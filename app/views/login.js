import { auth } from '../mockApi.js';

function createLabel(text) {
    const label = document.createElement('label');
    label.textContent = text;
    return label;
}

function createInput(type, id, placeholder, value = '') {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    input.value = value;
    input.classList.add('form-input');
    return input;
}

function createButton(text, type = 'submit', classes = ['btn', 'btn-primary']) {
    const button = document.createElement('button');
    button.type = type;
    button.textContent = text;
    button.classList.add(...classes);
    return button;
}

export default function login() {
    const element = document.createElement('div');
    element.classList.add('login-container');

    const card = document.createElement('div');
    card.classList.add('login-card');

    const h1 = document.createElement('h1');
    h1.textContent = 'Welcome Back';
    card.appendChild(h1);

    const form = document.createElement('form');
    form.id = 'login-form';

    const roleGroup = document.createElement('div');
    roleGroup.classList.add('form-group');

    const waiterLabel = createLabel('Waiter');
    const waiterInput = createInput('radio', 'waiter', '');
    waiterInput.name = 'role';
    waiterInput.value = 'waiters';
    waiterInput.checked = true;
    waiterLabel.prepend(waiterInput);

    const patronLabel = createLabel('Patron');
    const patronInput = createInput('radio', 'patron', '');
    patronInput.name = 'role';
    patronInput.value = 'patrons';
    patronLabel.prepend(patronInput);

    roleGroup.append(waiterLabel, patronLabel);
    form.appendChild(roleGroup);

    const idGroup = document.createElement('div');
    idGroup.classList.add('form-group');
    idGroup.appendChild(createLabel('Waiter ID / Patron ID'));
    idGroup.appendChild(createInput('text', 'id', 'Enter your ID', 'SPUR-001'));
    form.appendChild(idGroup);

    const passwordGroup = document.createElement('div');
    passwordGroup.classList.add('form-group');
    passwordGroup.appendChild(createLabel('Password'));
    passwordGroup.appendChild(createInput('password', 'password', 'Enter your password', 'waiter123'));
    form.appendChild(passwordGroup);

    form.appendChild(createButton('Login'));

    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginTop = '1rem';
    form.appendChild(errorMessage);

    card.appendChild(form);
    element.appendChild(card);

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
            errorMessage.textContent = 'Invalid credentials';
        }
    });

    return element;
}
