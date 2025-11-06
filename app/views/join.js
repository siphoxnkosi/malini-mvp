import { bills } from '../mockApi.js';

function createDOMElement(tag, classNames = [], attributes = {}, children = []) {
    // ... (helper function)
}

export default function join() {
    const form = createDOMElement('form', ['space-y-6'], { id: 'join-form' });
    // ... (programmatic creation of the entire join form from Screen 2 design)

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = form.elements['bill-code'].value;
        const bill = await bills.get(code);
        if (bill) {
            window.location.hash = `#/bill/${code}`;
        } else {
            document.getElementById('error-message').style.display = 'flex';
        }
    });

    return createDOMElement('div', ['join-container'], {}, [
        createDOMElement('div', ['join-card'], {}, [
            createDOMElement('h1', [], { textContent: 'Enter Bill Code' }),
            createDOMElement('p', ['text-subtle'], { textContent: 'Join an existing bill-splitting session by entering the code below.' }),
            form,
            createDOMElement('div', ['error-message'], { id: 'error-message', style: 'display:none' })
        ])
    ]);
}
