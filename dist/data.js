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
  "Image": "https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Begotas+Special+Burger",
  "Name": "Begotas Special Burger",
  "NameAm": "ስፔሻል በርገር",
  "Price": 450
 },
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/FFD700/000000?text=Cheese+Burger",
  "Name": "Cheese Burger",
  "NameAm": "ቺዝ በርገር",
  "Price": 400
 },
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Burger_Doubleking.jpg",
  "Name": "Double King Burger",
  "NameAm": "ደብል ክንግ በርገር",
  "Price": 550
 },
 {
  "SubCategory": "Burger",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Burger_Chicken.jpg",
  "Name": "Chicken Burger",
  "NameAm": "ቺክን በርገር",
  "Price": 550
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Soft.jpg",
  "Name": "Soft Cake",
  "NameAm": "ለስላሳ ኬክ",
  "Price": 90
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Cream.jpg",
  "Name": "Cream Cake",
  "NameAm": "ክሬም ኬክ",
  "Price": 100
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Chocolate.jpg",
  "Name": "Chocolate Cake",
  "NameAm": "ቼኮለታ ኬክ",
  "Price": 100
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Caramel.jpg",
  "Name": "Caramel Cake",
  "NameAm": "ካራሜል ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_strawberry.jpg",
  "Name": "Strawberry Cake",
  "NameAm": "እንጆሪ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Tiramisu.jpg",
  "Name": "Teramisu Cake",
  "NameAm": "ቴራሚሱ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Cup.jpg",
  "Name": "Cup Cake",
  "NameAm": "ካፕ ኬክ",
  "Price": 80
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Donut.jpg",
  "Name": "Donut",
  "NameAm": "ዶናት",
  "Price": 80
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Bonbolino.jpg",
  "Name": "Bonbolino",
  "NameAm": "ቦንቦሊኖ",
  "Price": 50
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Milfoni.jpg",
  "Name": "Milfoni Cake",
  "NameAm": "ሚልፎኒ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_CreamPuffis.jpg",
  "Name": "Cream Puffs",
  "NameAm": "ቦክሰኛ ኬክ",
  "Price": 120
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Tortacircle.jpg",
  "Name": "Torta Circle 1kg",
  "NameAm": "ቶርታ ክብ 1ኪግ",
  "Price": 1300
 },
 {
  "SubCategory": "Cakes",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Cake_Tortarectangle.jpg",
  "Name": "Torta Rectangle 1kg",
  "NameAm": "ቶርታ 4ማዕዘን 1ኪግ",
  "Price": 1500
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Chicken_Tenders.jpg",
  "Name": "Chicken Tenders",
  "NameAm": "ቺክን  ቴንደርስ",
  "Price": 600
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Chicken_Wings.jpg",
  "Name": "Chicken Wings",
  "NameAm": "ቺክን ዊንግስ",
  "Price": 600
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Chicken_Nuggets.jpg",
  "Name": "Chicken Nuggets",
  "NameAm": "ቺክን ዊንግስ",
  "Price": 500
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Chicken_Roasted.jpg",
  "Name": "Roasted Chicken",
  "NameAm": "ሮስትድ ቺክን",
  "Price": 700
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Chicken_Breast.jpg",
  "Name": "Chicken Breast",
  "NameAm": "ቺክን ብረሰት",
  "Price": 700
 },
 {
  "SubCategory": "Chicken",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Chicken_Fingers.jpg",
  "Name": "Chicken Fingers",
  "NameAm": "ቺክን ፍንገር",
  "Price": 500
 },
 {
  "SubCategory": "Extra",
  "Category": "Extra",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=ExtraBread.jpg",
  "Name": "Bread",
  "NameAm": "ዳቦ",
  "Price": 30
 },
 {
  "SubCategory": "Extra",
  "Category": "Extra",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Extra_Injera.jpg",
  "Name": "Injera",
  "NameAm": "እንጀራ",
  "Price": 30
 },
 {
  "SubCategory": "Extra",
  "Category": "Extra",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Extrea_Cup.jpg",
  "Name": "Coffee Cup",
  "NameAm": "የቡና ካፕ",
  "Price": 30
 },
 {
  "SubCategory": "Extra",
  "Category": "Extra",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Extra_Juicecup.jpg",
  "Name": "Juice Cup",
  "NameAm": "የጁስ ካፕ",
  "Price": 30
 },
 {
  "SubCategory": "Extra",
  "Category": "Extra",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Extra_Foil.jpg",
  "Name": "Foil",
  "NameAm": "ፎይል",
  "Price": 30
 },
 {
  "SubCategory": "Fish",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Fish_Gulash.jpg",
  "Name": "Fish Goulash",
  "NameAm": "ዓሣ ጉላሽ",
  "Price": 450
 },
 {
  "SubCategory": "Fish",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Fish_Cutlet.jpg",
  "Name": "Fish Cutlet",
  "NameAm": "ዓሣ ኮቴለት",
  "Price": 500
 },
 {
  "SubCategory": "Fish",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Fish_Lebleb.jpg",
  "Name": "Fish Lebleb",
  "NameAm": "ዓሣ ለብለብ",
  "Price": 400
 },
 {
  "SubCategory": "Fish",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Fish_Dulet.jpg",
  "Name": "Fish Dulet",
  "NameAm": "ዓሣ ዱለት",
  "Price": 400
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Machine_Coffee.jpg",
  "Name": "Coffee",
  "NameAm": "ቡና",
  "Price": 50
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Jebena_coffee.jpg",
  "Name": "Jebena Coffee",
  "NameAm": "የጀበና ቡና",
  "Price": 40
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Macchiato.jpg",
  "Name": "Macchiato",
  "NameAm": "ማክያቶ",
  "Price": 70
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Caramel_Machiato.jpg",
  "Name": "Caramel Macchiato",
  "NameAm": "ካራሜል ማክያቶ",
  "Price": 100
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Fasting_Machiatto.jpg",
  "Name": "Fasting Macchiato",
  "NameAm": "የፆም ማክያቶ",
  "Price": 100
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Cappuccino.jpg",
  "Name": "Cappucino",
  "NameAm": "ካፑቺኖ",
  "Price": 120
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Milk.jpg",
  "Name": "Milk",
  "NameAm": "ወተት",
  "Price": 70
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_SprizeTea.jpg",
  "Name": "Spris",
  "NameAm": "ስፕሪስ",
  "Price": 50
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Tea.jpg",
  "Name": "Tea",
  "NameAm": "ሻይ",
  "Price": 40
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Specialtea.jpg",
  "Name": "Special Tea",
  "NameAm": "ስፔሻል ሻይ",
  "Price": 100
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Peneaple_Tea.jpg",
  "Name": "Pineapple Tea",
  "NameAm": "አናናስ ሻይ",
  "Price": 60
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Orange_Tea.jpg",
  "Name": "Orange Tea",
  "NameAm": "ብርቱካን ሻይ",
  "Price": 60
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Lemontea.jpg",
  "Name": "Lemon Tea",
  "NameAm": "ሻይ በሎሚ",
  "Price": 60
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Gingertea.jpg",
  "Name": "Ginger Tea",
  "NameAm": "ቀሽር ሻይ",
  "Price": 40
 },
 {
  "SubCategory": "Hot Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hot_Peanut_coffeee.jpg",
  "Name": "Peanut Tea",
  "NameAm": "ለውዝ ሻይ",
  "Price": 70
 },
 {
  "SubCategory": "Iced Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Iced_Latte.jpg",
  "Name": "Iced Latte",
  "NameAm": "በረዶ ላቴ",
  "Price": 180
 },
 {
  "SubCategory": "Iced Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Iced_Mocha.jpg",
  "Name": "Iced Mocha",
  "NameAm": "በረዶ ሞቻ",
  "Price": 190
 },
 {
  "SubCategory": "Iced Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Iced_Caramel.jpg",
  "Name": "Iced Caramela",
  "NameAm": "በረዶ ካራሜል",
  "Price": 200
 },
 {
  "SubCategory": "Iced Drinks",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Iced_Coffee.jpg",
  "Name": "Iced Coffee",
  "NameAm": "በረዶ ቡና",
  "Price": 150
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Special.jpg",
  "Name": "Begotas Special Juice",
  "NameAm": "በጎታስ ስፔሻል ጁስ",
  "Price": 150
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Telba.jpg",
  "Name": "Talba Juice",
  "NameAm": "ተልባ ጁስ",
  "Price": 120
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Avocado.jpg",
  "Name": "Avocado Juice",
  "NameAm": "አቮካዶ ጁስ",
  "Price": 100
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Mango Juice.jpg",
  "Name": "Mango Juice",
  "NameAm": "ማንጎ ጁስ",
  "Price": 100
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Papaya.jpg",
  "Name": "Papaya Juice",
  "NameAm": "ፓፓያ ጁስ",
  "Price": 100
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Pineaple.jpg",
  "Name": "Pineapple Juice",
  "NameAm": "አናናስ ጁስ",
  "Price": 120
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Orange.jpg",
  "Name": "Orange Juice",
  "NameAm": "ብርቱካን ጁስ",
  "Price": 100
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_strawberry.jpg",
  "Name": "Strawberry Juice",
  "NameAm": "እንጆሪ ጁስ",
  "Price": 130
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_Spris.jpg",
  "Name": "Mixed Juice",
  "NameAm": "ስፕሪስ ጁስ",
  "Price": 100
 },
 {
  "SubCategory": "Normal Juice",
  "Category": "Drink",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Juice_watermelon.jpg",
  "Name": "Watermelon Juice",
  "NameAm": "ሀባብ ጁስ",
  "Price": 100
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pasta_Meat.jpg",
  "Name": "Pasta with Meat",
  "NameAm": "ፓስታ በሥጋ",
  "Price": 400
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pasta_Eag.jpg",
  "Name": "Pasta with Egg",
  "NameAm": "ፓስታ እንቁላል",
  "Price": 300
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pasta_Veg.jpg",
  "Name": "Pasta with Vegetable",
  "NameAm": "ፓስታ በአትክልት",
  "Price": 250
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pasta_Soos.jpg",
  "Name": "Pasta with Tomato Sos",
  "NameAm": "ፓስታ በቲማቲም",
  "Price": 250
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pasta_Tuna.jpg",
  "Name": "Pasta with Tuna",
  "NameAm": "ፓስታ በቱና",
  "Price": 450
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Rice_Meat.jpg",
  "Name": "Rice with Meat",
  "NameAm": "ሩዝ በሥጋ",
  "Price": 400
 },
 {
  "SubCategory": "Pasta & Rice",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Rice_Vegetable.jpeg",
  "Name": "Rice with Vegetable",
  "NameAm": "ሩዝ በአትክልት",
  "Price": 300
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_Special.jpg",
  "Name": "Begotas Special Pizza",
  "NameAm": "ስፔሻል ፒዛ",
  "Price": 650
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_Cheese.jpg",
  "Name": "Cheese Pizza",
  "NameAm": "ቺዝ ፒዛ",
  "Price": 500
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_Margherita.jpg",
  "Name": "Margherita Pizza",
  "NameAm": "ማረጋሬታ ፒዛ",
  "Price": 500
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_Tuna.jpg",
  "Name": "Tuna Pizza",
  "NameAm": "ቱና ፒዛ",
  "Price": 500
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_fasting.jpg",
  "Name": "Fasting Pizza",
  "NameAm": "ፋስቲንግ ፒዛ",
  "Price": 400
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_Vegetable.jpg",
  "Name": "Vegetable Pizza",
  "NameAm": "የአትክልት ፒዛ",
  "Price": 400
 },
 {
  "SubCategory": "Pizza",
  "Category": "Food",
  "Image": "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Pizza_Chicken.jpg",
  "Name": "Chicken Pizza",
  "NameAm": "ቺክን ፒዛ",
  "Price": 750
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
