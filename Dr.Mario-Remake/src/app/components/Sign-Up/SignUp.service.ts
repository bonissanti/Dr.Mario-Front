import type {CreateUserDTO} from "../../entities/CreateUserDTO.ts";
import {ProxyData} from "../../utils/ProxyData/ProxyData.ts";
import {CreateAccountExternalAPI} from "../../../app-deprecated/pages/Auth/@service/CreateAccountExternalAPI.ts";
import {EventBus} from "../../utils/EventBus/Concrete/EventBus.ts";
import type {AuthEventsEnum} from "../../../app-deprecated/pages/Auth/@entities/AuthEventsEnum.ts";

export default class SignUpService
{
    private createUserDTO: CreateUserDTO = {}
    private debouncerTimer: number | null = null;
    private readonly proxyData: ProxyData = new ProxyData();
    private readonly apiService: CreateAccountExternalAPI;

    public constructor()
    {
        const eventBus = new EventBus<AuthEventsEnum>();
        this.apiService = new CreateAccountExternalAPI(eventBus);
    }

    public init(): void
    {
        this.setupFormListeners();
    }

    private setupFormListeners(): void
    {
        this.createUserDTO = this.proxyData.createProxy({}, (property, value) => {
            if (this.debouncerTimer)
                clearTimeout(this.debouncerTimer);

            this.debouncerTimer = globalThis.setTimeout(() => {
                this.validateBasicInputs(property, value);
            }, 500);
        });

        const nameInput = document.querySelector('wa-input.firstName') as HTMLInputElement;
        const lastNameInput = document.querySelector('wa-input.lastName') as HTMLInputElement;
        const usernameInput = document.querySelector('wa-input.username') as HTMLInputElement;
        const emailInput = document.querySelector('wa-input.email') as HTMLInputElement;
        const passwordInput = document.querySelector('wa-input.password') as HTMLInputElement;
        const confirmPasswordInput = document.querySelector('wa-input.confirm-password') as HTMLInputElement;
        const birthDateInput = document.querySelector('wa-input.birth-date') as HTMLInputElement;
        const form = document.querySelector('form') as HTMLFormElement;

        nameInput.addEventListener('input', (e) => {
            this.createUserDTO.firstName = (e.target as HTMLInputElement).value;
        })

        lastNameInput.addEventListener('input', (e) => {
            this.createUserDTO.lastName = (e.target as HTMLInputElement).value;
        })

        usernameInput.addEventListener('input', (e) => {
            this.createUserDTO.username = (e.target as HTMLInputElement).value;
        })

        emailInput.addEventListener('input', (e) => {
            this.createUserDTO.email = (e.target as HTMLInputElement).value;
        })

        passwordInput.addEventListener('input', (e) => {
            this.createUserDTO.password = (e.target as HTMLInputElement).value;
        })

        confirmPasswordInput.addEventListener('input', (e) => {
            this.createUserDTO.confirmPassword = (e.target as HTMLInputElement).value;
        })

        birthDateInput.addEventListener('input', (e) => {
            this.createUserDTO.birthDate = new Date((e.target as HTMLInputElement).value);
        })

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitForm();
        })
    }

    private async submitForm(): Promise<void>
    {
        await this.apiService.CreateAccount(this.createUserDTO);
    }

    private validateBasicInputs(property: string, value: string): void
    {
        const className = property.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
        const input = document.querySelector(`wa-input.${className}`) as HTMLInputElement;

        if (property === 'firstName') {
            if  (value.length < 3 || value.length > 20) {
                this.setCustomValidity(input, 'First name must be between 3 and 20 characters long.');
                return;
            }
            this.cleanCustomValidity(input);
        }

        if (property === 'lastName' ){
            if (value.length < 3 || value.length > 20) {
                this.setCustomValidity(input, 'Last name must be between 3 and 20 characters long.');
                return
            }
            this.cleanCustomValidity(input);
        }

        if (property === 'username') {
            if (value.length < 3 || value.length > 15) {
                this.setCustomValidity(input, 'Username must be between 3 and 10 characters long.');
                return;
            }
            this.cleanCustomValidity(input);
        }

        if (property === 'email') {
            if (value.includes('@')) {
                this.cleanCustomValidity(input);
                return;
            }
            this.setCustomValidity(input, 'Invalid email.');
        }
        this.validateSensitiveInputs(property, value, input);
    }

    private validateSensitiveInputs(property: string, value: string, input: HTMLInputElement): void
    {
        if (property === 'birthDate') {
            if (this.validateBirthDate(value)) {
                this.cleanCustomValidity(input);
                return
            }
            input.setCustomValidity('Invalid birth date.');
        }

        if (property === 'password') {
            if ((value.length < 8 || value.length > 30)) {
                this.setCustomValidity(input, 'Password must be between 8 and 30 characters long.');
                return;
            }
            this.cleanCustomValidity(input);
        }

        if (property === 'confirmPassword') {
            if ((value.length < 8 || value.length > 30)) {
                this.setCustomValidity(input, 'Confirm password must be between 8 and 30 characters long.');
                return;

            }
            if (value !== this.createUserDTO.password) {
                this.setCustomValidity(input, 'Passwords do not match.');
                return;
            }
            this.cleanCustomValidity(input);
        }
    }

    private validateBirthDate(value: string): boolean
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
            return false

        if (day > 30 && (month === 3 || month === 5 || month === 8 || month === 10))
            return false;
        return true;
    }

    private setCustomValidity(input : HTMLInputElement, message : string)
    {
        input.setCustomValidity(message);
        input.reportValidity();
    }

    private cleanCustomValidity(input : HTMLInputElement)
    {
        globalThis.setTimeout(() => {
            input.setCustomValidity('');

        }, 300);
    }
}