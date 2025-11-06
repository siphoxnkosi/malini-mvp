import { auth } from '../mockApi.js';

function createDOMElement(tag, classNames = [], attributes = {}, children = []) {
    const element = document.createElement(tag);
    if (classNames.length) {
        element.classList.add(...classNames);
    }
    for (const attr in attributes) {
        element[attr] = attributes[attr];
    }
    children.forEach(child => element.appendChild(child));
    return element;
}

export default function login() {
    const waiterRadio = createDOMElement('input', [], { type: 'radio', name: 'role', value: 'waiters', checked: true, className: 'invisible w-0' });
    const patronRadio = createDOMElement('input', [], { type: 'radio', name: 'role', value: 'patrons', className: 'invisible w-0' });

    const waiterLabel = createDOMElement('label', ['flex', 'cursor-pointer', 'h-full', 'grow', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-md', 'px-2', 'has-[:checked]:bg-card-light', 'dark:has-[:checked]:bg-card-dark', 'has-[:checked]:shadow-sm', 'has-[:checked]:text-primary', 'dark:has-[:checked]:text-white', 'text-subtle-light', 'dark:text-subtle-dark', 'text-sm', 'font-medium', 'leading-normal'], {}, [
        createDOMElement('span', ['truncate'], { textContent: 'Waiter' }),
        waiterRadio
    ]);
    const patronLabel = createDOMElement('label', ['flex', 'cursor-pointer', 'h-full', 'grow', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-md', 'px-2', 'has-[:checked]:bg-card-light', 'dark:has-[:checked]:bg-card-dark', 'has-[:checked]:shadow-sm', 'has-[:checked]:text-primary', 'dark:has-[:checked]:text-white', 'text-subtle-light', 'dark:text-subtle-dark', 'text-sm', 'font-medium', 'leading-normal'], {}, [
        createDOMElement('span', ['truncate'], { textContent: 'Patron' }),
        patronRadio
    ]);

    const idInput = createDOMElement('input', ['form-input', 'flex', 'w-full', 'min-w-0', 'flex-1', 'resize-none', 'overflow-hidden', 'rounded-lg', 'text-text-light', 'dark:text-text-dark', 'focus:outline-0', 'focus:ring-2', 'focus:ring-accent/50', 'border', 'border-border-light', 'dark:border-border-dark', 'bg-card-light', 'dark:bg-card-dark', 'h-12', 'placeholder:text-subtle-light', 'dark:placeholder:text-subtle-dark', 'p-[15px]', 'text-base', 'font-normal', 'leading-normal'], { id: 'id', placeholder: 'Enter your ID', value: 'SPUR-001' });
    const passwordInput = createDOMElement('input', ['form-input', 'flex', 'w-full', 'min-w-0', 'flex-1', 'resize-none', 'overflow-hidden', 'rounded-lg', 'text-text-light', 'dark:text-text-dark', 'focus:outline-0', 'focus:ring-2', 'focus:ring-accent/50', 'border', 'border-border-light', 'dark:border-border-dark', 'bg-card-light', 'dark:bg-card-dark', 'h-12', 'placeholder:text-subtle-light', 'dark:placeholder:text-subtle-dark', 'p-[15px]', 'rounded-r-none', 'border-r-0', 'pr-2', 'text-base', 'font-normal', 'leading-normal'], { id: 'password', type: 'password', placeholder: 'Enter your password', value: 'waiter123' });

    const form = createDOMElement('form', ['space-y-6'], { id: 'login-form' }, [
        createDOMElement('div', ['flex', 'px-0', 'py-1'], {}, [
            createDOMElement('div', ['flex', 'h-12', 'flex-1', 'items-center', 'justify-center', 'rounded-lg', 'bg-background-light', 'dark:bg-background-dark', 'p-1'], {}, [waiterLabel, patronLabel])
        ]),
        createDOMElement('div', ['form-group'], {}, [
            createDOMElement('p', ['text-text-light', 'dark:text-text-dark', 'text-sm', 'font-medium', 'leading-normal', 'pb-2'], { textContent: 'Waiter ID / Patron ID' }),
            idInput
        ]),
        createDOMElement('div', ['form-group'], {}, [
            createDOMElement('p', ['text-text-light', 'dark:text-text-dark', 'text-sm', 'font-medium', 'leading-normal', 'pb-2'], { textContent: 'Password' }),
            createDOMElement('div', ['flex', 'w-full', 'flex-1', 'items-stretch', 'rounded-lg'], {}, [
                passwordInput,
                createDOMElement('button', ['text-subtle-light', 'dark:text-subtle-dark', 'flex', 'border', 'border-border-light', 'dark:border-border-dark', 'bg-card-light', 'dark:bg-card-dark', 'items-center', 'justify-center', 'pr-[15px]', 'rounded-r-lg', 'border-l-0'], { type: 'button', innerHTML: '<i data-lucide="eye"></i>' })
            ])
        ]),
        createDOMElement('button', ['flex', 'w-full', 'items-center', 'justify-center', 'rounded-lg', 'bg-primary', 'h-12', 'px-6', 'text-base', 'font-medium', 'text-white', 'shadow-sm', 'hover:bg-opacity-90', 'focus:outline-none', 'focus:ring-2', 'focus:ring-accent', 'focus:ring-offset-2', 'dark:focus:ring-offset-background-dark'], { type: 'submit', textContent: 'Login' }),
        createDOMElement('div', ['text-center'], {}, [
            createDOMElement('a', ['text-sm', 'font-medium', 'text-accent', 'hover:underline'], { href: '#', textContent: 'Forgot Password?' })
        ])
    ]);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = form.elements.role.value;
        const id = form.elements.id.value;
        const password = form.elements.password.value;
        const { success, user } = await auth.login({ role, id, password });
        if (success) {
            if (user.role === 'waiters') {
                window.location.hash = '#/dashboard';
            } else {
                window.location.hash = '#/join';
            }
        } else {
            document.getElementById('error-message').textContent = 'Invalid credentials';
        }
    });

    return createDOMElement('div', ['login-container'], {}, [
        createDOMElement('div', ['login-illustration']),
        createDOMElement('div', ['login-card'], {}, [
            createDOMElement('h1', [], { textContent: 'Welcome Back' }),
            form,
            createDOMElement('div', ['text-center', 'text-red-500'], { id: 'error-message' })
        ])
    ]);
}
