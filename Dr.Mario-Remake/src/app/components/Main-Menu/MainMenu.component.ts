import { RouterService } from '../../services/Router/RouterService.ts';
import { container } from '../../../main.ts';

type WindowPane = {
    id: string;
    label: string;
    element: HTMLDivElement;
    isFullscreen: boolean;
};

export default class MainMenuComponent
{
    private readonly router: RouterService;

    private openWindows: WindowPane[] = [];
    private focusedWindowId: string | null = null;
    private isFullscreen: boolean = false;

    private readonly SCROLL_AMOUNT = 320;

    public constructor()
    {
        this.router = container.resolve(RouterService);
    }

    public init(): void
    {

    }
    public dispose(): void
    {

    }
}
