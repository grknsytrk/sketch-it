// Word database for drawing game

export const WORD_CATEGORIES = {
    general: [
        // Nature & Sky
        'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'rainbow', 'storm', 'lightning',
        'mountain', 'river', 'ocean', 'sea', 'lake', 'beach', 'island', 'volcano', 'cave',
        'forest', 'jungle', 'desert', 'garden', 'flower', 'rose', 'tulip', 'cactus', 'palm tree',
        'tree', 'leaf', 'grass', 'rock', 'stone', 'fire', 'water', 'ice', 'smoke',

        // Places & Buildings
        'house', 'home', 'castle', 'palace', 'school', 'hospital', 'library', 'museum', 'cinema',
        'stadium', 'airport', 'station', 'bridge', 'road', 'street', 'park', 'zoo', 'farm',
        'city', 'village', 'shop', 'store', 'market', 'hotel', 'restaurant', 'cafe', 'bakery',
        'church', 'temple', 'mosque', 'prison', 'factory', 'tower', 'skyscraper', 'lighthouse',
        'tent', 'igloo', 'pyramid', 'statue', 'fountain', 'pool', 'playground',

        // People & Professions
        'king', 'queen', 'prince', 'princess', 'knight', 'wizard', 'witch', 'pirate', 'ninja',
        'robot', 'alien', 'ghost', 'monster', 'zombie', 'vampire', 'clown', 'mime',
        'doctor', 'nurse', 'police', 'firefighter', 'soldier', 'pilot', 'astronaut', 'chef',
        'teacher', 'student', 'artist', 'singer', 'dancer', 'actor', 'farmer', 'detective',
        'thief', 'judge', 'lawyer', 'president', 'baby', 'child', 'man', 'woman', 'family',

        // Body Parts
        'eye', 'nose', 'mouth', 'ear', 'hair', 'face', 'head', 'hand', 'finger', 'thumb',
        'arm', 'leg', 'foot', 'toe', 'knee', 'elbow', 'tooth', 'tongue', 'heart', 'brain',
        'skeleton', 'skull', 'bone', 'muscle', 'blood', 'smile', 'tear', 'beard', 'mustache',

        // Clothing
        'shirt', 'pants', 'dress', 'skirt', 'jacket', 'coat', 'hat', 'cap', 'scarf', 'gloves',
        'shoes', 'socks', 'boots', 'belt', 'tie', 'glasses', 'sunglasses', 'watch', 'ring',
        'necklace', 'crown', 'mask', 'helmet', 'cape', 'uniform', 'pyjamas', 'swimsuit'
    ],

    animals: [
        // Pets & Farm
        'cat', 'dog', 'kitten', 'puppy', 'rabbit', 'hamster', 'mouse', 'rat', 'guinea pig',
        'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'rooster', 'hen', 'duck', 'goose',
        'turkey', 'donkey', 'bull', 'llama', 'alpaca',

        // Wild Animals
        'lion', 'tiger', 'leopard', 'cheetah', 'jaguar', 'panther', 'wolf', 'fox', 'bear',
        'polar bear', 'panda', 'koala', 'kangaroo', 'elephant', 'giraffe', 'zebra', 'rhino',
        'hippo', 'monkey', 'gorilla', 'chimpanzee', 'sloth', 'camel', 'deer', 'moose', 'elk',
        'bison', 'buffalo', 'hyena', 'warthog', 'meerkat', 'otter', 'beaver', 'raccoon',
        'skunk', 'badger', 'hedgehog', 'squirrel', 'bat', 'mole',

        // Birds
        'eagle', 'hawk', 'falcon', 'owl', 'parrot', 'penguin', 'flamingo', 'swan', 'peacock',
        'ostrich', 'woodpecker', 'hummingbird', 'pigeon', 'dove', 'crow', 'raven', 'seagull',
        'pelican', 'stork', 'toucan', 'vulture',

        // Reptiles & Amphibians
        'snake', 'cobra', 'python', 'lizard', 'chameleon', 'gecko', 'iguana', 'turtle',
        'tortoise', 'crocodile', 'alligator', 'dinosaur', 't-rex', 'frog', 'toad', 'salamander',

        // Sea Creatures
        'fish', 'shark', 'whale', 'dolphin', 'octopus', 'squid', 'jellyfish', 'starfish',
        'crab', 'lobster', 'shrimp', 'seahorse', 'seal', 'walrus', 'eel', 'ray', 'clam',
        'oyster', 'coral', 'mermaid',

        // Insects
        'butterfly', 'moth', 'bee', 'wasp', 'ant', 'spider', 'scorpion', 'beetle', 'ladybug',
        'dragonfly', 'mosquito', 'fly', 'worm', 'caterpillar', 'snail', 'slug'
    ],

    food: [
        // Fruits
        'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry', 'cherry',
        'watermelon', 'melon', 'pineapple', 'mango', 'papaya', 'kiwi', 'lemon', 'lime',
        'peach', 'pear', 'plum', 'apricot', 'coconut', 'avocado', 'tomato',

        // Vegetables
        'carrot', 'potato', 'corn', 'onion', 'garlic', 'pepper', 'cucumber', 'lettuce',
        'cabbage', 'broccoli', 'cauliflower', 'spinach', 'mushroom', 'pumpkin', 'eggplant',
        'bean', 'pea', 'radish',

        // Meals & Fast Food
        'pizza', 'burger', 'hamburger', 'cheeseburger', 'hotdog', 'sandwich', 'taco', 'burrito',
        'sushi', 'sashimi', 'ramen', 'noodle', 'pasta', 'spaghetti', 'lasagna', 'soup',
        'salad', 'steak', 'chicken', 'fish and chips', 'kebab', 'curry', 'rice', 'bread',
        'toast', 'pancake', 'waffle', 'omelet', 'egg', 'bacon', 'sausage', 'cheese',

        // Sweets & Desserts
        'cake', 'cupcake', 'cookie', 'biscuit', 'donut', 'pie', 'tart', 'ice cream',
        'chocolate', 'candy', 'lollipop', 'gum', 'popcorn', 'chips', 'pretzel', 'pudding',
        'jelly', 'honey', 'jam', 'yogurt',

        // Drinks
        'water', 'milk', 'coffee', 'tea', 'juice', 'soda', 'coke', 'lemonade', 'smoothie',
        'milkshake', 'beer', 'wine', 'cocktail'
    ],

    objects: [
        // Electronics
        'phone', 'smartphone', 'computer', 'laptop', 'tablet', 'keyboard', 'mouse', 'monitor',
        'printer', 'camera', 'television', 'tv', 'radio', 'speaker', 'headphones', 'microphone',
        'battery', 'charger', 'cable', 'robot', 'drone', 'gamepad', 'console',

        // Tools
        'hammer', 'screwdriver', 'wrench', 'saw', 'axe', 'drill', 'pliers', 'scissors',
        'knife', 'spoon', 'fork', 'plate', 'bowl', 'cup', 'glass', 'bottle', 'ladder',
        'broom', 'mop', 'bucket', 'shovel', 'rake', 'hose', 'torch', 'flashlight',

        // Furniture
        'chair', 'table', 'desk', 'sofa', 'couch', 'bed', 'closet', 'wardrobe', 'shelf',
        'cabinet', 'lamp', 'mirror', 'clock', 'rug', 'carpet', 'curtain', 'door', 'window',

        // Vehicles
        'car', 'bus', 'truck', 'van', 'taxi', 'police car', 'ambulance', 'fire truck',
        'bicycle', 'bike', 'motorcycle', 'scooter', 'skateboard', 'train', 'subway', 'tram',
        'plane', 'airplane', 'helicopter', 'rocket', 'ufo', 'boat', 'ship', 'yacht',
        'submarine', 'tractor', 'tank',

        'pulp fiction', 'fight club', 'forrest gump', 'lion king', 'shrek', 'toy story',
        'finding nemo', 'frozen', 'cars', 'minions', 'despicable me', 'kung fu panda',
        'how to train your dragon', 'spider man', 'batman', 'superman', 'avengers', 'iron man',
        'captain america', 'thor', 'hulk', 'black panther', 'wonder woman', 'joker',
        'deadpool', 'x men', 'wolverine', 'terminator', 'alien', 'predator', 'ghostbusters',
        'back to the future', 'men in black', 'james bond', 'mission impossible', 'rocky',

        // Characters
        'harry potter', 'hermione', 'ron weasley', 'dumbledore', 'voldemort', 'dobby',
        'luke skywalker', 'darth vader', 'yoda', 'obi wan', 'han solo', 'chewbacca', 'r2d2',
        'frodo', 'gandalf', 'gollum', 'legolas', 'aragorn', 'neo', 'morpheus', 'trinity',
        'jack sparrow', 'will turner', 'simba', 'mufasa', 'woody', 'buzz lightyear', 'shrek',
        'donkey', 'fiona', 'elsa', 'anna', 'olaf', 'po', 'bruce wayne', 'clark kent',
        'tony stark', 'steve rogers', 'thanos', 'loki', 'groot', 'rocket raccoon',

        // Objects
        'lightsaber', 'wand', 'ring', 'infinity gauntlet', 'shield', 'hammer', 'batmobile',
        'delorean', 'hoverboard', 'proton pack', 'golden snitch', 'sorting hat', 'nimbus',
        'death star', 'millennium falcon', 'black pearl'
    ],

    games: [
        // Titles
        'minecraft', 'roblox', 'fortnite', 'league of legends', 'dota', 'valorant', 'cs go',
        'counter strike', 'call of duty', 'gta', 'grand theft auto', 'super mario', 'mario kart',
        'sonic', 'pokemon', 'zelda', 'animal crossing', 'among us', 'fall guys', 'tetris',
        'pacman', 'donkey kong', 'street fighter', 'mortal kombat', 'tekken', 'final fantasy',
        'world of warcraft', 'overwatch', 'apex legends', 'pubg', 'clash of clans',
        'clash royale', 'brawl stars', 'angry birds', 'candy crush', 'sims', 'portal',
        'half life', 'halo', 'god of war', 'assassins creed', 'witcher', 'cyberpunk',
        'skyrim', 'elden ring', 'dark souls', 'resident evil', 'silent hill', 'fnaf',
        'five nights at freddys', 'undertale', 'cuphead', 'hollow knight', 'stardew valley',

        // Characters
        'steve', 'alex', 'creeper', 'enderman', 'zombie', 'skeleton', 'mario', 'luigi',
        'peach', 'bowser', 'yoshi', 'toad', 'sonic', 'tails', 'knuckles', 'eggman',
        'link', 'zelda', 'pikachu', 'charizard', 'kratos', 'master chief', 'doom slayer',
        'solid snake', 'lara croft', 'cloud strife', 'sephiroth', 'geralt', 'cj', 'trevor',
        'arthur morgan', 'ellie', 'joel', 'nathan drake', 'ryu', 'ken', 'chun li', 'scorpion',
        'sub zero', 'jinx', 'yasuo', 'teemo', 'ahri', 'lux', 'tracer', 'genji', 'dva',
        'sans', 'papyrus', 'freddy fazbear',

        // Items
        'diamond sword', 'pickaxe', 'crafting table', 'furnace', 'chest', 'bed', 'tnt',
        'potion', 'golden apple', 'ender pearl', 'mushroom', 'coin', 'ring', 'star',
        'pokeball', 'master sword', 'hylian shield', 'portal gun', 'crowbar', 'hidden blade',
        'pip boy'
    ],

    sports: [
        // Sports
        'football', 'soccer', 'basketball', 'volleyball', 'tennis', 'baseball', 'golf',
        'hockey', 'cricket', 'rugby', 'american football', 'badminton', 'table tennis',
        'ping pong', 'boxing', 'wrestling', 'karate', 'judo', 'taekwondo', 'kung fu',
        'swimming', 'diving', 'surfing', 'sailing', 'rowing', 'kayaking', 'fishing',
        'skiing', 'snowboarding', 'skating', 'ice skating', 'cycling', 'biking',
        'running', 'jogging', 'marathon', 'sprint', 'gymnastics', 'yoga', 'pilates',
        'weightlifting', 'bodybuilding', 'archery', 'shooting', 'hunting', 'bowling',
        'billiards', 'pool', 'darts', 'chess', 'racing', 'formula 1', 'motogp',

        // Equipment
        'ball', 'bat', 'racket', 'stick', 'club', 'glove', 'helmet', 'pad', 'net',
        'goal', 'basket', 'hoop', 'board', 'skis', 'skates', 'bike', 'bicycle',
        'dumbbell', 'barbell', 'mat', 'target', 'bow', 'arrow', 'gun', 'rifle',
        'cue', 'puck', 'shuttlecock', 'whistle', 'card', 'flag', 'trophy', 'medal',
        'cup', 'ring', 'belt', 'jersey', 'shorts', 'cleats', 'sneakers',

        // Actions & Terms
        'goal', 'point', 'score', 'win', 'lose', 'draw', 'tie', 'foul', 'penalty',
        'corner', 'free kick', 'throw in', 'offside', 'homerun', 'strike', 'spare',
        'knockout', 'submission', 'lap', 'pit stop', 'serve', 'ace', 'dunk', 'layup',
        'three pointer', 'touchdown', 'try', 'wicket', 'century', 'checkmate'
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
