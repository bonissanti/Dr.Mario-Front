import {AUIBehavior} from "../../utils/UIBehavior/Abstract/AUIBehavior.ts";
import {AuthEventsEnum} from "../../../app-deprecated/pages/Auth/@entities/AuthEventsEnum.ts";

export class SignUpBehaviorFailed extends AUIBehavior
{
    protected canHandle(event: AuthEventsEnum): boolean
    {
        return event === AuthEventsEnum.ACCOUNT_FAILED;
    }

    protected execute(payload: any): void
    {
        const form = globalThis.document.querySelector('form');

        if (form)
        {
            form.classList.add('blur-sm', 'pointer-events-none');
            console.error(payload);
            this.showFailedModal();
        }
    }

    private showFailedModal(): void
    {
        const modal = document.createElement('dialog');

        modal.id = 'failed-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <wa-dialog label="Dialog" id="dialog-overview">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <wa-button slot="footer" variant="brand" data-dialog="close">Close</wa-button>
            </wa-dialog>
        `

        modal.open = true;
    }
}