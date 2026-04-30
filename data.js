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

// Embed menu data directly to avoid async loading issues
const embeddedMenuData = [
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "images/Products/Burger_Special.jpg",
  "Name": "Begotas Special Burger",
  "NameAm": "ስፔሻል በርገር",
  "Price": 450
 },
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "images/Products/Burger_Cheese.jpg",
  "Name": "Cheese Burger",
  "NameAm": "ቺዝ በርገር",
  "Price": 400
 },
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "images/Products/Burger_Doubleking.jpg",
  "Name": "Double King Burger",
  "NameAm": "ደብል ክንግ በርገር",
  "Price": 550
 },
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "images/Products/Burger_Chicken.jpg",
  "Name": "Chicken Burger",
  "NameAm": "ቺክን በርገር",
  "Price": 550
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Soft.jpg",
  "Name": "Soft Cake",
  "NameAm": "ለስላሳ ኬክ",
  "Price": 90
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Cream.jpg",
  "Name": "Cream Cake",
  "NameAm": "ክሬም ኬክ",
  "Price": 100
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Chocolate.jpg",
  "Name": "Chocolate Cake",
  "NameAm": "ቼኮለታ ኬክ",
  "Price": 100
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Caramel.jpg",
  "Name": "Caramel Cake",
  "NameAm": "ካራሜል ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_strawberry.jpg",
  "Name": "Strawberry Cake",
  "NameAm": "እንጆሪ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Tiramisu.jpg",
  "Name": "Teramisu Cake",
  "NameAm": "ቴራሚሱ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Cup.jpg",
  "Name": "Cup Cake",
  "NameAm": "ካፕ ኬክ",
  "Price": 80
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Donut.jpg",
  "Name": "Donut",
  "NameAm": "ዶናት",
  "Price": 80
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Bonbolino.jpg",
  "Name": "Bonbolino",
  "NameAm": "ቦንቦሊኖ",
  "Price": 50
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Milfoni.jpg",
  "Name": "Milfoni Cake",
  "NameAm": "ሚልፎኒ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_CreamPuffis.jpg",
  "Name": "Cream Puffs",
  "NameAm": "ቦክሰኛ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Tortacircle.jpg",
  "Name": "Torta Circle 1kg",
  "NameAm": "ቶርታ ክብ 1ኪግ",
  "Price": 1300
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "images/Products/Cake_Tortarectangle.jpg",
  "Name": "Torta Rectangle 1kg",
  "NameAm": "ቶርታ 4ማዕዘን 1ኪግ",
  "Price": 1500
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "images/Products/Chicken_Tenders.jpg",
  "Name": "Chicken Tenders",
  "NameAm": "ቺክን  ቴንደርስ",
  "Price": 600
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "images/Products/Chicken_Wings.jpg",
  "Name": "Chicken Wings",
  "NameAm": "ቺክን ዊንግስ",
  "Price": 600
 }
];

const defaultMenuData = {
    specials: [],
    products: embeddedMenuData,
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

function initMenuDatabase() {
    // Use embedded data directly
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(defaultMenuData.products));
    localStorage.setItem(DB_KEYS.SPECIALS, JSON.stringify(defaultMenuData.specials));
    localStorage.setItem(DB_KEYS.PAYMENT, JSON.stringify(defaultMenuData.payment));
    localStorage.setItem(DB_KEYS.RESTAURANT, JSON.stringify(defaultMenuData.restaurant));
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.SUBCATEGORIES, JSON.stringify(defaultSubCategories));
    localStorage.setItem(DB_KEYS.MAIN_CATEGORIES, JSON.stringify(defaultMainCategories));
    localStorage.setItem(DB_KEYS.DISPLAY_SETTINGS, JSON.stringify(defaultDisplaySettings));
}

function getMenuData() {
    initMenuDatabase();

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

document.addEventListener('DOMContentLoaded', function () {
    initMenuDatabase();
    window.menuData = getMenuData();
    window.menuData.subCategories = getSubCategories();
    window.syncMenuData = syncMenuData;
});

window.DB_KEYS = DB_KEYS;
window.getMenuData = getMenuData;
window.initMenuDatabase = initMenuDatabase;
