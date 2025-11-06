import { bills, restaurants } from '../mockApi.js';
import { getState } from '../state.js';
import { formatCurrency } from '../utils.js';

function createDOMElement(tag, classNames = [], attributes = {}, children = []) {
    // ... (helper function)
}

function createBillItem(item) {
    // ... (programmatic creation of bill item from Screen 8 design)
}

export default function bill({ code }) {
    const element = createDOMElement('div', ['bill-overview-container']);

    // ... (programmatic creation of the entire bill overview from Screen 8 design, including restaurant header, itemized list, totals, participants, and 'You Pay' card)

    return element;
}
