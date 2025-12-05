import React, { useRef, useEffect, useState } from 'react';
import type { DrawingAction } from '../../../server/src/types';
import { IconEraser } from './Icons';

interface DrawingCanvasProps {
    isDrawer: boolean;
    onDraw: (action: DrawingAction) => void;
    drawingData: DrawingAction[];
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isDrawer, onDraw, drawingData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null); // To measure available space
    const canvasContainerRef = useRef<HTMLDivElement>(null); // For eraser cursor overlay
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentSize, setCurrentSize] = useState(3);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    // We store canvas dimensions to force re-renders and update styles
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    // Eraser cursor position (relative to canvas container)
    const [eraserCursorPos, setEraserCursorPos] = useState<{ x: number; y: number } | null>(null);

    const colors = ['#000000', '#555555', '#FFFFFF', '#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF', '#FFAA44', '#800080', '#A52A2A'];

    // Handle resizing to maintain 4:3 aspect ratio
    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                const { width: availWidth, height: availHeight } = wrapperRef.current.getBoundingClientRect();

                // Calculate best fit 4:3
                let w = availWidth;
                let h = availWidth * 0.75; // 3/4 ratio

                if (h > availHeight) {
                    h = availHeight;
                    w = availHeight * (4 / 3); // 4/3 ratio
                }

                // Update state to trigger re-render with new dimensions
                setDimensions({ width: w, height: h });

                if (canvasRef.current) {
                    canvasRef.current.width = w;
                    canvasRef.current.height = h;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial calculation

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Redraw when data changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Redraw all actions
        drawingData.forEach(action => {
            drawAction(ctx, action);
        });
    }, [drawingData, dimensions]);

    const drawAction = (ctx: CanvasRenderingContext2D, action: DrawingAction) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        if (action.type === 'clear') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
        } else if (action.type === 'draw' && action.x !== undefined && action.y !== undefined) {
            ctx.strokeStyle = action.color || '#000000';
            // Scale line width relative to canvas width (base 800px)
            ctx.lineWidth = (action.size || 3) * (w / 800);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            if (action.prevX !== undefined && action.prevY !== undefined) {
                ctx.moveTo(action.prevX * w, action.prevY * h);
            } else {
                ctx.moveTo(action.x * w, action.y * h);
            }
            ctx.lineTo(action.x * w, action.y * h);
            ctx.stroke();
        } else if (action.type === 'start' && action.x !== undefined && action.y !== undefined) {
            // Draw a single dot for start
            ctx.fillStyle = action.color || '#000000';
            const size = (action.size || 3) * (w / 800);
            ctx.beginPath();
            ctx.arc(action.x * w, action.y * h, size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / rect.width,  // Normalized 0-1
            y: (e.clientY - rect.top) / rect.height // Normalized 0-1
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawer) return;

        const pos = getMousePos(e);
        setIsDrawing(true);
        setLastPos(pos);

        const action: DrawingAction = {
            type: 'start',
            x: pos.x,
            y: pos.y,
            color: currentColor,
            size: currentSize
        };
        onDraw(action);

        // Immediate local feedback (optional, as we now have optimistic UI in store)
        // But drawing directly on canvas can be even smoother
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) drawAction(ctx, action);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // Update eraser cursor position for overlay
        if (isDrawer && currentColor === '#FFFFFF' && canvasContainerRef.current) {
            const containerRect = canvasContainerRef.current.getBoundingClientRect();
            setEraserCursorPos({
                x: e.clientX - containerRect.left,
                y: e.clientY - containerRect.top
            });
        }

        if (!isDrawer || !isDrawing) return;

        const pos = getMousePos(e);
        const action: DrawingAction = {
            type: 'draw',
            x: pos.x,
            y: pos.y,
            prevX: lastPos.x,
            prevY: lastPos.y,
            color: currentColor,
            size: currentSize
        };
        onDraw(action);

        // Immediate local feedback
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) drawAction(ctx, action);
        }

        setLastPos(pos);
    };

    // Handle mouse leave to hide eraser cursor
    const handleMouseLeave = () => {
        setIsDrawing(false);
        setEraserCursorPos(null);
    };

    // Handle mouse enter to show eraser cursor
    const handleMouseEnter = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawer && currentColor === '#FFFFFF' && canvasContainerRef.current) {
            const containerRect = canvasContainerRef.current.getBoundingClientRect();
            setEraserCursorPos({
                x: e.clientX - containerRect.left,
                y: e.clientY - containerRect.top
            });
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    // Calculate eraser size in pixels based on canvas scale
    const getEraserSizeInPixels = () => {
        return currentSize * (dimensions.width / 800);
    };

    const isEraserActive = isDrawer && currentColor === '#FFFFFF';

    const handleClearCanvas = () => {
        if (!isDrawer) return;
        const action: DrawingAction = { type: 'clear' };
        onDraw(action);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full h-full">
            {/* Drawing Tools */}
            {isDrawer && (
                <div className="flex flex-wrap gap-4 bg-paper border-2 border-ink border-dashed rounded-xl p-4 w-full justify-center shrink-0 items-center shadow-sm">
                    {/* Colors */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => setCurrentColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${currentColor === color ? 'border-ink scale-125' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: color, boxShadow: currentColor === color ? '0 0 0 2px white, 0 0 0 4px var(--color-ink)' : 'none' }}
                            />
                        ))}
                    </div>

                    <div className="w-[1px] h-8 bg-gray-300 mx-2"></div>

                    {/* Brush Size */}
                    <div className="flex items-center gap-2 font-hand font-bold">
                        <span className="text-ink text-xs">SIZE:</span>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={currentSize}
                            onChange={(e) => setCurrentSize(Number(e.target.value))}
                            className="w-24 accent-ink cursor-pointer"
                        />
                    </div>

                    <div className="w-[1px] h-8 bg-gray-300 mx-2"></div>

                    {/* Eraser */}
                    <button
                        onClick={() => setCurrentColor('#FFFFFF')}
                        className={`p-1.5 rounded-lg border-2 transition-all ${currentColor === '#FFFFFF' ? 'border-ink bg-gray-200' : 'border-transparent hover:bg-gray-100 text-gray-500'}`}
                        title="Eraser"
                    >
                        <IconEraser size={24} />
                    </button>

                    <div className="w-[1px] h-8 bg-gray-300 mx-2"></div>

                    {/* Clear Button */}
                    <button
                        onClick={handleClearCanvas}
                        className="px-3 py-1 bg-red-100 text-red-600 border-2 border-red-400 rounded-full font-bold font-marker hover:bg-red-200 text-xs transition-colors"
                    >
                        CLEAR
                    </button>
                </div>
            )}

            {/* Canvas Wrapper - measures available space */}
            <div ref={wrapperRef} className="flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden">
                {/* Canvas Container - Fixed 4:3 ratio via calculated dimensions */}
                <div
                    ref={canvasContainerRef}
                    className="bg-white border-2 border-ink relative shadow-sketch"
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        borderRadius: '2px 2px 2px 2px',
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onMouseEnter={handleMouseEnter}
                        className="block w-full h-full"
                        style={{
                            cursor: isDrawer
                                ? (isEraserActive ? 'none' : 'crosshair')
                                : 'not-allowed'
                        }}
                    />
                    {/* Eraser Cursor Overlay - shows size preview */}
                    {isEraserActive && eraserCursorPos && (
                        <div
                            className="pointer-events-none absolute"
                            style={{
                                left: eraserCursorPos.x,
                                top: eraserCursorPos.y,
                                width: getEraserSizeInPixels(),
                                height: getEraserSizeInPixels(),
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                border: '2px dashed var(--color-ink)',
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 0 0 1px rgba(255,255,255,0.8)',
                                transition: 'width 0.1s, height 0.1s',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrawingCanvas;
