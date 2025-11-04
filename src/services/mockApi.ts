// src/services/mockApi.ts

// --- DATA TYPES ---
interface User {
  id: string;
  role: 'waiter' | 'patron';
  name: string;
  email?: string;
  passwordHash: string; // In a real app, this would be a hash, but we'll store the plain password for the demo
  restaurantIds?: string[];
}

interface Restaurant {
  id: string;
  name: string;
  tags: string[];
  rating: number;
  distanceKm: number;
  imageUrl?: string;
}

interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  sort: number;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
}

// --- MOCK DATABASE ---
const mockUsers: User[] = [
  { id: 'SPUR-001', passwordHash: 'waiter123', name: 'Thandi', role: 'waiter', restaurantIds: ['spur'] },
  { id: 'P-555001', passwordHash: 'patron123', name: 'Kabelo', role: 'patron' },
];

const mockRestaurants: Restaurant[] = [
  { id: 'spur', name: 'Spur Steak Ranches', tags: ['Grill', 'Family'], rating: 4.5, distanceKm: 2.1, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtK1BeocyEMzcJ0ZJ7tL2juTNU6OEyFhgufuQ8bRCO61jrJD5GC4-rkGw8El_pnya-mTteUlDmab-IvfhnaHHw1UzE1TLpej5bDmq-YSFP6NhpJyNvB9qClnggBhBGTE72wESmsf8XBE46FOuGZELpVulGXmumnoFVbCgCJOMM41bxJSSdnn-sYJmz6CRlyd9HuxqiPwBlWE9Oevn_goorgRkD7cwbPwuBtL3C4Vs0gtRS9hd1BdhJFpKTm5F_rWHmgavbj4qiPGI' },
  { id: 'ocean-basket', name: 'Ocean Basket', tags: ['Seafood', 'Family'], rating: 4.7, distanceKm: 3.5, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp8RoRLaDxliGGQLKbXrxbnsgaKuzkyg4E3FHpEG29fzMLBuDIhOA3sEjM7yoqwPDrfaXc1rBrckS6i9s_Lcxpv6QKhDt5v5iPNQ4reRPnmo96L6fDFVBVro7TLYtVQLBodcdaX4-Cg-2qdJCqYK9A8tPFxobAmD_aCAUoYwNmLnmGTS5VXsj6CJXDGiqrszKeLcrqGtcPb-HTh_ssQxXBKwaqWa-u1a2hGFP_QKGukJpXnmHDWFWIBTV0sjyJ_A47mmg4CkhGbAQ' },
  { id: 'kauai', name: 'Kauai', tags: ['Healthy', 'Smoothies'], rating: 4.8, distanceKm: 4.2, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec782864272?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const mockMenuCategories: MenuCategory[] = [
  { id: 'spur-1', restaurantId: 'spur', name: 'Burgers', sort: 1 },
  { id: 'spur-2', restaurantId: 'spur', name: 'Steaks', sort: 2 },
  { id: 'ocean-basket-1', restaurantId: 'ocean-basket', name: 'Platters', sort: 1 },
];

const mockMenuItems: MenuItem[] = [
  { id: 'spur-item-1', categoryId: 'spur-1', name: 'Goodie Burger', price: 99.90 },
  { id: 'spur-item-2', categoryId: 'spur-1', name: 'Cheddamelt Burger', price: 129.90 },
  { id: 'spur-item-3', categoryId: 'spur-2', name: '300g Rump Steak', price: 189.90 },
  { id: 'ocean-basket-item-1', categoryId: 'ocean-basket-1', name: 'Platter for 1', price: 199.90 },
];

// Simple sessionStorage wrapper
const db = {
  getItem: <T>(key: string): T | null => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  setItem: <T>(key: string, value: T) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  init: () => {
    if (!db.getItem('users')) db.setItem('users', mockUsers);
    if (!db.getItem('restaurants')) db.setItem('restaurants', mockRestaurants);
    if (!db.getItem('menuCategories')) db.setItem('menuCategories', mockMenuCategories);
    if (!db.getItem('menuItems')) db.setItem('menuItems', mockMenuItems);
  }
};

db.init();

// --- API FUNCTIONS ---
export const login = (userId: string, password_not_used: string) => {
  const users = db.getItem<User[]>('users');
  const user = users?.find(u => u.id === userId);
  if (user) {
    db.setItem('currentUser', user);
    return Promise.resolve(user);
  }
  return Promise.reject(new Error('User not found'));
};

export const getRestaurants = () => {
  return Promise.resolve(db.getItem<Restaurant[]>('restaurants'));
};

export const getMenu = (restaurantId: string) => {
  const categories = db.getItem<MenuCategory[]>('menuCategories')?.filter(c => c.restaurantId === restaurantId);
  const items = db.getItem<MenuItem[]>('menuItems');

  const menu = categories?.map(category => ({
    ...category,
    items: items?.filter(i => i.categoryId === category.id)
  }));

  return Promise.resolve(menu);
};

export const getCurrentUser = () => {
    return db.getItem<User>('currentUser');
}

// --- BILL DATA TYPES ---
interface Bill {
    code: string;
    restaurantId: string;
    title: string;
    createdBy: string;
    createdAt: Date;
    tipPct: number;
    settled: boolean;
    items: BillItem[];
    participants: Participant[];
}

interface BillItem {
    id: string;
    menuItemId?: string;
    name: string;
    price: number;
    qty: number;
    assignments: Assignment[];
}

interface Participant {
    id: string;
    name: string;
}

interface Assignment {
    participantId: string;
    sharePct: number;
}


const generateBillCode = (restaurantId: string) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${restaurantId.toUpperCase()}-${code}`;
}

export const createBill = (restaurantId: string, title?: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return Promise.reject(new Error("User not logged in"));

    const newBill: Bill = {
        code: generateBillCode(restaurantId),
        restaurantId,
        title: title || `Bill for ${restaurantId}`,
        createdBy: currentUser.id,
        createdAt: new Date(),
        tipPct: 0,
        settled: false,
        items: [],
        participants: [{id: currentUser.id, name: currentUser.name}],
    };

    const bills = db.getItem<Bill[]>('bills') || [];
    bills.push(newBill);
    db.setItem('bills', bills);

    return Promise.resolve(newBill);
}

export const getBill = (code: string) => {
    const bills = db.getItem<Bill[]>('bills') || [];
    const bill = bills.find(b => b.code === code);
    return bill ? Promise.resolve(bill) : Promise.reject(new Error("Bill not found"));
}

export const addItemToBill = (billCode: string, item: { name: string; price: number; qty: number; assignments: { participantId: string }[] }) => {
    const bills = db.getItem<Bill[]>('bills') || [];
    const billIndex = bills.findIndex(b => b.code === billCode);
    if (billIndex === -1) {
        return Promise.reject(new Error("Bill not found"));
    }

    const bill = bills[billIndex];
    const newBillItem: BillItem = {
        id: `item-${Date.now()}`,
        name: item.name,
        price: item.price,
        qty: item.qty,
        assignments: item.assignments.map(a => ({...a, sharePct: 1 / item.assignments.length})),
    };

    bill.items.push(newBillItem);
    bills[billIndex] = bill;
    db.setItem('bills', bills);

    return Promise.resolve(bill);
};

export const addParticipantToBill = (billCode: string, name: string) => {
    const bills = db.getItem<Bill[]>('bills') || [];
    const billIndex = bills.findIndex(b => b.code === billCode);
    if (billIndex === -1) {
        return Promise.reject(new Error("Bill not found"));
    }

    const bill = bills[billIndex];
    const newParticipant: Participant = {
        id: `participant-${Date.now()}`,
        name,
    };

    bill.participants.push(newParticipant);
    bills[billIndex] = bill;
    db.setItem('bills', bills);

    return Promise.resolve(bill);
}

export const getBills = (userId: string) => {
    const bills = db.getItem<Bill[]>('bills') || [];
    const userBills = bills.filter(b => b.createdBy === userId);
    return Promise.resolve(userBills);
}

export const joinBill = (code: string) => {
    const bills = db.getItem<Bill[]>('bills') || [];
    const bill = bills.find(b => b.code === code);
    if (bill) {
        // In a real app, you might associate the current user with the bill here.
        // For the mock, just finding it is enough.
        return Promise.resolve(bill);
    }
    return Promise.reject(new Error("Invalid code. Please check the code and try again."));
}

export const makePayment = (billCode: string, amount: number, method: string) => {
    // In a real app, this would interact with a payment gateway.
    // For our mock, we just simulate a successful payment.
    console.log(`Payment of $${amount} for bill ${billCode} via ${method} was successful.`);
    return Promise.resolve({ success: true, message: "Payment confirmed" });
}

export const updateBill = (billCode: string, updates: { tipPct?: number; settled?: boolean }) => {
    const bills = db.getItem<Bill[]>('bills') || [];
    const billIndex = bills.findIndex(b => b.code === billCode);
    if (billIndex === -1) {
        return Promise.reject(new Error("Bill not found"));
    }

    const bill = { ...bills[billIndex], ...updates };
    bills[billIndex] = bill;
    db.setItem('bills', bills);

    return Promise.resolve(bill);
}
