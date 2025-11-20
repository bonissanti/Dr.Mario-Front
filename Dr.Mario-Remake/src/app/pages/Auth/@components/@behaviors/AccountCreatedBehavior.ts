import { AUIBehavior } from '../../../../../shared/components/UIBehavior/Abstract/AUIBehavior.ts';
import { AuthEventsEnum } from '../../@entities/AuthEventsEnum.ts';

export class AccountCreatedBehavior extends AUIBehavior
{
    protected canHandle(event: AuthEventsEnum): boolean
    {
        return event === AuthEventsEnum.ACCOUNT_CREATED;
    }

    protected execute(payload: any): void
    {
        const form = this.shadowRoot.querySelector('form');
        form?.classList.add('hidden');

        this.showSuccessModal(payload);
    }

    private showSuccessModal(payload: any): void
    {
        const modal = document.createElement('dialog');
        modal.id = 'success-modal';
        modal.className = 'modal';

        modal.innerHTML = `
            <dialog id="success-modal" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Account Created Successfully!</h3>
                    <p class="py-4">Welcome ${payload.user}! Your account has been created.</p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn btn-success">Continue</button>
                        </form>
                    </div>
                </div>
            </dialog>
        `;

        this.shadowRoot.appendChild(modal);
        modal.showModal();
    }
}