// Sound Manager for Game
export class SoundManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private enabled: boolean = true;

    constructor() {
        this.initSounds();
    }

    private initSounds() {
        // Mixkit - Professional game sounds (Direct URLs)
        // We will treat these as "base" sounds but vary their playback
        const soundUrls = {
            // Correct guess - Better success sound
            correct: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',

            // Wrong guess - Error buzz
            wrong: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',

            // Time warning - Clock tick (Slightly faster for tension)
            tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',

            // Game start - Positive notification
            gameStart: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',

            // Victory - Fanfare
            victory: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',

            // Word selected - Click/Pop
            wordSelect: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',

            // Round end - Soft notification
            roundEnd: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',

            // Guess limit reached - Error/Warning (ONLY LOCAL)
            guessLimitReached: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
            
            // UI Click - Paper/Pen sound equivalent (using a short click for now, varied by pitch)
            click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' 
        };

        // Preload all sounds
        Object.entries(soundUrls).forEach(([name, url]) => {
            const audio = new Audio(url);
            audio.preload = 'auto';
            audio.volume = 0.5; // Default volume
            this.sounds.set(name, audio);
        });
    }

    play(soundName: string, volume: number = 0.5) {
        if (!this.enabled) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            // Clone to allow overlapping sounds
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = Math.min(1, Math.max(0, volume));
            
            // ORGANIC FEEL: Randomize playback rate slightly (0.85 - 1.15)
            // This mimics the imperfection of real-world sounds/human actions
            const randomRate = 0.85 + Math.random() * 0.3;
            clone.playbackRate = randomRate;

            // Needed for some browsers to handle rapid playback
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
            sound.volume = Math.max(0, Math.min(1, volume));
        });
    }
}

// Singleton instance
export const soundManager = new SoundManager();
