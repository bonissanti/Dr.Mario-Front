import { AUIBehavior } from '../../../../../shared/components/UIBehavior/Abstract/AUIBehavior.ts';
import { AuthEventsEnum } from '../../@entities/AuthEventsEnum.ts';
import { ComponentConfiguration } from '../@configuration/ComponentConfiguration.ts';

export class AccountFailedBehavior extends AUIBehavior
{
    protected canHandle(event: AuthEventsEnum): boolean
    {
        return event === AuthEventsEnum.ACCOUNT_FAILED;
    }

    protected execute(payload: any): void
    {
        const form = this.shadowRoot.getElementById('create-account-form');
        form?.classList.add('hidden');
        console.error(payload); // temp

        this.showFailedModal();
    }

    private showFailedModal(): void
    {
        const modal = document.createElement('dialog');
        modal.id = 'failed-modal';
        modal.className = 'modal';
        modal.style = ComponentConfiguration.style.transition;

        // TodU: redirect to homepage
        // TodU: smooth modal - entry, exit is okay
        // TODU: use sentry to send stack trace (from payload.stackTrace)
        modal.innerHTML = `
                <div class="modal-box bg-gray-400">
                    <h3 class="text-lg font-bold">Ops! Occurred one problem when creating your account!</h3>
                    <p class="py-4">Our apologizing! Our dev will be notified to fix this error soon as possible</p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn btn-error">Back</button>
                        </form>
                    </div>
                </div>

        `
        this.shadowRoot.appendChild(modal);
        modal.showModal();
        modal.addEventListener('click', () => this.backToForm())
    }

    private backToForm(): void
    {
        const form = this.shadowRoot.getElementById('create-account-form');
        form?.classList.remove('hidden');
    }
}