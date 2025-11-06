const initialState = {
  users: {
    waiters: [
      { id: "SPUR-001", password: "waiter123", name: "Thandi", restaurantIds: ["spur"] },
      { id: "OB-009",   password: "waiter123", name: "Jabu",   restaurantIds: ["ocean"] }
    ],
    patrons: [
      { id: "P-555001", password: "patron123", name: "Kabelo" },
      { id: "P-555002", password: "patron123", name: "Jenna"  }
    ]
  },
  restaurants: {
    spur: { id: 'spur', name: 'Spur Steak Ranches', rating: 4.5, distanceKm: 2.1, tags: ['Grill', 'Family'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtK1BeocyEMzcJ0ZJ7tL2juTNU6OEyFhgufuQ8bRCO61jrJD5GC4-rkGw8El_pnya-mTteUlDmab-IvfhnaHHw1UzE1TLpej5bDmq-YSFP6NhpJyNvB9qClnggBhBGTE72wESmsf8XBE46FOuGZELpVulGXmumnoFVbCgCJOMM41bxJSSdnn-sYJmz6CRlyd9HuxqiPwBlWE9Oevn_goorgRkD7cwbPwuBtL3C4Vs0gtRS9hd1BdhJFpKTm5F_rWHmgavbj4qiPGI', menu: {
      starters: [{id: 's1', name: 'Cheesy Garlic Prawns', price: 8.99}, {id: 's2', name: 'Crumbed Mushrooms', price: 6.99}],
      mains: [{id: 'm1', name: 'Classic Burger', price: 12.99}, {id: 'm2', name: 'Cheddamelt Steak', price: 18.99}],
      desserts: [{id: 'd1', name: 'Chocolate Lava Cake', price: 7.99}],
      drinks: [{id: 'dr1', name: 'Coca-Cola', price: 2.99}]
    } },
    ocean: { id: 'ocean', name: 'Ocean Basket', rating: 4.7, distanceKm: 3.5, tags: ['Seafood', 'Family'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp8RoRLaDxliGGQLKbXrxbnsgaKuzkyg4E3FHpEG29fzMLBuDIhOA3sEjM7yoqwPDrfaXc1rBrckS6i9s_Lcxpv6QKhDt5v5iPNQ4reRPnmo96L6fDFVBVro7TLYtVQLBodcdaX4-Cg-2qdJCqYK9A8tPFxobAmD_aCAUoYwNmLnmGTS5VXsj6CJXDGiqrszKeLcrqGtcPb-HTh_ssQxXBKwaqWa-u1a2hGFP_QKGukJpXnmHDWFWIBTV0sjyJ_A47mmg4CkhGbAQ', menu: {
      starters: [{id: 's3', name: 'Calamari', price: 9.99}],
      mains: [{id: 'm3', name: 'Fish & Chips', price: 15.99}, {id: 'm4', name: 'Prawn Platter', price: 22.99}],
      desserts: [],
      drinks: [{id: 'dr2', name: 'Sprite', price: 2.99}]
    } },
    hussar: { id: 'hussar', name: 'The Hussar Grill', rating: 4.9, distanceKm: 1.8, tags: ['Steakhouse', 'Fine Dining'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNJYMhIB4pqangqkhiCKAxCs7bW8kN4mW9UiDC0VGA5m8wWcND70sY1hm__3AnbE193lhEkUa7hSGoa1YE0n-S4bqLONNQDl-TjWDtqR3YYlzyzo5WRvzXqmkAQn3fpDUjLz6N4oL1xJf8ZRGIrs3otER4sn941c9M1tfeKx3J2KC6Tj80TZcOJMRIb2KLAkBQ61uQX7NDD-6_xfyhEjS-m-qxOkuuRAkXs7v_tSbkcBPca1K1pBjqkcSoWCs21UGQUTIzJ7i7lRc', menu: {
      starters: [{id: 's4', name: 'Hollandse Bitterballen', price: 10.99}],
      mains: [{id: 'm5', name: 'Fillet Steak', price: 25.99}],
      desserts: [{id: 'd2', name: 'Creme Brulee', price: 8.99}],
      drinks: [{id: 'dr3', name: 'Red Wine', price: 9.99}]
    } },
    roco: { id: 'roco', name: 'RocoMamas', rating: 4.3, distanceKm: 5.2, tags: ['Burgers', 'Casual'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKg7X8PssgAfNKnktnNtmszY6WQHv5w0yZ4jXHWJW-O_H0TuK-P4-0wrS4gB2KE_P5CrWxVkMvbJCjsUW-SWLWrqwGAKMUyV7cY9GXHB0BxbsrY145Ata6XxzJeOT62bDM1Xm81oBMYpKjwMJSz3pt7Ha4B8Iliuh2_n-evsRWNCoz6lul1icHB0RDceP1VacgootsUUcWieWdlRK-cUzhy9fwGQNdnB-ItQkbfBFYeodSwojtzPs-5YrT3TsdWFp0BwUDFklCfuA', menu: {
      starters: [],
      mains: [{id: 'm6', name: 'Smash Burger', price: 14.99}, {id: 'm7', name: 'Ribs', price: 20.99}],
      desserts: [],
      drinks: [{id: 'dr4', name: 'Milkshake', price: 5.99}]
    } },
  },
  bills: {},
  session: null, // { role, id, name }
  viewPref: 'grid',
};

let storageAdapter = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
};

const DATA_KEY = 'malini_data';
const SESSION_KEY = 'malini_session';

let state = {};

function persistState() {
  const dataToPersist = {
    users: state.users,
    restaurants: state.restaurants,
    bills: state.bills,
    viewPref: state.viewPref,
  };
  storageAdapter.setItem(DATA_KEY, JSON.stringify(dataToPersist));
  storageAdapter.setItem(SESSION_KEY, JSON.stringify(state.session));
}

function loadState() {
  const persistedData = storageAdapter.getItem(DATA_KEY);
  const persistedSession = storageAdapter.getItem(SESSION_KEY);

  if (persistedData) {
    const data = JSON.parse(persistedData);
    state = { ...initialState, ...data };
  } else {
    state = { ...initialState };
  }

  if (persistedSession) {
    state.session = JSON.parse(persistedSession);
  }

  persistState();
}

export function getState() {
  return state;
}

export function updateState(updater) {
  const newState = updater(state);
  state = { ...state, ...newState };
  persistState();
}

export function replaceStorageAdapter(newAdapter) {
  storageAdapter = newAdapter;
  loadState();
}

loadState();
