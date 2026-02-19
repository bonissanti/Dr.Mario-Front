import {AuthEventsEnum} from "../../domain/enum/AuthEventsEnum.ts";
import {AUIBehavior} from "../../utils/UIBehavior/Abstract/AUIBehavior.ts";
import {RouterService} from "../../services/Router/RouterService.ts";
import {container} from "../../../main.ts";

export class SignUpBehaviorSuccess extends AUIBehavior
{
    private readonly router: RouterService;

    constructor()
    {
        super();
        this.router = container.resolve(RouterService);
    }

    protected canHandle(event: AuthEventsEnum): boolean
    {
        return event === AuthEventsEnum.ACCOUNT_CREATED;
    }

    protected execute(payload: any): void
    {
        const form = globalThis.document.getElementById('sign-up');

        if (form)
        {
            form.classList.add('transition-all', 'duration-300', 'blur-sm', 'pointer-events-none');
            this.showSuccessModal();

            setTimeout(() => {
                this.router?.navigate('/main-menu');
            }, 3000);
            console.log(payload);
        }
    }

    private showSuccessModal(): void
    {
        const modal = document.createElement('wa-dialog') as HTMLElement & { open: boolean };

        modal.id = 'success-modal';
        modal.setAttribute('label', 'Account created successfully');
        modal.innerHTML = `
            <h3>Welcome to Dr.Mario Web Game!</h3>
            <p>
                You’ll be redirected to the main menu shortly. From there, you can explore a quick tutorial,
                customize your experience, add friends, and — most importantly — start playing Dr. Mario!
            </p>
            <wa-button slot="footer" variant="success" data-dialog="close">Continue</wa-button>
        `;
        document.body.appendChild(modal);
        modal.open = true;
    }
}