document.addEventListener('DOMContentLoaded', function () {
    initMenuDatabase();
    initTranslations();

    let currentCategory = 'all';
    let currentSubCategory = 'all';
    let currentView = 'grid';
    let searchQuery = '';
    let carouselIndex = 0;
    let carouselAutoplay;
    let currentCategoryType = 'all';

    const menuGrid = document.getElementById('menuGrid');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const filterChips = document.getElementById('filterChips');
    const carouselSlides = document.getElementById('carouselSlides');
    const carouselPagination = document.getElementById('carouselPagination');

    window.menuData = getMenuData();
    console.log('App.js - Menu data loaded:', window.menuData.products?.length || 0, 'products');
    window.menuData.subCategories = window.menuData.subCategories || [];
    window.menuData.specials = (window.menuData.specials || []).filter((s) => s.available !== false);

    console.log('App.js - Starting initialization...');
    initCarousel();
    renderFilterChips();
    renderMenu();
    renderPayment();
    initEventListeners();
    initDarkMode();
    console.log('App.js - Initialization complete');

    function initCarousel() {
        if (!carouselSlides || !window.menuData || !window.menuData.specials) return;

        if (window.menuData.specials.length === 0) {
            const carouselSection = document.querySelector('.hero-carousel');
            if (carouselSection) carouselSection.style.display = 'none';
            return;
        }

        carouselSlides.innerHTML = window.menuData.specials
            .map(
                (product) => `
            <div class="carousel-slide">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=' + encodeURIComponent('${product.name}')">
                <div class="carousel-slide-content">
                    <p class="category-label" style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); font-weight: 600; letter-spacing: 1px;">OUR SPECIAL</p>
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}.00 Br</p>
                </div>
            </div>
        `,
            )
            .join('');

        if (carouselPagination && window.menuData.specials.length > 0) {
            carouselPagination.innerHTML = window.menuData.specials
                .map(
                    (_, index) => `
                <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
            `,
                )
                .join('');

            carouselPagination.querySelectorAll('.dot').forEach((dot) => {
                dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
            });
        }

        startAutoplay();
    }

    function goToSlide(index) {
        if (!carouselSlides || !window.menuData || !window.menuData.specials) return;

        carouselIndex = index;
        if (carouselIndex >= window.menuData.specials.length) carouselIndex = 0;
        if (carouselIndex < 0) carouselIndex = window.menuData.specials.length - 1;

        carouselSlides.style.transform = `translateX(-${carouselIndex * 100}%)`;

        if (carouselPagination) {
            carouselPagination.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === carouselIndex);
            });
        }
    }

    function startAutoplay() {
        stopAutoplay();
        if (window.menuData && window.menuData.specials && window.menuData.specials.length > 1) {
            carouselAutoplay = setInterval(() => goToSlide(carouselIndex + 1), 5000);
        }
    }

    function stopAutoplay() {
        if (carouselAutoplay) clearInterval(carouselAutoplay);
    }

    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');

    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(carouselIndex - 1);
            startAutoplay();
        });
    }

    if (carouselNext) {
        carouselNext.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(carouselIndex + 1);
            startAutoplay();
        });
    }

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoplay);
        carouselWrapper.addEventListener('mouseleave', startAutoplay);
    }

    function getSubCategoryIcon(name) {
        const normalized = (name || '').toLowerCase().trim();
        const iconMap = {
            'all types':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>',
            juice: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8l-1 6v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8L8 2z"></path><path d="M10 8h4"></path></svg>',
            'normal juice':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8l-1 6v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8L8 2z"></path><path d="M10 8h4"></path></svg>',
            shake: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h10l-2 6v9a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V9L7 3z"></path><path d="M12 2v3"></path></svg>',
            'shake juice':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h10l-2 6v9a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V9L7 3z"></path><path d="M12 2v3"></path></svg>',
            coffee: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z"></path><path d="M16 11h2a2 2 0 0 1 0 4h-2"></path><path d="M8 3v3"></path><path d="M12 3v3"></path></svg>',
            'coffee series':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z"></path><path d="M16 11h2a2 2 0 0 1 0 4h-2"></path><path d="M8 3v3"></path><path d="M12 3v3"></path></svg>',
            tea: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 11h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4z"></path><path d="M16 12h2a2 2 0 0 1 0 3h-2"></path><path d="M7 8h7"></path></svg>',
            'tea series':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 11h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4z"></path><path d="M16 12h2a2 2 0 0 1 0 3h-2"></path><path d="M7 8h7"></path></svg>',
            ice: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"></polygon><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
            'ice drink':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"></polygon><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
            'iced drinks':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"></polygon><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
            'soft drinks':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8l-1 6v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8L8 2z"></path><path d="M10 8h4"></path></svg>',
            mojito: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l-2 7v7a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-7L6 3z"></path><path d="M14 2l2 3"></path></svg>',
            other: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l-2 7v7a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-7L6 3z"></path></svg>',
            'other drink':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l-2 7v7a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-7L6 3z"></path></svg>',
            topping:
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4-8 4-8-4 8-4z"></path><path d="M4 7v5l8 4 8-4V7"></path></svg>',
            'hot drinks':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z"></path><path d="M16 11h2a2 2 0 0 1 0 4h-2"></path><path d="M8 3v3"></path><path d="M12 3v3"></path></svg>',
            breakfast:
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="8"></circle></svg>',
            'pasta & rice':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="16" rx="8" ry="4"></ellipse><path d="M4 16V9h16v7"></path></svg>',
            burger: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10a8 8 0 0 1 16 0H4z"></path><path d="M4 14h16"></path><path d="M6 18h12"></path></svg>',
            'traditional dish':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"></circle><path d="M12 4a8 8 0 0 1 8 8h-8z"></path></svg>',
            fish: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-5 9-5 11 5 11 5-5 5-11 5-9-5-9-5z"></path><circle cx="14" cy="12" r="1"></circle></svg>',
            shewarma:
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l12 8-12 8z"></path></svg>',
            'shawarma & wrap':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l12 8-12 8z"></path></svg>',
            'shawarma & wraps':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l12 8-12 8z"></path></svg>',
            rolls: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="7" width="16" height="10" rx="5"></rect><line x1="9" y1="7" x2="9" y2="17"></line><line x1="15" y1="7" x2="15" y2="17"></line></svg>',
            'rolls sandwich':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="7" width="16" height="10" rx="5"></rect><line x1="9" y1="7" x2="9" y2="17"></line><line x1="15" y1="7" x2="15" y2="17"></line></svg>',
            sandwich:
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="7" width="16" height="10" rx="5"></rect><line x1="9" y1="7" x2="9" y2="17"></line><line x1="15" y1="7" x2="15" y2="17"></line></svg>',
            chicken:
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 14a5 5 0 1 1 7-7l5 5a3 3 0 0 1-4 4l-5-5a3 3 0 0 0-4 4z"></path></svg>',
            salad: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-6-4-6-10a6 6 0 0 1 12 0c0 6-6 10-6 10z"></path><line x1="12" y1="9" x2="12" y2="16"></line></svg>',
            soups: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 11h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4z"></path><path d="M16 12h2a2 2 0 0 1 0 3h-2"></path><path d="M7 8h7"></path></svg>',
            cakes: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="9" rx="1"></rect><path d="M8 10V7"></path><path d="M12 10V6"></path><path d="M16 10V7"></path></svg>',
            meat: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 14a5 5 0 1 1 7-7l5 5a3 3 0 0 1-4 4l-5-5a3 3 0 0 0-4 4z"></path></svg>',
            fasting:
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-6-4-6-10a6 6 0 0 1 12 0c0 6-6 10-6 10z"></path><line x1="12" y1="9" x2="12" y2="16"></line></svg>',
            'fasting menu':
                '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-6-4-6-10a6 6 0 0 1 12 0c0 6-6 10-6 10z"></path><line x1="12" y1="9" x2="12" y2="16"></line></svg>',
            pizza: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6a18 18 0 0 1 18 0L12 21z"></path><circle cx="10" cy="12" r="1"></circle><circle cx="14" cy="10" r="1"></circle></svg>',
            extra: '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        };
        return (
            iconMap[normalized] ||
            '<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>'
        );
    }

    function renderFilterChips() {
        if (!filterChips || !window.menuData || !window.menuData.products) return;

        const displaySettings = window.menuData.displaySettings || {};
        const categoryDisplay = displaySettings.categoryDisplay || 'main';

        if (categoryDisplay === 'main') {
            const mainCats = (window.menuData.mainCategories || []).sort(
                (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
            );
            const categories = ['All Types', ...mainCats.map((c) => c.name)];

            filterChips.innerHTML = categories
                .map(
                    (cat, index) => `
                <button class="filter-chip ${index === 0 ? 'active' : ''}" data-subcategory="${cat === 'All Types' ? 'all' : cat}" data-type="main">
                    ${getSubCategoryIcon(cat)} <span>${cat}</span>
                </button>
            `,
                )
                .join('');
        } else if (categoryDisplay === 'both') {
            const mainCats = (window.menuData.mainCategories || []).sort(
                (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
            );
            const allSubCats = window.menuData.subCategories || [];

            let html = `<button class="filter-chip active" data-subcategory="all" data-type="all">${getSubCategoryIcon('All Types')} <span>All Types</span></button>`;

            mainCats.forEach((mainCat) => {
                html += `<button class="filter-chip filter-chip-main" data-subcategory="${mainCat.name}" data-type="main" data-maincategory="${mainCat.name}">${getSubCategoryIcon(mainCat.name)} <span>${mainCat.name}</span></button>`;

                const subCats = allSubCats
                    .filter((c) => c.mainCategory === mainCat.name)
                    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

                subCats.forEach((subCat) => {
                    html += `<button class="filter-chip filter-chip-sub" data-subcategory="${subCat.name}" data-type="sub" data-maincategory="${mainCat.name}">${getSubCategoryIcon(subCat.name)} <span>${subCat.name}</span></button>`;
                });
            });

            filterChips.innerHTML = html;
        } else {
            const sortedSubCats = (window.menuData.subCategories || []).sort(
                (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
            );
            const categories = ['All Types', ...sortedSubCats.map((c) => c.name)];

            filterChips.innerHTML = categories
                .map(
                    (cat, index) => `
                <button class="filter-chip ${index === 0 ? 'active' : ''}" data-subcategory="${cat === 'All Types' ? 'all' : cat}">
                    ${getSubCategoryIcon(cat)} <span>${cat}</span>
                </button>
            `,
                )
                .join('');
        }

        filterChips.querySelectorAll('.filter-chip').forEach((btn) => {
            btn.addEventListener('click', handleFilterChipClick);
        });
    }

    function renderMenu() {
        if (!window.menuData || !window.menuData.products) {
            console.log('No menu data found');
            return;
        }

        let filteredProducts = filterProducts();

        if (filteredProducts.length === 0) {
            if (menuGrid) menuGrid.innerHTML = '';
            if (noResults) noResults.classList.add('show');
        } else {
            if (noResults) noResults.classList.remove('show');
            if (menuGrid) menuGrid.innerHTML = filteredProducts.map((product) => createMenuCard(product)).join('');
        }
    }

    function filterProducts() {
        if (!window.menuData || !window.menuData.products) return [];

        const displaySettings = window.menuData.displaySettings || {};
        const categoryDisplay = displaySettings.categoryDisplay || 'main';

        const filtered = window.menuData.products.filter((product) => {
            if (product.available === false) return false;

            let matchesCategory = true;
            if (currentCategory !== 'all') {
                if (categoryDisplay === 'both') {
                    if (currentCategoryType === 'main') {
                        matchesCategory = product.mainCategory === currentCategory;
                    } else {
                        matchesCategory =
                            product.subCategory === currentCategory || product.category === currentCategory;
                    }
                } else if (categoryDisplay === 'main') {
                    matchesCategory = product.mainCategory === currentCategory;
                } else {
                    matchesCategory = product.subCategory === currentCategory || product.category === currentCategory;
                }
            }

            const matchesSubCategory =
                currentSubCategory === 'all' ||
                product.subCategory === currentSubCategory ||
                product.category === currentSubCategory;
            const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSubCategory && matchesSearch;
        });

        return sortProducts(filtered);
    }

    function sortProducts(products) {
        const sorted = [...products];
        sorted.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        return sorted;
    }

    function createMenuCard(product) {
        const displayName = currentLang === 'am' && product.name_am ? product.name_am : product.name;
        const displayCategory =
            currentLang === 'am' && product.category_am
                ? product.category_am
                : product.category || product.mainCategory;
        const displayDesc =
            currentLang === 'am' && product.description_am ? product.description_am : product.description;

        return `
            <div class="menu-card">
                <img src="${product.image}" alt="${displayName}" onerror="this.src='https://via.placeholder.com/170?text=' + encodeURIComponent('${displayName}')">
                <div class="menu-card-content">
                    <p class="category-label">${displayCategory}</p>
                    <h3>${displayName}</h3>
                    ${displayDesc ? `<p class="description">${displayDesc}</p>` : ''}
                    <p class="price">${product.price}.00 Br</p>
                </div>
            </div>
        `;
    }

    function renderPayment() {
        const paymentCards = document.querySelector('.payment-cards');
        const paymentSection = document.getElementById('paymentSection');
        const navPaymentLink = document.getElementById('navPaymentLink');
        const mobileNavPaymentLink = document.getElementById('mobileNavPaymentLink');
        const footerPaymentLink = document.getElementById('footerPaymentLink');

        if (!paymentCards || !window.menuData || !window.menuData.payment) return;

        const activePayments = window.menuData.payment.filter((p) => p.active !== false);

        if (activePayments.length === 0) {
            if (paymentSection) paymentSection.style.display = 'none';
            if (navPaymentLink) navPaymentLink.style.display = 'none';
            if (mobileNavPaymentLink) mobileNavPaymentLink.style.display = 'none';
            if (footerPaymentLink) footerPaymentLink.style.display = 'none';
            return;
        }

        if (paymentSection) paymentSection.style.display = 'block';
        if (navPaymentLink) navPaymentLink.style.display = 'flex';
        if (mobileNavPaymentLink) mobileNavPaymentLink.style.display = 'block';
        if (footerPaymentLink) footerPaymentLink.style.display = 'inline';

        paymentCards.innerHTML = activePayments
            .map(
                (p) => `
            <div class="payment-card">
                <h3>${p.method}</h3>
                <p class="payment-type">${p.type}</p>
                <div class="payment-detail"><span>Account Holder</span>
                    <p>${p.holder}</p>
                </div>
                <div class="payment-detail"><span>${p.account.length > 10 ? 'Account Number' : 'Phone Number'}</span>
                    <p class="account-number">${p.account}</p><button class="copy-btn" data-copy="${p.account}">Copy</button>
                </div>
            </div>
        `,
            )
            .join('');
    }

    function initEventListeners() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });

            mobileMenu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                });
            });
        }

        document.querySelectorAll('.category-icon').forEach((btn) => {
            btn.addEventListener('click', handleCategoryIconClick);
        });

        document.querySelectorAll('.view-btn').forEach((btn) => {
            btn.addEventListener('click', handleViewClick);
        });

        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        document.querySelectorAll('.copy-btn').forEach((btn) => {
            btn.addEventListener('click', handleCopy);
        });

        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', handleFeedbackSubmit);

            const commentsTextarea = feedbackForm.querySelector('textarea[name="comments"]');
            const charCount = feedbackForm.querySelector('.char-count');
            if (commentsTextarea && charCount) {
                commentsTextarea.addEventListener('input', () => {
                    charCount.textContent = `${commentsTextarea.value.length}/500`;
                });
            }
        }

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    function handleCategoryIconClick(e) {
        const btn = e.currentTarget;
        document.querySelectorAll('.category-icon').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        currentCategoryType = currentCategory === 'all' ? 'all' : 'main';

        currentSubCategory = 'all';
        document.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
        const allChip = document.querySelector('.filter-chip[data-subcategory="all"]');
        if (allChip) allChip.classList.add('active');

        renderMenu();
    }

    function handleFilterChipClick(e) {
        const btn = e.currentTarget;
        document.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const chipType = btn.dataset.type || 'sub';
        const chipSubcategory = btn.dataset.subcategory;

        if (chipType === 'main') {
            currentCategory = chipSubcategory;
            currentCategoryType = 'main';
        } else if (chipType === 'sub') {
            currentCategory = chipSubcategory;
            currentCategoryType = 'sub';
        } else {
            currentCategory = 'all';
            currentCategoryType = 'all';
        }

        currentSubCategory = 'all';
        renderMenu();
    }

    function handleViewClick(e) {
        const btn = e.currentTarget;
        document.querySelectorAll('.view-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        if (menuGrid) {
            menuGrid.classList.toggle('list-view', currentView === 'list');
        }
        renderMenu();
    }

    function handleSearch(e) {
        searchQuery = e.target.value.trim();
        renderMenu();
    }

    function handleCopy(e) {
        const btn = e.currentTarget;
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 2000);
        });
    }

    function handleFeedbackSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const reviews = JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]');

        const review = {
            id: reviews.length + 1,
            name: formData.get('name'),
            email: formData.get('email'),
            food_rating: formData.get('food_rating'),
            drink_rating: formData.get('drink_rating'),
            service_rating: formData.get('service_rating'),
            comments: formData.get('comments'),
            category: formData.get('category'),
            source: formData.get('source'),
            first_visit: formData.get('first_visit') === 'on',
            contact: formData.get('contact') === 'on',
            date: new Date().toISOString(),
        };

        reviews.push(review);
        localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews));

        alert('Thank you for your feedback!');
        form.reset();

        const charCount = form.querySelector('.char-count');
        if (charCount) charCount.textContent = '0/500';
    }

    function initDarkMode() {
        const darkModeBtn = document.getElementById('darkModeBtn');
        if (!darkModeBtn) return;

        const moonIcon = darkModeBtn.querySelector('.moon-icon');
        const sunIcon = darkModeBtn.querySelector('.sun-icon');

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateDarkModeIcons(savedTheme === 'light');
        }

        darkModeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? '' : 'light');
            localStorage.setItem('theme', newTheme === 'dark' ? '' : 'light');
            updateDarkModeIcons(newTheme === 'light');
        });

        function updateDarkModeIcons(isLight) {
            if (moonIcon && sunIcon) {
                moonIcon.style.display = isLight ? 'none' : 'block';
                sunIcon.style.display = isLight ? 'block' : 'none';
            }
        }
    }

    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.style.padding = '8px 0';
            } else {
                header.style.padding = '12px 0';
            }
        });
    }
});
