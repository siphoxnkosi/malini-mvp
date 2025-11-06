import { restaurants, bills } from '../mockApi.js';
import { getState, updateState } from '../state.js';
import modal from './modal.js';
import { formatCurrency } from '../utils.js';

function createMenuItem(item) {
    // ... (function remains the same)
}

function createBillPanel(bill) {
    // ... (function remains the same)
}

export default function menu({ restaurantId }) {
    const element = document.createElement('div');
    element.classList.add('menu-grid');

    let restaurant, bill;

    const menuContainer = document.createElement('div');
    const billContainer = document.createElement('div');
    billContainer.id = 'bill-container';

    element.append(menuContainer, billContainer);

    async function loadData() {
        restaurant = await restaurants.get(restaurantId);
        // Bill creation will be handled by the modal
        renderMenu();
    }

    function renderMenu() {
        menuContainer.innerHTML = ''; // Clear previous content
        const h1 = document.createElement('h1');
        h1.textContent = `${restaurant.name} Menu`;
        menuContainer.appendChild(h1);

        const menuItems = document.createElement('div');
        menuItems.classList.add('menu-items');

        Object.keys(restaurant.menu).forEach(category => {
            const categoryDiv = document.createElement('div');
            const h2 = document.createElement('h2');
            h2.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryDiv.appendChild(h2);

            restaurant.menu[category].forEach(item => {
                const menuItem = createMenuItem(item);
                menuItem.querySelector('.add-item-btn').addEventListener('click', async () => {
                    if (!bill) {
                        bill = await bills.create({ restaurantId, title: `Bill at ${restaurant.name}` });
                    }
                    const modalElement = modal({ item, billCode: bill.code, onAddItem: renderBill });
                    document.body.appendChild(modalElement);
                });
                categoryDiv.appendChild(menuItem);
            });
            menuItems.appendChild(categoryDiv);
        });
        menuContainer.appendChild(menuItems);
        lucide.createIcons();
    }

    async function renderBill() {
        if (!bill) return;
        const updatedBill = await bills.get(bill.code);
        billContainer.innerHTML = '';
        const billPanel = createBillPanel(updatedBill);
        billContainer.appendChild(billPanel);
        lucide.createIcons();
    }

    loadData();

    return element;
}
