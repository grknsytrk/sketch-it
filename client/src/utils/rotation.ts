/**
 * Calculates the relative position of a player based on the current user's index.
 * 
 * Positions:
 * 0: Bottom (Me)
 * 1: Right
 * 2: Top
 * 3: Left
 * 
 * Formula: (targetIndex - myIndex + 4) % 4
 */
export const getRelativePosition = (myIndex: number, targetIndex: number): number => {
    return (targetIndex - myIndex + 4) % 4;
};

export const getPositionName = (positionIndex: number): 'bottom' | 'right' | 'top' | 'left' => {
    switch (positionIndex) {
        case 0: return 'bottom';
        case 1: return 'right';
        case 2: return 'top';
        case 3: return 'left';
        default: return 'bottom';
    }
};
