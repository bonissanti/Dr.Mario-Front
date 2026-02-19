import {AUIBehavior} from "../../utils/UIBehavior/Abstract/AUIBehavior.ts";
import {AuthEventsEnum} from "../../domain/enum/AuthEventsEnum.ts";

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

    private showFailedModal(payload: any): void
    {
        const modal = document.createElement('wa-dialog') as HTMLElement & { open: boolean };

        modal.id = 'failed-modal';
        modal.setAttribute('label', 'Failed to create account :(');
        modal.innerHTML = `
            <h3>Oops! Something went wrong.</h3>
            <p>
                We couldn’t create your account right now. This might be a temporary issue.
                Please try again in a moment.
            </p>

            <wa-details summary="Technical details" class="custom-icons">
              <wa-icon name="square-plus" slot="expand-icon" variant="regular"></wa-icon>
              <wa-icon name="square-minus" slot="collapse-icon" variant="regular"></wa-icon>
                ${payload.trace ?? "No additional details available."}
            </wa-details>

            <wa-button slot="footer" variant="neutral" id="report-btn">
                Report issue
            </wa-button>

            <wa-button slot="footer" variant="brand" data-dialog="close" id="close-btn">
                Close
            </wa-button>
        `;
        document.body.appendChild(modal);
        modal.open = true;
    }
}