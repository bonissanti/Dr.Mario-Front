class LoginRegistration extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open'});
    }

    async connectedCallback(): Promise<void>
    {
        const response: Response = await fetch('/src/app/pages/Home/@components/login-registration.html');
        const content: string = await response.text();
        if (this.shadowRoot)
        {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        font-family: "Press Start 2P", monospace;
                    }
                    
                    h2 {
                        font-size: 1.5rem !important;
                    }
                    p {
                        font-size: 0.48rem !important;
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
                </style>
                ${content}
            `;
        }
        await this.createAccountNavigation();
    }

    async disconnectCallback(): Promise<void>
    {

    }

    async createAccountNavigation(): Promise<void>
    {
        const createAccountLink: HTMLElement | null | undefined = this.shadowRoot?.getElementById('createAccountLink');
        if (!createAccountLink)
        {
            console.error('Error: Create account link not found');
            return;
        }

        createAccountLink.addEventListener('click', (event) => {
            event.preventDefault();
            history.pushState({}, '', '/create-account');

            const home: HTMLElement | null = document.getElementById('home-page');
            if (home)
                home.style.display = 'none';

            const createAccount = document.querySelector('#app');
            if (createAccount)
                createAccount.innerHTML = '<create-account></create-account>'
        });
    }
}

customElements.define('login-registration', LoginRegistration);