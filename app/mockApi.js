import { getState, updateState } from './state.js';
import { generateBillCode } from './utils.js';

const LATENCY = 500; // ms

function simulateLatency(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), LATENCY);
  });
}

function findUser(role, id, password) {
  const users = getState().users[role];
  return users.find(user => user.id === id && user.password === password);
}

export const auth = {
  login({ role, id, password }) {
    const user = findUser(role, id, password);
    if (user) {
      const session = { role, id: user.id, name: user.name };
      updateState(state => ({ ...state, session }));
      return simulateLatency({ success: true, user: session });
    }
    return simulateLatency({ success: false, message: 'Invalid credentials' });
  },
  logout() {
    updateState(state => ({ ...state, session: null }));
    return simulateLatency({ success: true });
  }
};

export const restaurants = {
  list({ q = '', view = 'grid' } = {}) {
    const allRestaurants = Object.values(getState().restaurants);
    const filtered = q
      ? allRestaurants.filter(r => r.name.toLowerCase().includes(q.toLowerCase()))
      : allRestaurants;
    return simulateLatency(filtered);
  },
  get(id) {
    const restaurant = getState().restaurants[id];
    return simulateLatency(restaurant);
  }
};

export const bills = {
  create({ restaurantId, title }) {
    const code = generateBillCode(restaurantId);
    const newBill = {
      code,
      restaurantId,
      title,
      participants: [],
      items: [],
      subtotal: 0,
      tax: 0.15,
      tip: 0.10,
      total: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    updateState(state => ({
      ...state,
      bills: { ...state.bills, [code]: newBill }
    }));
    return simulateLatency({ code });
  },
  get(code) {
    const bill = getState().bills[code];
    return simulateLatency(bill);
  },
  update(code, patch) {
    const bill = getState().bills[code];
    if (bill) {
      const updatedBill = { ...bill, ...patch };
      updateState(state => ({
        ...state,
        bills: { ...state.bills, [code]: updatedBill }
      }));
      return simulateLatency(updatedBill);
    }
    return simulateLatency(null);
  },
  list({ page = 1, pageSize = 10, status = 'all' } = {}) {
    let allBills = Object.values(getState().bills);
    if (status !== 'all') {
      allBills = allBills.filter(b => b.status === status);
    }
    const paginated = allBills.slice((page - 1) * pageSize, page * pageSize);
    return simulateLatency({ bills: paginated, total: allBills.length });
  }
};
