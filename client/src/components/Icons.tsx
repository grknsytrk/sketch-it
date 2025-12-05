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
        {/* Eraser body - sketchy rectangular shape */}
        <path d="M4 18h16c0.5 0 1-0.5 1-1V7c0-0.5-0.5-1-1-1H4c-0.5 0-1 0.5-1 1v10c0 0.5 0.5 1 1 1z" />
        {/* Eraser grip lines - hand drawn feel */}
        <path d="M7 8.5v7" strokeWidth={1.5} opacity={0.6} />
        <path d="M10.5 8.5v7" strokeWidth={1.5} opacity={0.6} />
        {/* Used edge marks - shows it's been used */}
        <path d="M14 17c0.5-1 1-2 1.5-1.5" strokeWidth={1.5} opacity={0.4} />
        <path d="M17 16.5c0.3-0.8 0.8-1.5 1.2-1" strokeWidth={1.5} opacity={0.4} />
        {/* Eraser crumbs/dust for sketchy effect */}
        <circle cx="15" cy="20" r="0.8" fill="currentColor" opacity={0.3} />
        <circle cx="18" cy="19.5" r="0.5" fill="currentColor" opacity={0.3} />
        <circle cx="16.5" cy="20.5" r="0.6" fill="currentColor" opacity={0.3} />
    </SketchIcon>
);

export const IconTarget: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Outer circle */}
        <circle cx="12" cy="12" r="10" />
        {/* Middle circle */}
        <circle cx="12" cy="12" r="6" />
        {/* Inner circle */}
        <circle cx="12" cy="12" r="2" />
    </SketchIcon>
);

export const IconChat: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Chat bubble */}
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </SketchIcon>
);

export const IconRefresh: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </SketchIcon>
);

// Theme Icons
export const IconPalette: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Palette body */}
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.1 2.5-.3.3-.1.5-.4.5-.7v-2c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v2c0 .3.2.6.5.7.8.2 1.6.3 2.5.3 1.1 0 2-.9 2-2 0-5.5-4.5-10-10-10z" />
        {/* Paint dots */}
        <circle cx="7" cy="10" r="1.5" fill="currentColor" />
        <circle cx="10" cy="6" r="1.5" fill="currentColor" />
        <circle cx="15" cy="7" r="1.5" fill="currentColor" />
        <circle cx="7" cy="14" r="1.5" fill="currentColor" />
    </SketchIcon>
);

export const IconPaw: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Main pad */}
        <ellipse cx="12" cy="15" rx="4" ry="3.5" />
        {/* Toe beans */}
        <circle cx="7" cy="10" r="2" />
        <circle cx="17" cy="10" r="2" />
        <circle cx="9" cy="6" r="1.8" />
        <circle cx="15" cy="6" r="1.8" />
    </SketchIcon>
);

export const IconPizza: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Pizza slice */}
        <path d="M12 2L3 20h18L12 2z" />
        {/* Toppings */}
        <circle cx="10" cy="14" r="1.5" fill="currentColor" />
        <circle cx="14" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" />
        {/* Crust detail */}
        <path d="M5 18h14" strokeWidth={1.5} opacity={0.5} />
    </SketchIcon>
);

export const IconBox: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Box body */}
        <path d="M21 8v13H3V8" />
        <path d="M1 3h22v5H1z" />
        {/* Center line */}
        <path d="M10 12h4" />
    </SketchIcon>
);

export const IconStar: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Star shape */}
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </SketchIcon>
);

export const IconFilm: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Film strip */}
        <rect x="2" y="2" width="20" height="20" rx="2" />
        {/* Holes */}
        <path d="M7 2v20M17 2v20" />
        <path d="M2 7h5M17 7h5M2 12h5M17 12h5M2 17h5M17 17h5" strokeWidth={1.5} />
    </SketchIcon>
);

export const IconGamepad: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Controller body */}
        <path d="M6 11h4M8 9v4" /> {/* D-pad */}
        <circle cx="17" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        {/* Body outline */}
        <path d="M17 4H7a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5z" />
    </SketchIcon>
);

export const IconBall: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Ball */}
        <circle cx="12" cy="12" r="10" />
        {/* Pattern lines */}
        <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        <path d="M2 12h20" />
    </SketchIcon>
);

export const IconWarning: React.FC<IconProps> = (props) => (
    <SketchIcon {...props}>
        {/* Triangle */}
        <path d="M12 2L2 20h20L12 2z" />
        {/* Exclamation mark */}
        <path d="M12 9v5" strokeWidth={3} />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
    </SketchIcon>
);
