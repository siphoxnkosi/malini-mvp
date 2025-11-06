import { bills, restaurants } from '../mockApi.js';
import { getState } from '../state.js';
import { formatCurrency } from '../utils.js';

function createBillItem(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('bill-item');
    itemEl.innerHTML = `
        <p>${item.quantity}x ${item.name}</p>
        <p>${formatCurrency(item.price * item.quantity)}</p>
    `;
    return itemEl;
}

function createTotalLine(label, amount) {
    const line = document.createElement('div');
    line.classList.add('total-line');
    line.innerHTML = `<p>${label}</p><p>${formatCurrency(amount)}</p>`;
    return line;
}

export default function bill({ code }) {
    const element = document.createElement('div');
    element.classList.add('bill-container');

    const itemizedPanel = document.createElement('div');
    itemizedPanel.classList.add('bill-panel');

    const participantsPanel = document.createElement('div');
    participantsPanel.classList.add('bill-panel');

    element.append(itemizedPanel, participantsPanel);

    async function loadBill() {
        const bill = await bills.get(code);
        const restaurant = await restaurants.get(bill.restaurantId);
        const session = getState().session;

        const subtotal = bill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * bill.tax;
        const tip = subtotal * bill.tip;
        const total = subtotal + tax + tip;

        // Populate Itemized Panel
        itemizedPanel.innerHTML = '';
        const h3Items = document.createElement('h3');
        h3Items.textContent = 'Itemized Bill';
        itemizedPanel.appendChild(h3Items);
        bill.items.forEach(item => itemizedPanel.appendChild(createBillItem(item)));

        const totals = document.createElement('div');
        totals.classList.add('totals');
        totals.appendChild(createTotalLine('Subtotal', subtotal));
        totals.appendChild(createTotalLine('Tax (15%)', tax));
        totals.appendChild(createTotalLine('Tip (10%)', tip));
        totals.appendChild(createTotalLine('Grand Total', total));
        itemizedPanel.appendChild(totals);

        // Populate Participants Panel
        participantsPanel.innerHTML = '';
        const h3Participants = document.createElement('h3');
        h3Participants.textContent = 'Participants';
        participantsPanel.appendChild(h3Participants);
        (bill.participants || []).forEach(p => {
            const pEl = document.createElement('div');
            pEl.innerHTML = `${p.name} - <span class="status-${p.status}">${p.status}</span>`;
            participantsPanel.appendChild(pEl);
        });

        if (session.role === 'patrons') {
            const youPayEl = document.createElement('div');
            youPayEl.classList.add('you-pay');
            youPayEl.innerHTML = `
                <p>You Pay</p>
                <p class="amount">${formatCurrency(total / (bill.participants.length || 1))}</p>
            `;
            const settleBtn = document.createElement('button');
            settleBtn.textContent = 'Settle My Portion';
            settleBtn.classList.add('btn', 'btn-primary');
            settleBtn.addEventListener('click', () => {
                window.location.hash = `#/payment/${code}`;
            });
            youPayEl.appendChild(settleBtn);
            participantsPanel.appendChild(youPayEl);
        }
    }

    loadBill();

    return element;
}
