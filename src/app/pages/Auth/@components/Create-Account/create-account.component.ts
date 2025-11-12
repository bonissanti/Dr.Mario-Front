import { CreateUserDTO } from '../../@entities/CreateUserDTO.ts';
import { ProxyData } from '../../../../../shared/components/ProxyData/ProxyData.ts';
import { NotificationContext } from '../../../../../shared/stores/NotificationContext/NotificationContext.ts';
import { ErrorCatalog } from '../../../../../shared/stores/NotificationContext/ErrorCatalog/ErrorCatalog.ts';
import { CreateAccountUIHandler } from '../@uihandler/CreateAccountUIHandler.ts';
import { EventBus } from '../../../../../shared/stores/EventBus/Concrete/EventBus.ts';
import { AuthEventsEnum } from '../../@entities/AuthEventsEnum.ts';
import { CreateAccountExternalAPI } from '../../@service/CreateAccountExternalAPI.ts';
import { ComponentAnimationHelper, ComponentConfiguration } from '../@configuration/ComponentConfiguration.ts';
import {Countries} from "../../../../../shared/stores/Countries/Countries.ts";

class CreateAccountComponent extends HTMLElement
{
    private readonly createUserDTO: CreateUserDTO = {};
    private debounceTimer: number | null = null;
    private proxyData: ProxyData = new ProxyData();
    private notificationContext: NotificationContext = new NotificationContext([]);
    private readonly countriesInstance: Countries;

    // @ts-ignore
    private readonly uiHandler: CreateAccountUIHandler;
    private readonly apiService: CreateAccountExternalAPI;

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open'});
        this.countriesInstance = Countries.getInstance();

        const eventBus = new EventBus<AuthEventsEnum>();
        this.uiHandler = new CreateAccountUIHandler(eventBus, this.shadowRoot);
        this.apiService = new CreateAccountExternalAPI(eventBus);

        this.style.visibility = ComponentConfiguration.style.initialVisibility;
        this.style.opacity = ComponentConfiguration.style.initialOpacity;
        this.style.transition = ComponentConfiguration.style.transition; //Test, remove if cause problems
        this.createUserDTO = this.proxyData.createProxy({}, (property, value) => {
            if (this.debounceTimer)
                clearTimeout(this.debounceTimer);

            this.debounceTimer = window.setTimeout(() => {
                this.validateInputs(property, value);
                this.updateUI();
            }, ComponentConfiguration.behavior.debounceDelay);
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
                input.addEventListener('paste', (event) => {
                    const eventTarget = event.target as HTMLInputElement;
                    this.handlePasteEventListener(event, eventTarget.id);
                })

                input.addEventListener('input', (event) => {
                    const eventTarget = event.target as HTMLInputElement;
                    this.handleInputEventListener(eventTarget, eventTarget.id);
                })
            });

            const form = this.shadowRoot.querySelector('form');
            form?.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleSubmit();
            });
            this.handleSelect();
        }
        ComponentAnimationHelper.showComponent(this, ComponentConfiguration.style);
    }

    async disconnectedCallback(): Promise<void>
    {
        //TODO: hide component when it's being removed from DOM
    }

    /**
     * Handles the paste and input events for the specified property.
     *
     * @param {Event} event The paste or input event.
     * @param {string} property The name of the property to handle, such as 'firstName', 'lastName', 'password', etc.
     * @param {HTMLInputElement} eventTarget The input element associated with the event.
     * @return {void} This method does not return a value but may add errors to the notification context if validation fails.
     */

    private handlePasteEventListener(event: Event, property: string): void
    {
        if (property === 'confirm-password')
        {
            event.preventDefault()
        }
    }

    private handleInputEventListener(eventTarget: HTMLInputElement, property: string): void
    {
        if (property === 'birth-date')
        {
            let value = eventTarget.value.replace(/\D/g, '');
            let formattedInput = '';

            if (value.length > 0)
                formattedInput = value.substring(0, 2);

            if (value.length > 2)
                formattedInput += '/' + value.substring(2, 4);

            if (value.length > 4)
                formattedInput += '/' + value.substring(4, 8);

            eventTarget.value = formattedInput.split('/').reverse().join('/');
        }

        (this.createUserDTO as any)[property] = eventTarget.value;
    }

    private handleSelect()
    {
        if (!this.shadowRoot)
            return null;

        const countriesList = this.countriesInstance.CountryNames;
        const countryInput = this.shadowRoot.getElementById('country') as HTMLSelectElement;

        const placeHolderOptions = document.createElement('option');
        placeHolderOptions.value = '';
        placeHolderOptions.textContent = 'Select a country';
        placeHolderOptions.disabled = true;
        placeHolderOptions.selected = true;

        for (let i = 0; i < countriesList.length; i++)
        {
            const option = document.createElement('option');
            option.classList.add('text-gray-600');
            option.value = countriesList[i].code;
            option.textContent = `${countriesList[i].emoji} ${countriesList[i].name}`;
            countryInput.appendChild(option);
        }
    }

    /**
     * Validates the provided input based on the property type and value.
     *
     * @param {string} property The name of the property to validate, such as 'firstName', 'lastName', 'password', etc.
     * @param {any} value The value of the property to validate.
     * @return {void} This method does not return a value but may add errors to the notification context if validation fails.
     */

    private validateInputs(property: string, value: any): void
    {
        if (property === 'firstName' && value.length < 3)
            this.notificationContext.addError(ErrorCatalog.InvalidFirstName);

        if (property === 'lastName' && value.length < 3)
            this.notificationContext.addError(ErrorCatalog.InvalidLastName);

        if (property === 'password' && (value.length < 8 || value.length > 30))
            this.notificationContext.addError(ErrorCatalog.InvalidPassword);

        if (property === 'confirm-password' && (value.length < 8 || value.length > 30))
            this.notificationContext.addError(ErrorCatalog.InvalidConfirmPassword);

        if ((property === 'confirm-password') && this.createUserDTO['password'])
        {
            if (value !== this.createUserDTO['password'])
                this.notificationContext.addError(ErrorCatalog.InvalidDifferentPassword);
        }

        if (property === 'username' && value.length < 4)
            this.notificationContext.addError(ErrorCatalog.InvalidUsername);

        if (property === 'email' && !value.includes('@'))
            this.notificationContext.addError(ErrorCatalog.InvalidEmail);

        if (property === 'birth-date' && (value.length < 10 || !this.ValidateBirthDate(value)))
            this.notificationContext.addError(ErrorCatalog.InvalidBirthDate);
    }

    private ValidateBirthDate(value: string): boolean
    {
        const dateParts = value.split('/');
        const year = +dateParts[2];
        const month = +dateParts[1];
        const day = +dateParts[0];

        if (year < 1926 || year > 2023)
            return false;

        if (month < 1 || month > 12)
            return false;

        if (day < 1 || day > 31)
            return false;

        if (day > 29 && month === 2)
            return false;

        if (day > 30 && (month === 3 || month === 5 || month === 8 || month === 10))
            return false;

        return true;
    }

    /**
     * Handles the form submission process by creating a new user account
     * using the provided data transfer object.
     *
     * @return {Promise<void>} A promise that resolves when the account creation
     * process is completed.
     */

    private async handleSubmit(): Promise<void>
    {
        await this.apiService.CreateAccount(this.createUserDTO);
    }

    /**
     * Update UI after invalid input.
     *
     * @return {void} This method does not return a value but creates a container of errors added
     *  in the notification context list
     */

    public updateUI(): void
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

            this.notificationContext.error.forEach(error =>
            {
                const li: HTMLLIElement = document.createElement('li');
                li.textContent = "Status code: " + error.toString();
                errorList?.appendChild(li);
            })

            this.showTimedWarning(alertContainer, ComponentConfiguration.behavior.warningDuration);
            this.showTimedWarning(errorContainer, ComponentConfiguration.behavior.warningDuration);
            this.notificationContext.cleanErrors();
        }
        else
        {
            alertContainer?.classList.add('hidden');
            errorContainer?.classList.add('hidden');
        }
    }

    private showTimedWarning(container: HTMLElement | null, durationInMs: number): void
    {
        if (!container)
            return ;

        container.classList.remove('hidden');

        setTimeout(() => {
            container.classList.add('hidden');
        }, durationInMs)
    }

    /**
     * Asynchronously fetches and renders the content of an HTML file into the shadow DOM of the component.
     * The method updates the shadow DOM's innerHTML with the HTML content and applies custom styles.
     *
     * @return {Promise<void>} A promise that resolves when the content is successfully fetched and rendered.
     */

    private async render(): Promise<void>
    {

        const response: Response = await fetch('/src/app/pages/Auth/@components/Create-Account/create-account.component.html');
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