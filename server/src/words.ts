// Word database for drawing game

export const WORD_CATEGORIES = {
    general: [
        'house', 'car', 'tree', 'sun', 'moon', 'star', 'book', 'chair', 'table',
        'door', 'window', 'cup', 'ball', 'hat', 'shoe', 'eye', 'hand', 'heart',
        'smile', 'clock', 'key', 'bed', 'boat', 'plane', 'camera', 'castle',
        'umbrella', 'snowman', 'lighthouse', 'rocket', 'robot', 'wizard', 'pirate'
    ],
    animals: [
        'cat', 'dog', 'fish', 'bird', 'elephant', 'giraffe', 'lion', 'tiger',
        'bear', 'monkey', 'snake', 'rabbit', 'mouse', 'horse', 'cow', 'pig',
        'sheep', 'chicken', 'duck', 'penguin', 'octopus', 'butterfly', 'spider',
        'frog', 'turtle', 'dolphin', 'shark', 'whale', 'dinosaur', 'unicorn', 'dragon'
    ],
    food: [
        'apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'pizza',
        'burger', 'fries', 'hotdog', 'sandwich', 'taco', 'sushi', 'ice cream',
        'cake', 'cookie', 'donut', 'chocolate', 'candy', 'popcorn', 'bread',
        'cheese', 'egg', 'milk', 'coffee', 'tea', 'juice', 'soda', 'water'
    ],
    objects: [
        'phone', 'computer', 'television', 'radio', 'camera', 'watch', 'glasses',
        'backpack', 'pencil', 'pen', 'scissors', 'hammer', 'screwdriver', 'ladder',
        'broom', 'bucket', 'shovel', 'rake', 'lamp', 'candle', 'flashlight',
        'umbrella', 'wallet', 'purse', 'suitcase', 'guitar', 'piano', 'drum'
    ]
};

export type WordTheme = keyof typeof WORD_CATEGORIES;

export function getRandomWords(count: number = 3, theme: string = 'general'): string[] {
    // Default to general if theme not found
    const category = (WORD_CATEGORIES as any)[theme] || WORD_CATEGORIES.general;
    const selected: string[] = [];

    // Safety check to avoid infinite loop if category is empty
    if (!category || category.length === 0) return ['error'];

    let attempts = 0;
    while (selected.length < count && attempts < 100) {
        const randomIndex = Math.floor(Math.random() * category.length);
        const word = category[randomIndex];

        if (!selected.includes(word)) {
            selected.push(word);
        }
        attempts++;
    }

    return selected;
}

export function getWordHint(word: string, revealCount: number = 0): string {
    const letters = word.split('');
    return letters.map((letter, index) => {
        if (letter === ' ') return ' ';
        if (index < revealCount) return letter;
        return '_';
    }).join(' ');
}
