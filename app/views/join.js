import { bills } from '../mockApi.js';

function createLabel(text, forInput) {
    const label = document.createElement('label');
    label.textContent = text;
    label.htmlFor = forInput;
    return label;
}

function createInput(type, id, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
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

export default function join() {
    const element = document.createElement('div');
    element.classList.add('join-container');

    const card = document.createElement('div');
    card.classList.add('join-card');

    const h1 = document.createElement('h1');
    h1.textContent = 'Enter Bill Code';
    card.appendChild(h1);

    const p = document.createElement('p');
    p.textContent = 'Join an existing bill-splitting session by entering the code below.';
    p.style.textAlign = 'center';
    p.style.color = 'var(--subtle-light)';
    p.style.marginBottom = '1.5rem';
    card.appendChild(p);

    const form = document.createElement('form');
    form.id = 'join-form';

    const codeGroup = document.createElement('div');
    codeGroup.classList.add('form-group');
    codeGroup.appendChild(createLabel('Bill Code', 'bill-code'));
    codeGroup.appendChild(createInput('text', 'bill-code', 'ABCD-EFGH'));
    form.appendChild(codeGroup);

    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginBottom = '1rem';
    errorMessage.style.display = 'none';
    errorMessage.innerHTML = `<i data-lucide="alert-circle" style="vertical-align: middle;"></i> Invalid code. Please check the code and try again.`;
    form.appendChild(errorMessage);

    form.appendChild(createButton('Join'));

    card.appendChild(form);
    element.appendChild(card);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = form.elements['bill-code'].value;
        const bill = await bills.get(code);
        if (bill) {
            window.location.hash = `#/bill/${code}`;
        } else {
            errorMessage.style.display = 'block';
        }
    });

    return element;
}
