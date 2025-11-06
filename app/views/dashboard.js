import { restaurants } from '../mockApi.js';
import { getState, updateState } from '../state.js';

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.classList.add('restaurant-card');
    card.dataset.id = restaurant.id;

    const img = document.createElement('img');
    img.src = restaurant.image;
    img.alt = restaurant.name;
    card.appendChild(img);

    const content = document.createElement('div');
    content.classList.add('restaurant-card-content');

    const h3 = document.createElement('h3');
    h3.textContent = restaurant.name;
    content.appendChild(h3);

    const p = document.createElement('p');
    p.innerHTML = `<i data-lucide="star" style="color: var(--accent-color);"></i> ${restaurant.rating} <i data-lucide="map-pin"></i> ${restaurant.distanceKm} km`;
    content.appendChild(p);

    const tagsDiv = document.createElement('div');
    restaurant.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsDiv.appendChild(span);
    });
    content.appendChild(tagsDiv);

    card.appendChild(content);
    return card;
}

function createRestaurantListItem(restaurant) {
    // ... (function remains the same)
}

export default function dashboard() {
    const element = document.createElement('div');
    element.classList.add('dashboard-container');

    const header = document.createElement('header');
    header.classList.add('dashboard-header');

    const h2Header = document.createElement('h2');
    h2Header.textContent = 'Malini';
    header.appendChild(h2Header);

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Search restaurants...';
    header.appendChild(searchInput);

    const viewToggle = document.createElement('div');
    viewToggle.classList.add('view-toggle');
    const gridViewBtn = document.createElement('button');
    gridViewBtn.id = 'grid-view-btn';
    gridViewBtn.innerHTML = `<i data-lucide="layout-grid"></i>`;
    viewToggle.appendChild(gridViewBtn);
    const listViewBtn = document.createElement('button');
    listViewBtn.id = 'list-view-btn';
    listViewBtn.innerHTML = `<i data-lucide="list"></i>`;
    viewToggle.appendChild(listViewBtn);
    header.appendChild(viewToggle);

    element.appendChild(header);

    const main = document.createElement('main');
    main.classList.add('dashboard-main');

    const h2 = document.createElement('h2');
    h2.textContent = 'Your Restaurants';
    main.appendChild(h2);

    const restaurantListContainer = document.createElement('div');
    restaurantListContainer.id = 'restaurant-list-container';
    main.appendChild(restaurantListContainer);

    const fab = document.createElement('button');
    fab.classList.add('fab');
    fab.innerHTML = `<i data-lucide="plus"></i>`;
    main.appendChild(fab);

    element.appendChild(main);

    async function loadRestaurants(query = '') {
        const restaurantList = await restaurants.list({ q: query });
        restaurantListContainer.innerHTML = ''; // Clear previous results
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
