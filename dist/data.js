const DB_KEYS = {
    PRODUCTS: 'begotas_products',
    SPECIALS: 'begotas_specials',
    PAYMENT: 'begotas_payment',
    REVIEWS: 'begotas_reviews',
    SETTINGS: 'begotas_settings',
    RESTAURANT: 'begotas_restaurant',
    SUBCATEGORIES: 'begotas_subcategories',
    MAIN_CATEGORIES: 'begotas_main_categories',
    DISPLAY_SETTINGS: 'begotas_display_settings',
};

const defaultSubCategories = [];

const defaultMainCategories = [
    { id: 1, name: 'Food', name_am: 'ምግብ', sortOrder: 1, icon: 'food' },
    { id: 2, name: 'Drink', name_am: 'መጠጥ', sortOrder: 2, icon: 'drink' },
    { id: 3, name: 'Extra', name_am: 'ተጨማሪ', sortOrder: 3, icon: 'extra' },
];

const defaultDisplaySettings = {
    categoryDisplay: 'main',
};

const defaultMenuData = {
    specials: [],
    products: [],
    payment: [
        {
            id: 1,
            method: 'Commercial Bank of Ethiopia',
            type: 'Primary',
            holder: 'Asrat Menta Gallaso',
            account: '1000730201579',
            active: true,
        },
        { id: 2, method: 'Tele Birr', type: 'Primary', holder: 'Senait Desta', account: '0993902163', active: true },
    ],
    restaurant: {
        name: 'Begotas Cafe',
        tagline: 'Taste the Difference!',
        address: 'Mercato, Gishe, Wolaita Sodo, Ethiopia',
        phone: '+251993902163',
        hours: '7:00 AM - 10:00 PM',
    },
};

async function loadMenuDataFromFile() {
    try {
        console.log('Attempting to load menu-data.json...');
        const response = await fetch('menu-data.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.warn('Could not load menu-data.json, using defaults');
            return defaultMenuData;
        }
        const data = await response.json();
        console.log('Loaded menu data:', data?.length || 0, 'products');
        
        const result = {
            ...defaultMenuData,
            products: data || [],
            specials: []
        };
        console.log('Final menu data result:', result.products.length, 'products');
        return result;
    } catch (error) {
        console.error('Error loading menu data:', error);
        return defaultMenuData;
    }
}

async function initMenuDatabase() {
    // Load menu data from JSON file
    const menuData = await loadMenuDataFromFile();
    
    // Force fresh load from JSON by clearing and setting new data
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(menuData.products));
    localStorage.setItem(DB_KEYS.SPECIALS, JSON.stringify(menuData.specials));
    localStorage.setItem(DB_KEYS.PAYMENT, JSON.stringify(menuData.payment));
    localStorage.setItem(DB_KEYS.RESTAURANT, JSON.stringify(menuData.restaurant));
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.SUBCATEGORIES, JSON.stringify(defaultSubCategories));
    localStorage.setItem(DB_KEYS.MAIN_CATEGORIES, JSON.stringify(defaultMainCategories));
    localStorage.setItem(DB_KEYS.DISPLAY_SETTINGS, JSON.stringify(defaultDisplaySettings));
}

async function getMenuData() {
    await initMenuDatabase();

    const specials = JSON.parse(localStorage.getItem(DB_KEYS.SPECIALS) || '[]');
    const products = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]');
    const payment = JSON.parse(localStorage.getItem(DB_KEYS.PAYMENT) || '[]');
    const restaurant = JSON.parse(localStorage.getItem(DB_KEYS.RESTAURANT) || '{}');
    const subCategories = JSON.parse(localStorage.getItem(DB_KEYS.SUBCATEGORIES) || '[]');
    const mainCategories = JSON.parse(localStorage.getItem(DB_KEYS.MAIN_CATEGORIES) || '[]');
    const displaySettings = JSON.parse(localStorage.getItem(DB_KEYS.DISPLAY_SETTINGS) || '{}');

    return {
        specials: specials,
        products: products,
        payment: payment,
        restaurant: restaurant,
        subCategories: subCategories,
        mainCategories: mainCategories,
        displaySettings: displaySettings,
    };
}

function getSubCategories() {
    const data = getMenuData();
    const categories = new Set();
    data.products.forEach((p) => {
        if (p.category) categories.add(p.category);
    });
    return Array.from(categories).sort();
}

function syncMenuData() {
    return getMenuData();
}

document.addEventListener('DOMContentLoaded', async function () {
    await initMenuDatabase();
    window.menuData = await getMenuData();
    window.menuData.subCategories = getSubCategories();
    window.syncMenuData = syncMenuData;
});

window.DB_KEYS = DB_KEYS;
window.getMenuData = getMenuData;
window.initMenuDatabase = initMenuDatabase;
