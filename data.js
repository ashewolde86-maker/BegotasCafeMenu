const DB_KEYS = {
    PRODUCTS: 'begotas_products',
    SPECIALS: 'begotas_specials',
    PAYMENT: 'begotas_payment',
    REVIEWS: 'begotas_reviews',
    SETTINGS: 'begotas_settings',
    RESTAURANT: 'begotas_restaurant',
    SUBCATEGORIES: 'begotas_subcategories'
};

const defaultSubCategories = [
    {id: 1, name: "Normal Juice", name_am: "የተራገበ ጡስ", mainCategory: "Drink", icon: "juice"},
    {id: 2, name: "Shake Juice", name_am: "የሼይክ ጡስ", mainCategory: "Drink", icon: "shake"},
    {id: 3, name: "Coffee", name_am: "ቡና", mainCategory: "Drink", icon: "coffee"},
    {id: 4, name: "Tea", name_am: "ሻይ", mainCategory: "Drink", icon: "tea"},
    {id: 5, name: "Ice", name_am: "ወይስ", mainCategory: "Drink", icon: "ice"},
    {id: 6, name: "Mojito", name_am: "ሞጂቶ", mainCategory: "Drink", icon: "mojito"},
    {id: 7, name: "Hot Drinks", name_am: "ትኩስ መጠጦች", mainCategory: "Drink", icon: "topping"},
    {id: 16, name: "Iced Drinks", name_am: "ቀዝቃዛ መጠጦች", mainCategory: "Drink", icon: "ice"},
    {id: 17, name: "Soft Drinks", name_am: "ሶፍት ድሪንክስ", mainCategory: "Drink", icon: "other"},
    {id: 8, name: "Pasta & Rice", name_am: "ፓስታ እና ሩዝ", mainCategory: "Food", icon: "breakfast"},
    {id: 9, name: "Burger", name_am: "በርገር", mainCategory: "Food", icon: "burger"},
    {id: 10, name: "Shawarma & Wrap", name_am: "ሻዋርማ እና ራፕ", mainCategory: "Food", icon: "shewarma"},
    {id: 11, name: "Sandwich", name_am: "ሳንድዊች", mainCategory: "Food", icon: "rolls"},
    {id: 12, name: "Pizza", name_am: "ፒዛዝ", mainCategory: "Food", icon: "pizza"},
    {id: 13, name: "Meat", name_am: "ስጋ", mainCategory: "Food", icon: "meat"},
    {id: 14, name: "Fasting", name_am: "ፆም", mainCategory: "Food", icon: "fasting"},
    {id: 18, name: "Traditional Dish", name_am: "ባህላዊ ምግብ", mainCategory: "Food", icon: "meat"},
    {id: 19, name: "Fish", name_am: "አሳ", mainCategory: "Food", icon: "meat"},
    {id: 20, name: "Chicken", name_am: "ዶሮ", mainCategory: "Food", icon: "meat"},
    {id: 21, name: "Salad", name_am: "ሳላድ", mainCategory: "Food", icon: "fasting"},
    {id: 22, name: "Shawarma & Wraps", name_am: "ሻዋርማ እና ራፕስ", mainCategory: "Food", icon: "shewarma"},
    {id: 23, name: "Soups", name_am: "ሾርባ", mainCategory: "Food", icon: "tea"},
    {id: 24, name: "Cakes", name_am: "ኬኮች", mainCategory: "Food", icon: "breakfast"},
    {id: 15, name: "Extra", name_am: "ተጨማሪ", mainCategory: "Extra", icon: "extra"}
];

const defaultMenuData = {
    specials: [
        {id: 1, name: "Mojito with strawberry", name_am: "ሞጂቶ ከስትራቤሪ", price: 170, description: "Refreshing strawberry mojito", description_am: "ሚማቃዊ ስትራቤሪ ሞጂቶ", image: "https://digitalmenu.ctechcloud.net/images/Products/da231783-c684-4a58-8057-49175efa958a.jpg", category: "Special", mainCategory: "Drink"},
        {id: 2, name: "Special caramel", name_am: "ልዩ ካራሜል", price: 150, description: "Special caramel drink", description_am: "ልዩ ካራሜል መጠጥ", image: "https://digitalmenu.ctechcloud.net/images/Products/6aa81e10-2260-47eb-b291-7dac077658b9.jpg", category: "Special", mainCategory: "Drink"},
        {id: 3, name: "Special cheesebsa", name_am: "ልዩ ቺዝባ", price: 280, description: "Special cheese bread", description_am: "ልዩ ቺዝ ዳቦ", image: "https://digitalmenu.ctechcloud.net/images/Products/b74a6d47-2aec-4a65-b9d5-be6539c4a379.jpg", category: "Special", mainCategory: "Food"},
        {id: 4, name: "Special pizza", name_am: "ልዩ ፒዛዝ", price: 480, description: "Special house pizza", description_am: "ልዩ የቤቱ ፒዛዝ", image: "https://digitalmenu.ctechcloud.net/images/Products/4173933f-dbf0-4066-9bbe-e3bea07325c2.jpg", category: "Special", mainCategory: "Food"},
        {id: 5, name: "Special shewarma", name_am: "ልዩ ሸዋርማ", price: 500, description: "Special shewarma platter", description_am: "ልዩ ሸዋርማ ፕላተር", image: "https://digitalmenu.ctechcloud.net/images/Products/1a9d35ca-3ab7-42e5-8a32-0182c2e60528.jpg", category: "Special", mainCategory: "Food"},
        {id: 6, name: "Begotas Special Pizza", name_am: "ቤጎታስ ልዩ ፒዛዝ", price: 500, description: "Begotas signature pizza", description_am: "ቤጎታስ ፊርማዊ ፒዛዝ", image: "https://digitalmenu.ctechcloud.net/images/Products/085de016-6caa-4299-9e61-537eddccc561.jpg", category: "Special", mainCategory: "Food"}
    ],
    products: [
        {id: 101, name: "Avocado", name_am: "አቮካዶ", price: 150, description: "Fresh avocado juice", description_am: "አቮካዶ ጡስ", image: "https://digitalmenu.ctechcloud.net/images/Products/ad5f8397-c41a-4183-9706-fbc43400d698.jpg", category: "Normal Juice", category_am: "የተራገበ ጡስ", mainCategory: "Drink", subCategory: "Juice"},
        {id: 102, name: "Avocado shake", name_am: "አቮካዶ ሼይክ", price: 200, description: "Creamy avocado shake with milk", description_am: "ከወቭት ጋር አቮካዶ ሼይክ", image: "https://digitalmenu.ctechcloud.net/images/Products/dbe29068-bf2b-48b3-8485-439fa0c3d130.jpg", category: "Shake Juice", category_am: "የሼይክ ጡስ", mainCategory: "Drink", subCategory: "Shake"},
        {id: 103, name: "Avocado with egg", name_am: "አቮካዶ ከእምብጣን", price: 250, description: "Avocado served with scrambled egg", description_am: "ከብራን እጃት ጋር አቮካዶ", image: "https://digitalmenu.ctechcloud.net/images/Products/b851349c-7657-4b7d-aeb9-90af36229d57.jpg", category: "Pasta & Rice", category_am: "ፓስታ እና ሩዝ", mainCategory: "Food", subCategory: "Pasta & Rice"},
        {id: 104, name: "Beef burger", name_am: "ቤፍ በርገር", price: 400, description: "Juicy beef patty with fresh vegetables", description_am: "ከትኩሳዎች ጋር ጣፋጭ የቤፍ ፓቲ", image: "https://digitalmenu.ctechcloud.net/images/Products/9a455e6f-0775-4d2b-b3ad-dd12604e6d25.jpg", category: "Burger", category_am: "በርገር", mainCategory: "Food", subCategory: "Burger"},
        {id: 105, name: "Beef shewarma", name_am: "ቤፍ ሸዋርማ", price: 450, description: "Tender beef shewarma with sauce", description_am: "ከሳስ ጋር ጣፋጭ የቤፍ ሸዋርማ", image: "https://digitalmenu.ctechcloud.net/images/Products/cc01a5c9-0080-4773-be82-bb1e01bb245e.jpg", category: "Shawarma & Wrap", category_am: "ሻዋርማ እና ራፕ", mainCategory: "Food", subCategory: "Shawarma & Wrap"},
        {id: 106, name: "Bread 1/2", name_am: "እኩል ዳቦ", price: 20, description: "Half portion of bread", description_am: "ግማሽ ዳቦ", image: "https://digitalmenu.ctechcloud.net/images/Products/46743a9e-b273-43b0-b856-6e2e16e13ca8.jpg", category: "Extra", category_am: "ተጨማሪ", mainCategory: "Extra", subCategory: "Extra"},
        {id: 107, name: "Capuchino", name_am: "ካፑቺኖ", price: 100, description: "Hot cappuccino with foam", description_am: "ከፎም ጋር ሞቃት ካፑቺኖ", image: "https://digitalmenu.ctechcloud.net/images/Products/fa927cef-63e8-4ca7-bdf3-1f86f5f20432.jpg", category: "Hot Drinks", category_am: "ትኩስ መጠጦች", mainCategory: "Drink", subCategory: "Hot Drinks"},
        {id: 108, name: "Caramel Machiatto", name_am: "ካራሜል ማቺያቶ", price: 120, description: "Sweet caramel macchiato", description_am: "ጣፋጭ ካራሜል ማቺያቶ", image: "https://digitalmenu.ctechcloud.net/images/Products/cbb1962a-50c9-4a30-baf8-905a27eb65d5.jpg", category: "Hot Drinks", category_am: "ትኩስ መጠጦች", mainCategory: "Drink", subCategory: "Hot Drinks"},
        {id: 109, name: "Club sandwich", name_am: "ክላብ ሳንድዊች", price: 400, description: "Triple-decker sandwich with fillings", description_am: "በሶስት ንቃት ሳንድዊች", image: "https://digitalmenu.ctechcloud.net/images/Products/8f0bc995-0876-46f9-9da6-fc6a0a51045c.jpg", category: "Sandwich", category_am: "ሳንድዊች", mainCategory: "Food", subCategory: "Sandwich"},
        {id: 110, name: "Cup", name_am: "ኩባ", price: 30, description: "Small cup for takeout", description_am: "ለ� carryን ኩባ", image: "https://digitalmenu.ctechcloud.net/images/Products/37d79c0b-f1ae-4174-8f22-9486219a4aa1.jpg", category: "Extra", category_am: "ተጨማሪ", mainCategory: "Extra", subCategory: "Extra"}
    ],
    payment: [
        {id: 1, method: "Commercial Bank of Ethiopia", type: "Primary", holder: "Asrat Menta Gallaso", account: "1000730201579"},
        {id: 2, method: "Tele Birr", type: "Primary", holder: "Senait Desta", account: "0993902163"}
    ],
    restaurant: {
        name: "Begotas Cafe",
        tagline: "Taste the Difference!",
        address: "Mercato, Gishe, Wolaita Sodo, Ethiopia",
        phone: "+251993902163",
        hours: "7:00 AM - 10:00 PM"
    }
};

function initMenuDatabase() {
    if (!localStorage.getItem(DB_KEYS.PRODUCTS) || localStorage.getItem(DB_KEYS.PRODUCTS) === '[]') {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(defaultMenuData.products));
    }
    if (!localStorage.getItem(DB_KEYS.SPECIALS) || localStorage.getItem(DB_KEYS.SPECIALS) === '[]') {
        localStorage.setItem(DB_KEYS.SPECIALS, JSON.stringify(defaultMenuData.specials));
    }
    if (!localStorage.getItem(DB_KEYS.PAYMENT) || localStorage.getItem(DB_KEYS.PAYMENT) === '[]') {
        localStorage.setItem(DB_KEYS.PAYMENT, JSON.stringify(defaultMenuData.payment));
    }
    if (!localStorage.getItem(DB_KEYS.RESTAURANT) || localStorage.getItem(DB_KEYS.RESTAURANT) === 'null') {
        localStorage.setItem(DB_KEYS.RESTAURANT, JSON.stringify(defaultMenuData.restaurant));
    }
    if (!localStorage.getItem(DB_KEYS.REVIEWS)) {
        localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.SUBCATEGORIES) || localStorage.getItem(DB_KEYS.SUBCATEGORIES) === '[]') {
        localStorage.setItem(DB_KEYS.SUBCATEGORIES, JSON.stringify(defaultSubCategories));
    }
}

function getMenuData() {
    initMenuDatabase();
    
    const specials = JSON.parse(localStorage.getItem(DB_KEYS.SPECIALS) || '[]');
    const products = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]');
    const payment = JSON.parse(localStorage.getItem(DB_KEYS.PAYMENT) || '[]');
    const restaurant = JSON.parse(localStorage.getItem(DB_KEYS.RESTAURANT) || '{}');
    
    return {
        specials: specials,
        products: products,
        payment: payment,
        restaurant: restaurant
    };
}

function getSubCategories() {
    const data = getMenuData();
    const categories = new Set();
    data.products.forEach(p => {
        if (p.category) categories.add(p.category);
    });
    return Array.from(categories).sort();
}

function syncMenuData() {
    return getMenuData();
}

document.addEventListener('DOMContentLoaded', function() {
    initMenuDatabase();
    window.menuData = getMenuData();
    window.menuData.subCategories = getSubCategories();
    window.syncMenuData = syncMenuData;
});

window.DB_KEYS = DB_KEYS;
window.getMenuData = getMenuData;
window.initMenuDatabase = initMenuDatabase;