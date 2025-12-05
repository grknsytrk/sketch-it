// Sound Manager for Game - Soft, Sketchy UI Sounds
export class SoundManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private enabled: boolean = true;

    constructor() {
        this.initSounds();
    }

    private initSounds() {
        // Soft, gentle sounds that match the pastel sketchbook aesthetic
        // Using Pixabay and other free sound sources
        const soundUrls = {
            // Correct guess - Soft chime/ding
            correct: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b49a6.mp3',

            // Wrong guess - Gentle error/boop (not harsh)
            wrong: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8b8db8e28.mp3',

            // Time warning - Soft tick (pencil tap on paper feel)
            tick: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694cbd9.mp3',

            // Game start - Gentle positive notification
            gameStart: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',

            // Victory - Soft celebration (not too loud)
            victory: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccf3232f.mp3',

            // Word selected - Soft pop/click
            wordSelect: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694cbd9.mp3',

            // Round end - Gentle whoosh
            roundEnd: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b49a6.mp3',

            // Guess limit reached - Soft warning
            guessLimitReached: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8b8db8e28.mp3',

            // UI Click - Paper/soft click
            click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694cbd9.mp3',

            // New message - Soft notification
            message: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694cbd9.mp3',

            // Player join - Soft pop
            playerJoin: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',

            // Player leave - Soft woosh down
            playerLeave: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8b8db8e28.mp3'
        };

        // Preload all sounds
        Object.entries(soundUrls).forEach(([name, url]) => {
            const audio = new Audio(url);
            audio.preload = 'auto';
            audio.volume = 0.3; // Lower default volume for softer feel
            this.sounds.set(name, audio);
        });
    }

    play(soundName: string, volume: number = 0.3) {
        if (!this.enabled) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            // Clone to allow overlapping sounds
            const clone = sound.cloneNode() as HTMLAudioElement;

            // Keep volume soft (max 40% of system volume)
            clone.volume = Math.min(0.4, Math.max(0, volume * 0.4));

            // Slight pitch variation for organic feel
            const randomRate = 0.95 + Math.random() * 0.1; // 0.95 - 1.05
            clone.playbackRate = randomRate;
            clone.preservesPitch = false;

            clone.play().catch(err => {
                // Ignore autoplay restrictions errors
                if (err.name !== 'NotAllowedError') {
                    console.warn('Sound play failed:', err);
                }
            });
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    setVolume(volume: number) {
        this.sounds.forEach(sound => {
            sound.volume = Math.max(0, Math.min(0.4, volume * 0.4)); // Max 40%
        });
    }
}

// Singleton instance
export const soundManager = new SoundManager();
