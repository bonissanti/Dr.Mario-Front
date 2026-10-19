export type ThemeMode = 'light' | 'dark' | 'auto';
export type TextSize = 'small' | 'normal' | 'large';
export type KeyboardPreset = 'arrows' | 'wasd';
export type TouchPreset = 'swipe' | 'buttons';

export interface AccessibilityState
{
    shapes: boolean;
    contrast: boolean;
    motion: boolean;      // true = reduce motion
    sound: boolean;
    text: TextSize;
    theme: ThemeMode;
    keyboard: KeyboardPreset;
    touch: TouchPreset;
}

type Listener = (state: Readonly<AccessibilityState>) => void;

const STORAGE_KEY = 'a11y:v1';

const BOOLEAN_KEYS = ['shapes', 'contrast', 'motion', 'sound'] as const;

const ALLOWED = {
    text: ['small', 'normal', 'large'],
    theme: ['light', 'dark', 'auto'],
    keyboard: ['arrows', 'wasd'],
    touch: ['swipe', 'buttons'],
} as const;

const matches = (query: string): boolean => globalThis.matchMedia?.(query).matches ?? false;

function defaultStorage(): Storage | undefined
{
    try { return globalThis.localStorage; }
    catch { return undefined; }
}

export default class AccessibilityService
{
    private readonly media = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
    private readonly listeners = new Set<Listener>();
    private readonly storage: Storage | undefined = defaultStorage();
    private readonly root: HTMLElement = document.documentElement;
    private state: AccessibilityState;

    // DI passes no arguments (no static `dependencies`), so the defaults are used in the app;
    // tests can pass a fake Storage and a detached element.
    constructor(
        storage: Storage | undefined = defaultStorage(),
        root: HTMLElement = document.documentElement,
    )
    {
        this.state = { ...this.defaults(), ...this.load() };
        this.media?.addEventListener('change', () => this.apply());
        this.storage = storage;
        this.root = root;
        this.apply();
    }

    get<K extends keyof AccessibilityState>(key: K): AccessibilityState[K]
    {
        return this.state[key];
    }

    set<K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]): void
    {
        if (this.state[key] === value)
            return;

        this.state = { ...this.state, [key]: value };
        this.save();
        this.apply();
        this.listeners.forEach(listener => listener(this.state));
    }

    /** `auto` resolved against the device preference. */
    get resolvedTheme(): 'light' | 'dark'
    {
        if (this.state.theme !== 'auto')
            return this.state.theme;
        return this.media?.matches ? 'dark' : 'light';
    }

    subscribe(listener: Listener): () => void
    {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // ── internals ──────────────────────────────────────────────

    private defaults(): AccessibilityState
    {
        return {
            shapes: false,
            contrast: matches('(prefers-contrast: more)'),
            motion: matches('(prefers-reduced-motion: reduce)'),
            sound: true,
            text: 'normal',
            theme: 'auto',
            keyboard: 'arrows',
            touch: 'swipe',
        };
    }

    private load(): Partial<AccessibilityState>
    {
        try
        {
            const raw = this.storage?.getItem(STORAGE_KEY);
            if (!raw) return {};

            const data = JSON.parse(raw) as Record<string, unknown>;
            const valid: Record<string, unknown> = {};

            for (const key of BOOLEAN_KEYS)
                if (typeof data[key] === 'boolean') valid[key] = data[key];

            for (const [key, allowed] of Object.entries(ALLOWED))
                if ((allowed as readonly unknown[]).includes(data[key])) valid[key] = data[key];

            return valid as Partial<AccessibilityState>;
        }
        catch {
            return {};
        }
    }

    private save(): void
    {
        try { this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.state)); }
        catch { /* TODO: storage full or blocked: settings still apply for this session */ }
    }

    /** Same data-* attributes your CSS already targets, plus Web Awesome's dark class. */
    private apply(): void
    {
        const { dataset } = this.root;

        for (const key of BOOLEAN_KEYS)
            dataset[key] = this.state[key] ? 'on' : 'off';

        dataset.text = this.state.text;
        dataset.keyboard = this.state.keyboard;
        dataset.touch = this.state.touch;

        const theme = this.resolvedTheme;
        dataset.theme = theme;
        this.root.classList.toggle('wa-dark', theme === 'dark');
    }
}