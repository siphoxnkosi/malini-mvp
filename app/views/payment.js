import { bills } from '../mockApi.js';
import { getState } from '../state.js';
import { formatCurrency } from '../utils.js';

export default function payment({ code }) {
    const element = document.createElement('main');
    element.classList.add('payment-container');

    async function loadPayment() {
        const bill = await bills.get(code);
        const session = getState().session;
        const total = bill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) * (1 + bill.tax + bill.tip);
        const amountDue = total / (bill.participants.length || 1);

        element.innerHTML = `
            <h1>Pay ${formatCurrency(amountDue)}</h1>
            <p>Choose your payment method</p>
            <div class="payment-methods">
                <div class="payment-method">
                    <i data-lucide="qr-code"></i>
                    <p>PayShap</p>
                </div>
                </div>
            <button id="confirm-payment-btn" class="btn btn-primary">Confirm Payment</button>
        `;

        element.querySelector('#confirm-payment-btn').addEventListener('click', async () => {
            const currentBill = await bills.get(code);
            const user = getState().session;
            const updatedParticipants = [...(currentBill.participants || [])];

            if (!updatedParticipants.find(p => p.id === user.id)) {
                updatedParticipants.push({ ...user, status: 'paid' });
            } else {
                const participant = updatedParticipants.find(p => p.id === user.id);
                participant.status = 'paid';
            }

            await bills.update(code, { participants: updatedParticipants });

            window.location.hash = `#/bill/${code}`;
        });
    }

    loadPayment();

    return element;
}
