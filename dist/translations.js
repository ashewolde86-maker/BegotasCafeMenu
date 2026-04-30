const translations = {
    en: {
        nav: {
            home: 'Home',
            specials: 'Our Specials',
            menu: 'Full Menu',
            payment: 'Payment',
            feedback: 'Feedback',
        },
        carousel: {
            ourSpecial: 'OUR SPECIAL',
        },
        menu: {
            search: 'Search menu...',
            allTypes: 'All Types',
            noResults: 'No items found',
        },
        payment: {
            title: 'Payment Options',
            accountHolder: 'Account Holder',
            accountNumber: 'Account Number',
            phoneNumber: 'Phone Number',
            copy: 'Copy',
            copied: 'Copied!',
            noMethods: 'No payment methods available',
            primary: 'Primary',
        },
        feedback: {
            title: 'We Value Your Feedback',
            name: 'Your Name',
            email: 'Email (optional)',
            foodRating: 'Food Quality',
            drinkRating: 'Drink Quality',
            serviceRating: 'Service Quality',
            comments: 'Your Comments',
            commentsPlaceholder: 'Tell us about your experience...',
            category: 'How did you hear about us?',
            source1: 'Social Media',
            source2: 'Friend/Family',
            source3: 'Walk-in',
            source4: 'Other',
            firstVisit: 'This is my first visit',
            contact: 'I want to be contacted',
            submit: 'Submit Feedback',
            charCount: '0/500',
        },
        footer: {
            address: 'Address',
            hours: 'Hours',
            phone: 'Phone',
            rights: 'All rights reserved',
        },
        categories: {
            food: 'Food',
            drink: 'Drink',
            extra: 'Extra',
        },
        rating: {
            excellent: 'Excellent',
            good: 'Good',
            average: 'Average',
            poor: 'Poor',
        },
    },
    am: {
        nav: {
            home: 'ቤት',
            specials: 'ልዩ ምርቶች',
            menu: 'የምግብ ዝርዝር',
            payment: 'ክፈል',
            feedback: 'አስተያየት',
        },
        carousel: {
            ourSpecial: 'ልዩ ምርታችን',
        },
        menu: {
            search: 'ፍለጋ...',
            allTypes: 'ሁሉም አይነቶች',
            noResults: 'ምንም ነገር አልተገኘም',
        },
        payment: {
            title: 'የክፈል አማራጮች',
            accountHolder: 'የሒሳብ ታራሚ',
            accountNumber: 'የሒሳብ ቁጥር',
            phoneNumber: 'ስልክ ቁጥር',
            copy: 'ቅዳ',
            copied: 'ተቅዷል!',
            noMethods: 'ምንም የክፈል አማራጭ � n/a',
            primary: 'ዋና',
        },
        feedback: {
            title: 'አስተያየትዎን እናደንቃለን',
            name: 'ስመዎ',
            email: 'ኢሜይል (አማራጭ)',
            foodRating: 'የምግብ ጥራት',
            drinkRating: 'የመጠጥ ጥራት',
            serviceRating: 'የአገልግሎት ጥራት',
            comments: 'አስተያየትዎ',
            commentsPlaceholder: 'ልዩነትዎን ይንገሩን...',
            category: 'እ��ዴት ከወደዱት ነው?',
            source1: 'ማህበራዊ ሚዲያ',
            source2: 'ጓደኛ/ቤተሰብ',
            source3: 'ቀጥታ መምጫ',
            source4: 'ሌላ',
            firstVisit: 'ይሄ የመጀመሪያ ጉብኝት ነው',
            contact: 'የእርሶ ስለልክ ቁጥር እፈልጋለሁ',
            submit: 'አስተያየት ላክ',
            charCount: '0/500',
        },
        footer: {
            address: 'አድራሻ',
            hours: 'ሰአታት',
            phone: 'ስልክ',
            rights: 'ሁሉም ነገሮች ተያዝዟል',
        },
        categories: {
            food: 'ምግብ',
            drink: 'መጠጥ',
            extra: 'ተጨማሪ',
        },
        rating: {
            excellent: 'እጅግ በጣም ጥሩ',
            good: 'ጥሩ',
            average: 'አማካይ',
            poor: 'ደካማ',
        },
    },
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateAllTranslations();
}

function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    for (const k of keys) {
        value = value?.[k];
    }
    return value || key;
}

function t(key) {
    return getTranslation(key);
}

function updateAllTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    updateDynamicContent();
}

function updateDynamicContent() {
    if (typeof renderMenu === 'function') renderMenu();
    if (typeof renderPayment === 'function') renderPayment();
    if (typeof renderFilterChips === 'function') renderFilterChips();
    if (typeof renderCarousel === 'function') renderCarousel();
}

function translateProduct(product) {
    return {
        ...product,
        name: product.name_am || product.name,
        category: product.category_am || product.category,
        mainCategory: product.mainCategory_am || product.mainCategory,
        subCategory: product.subCategory_am || product.subCategory,
    };
}

function initTranslations() {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
        currentLang = saved;
    }

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const span = langBtn.querySelector('span');
        if (span) {
            span.textContent = currentLang.toUpperCase();
        }

        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'am' : 'en');
            const newSpan = langBtn.querySelector('span');
            if (newSpan) {
                newSpan.textContent = currentLang.toUpperCase();
            }
        });
    }

    updateAllTranslations();
}

window.translations = translations;
window.t = t;
window.setLanguage = setLanguage;
window.initTranslations = initTranslations;
window.translateProduct = translateProduct;
