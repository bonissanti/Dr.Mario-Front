import { CreateUserDTO } from '../@dto/Authentication/CreateUserDTO.ts';
import { ProxyData } from '../../../../../shared/components/ProxyData/ProxyData.ts';
import { NotificationContext } from '../../../../../shared/stores/NotificationContext/NotificationContext.ts';
import { ErrorCatalog } from '../../../../../shared/stores/NotificationContext/ErrorCatalog/ErrorCatalog.ts';
import { AuthenticationService } from '../../@service/AuthenticationService.ts';


/**
 * Represents a web component for creating a user account.
 * Extends the `HTMLElement` base class and provides functionality for input management,
 * validation, user notification, and form submission.
 */

class CreateAccountComponent extends HTMLElement
{
    private readonly createUserDTO: CreateUserDTO = {};
    private debounceTimer: number | null = null;
    private proxyData: ProxyData = new ProxyData();
    private notificationContext: NotificationContext = new NotificationContext([]);
    private authenticationService: AuthenticationService = new AuthenticationService();

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open'});

        this.createUserDTO = this.proxyData.createProxy({}, (property, value) => {
            console.log(`Property ${property} changed to ${value}`);

            if (this.debounceTimer)
                clearTimeout(this.debounceTimer);

            this.debounceTimer = window.setTimeout(() => {
                this.validateInputs(property, value);
                this.updateUI();
            }, 700);
        })
    }

    async connectedCallback(): Promise<void>
    {
        await this.render();

        if (this.shadowRoot)
        {
            const inputs = this.shadowRoot.querySelectorAll('input');
            inputs.forEach(input =>
            {
                input.addEventListener('input', (event) => {
                    const target: HTMLInputElement = event.target as HTMLInputElement;
                    const property: string = target.id;

                    (this.createUserDTO as any)[property] = target.value;
                })
            });
            const form = this.shadowRoot.querySelector('form');
            form?.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleSubmit();
            });
        }
    }

    private validateInputs(property: string, value: any): void
    {
        if (property === 'firstName' && value.length < 2)
            this.notificationContext.addError(ErrorCatalog.InvalidFirstName);

        if (property === 'lastName' && value.length < 2)
            this.notificationContext.addError(ErrorCatalog.InvalidLastName);

        if (property === 'password' && (value.length < 8 || value.length > 30))
            this.notificationContext.addError(ErrorCatalog.InvalidPassword);

        if (property === 'username' && value.length < 5)
            this.notificationContext.addError(ErrorCatalog.InvalidUsername);

        if (property === 'email' && !value.includes('@'))
            this.notificationContext.addError(ErrorCatalog.InvalidEmail);
    }

    private async handleSubmit(): Promise<void> {
        console.log('Form submitted with data: ', this.createUserDTO);

        if (this.notificationContext.hasErrors())
            return;

        try {
            const result = await this.authenticationService.createUser(this.createUserDTO)
            console.log('User created successfully: ', result);
        } catch (error) {
            console.error('Error creating user: ', error);
            this.notificationContext.addError(ErrorCatalog.InternalServerError);
            this.updateUI();
        }
    }

    /**
     * TODO: add daisy ui for error red UI, for now it has only for warning wrong inputs
     * TODO: modify updateUI()
     */

    private updateUI(): void
    {
        if (!this.shadowRoot)
            return;

        const alertContainer: HTMLElement | null = this.shadowRoot.getElementById('alert-container');
        const errorList: HTMLElement | null = this.shadowRoot.getElementById('error-list');
        const errorContainer: HTMLElement | null = this.shadowRoot.getElementById('error-container');

        if (this.notificationContext.hasErrors())
        {
            if (errorList)
                errorList.innerHTML = '';

            alertContainer?.classList.remove('hidden');
            errorContainer?.classList.remove('hidden');

            this.notificationContext.error.forEach(error =>
            {
                const li: HTMLLIElement = document.createElement('li');
                li.textContent = "Status code: " + error.toString();
                errorList?.appendChild(li);
            })
            this.notificationContext.cleanErrors();
        }
        else
        {
            alertContainer?.classList.add('hidden');
            errorContainer?.classList.add('hidden');
        }
    }


    private async render()
    {
        const response: Response = await fetch('/src/app/pages/Auth/@service/create-account.component.html');
        const content: string = await response.text();

        if (this.shadowRoot)
            this.shadowRoot.innerHTML = `
                <style>
                :host {
                    font-family: "Press Start 2P", monospace;

                    .bg-pattern {
                        background-color: #4c1d95 !important;
                        background-image: linear-gradient(45deg, #000 25%, transparent 25%),
                        linear-gradient(-45deg, #000 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #000 75%),
                        linear-gradient(-45deg, transparent 75%, #000 75%);
                        background-size: 30px 30px;
                        background-position: 0 0, 0 15px, 15px -15px, -15px 0;
                        opacity: 0.8;
                        overflow: hidden;
                    }

                    .nes-menu {
                        --bg-color: white;
                        --border-color: black;
                        position: relative;
                        padding: 24px;
                        background-color: var(--bg-color);
                        color: var(--border-color);
                        font-family: 'Press Start 2P', monospace;
                        border: 3px solid var(--border-color);
                        box-shadow: -10px 0 var(--border-color),
                        10px 0 var(--border-color),
                        0 -10px var(--border-color),
                        0 10px var(--border-color);
                    }

                    .nes-button {
                        --bg-color: white;
                        --border-color: black;
                        font-family: 'Press Start 2P', monospace;
                        border: 3px solid var(--border-color) !important;
                        transition: 0.25s;
                        cursor: pointer;
                        padding: 10px 20px;
                        box-shadow: 5px 5px black !important;
                        font-weight: bolder;
                    }

                    .nes-button:hover{
                        --bg-color: black;
                        background-color: var(--bg-color) !important;
                    }

                    .nes-button:active {
                        box-shadow: 0 0 0 black !important;
                        transform: translate(5px, 5px) !important;
                    }

                    h2 {
                        font-size: 1.5rem !important;
                    }

                    p {
                        font-size: 0.68rem !important;
                    }

                    label {
                        text-align: left !important;
                        font-size: 0.7rem !important;
                    }

                    button {
                        padding: 0.6rem 0.5rem !important;
                        font-size: 0.7rem !important;
                    }

                    input {
                        font-size: 0.7rem !important;
                    }

                    span {
                        font-size: 0.7rem !important;
                    }

                    a {
                        font-size: 0.48rem !important;
                    }
                }
                </style>
                ${content}`;
    }
}

customElements.define('create-account', CreateAccountComponent);