import React from 'react';

// Common props for icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

const SketchIcon: React.FC<IconProps> = ({
    size = 24,
    color = "currentColor",
    strokeWidth = 2.5, // Thicker strokes for marker feel
    className,
    children,
    ...props
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {children}
    </svg>
);

export const IconCrown: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Crown body with slight imperfections */}
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </SketchIcon>
);

export const IconPencil: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Pencil body */}
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        {/* Tip line */}
        <path d="M15 5l3 3" />
        {/* Squiggle at tip to imply drawing */}
        <path d="M9 18c-1 1-3 2-4 2s-2-2-2-3" strokeWidth={1.5} opacity={0.6} />
    </SketchIcon>
);

export const IconCheck: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* A quick checkmark stroke */}
        <path d="M20 6L9 17l-5-5" />
        {/* Second stroke for emphasis (hand drawn feel) */}
        <path d="M20 6L9 17" strokeOpacity="0.5" strokeWidth={1} transform="translate(-0.5, 0.5)" />
    </SketchIcon>
);

export const IconLock: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Lock body */}
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" transform="rotate(-1 12 16.5)" />
        {/* Shackle */}
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SketchIcon>
);

export const IconSoundOn: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </SketchIcon>
);

export const IconSoundOff: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
    </SketchIcon>
);

export const IconMenu: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        <line x1="4" y1="12" x2="20" y2="12" transform="rotate(-2 12 12)" />
        <line x1="4" y1="6" x2="20" y2="6" transform="rotate(1 12 6)" />
        <line x1="4" y1="18" x2="20" y2="18" transform="rotate(1 12 18)" />
    </SketchIcon>
);

export const IconX: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </SketchIcon>
);

export const IconEraser: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Eraser block */}
        <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z" />
        {/* Detail line */}
        <path d="M17 17L7 7" />
    </SketchIcon>
);

export const IconRefresh: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </SketchIcon>
);




