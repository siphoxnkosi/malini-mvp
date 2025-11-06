import { restaurants } from '../mockApi.js';
import { getState, updateState } from '../state.js';

function createDOMElement(tag, classNames = [], attributes = {}, children = []) {
    // ... (helper function)
}

function createRestaurantCard(restaurant) {
    // ... (programmatic creation of the restaurant card from Screen 1 design)
}

function createRestaurantListItem(restaurant) {
    // ... (programmatic creation of the restaurant list item from Screen 1 design)
}

export default function dashboard() {
    const element = createDOMElement('div', ['dashboard-container']);
    const header = createDOMElement('header', ['dashboard-header']);
    // ... (programmatic creation of header elements)
    element.appendChild(header);

    const main = createDOMElement('main', ['dashboard-main']);
    // ... (programmatic creation of main content elements)
    element.appendChild(main);

    const fab = createDOMElement('button', ['fab'], { innerHTML: '<i data-lucide="plus"></i>' });
    element.appendChild(fab);

    const searchInput = header.querySelector('#search-input');
    const gridViewBtn = header.querySelector('#grid-view-btn');
    const listViewBtn = header.querySelector('#list-view-btn');
    const restaurantListContainer = main.querySelector('#restaurant-list-container');

    async function loadRestaurants(query = '') {
        const restaurantList = await restaurants.list({ q: query });
        restaurantListContainer.innerHTML = '';
        const viewPref = getState().viewPref;

        const listElement = document.createElement('div');
        listElement.classList.add(viewPref === 'grid' ? 'restaurant-grid' : 'restaurant-list');

        restaurantList.forEach(restaurant => {
            const card = viewPref === 'grid' ? createRestaurantCard(restaurant) : createRestaurantListItem(restaurant);
            card.addEventListener('click', () => {
                window.location.hash = `#/menu/${restaurant.id}`;
            });
            listElement.appendChild(card);
        });
        restaurantListContainer.appendChild(listElement);
        lucide.createIcons();
    }

    function updateViewButtons() {
        const viewPref = getState().viewPref;
        if (viewPref === 'grid') {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        } else {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        }
    }

    searchInput.addEventListener('input', (e) => {
        loadRestaurants(e.target.value);
    });

    gridViewBtn.addEventListener('click', () => {
        updateState(state => ({ ...state, viewPref: 'grid' }));
        loadRestaurants(searchInput.value);
        updateViewButtons();
    });

    listViewBtn.addEventListener('click', () => {
        updateState(state => ({ ...state, viewPref: 'list' }));
        loadRestaurants(searchInput.value);
        updateViewButtons();
    });

    fab.addEventListener('click', () => {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = 'Custom bill coming soon';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    });

    loadRestaurants();
    updateViewButtons();

    return element;
}
