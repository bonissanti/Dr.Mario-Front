import AccessibilityService, {type AccessibilityState} from "./Accessiblityservice.ts";

type WaDialog = HTMLElement & { open: boolean };
type WaSwitch = HTMLElement & { checked: boolean };
type WaValue = HTMLElement & { value: string };

type ToggleKey = 'shapes' | 'contrast' | 'motion' | 'sound';
type ValueKey = 'text' | 'theme' | 'keyboard' | 'touch';

// Tags that must be defined before the controls can be bound.
const REQUIRED_ELEMENTS = ['wa-dialog', 'wa-switch', 'wa-radio-group', 'wa-select'];

export default class AccessibilityComponent
{
    private readonly settings: AccessibilityService;
    static dependencies = [AccessibilityService];
    private readonly syncers: Array<() => void> = [];

    constructor(settings: AccessibilityService)
    {
        this.settings = settings;
    }

    async init(): Promise<void>
    {
        const button = document.getElementById('a11y-btn');
        const dialog = document.getElementById('a11y-dialog') as WaDialog | null;
        if (!button || !dialog) return;

        button.addEventListener('click', () => { dialog.open = true; });

        // If this never resolves, Web Awesome isn't loading (autoloader / component imports).
        await Promise.all(REQUIRED_ELEMENTS.map(tag => customElements.whenDefined(tag)));

        this.bindToggles(dialog);
        this.bindValue(dialog, '[data-a11y-text-group]', 'text');
        this.bindValue(dialog, '[data-a11y-theme-group]', 'theme');
        this.bindValue(dialog, '#a11y-keyboard', 'keyboard');
        this.bindValue(dialog, '#a11y-touch', 'touch');

        this.settings.subscribe(() => this.sync());
        this.sync();   // reflect stored settings the first time the dialog is set up
    }

    // Closing is declarative now: the built-in × and the Done button (data-dialog="close"),
    // Esc, and the `light-dismiss` attribute for backdrop clicks. No handlers needed.

    private bindToggles(dialog: HTMLElement): void
    {
        dialog.querySelectorAll<WaSwitch>('wa-switch[data-a11y-toggle]').forEach(sw =>
        {
            const key = sw.dataset.a11yToggle as ToggleKey;
            sw.addEventListener('change', () => this.settings.set(key, sw.checked));
            this.syncers.push(() => { sw.checked = this.settings.get(key); });
        });
    }

    private bindValue<K extends ValueKey>(root: ParentNode, selector: string, key: K): void
    {
        const control = root.querySelector<WaValue>(selector);
        if (!control) return;

        control.addEventListener('change', () => this.settings.set(key, control.value as AccessibilityState[K]));
        this.syncers.push(() => { control.value = this.settings.get(key); });
    }

    private sync(): void
    {
        this.syncers.forEach(fn => fn());
    }
}
