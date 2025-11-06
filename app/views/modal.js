import { bills } from '../mockApi.js';

function createButton(text, id, classes = []) {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.classList.add(...classes);
    return button;
}

export default function modal({ item, billCode, onAddItem }) {
    const element = document.createElement('div');
    element.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const h2 = document.createElement('h2');
    h2.textContent = 'Add Item to Bill';
    modalContent.appendChild(h2);

    const p = document.createElement('p');
    p.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    modalContent.appendChild(p);

    // ... (DOM creation for quantity stepper, assign tabs, participant list, new participant form)

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('modal-buttons');

    const cancelBtn = createButton('Cancel', 'cancel-btn', ['btn']);
    const addBtn = createButton('Add to Bill', 'add-to-bill-btn', ['btn', 'btn-primary']);

    buttonGroup.append(cancelBtn, addBtn);
    modalContent.appendChild(buttonGroup);

    element.appendChild(modalContent);

    let quantity = 1;
    let assignments = [];
    let splitMode = 'single';

    // ... (all event listeners and logic)

    return element;
}
