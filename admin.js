// DB_KEYS and defaultMenuData are loaded from data.js
const ADMIN_AUTH_KEY = 'begotas_admin_session';
const ADMIN_CREDENTIALS_KEY = 'begotas_admin_credentials';
const ADMIN_ACCOUNTS_KEY = 'begotas_admin_accounts';
const CURRENT_ADMIN_USER_KEY = 'begotas_admin_current_user';
const DEFAULT_ADMIN_ACCOUNT = {
    username: 'admin',
    password: 'Admin@123',
};

const PAGE_PERMISSIONS = {
    dashboard: 'dashboard',
    menu: 'menu',
    specials: 'specials',
    categories: 'categories',
    payment: 'payment',
    reviews: 'reviews',
    settings: 'settings',
    Reports: 'Reports',
    CreateAccount: 'CreateAccount',
    QRGenerator: 'QRGenerator',
};

let dashboardInitialized = false;
let clockIntervalId = null;
let currentAdminUser = null;
let currentReportData = [];
let currentEditingItem = null;
let currentEditType = null;
let currentEditId = null;
const ITEMS_PER_PAGE = 15;
let currentMenuPage = 1;
let filteredMenuItems = [];
const LEGACY_CATEGORY_RENAMES = {
    Breakfast: 'Pasta & Rice',
    Shewarma: 'Shawarma & Wrap',
    'Rolls Sandwich': 'Sandwich',
    Rolls: 'Sandwich',
    Topping: 'Hot Drinks',
};

function getCategoryIconSvg(category) {
    if (category === 'Drink') {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h10v5a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5V4z"></path><path d="M15 6h2a2 2 0 0 1 0 4h-2"></path><path d="M10 14v6"></path><path d="M7 20h6"></path></svg>';
    }
    if (category === 'Food') {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3v7"></path><path d="M6 3v7"></path><path d="M8 3v7"></path><path d="M6 10v11"></path><path d="M14 3v8a3 3 0 0 0 3 3h0v7"></path></svg>';
    }
    if (category === 'Extra') {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>';
}

function updateCategorySelectIcons() {
    const iconBindings = [
        { selectId: 'menuCategoryFilter', iconId: 'menuCategoryFilterIcon' },
        { selectId: 'categoryMainFilter', iconId: 'categoryMainFilterIcon' },
        { selectId: 'itemMainCategory', iconId: 'itemMainCategoryIcon' },
        { selectId: 'specialMainCategory', iconId: 'specialMainCategoryIcon' },
        { selectId: 'categoryMainCategory', iconId: 'categoryMainCategoryIcon' },
    ];

    iconBindings.forEach((binding) => {
        const select = document.getElementById(binding.selectId);
        const iconWrap = document.getElementById(binding.iconId);
        if (!select || !iconWrap) return;
        iconWrap.innerHTML = getCategoryIconSvg(select.value);
    });
}

function setupCategorySelectIcons() {
    [
        'menuCategoryFilter',
        'categoryMainFilter',
        'itemMainCategory',
        'specialMainCategory',
        'categoryMainCategory',
    ].forEach((id) => {
        const select = document.getElementById(id);
        if (!select) return;
        select.addEventListener('change', updateCategorySelectIcons);
        if (id === 'menuCategoryFilter') {
            select.addEventListener('change', () => {
                populateMenuSubCategoryFilter();
                filterMenu();
            });
        }
    });
    updateCategorySelectIcons();
}

function onMainCategoryChange() {
    populateSubCategoryDropdown();
    updateCategorySelectIcons();
}

function getAdminAccount() {
    const saved = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!saved) {
        localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN_ACCOUNT));
        return { ...DEFAULT_ADMIN_ACCOUNT };
    }

    try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.password) return parsed;
    } catch (error) {
        // ignore invalid value
    }

    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN_ACCOUNT));
    return { ...DEFAULT_ADMIN_ACCOUNT };
}

function getAccounts() {
    const raw = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveAccounts(accounts) {
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function migrateLegacyAccountToAccountsList() {
    const accounts = getAccounts();
    if (accounts.length > 0) return;

    const legacy = getAdminAccount();
    saveAccounts([
        {
            id: Date.now(),
            username: legacy.username,
            password: legacy.password,
            role: 'owner',
            permissions: ['*'],
            createdAt: new Date().toISOString(),
        },
    ]);
}

function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

function canAccess(permission) {
    if (!currentAdminUser) return false;
    if (currentAdminUser.permissions?.includes('*')) return true;
    return currentAdminUser.permissions?.includes(permission);
}

function ensurePermission(permission) {
    if (!canAccess(permission)) {
        alert('You do not have permission for this action.');
        return false;
    }
    return true;
}

function showAdminPanel() {
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('adminContainer')?.classList.remove('hidden');
}

function showLoginScreen() {
    document.getElementById('loginScreen')?.classList.remove('hidden');
    document.getElementById('adminContainer')?.classList.add('hidden');
}

function applyPermissionVisibility() {
    document.querySelectorAll('.nav-item').forEach((item) => {
        const pageId = item.dataset.page;
        const permission = PAGE_PERMISSIONS[pageId];
        if (!permission) return;
        item.style.display = canAccess(permission) ? 'flex' : 'none';
    });
}

function redirectToFirstAllowedPage() {
    const firstAllowed = Object.keys(PAGE_PERMISSIONS).find((page) => canAccess(PAGE_PERMISSIONS[page]));
    if (firstAllowed) {
        showPage(firstAllowed);
    }
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('adminUsername')?.value.trim();
        const password = document.getElementById('adminPassword')?.value;
        const accounts = getAccounts();
        const errorEl = document.getElementById('loginError');
        const matchedAccount = accounts.find((acc) => acc.username === username && acc.password === password);

        if (matchedAccount) {
            currentAdminUser = matchedAccount;
            localStorage.setItem(ADMIN_AUTH_KEY, 'true');
            localStorage.setItem(CURRENT_ADMIN_USER_KEY, JSON.stringify(matchedAccount));
            if (errorEl) errorEl.textContent = '';
            loginForm.reset();
            showAdminPanel();
            initAdminDashboard();
            return;
        }

        if (errorEl) errorEl.textContent = 'Invalid username or password.';
    });
}

function initAdminDashboard() {
    const savedUser = localStorage.getItem(CURRENT_ADMIN_USER_KEY);
    if (!currentAdminUser && savedUser) {
        try {
            currentAdminUser = JSON.parse(savedUser);
        } catch (error) {
            currentAdminUser = null;
        }
    }

    if (!dashboardInitialized) {
        initDatabase();
        initNavigation();
        dashboardInitialized = true;
    }

    updateTime();
    if (!clockIntervalId) {
        clockIntervalId = setInterval(updateTime, 1000);
    }

    loadDashboard();
    loadMenuItems();
    loadSpecials();
    loadPayment();
    loadCategories();
    loadReviews();
    loadSettings();
    loadAccounts();
    applyPermissionVisibility();
    populateSubCategoryDropdown();
    populateMenuSubCategoryFilter();
    setupCategorySelectIcons();
    redirectToFirstAllowedPage();
}

function logoutAdmin() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(CURRENT_ADMIN_USER_KEY);
    currentAdminUser = null;
    showLoginScreen();
}

function changeAdminPassword() {
    const currentPasswordInput = document.getElementById('currentAdminPassword');
    const newPasswordInput = document.getElementById('newAdminPassword');
    const confirmPasswordInput = document.getElementById('confirmAdminPassword');
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) return;
    if (!currentAdminUser) return;

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields.');
        return;
    }
    if (currentPassword !== currentAdminUser.password) {
        alert('Current password is incorrect.');
        return;
    }
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters.');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match.');
        return;
    }

    const accounts = getAccounts();
    const accountIndex = accounts.findIndex((a) => a.id === currentAdminUser.id);
    if (accountIndex === -1) {
        alert('Current account no longer exists.');
        return;
    }

    accounts[accountIndex].password = newPassword;
    saveAccounts(accounts);
    currentAdminUser = accounts[accountIndex];
    localStorage.setItem(CURRENT_ADMIN_USER_KEY, JSON.stringify(currentAdminUser));

    if (accounts[accountIndex].permissions?.includes('*')) {
        localStorage.setItem(
            ADMIN_CREDENTIALS_KEY,
            JSON.stringify({
                username: accounts[accountIndex].username,
                password: newPassword,
            }),
        );
    }

    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    alert('Admin password changed successfully.');
}

function initDatabase() {
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
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
        localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({ menuUrl: 'https://begotascafe.pro.et/menu.html' }));
    }
    if (!localStorage.getItem(DB_KEYS.SUBCATEGORIES) || localStorage.getItem(DB_KEYS.SUBCATEGORIES) === '[]') {
        localStorage.setItem(DB_KEYS.SUBCATEGORIES, JSON.stringify(defaultSubCategories));
    }
    migrateLegacyCategoryNames();
    removeMainCategoryNamesFromSubcategories();
}

function removeMainCategoryNamesFromSubcategories() {
    const mainCategoryNames = ['Drink', 'Food', 'Extra'];
    let changed = false;
    let subcategories = getData(DB_KEYS.SUBCATEGORIES);
    const originalLength = subcategories.length;
    subcategories = subcategories.filter((cat) => !mainCategoryNames.includes(cat.name));
    if (subcategories.length !== originalLength) {
        changed = true;
        saveData(DB_KEYS.SUBCATEGORIES, subcategories);
    }
    if (changed) {
        let products = getData(DB_KEYS.PRODUCTS);
        products = products.map((p) => {
            if (mainCategoryNames.includes(p.subCategory)) {
                return { ...p, subCategory: '', category: p.mainCategory || '' };
            }
            return p;
        });
        saveData(DB_KEYS.PRODUCTS, products);
    }
}

function renameCategoryValue(value) {
    return LEGACY_CATEGORY_RENAMES[value] || value;
}

function migrateLegacyCategoryNames() {
    let changedProducts = false;
    let products = getData(DB_KEYS.PRODUCTS);
    products = products.map((item) => {
        const newCategory = renameCategoryValue(item.category);
        const newSubCategory = renameCategoryValue(item.subCategory);
        if (newCategory !== item.category || newSubCategory !== item.subCategory) {
            changedProducts = true;
            return {
                ...item,
                category: newCategory,
                subCategory: newSubCategory,
            };
        }
        return item;
    });
    if (changedProducts) {
        saveData(DB_KEYS.PRODUCTS, products);
    }

    let changedSubcategories = false;
    let subcategories = getData(DB_KEYS.SUBCATEGORIES);
    subcategories = subcategories.map((item) => {
        const newName = renameCategoryValue(item.name);
        if (newName !== item.name) {
            changedSubcategories = true;
            return { ...item, name: newName };
        }
        return item;
    });
    if (changedSubcategories) {
        saveData(DB_KEYS.SUBCATEGORIES, subcategories);
    }
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId(key) {
    const data = getData(key);
    if (data.length === 0) return 1;
    return Math.max(...data.map((item) => item.id)) + 1;
}

document.addEventListener('DOMContentLoaded', function () {
    migrateLegacyAccountToAccountsList();
    initLogin();

    if (isAdminLoggedIn()) {
        showAdminPanel();
        initAdminDashboard();
    } else {
        showLoginScreen();
    }
});

function updateTime() {
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        timeEl.textContent = new Date().toLocaleString();
    }
}

function showPage(pageId) {
    const permission = PAGE_PERMISSIONS[pageId];
    if (permission && !canAccess(permission)) {
        alert('You do not have access to this page.');
        return;
    }

    document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

    const titles = {
        dashboard: 'Dashboard',
        menu: 'Menu Items',
        specials: 'Special Products',
        categories: 'Sub Categories',
        payment: 'Payment Info',
        reviews: 'Reviews',
        settings: 'Settings',
        Reports: 'Reports',
        QRGenerator: 'QR Generator',
        CreateAccount: 'Create Account',
    };
    document.getElementById('pageTitle').textContent = titles[pageId] || 'Dashboard';
}

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            showPage(this.dataset.page);
        });
    });
}

function loadDashboard() {
    const products = getData(DB_KEYS.PRODUCTS);
    const specials = getData(DB_KEYS.SPECIALS);
    const payment = getData(DB_KEYS.PAYMENT);
    const reviews = getData(DB_KEYS.REVIEWS);
    const settings = getData(DB_KEYS.SETTINGS);

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalSpecials').textContent = specials.length;
    document.getElementById('totalPayment').textContent = payment.length;
    document.getElementById('totalReviews').textContent = reviews.length;

    if (settings && settings.menuUrl) {
        document.getElementById('qrUrlBox').textContent = settings.menuUrl;
    }
}

function populateSubCategoryDropdown() {
    const select = document.getElementById('itemSubCategory');
    if (!select) return;

    const categories = getData(DB_KEYS.SUBCATEGORIES);
    const mainCategory = document.getElementById('itemMainCategory')?.value || '';

    let filteredCategories = mainCategory ? categories.filter((c) => c.mainCategory === mainCategory) : categories;

    select.innerHTML =
        '<option value="">Select Sub Category</option>' +
        filteredCategories.map((cat) => `<option value="${cat.name}">${cat.name}</option>`).join('');
}

function populateMenuSubCategoryFilter() {
    const select = document.getElementById('menuSubCategoryFilter');
    if (!select) return;

    const categories = getData(DB_KEYS.SUBCATEGORIES);
    const mainCategory = document.getElementById('menuCategoryFilter')?.value || '';

    let filteredCategories = mainCategory ? categories.filter((c) => c.mainCategory === mainCategory) : categories;

    select.innerHTML =
        '<option value="">All Sub Categories</option>' +
        filteredCategories.map((cat) => `<option value="${cat.name}">${cat.name}</option>`).join('');
}

function loadMenuItems() {
    const products = getData(DB_KEYS.PRODUCTS).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    filteredMenuItems = products;
    currentMenuPage = 1;
    displayMenuPage();

    if (document.getElementById('totalProducts')) {
        document.getElementById('totalProducts').textContent = products.length;
    }
}

function displayMenuPage() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;

    const totalItems = filteredMenuItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (currentMenuPage > totalPages) currentMenuPage = totalPages || 1;

    const startIndex = (currentMenuPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    const pageItems = filteredMenuItems.slice(startIndex, endIndex);

    tbody.innerHTML = pageItems
        .map((product) => {
            const isAvailable = product.available !== false;
            return `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60'"></td>
            <td>${product.name}</td>
            <td>${product.mainCategory}</td>
            <td>${product.subCategory || '-'}</td>
            <td>${product.price}.00 Br</td>
            <td>${product.sortOrder || 0}</td>
            <td>
                <button class="status-toggle ${isAvailable ? 'active' : ''}"
                    onclick="toggleProductStatus(${product.id})"
                    title="${isAvailable ? 'Click to mark unavailable' : 'Click to mark available'}">
                </button>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-edit" onclick="editItem('menu', ${product.id})">Edit</button>
                    <button class="action-delete" onclick="deleteItem('menu', ${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `;
        })
        .join('');

    updateMenuPagination(totalItems, totalPages);
}

function updateMenuPagination(totalItems, totalPages) {
    let paginationContainer = document.getElementById('menuPagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'menuPagination';
        paginationContainer.className = 'pagination-container';
        const tableContainer = document.querySelector('#menu .table-container');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
        }
    }

    if (totalItems === 0) {
        paginationContainer.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:10px;">No products found.</p>';
        return;
    }

    let paginationHTML = `<div class="pagination-info">Showing ${(currentMenuPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentMenuPage * ITEMS_PER_PAGE, totalItems)} of ${totalItems} items</div>`;
    paginationHTML += '<div class="pagination-controls">';

    paginationHTML += `<button class="pagination-btn" onclick="changeMenuPage(${currentMenuPage - 1})" ${currentMenuPage === 1 ? 'disabled' : ''}>Previous</button>`;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentMenuPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changeMenuPage(1)">1</button>`;
        if (startPage > 2) paginationHTML += '<span class="pagination-ellipsis">...</span>';
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentMenuPage ? 'active' : ''}" onclick="changeMenuPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += '<span class="pagination-ellipsis">...</span>';
        paginationHTML += `<button class="pagination-btn" onclick="changeMenuPage(${totalPages})">${totalPages}</button>`;
    }

    paginationHTML += `<button class="pagination-btn" onclick="changeMenuPage(${currentMenuPage + 1})" ${currentMenuPage === totalPages ? 'disabled' : ''}>Next</button>`;
    paginationHTML += '</div>';

    paginationContainer.innerHTML = paginationHTML;
}

function changeMenuPage(page) {
    const totalPages = Math.ceil(filteredMenuItems.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentMenuPage = page;
    displayMenuPage();
}

function toggleProductStatus(productId) {
    if (!ensurePermission('menu')) return;

    const key = DB_KEYS.PRODUCTS;
    const data = getData(key);
    const index = data.findIndex((p) => p.id === productId);

    if (index === -1) {
        alert('Product not found.');
        return;
    }

    const currentStatus = data[index].available !== false;
    data[index].available = !currentStatus;
    data[index].updatedAt = new Date().toISOString();

    saveData(key, data);
    refreshMenuAfterDataChange();
    loadDashboard();
}

function refreshMenuAfterDataChange() {
    const category = document.getElementById('menuCategoryFilter')?.value;
    const subCategory = document.getElementById('menuSubCategoryFilter')?.value;
    const search = document.getElementById('menuSearch')?.value.toLowerCase() || '';
    const minPrice = parseFloat(document.getElementById('menuMinPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('menuMaxPrice')?.value) || Infinity;
    let products = getData(DB_KEYS.PRODUCTS);

    if (category) {
        products = products.filter((p) => p.mainCategory === category);
    }
    if (subCategory) {
        products = products.filter((p) => p.subCategory === subCategory);
    }
    if (search) {
        products = products.filter((p) => p.name.toLowerCase().includes(search));
    }
    if (minPrice > 0) {
        products = products.filter((p) => p.price >= minPrice);
    }
    if (maxPrice < Infinity) {
        products = products.filter((p) => p.price <= maxPrice);
    }

    products = products.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    filteredMenuItems = products;

    const totalPages = Math.ceil(filteredMenuItems.length / ITEMS_PER_PAGE);
    if (currentMenuPage > totalPages) {
        currentMenuPage = totalPages || 1;
    }

    displayMenuPage();
}

function loadSpecials() {
    const specials = getData(DB_KEYS.SPECIALS);
    const tbody = document.getElementById('specialsTableBody');
    if (!tbody) return;

    tbody.innerHTML = specials
        .map((special) => {
            const isAvailable = special.available !== false;
            return `
        <tr>
            <td><img src="${special.image}" alt="${special.name}" onerror="this.src='https://via.placeholder.com/60'"></td>
            <td>${special.name}</td>
            <td>${special.mainCategory}</td>
            <td>${special.price}.00 Br</td>
            <td>
                <button class="status-toggle ${isAvailable ? 'active' : ''}" 
                    onclick="toggleSpecialStatus(${special.id})" 
                    title="${isAvailable ? 'Click to mark unavailable' : 'Click to mark available'}">
                </button>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-edit" onclick="editItem('specials', ${special.id})">Edit</button>
                    <button class="action-delete" onclick="deleteItem('specials', ${special.id})">Delete</button>
                </div>
            </td>
        </tr>
    `;
        })
        .join('');

    if (document.getElementById('totalSpecials')) {
        document.getElementById('totalSpecials').textContent = specials.length;
    }
}

function toggleSpecialStatus(specialId) {
    if (!ensurePermission('specials')) return;

    const key = DB_KEYS.SPECIALS;
    const data = getData(key);
    const index = data.findIndex((s) => s.id === specialId);

    if (index === -1) {
        alert('Special product not found.');
        return;
    }

    const currentStatus = data[index].available !== false;
    data[index].available = !currentStatus;
    data[index].updatedAt = new Date().toISOString();

    saveData(key, data);
    loadSpecials();
    loadDashboard();
}

function loadPayment() {
    const payment = getData(DB_KEYS.PAYMENT);
    const tbody = document.getElementById('paymentTableBody');
    if (!tbody) return;

    tbody.innerHTML = payment
        .map(
            (p) => {
                const isActive = p.active !== false;
                return `
        <tr>
            <td>${p.method}</td>
            <td>${p.type}</td>
            <td>${p.holder}</td>
            <td>${p.account}</td>
            <td>
                <button class="status-toggle ${isActive ? 'active' : ''}"
                    onclick="togglePaymentStatus(${p.id})"
                    title="${isActive ? 'Click to mark inactive' : 'Click to mark active'}">
                </button>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-edit" onclick="editItem('payment', ${p.id})">Edit</button>
                    <button class="action-delete" onclick="deleteItem('payment', ${p.id})">Delete</button>
                </div>
            </td>
        </tr>
    `;
            },
        )
        .join('');

    if (document.getElementById('totalPayment')) {
        document.getElementById('totalPayment').textContent = payment.length;
    }
}

function togglePaymentStatus(paymentId) {
    if (!ensurePermission('payment')) return;

    const key = DB_KEYS.PAYMENT;
    const data = getData(key);
    const index = data.findIndex((p) => p.id === paymentId);

    if (index === -1) {
        alert('Payment method not found.');
        return;
    }

    const currentStatus = data[index].active !== false;
    data[index].active = !currentStatus;
    data[index].updatedAt = new Date().toISOString();

    saveData(key, data);
    loadPayment();
}

function loadCategories() {
    const categories = getData(DB_KEYS.SUBCATEGORIES).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    tbody.innerHTML = categories
        .map(
            (cat, index) => `
        <tr>
            <td>${cat.name}</td>
            <td>${cat.name_am || '-'}</td>
            <td>${cat.mainCategory}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button class="sort-btn" onclick="moveCategory(${cat.id}, 'up')" ${index === 0 ? 'disabled' : ''} style="padding: 2px 6px; min-width: 25px; font-size: 12px;" title="Move Up">↑</button>
                    <button class="sort-btn" onclick="moveCategory(${cat.id}, 'down')" ${index === categories.length - 1 ? 'disabled' : ''} style="padding: 2px 6px; min-width: 25px; font-size: 12px;" title="Move Down">↓</button>
                    <span style="margin-left: 5px;">${cat.sortOrder || 0}</span>
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-edit" onclick="editItem('categories', ${cat.id})">Edit</button>
                    <button class="action-delete" onclick="deleteItem('categories', ${cat.id})">Delete</button>
                </div>
            </td>
        </tr>
    `,
        )
        .join('');
}

function moveCategory(id, direction) {
    const categories = getData(DB_KEYS.SUBCATEGORIES).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= categories.length) return;

    const currentOrder = categories[index].sortOrder;
    categories[index].sortOrder = categories[swapIndex].sortOrder;
    categories[swapIndex].sortOrder = currentOrder;

    saveData(DB_KEYS.SUBCATEGORIES, categories);
    loadCategories();
}

function loadReviews() {
    const reviews = getData(DB_KEYS.REVIEWS);
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    if (reviews.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted);">No reviews yet.</p>';
        return;
    }

    grid.innerHTML = reviews
        .map(
            (review) => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-name">${review.name || 'Anonymous'}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div class="review-ratings">
                ${review.food_rating ? `<span class="review-rating">Food: <span class="stars">${'★'.repeat(parseInt(review.food_rating))}</span></span>` : ''}
                ${review.drink_rating ? `<span class="review-rating">Drink: <span class="stars">${'★'.repeat(parseInt(review.drink_rating))}</span></span>` : ''}
                ${review.service_rating ? `<span class="review-rating">Service: <span class="stars">${'★'.repeat(parseInt(review.service_rating))}</span></span>` : ''}
            </div>
            <p class="review-comment">${review.comments || 'No comment'}</p>
        </div>
    `,
        )
        .join('');

    if (document.getElementById('totalReviews')) {
        document.getElementById('totalReviews').textContent = reviews.length;
    }
}

function loadSettings() {
    const settings = getData(DB_KEYS.SETTINGS);
    const restaurant = getData(DB_KEYS.RESTAURANT);
    const displaySettings = getData(DB_KEYS.DISPLAY_SETTINGS);

    if (settings && settings.menuUrl) {
        document.getElementById('menuUrl').value = settings.menuUrl;
        document.getElementById('qrUrlBox').textContent = settings.menuUrl;
    }

    if (restaurant) {
        document.getElementById('restaurantName').value = restaurant.name || '';
        document.getElementById('restaurantTagline').value = restaurant.tagline || '';
        document.getElementById('restaurantAddress').value = restaurant.address || '';
        document.getElementById('restaurantPhone').value = restaurant.phone || '';
        document.getElementById('restaurantHours').value = restaurant.hours || '';
    }

    if (displaySettings && displaySettings.categoryDisplay) {
        const displaySelect = document.getElementById('categoryDisplayMode');
        if (displaySelect) displaySelect.value = displaySettings.categoryDisplay;
    }

    loadMainCategories();
}

function loadMainCategories() {
    const mainCats = getData(DB_KEYS.MAIN_CATEGORIES).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const container = document.getElementById('mainCategoriesList');
    if (!container) return;

    container.innerHTML = mainCats
        .map(
            (cat, index) => `
        <div class="main-cat-item" style="display: flex; align-items: center; gap: 10px; padding: 10px; margin-bottom: 8px; background: var(--bg-dark-tertiary); border-radius: 8px;">
            <button class="sort-btn" onclick="moveMainCategory(${cat.id}, 'up')" ${index === 0 ? 'disabled' : ''} style="padding: 4px 8px; min-width: 30px;" title="Move Up">↑</button>
            <button class="sort-btn" onclick="moveMainCategory(${cat.id}, 'down')" ${index === mainCats.length - 1 ? 'disabled' : ''} style="padding: 4px 8px; min-width: 30px;" title="Move Down">↓</button>
            <span style="flex: 1;">
                <strong>${cat.name}</strong> (${cat.name_am || '-'})
                <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 10px;">Sort: ${cat.sortOrder || 0}</span>
            </span>
            <button class="action-edit" onclick="editMainCategory(${cat.id})">Edit</button>
            <button class="action-delete" onclick="deleteMainCategory(${cat.id})">Delete</button>
        </div>
    `,
        )
        .join('');
}

function moveMainCategory(id, direction) {
    const mainCats = getData(DB_KEYS.MAIN_CATEGORIES).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const index = mainCats.findIndex((c) => c.id === id);
    if (index === -1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= mainCats.length) return;

    const currentOrder = mainCats[index].sortOrder;
    mainCats[index].sortOrder = mainCats[swapIndex].sortOrder;
    mainCats[swapIndex].sortOrder = currentOrder;

    saveData(DB_KEYS.MAIN_CATEGORIES, mainCats);
    loadMainCategories();
}

function addMainCategory() {
    const name = prompt('Enter main category name (English):');
    if (!name) return;
    const name_am = prompt('Enter main category name (Amharic):') || '';
    const mainCats = getData(DB_KEYS.MAIN_CATEGORIES);
    const sortOrder = mainCats.length + 1;

    const newCat = {
        id: generateId(DB_KEYS.MAIN_CATEGORIES),
        name: name,
        name_am: name_am,
        sortOrder: sortOrder,
        icon: 'other',
    };

    mainCats.push(newCat);
    saveData(DB_KEYS.MAIN_CATEGORIES, mainCats);
    loadMainCategories();
}

function editMainCategory(id) {
    const mainCats = getData(DB_KEYS.MAIN_CATEGORIES);
    const cat = mainCats.find((c) => c.id === id);
    if (!cat) return;

    const name = prompt('Enter main category name (English):', cat.name);
    if (!name) return;
    const name_am = prompt('Enter main category name (Amharic):', cat.name_am || '');
    const sortOrder = parseInt(prompt('Enter sort order:', cat.sortOrder || 0)) || 0;

    const index = mainCats.findIndex((c) => c.id === id);
    mainCats[index] = { ...cat, name: name, name_am: name_am, sortOrder: sortOrder };

    saveData(DB_KEYS.MAIN_CATEGORIES, mainCats);
    loadMainCategories();
}

function deleteMainCategory(id) {
    if (!confirm('Are you sure you want to delete this main category? This will not delete the associated subcategories and products.')) return;

    let mainCats = getData(DB_KEYS.MAIN_CATEGORIES);
    mainCats = mainCats.filter((c) => c.id !== id);

    saveData(DB_KEYS.MAIN_CATEGORIES, mainCats);
    loadMainCategories();
}

function saveDisplaySettings() {
    const displayMode = document.getElementById('categoryDisplayMode').value;
    const settings = { categoryDisplay: displayMode };
    saveData(DB_KEYS.DISPLAY_SETTINGS, settings);
    alert('Display settings saved!');
}

function loadAccounts() {
    const tbody = document.getElementById('accountsTableBody');
    if (!tbody) return;

    const accounts = getAccounts();
    tbody.innerHTML = accounts
        .map(
            (account) => `
        <tr>
            <td>${account.username}</td>
            <td>${account.role || 'staff'}</td>
            <td>${(account.permissions || []).join(', ')}</td>
            <td>
                <div class="table-actions">
                    <button class="action-edit" onclick="startEditAccount(${account.id})">Edit</button>
                    ${account.permissions?.includes('*') ? '' : `<button class="action-delete" onclick="deleteAdminAccount(${account.id})">Delete</button>`}
                </div>
            </td>
        </tr>
    `,
        )
        .join('');
}

function startEditAccount(accountId) {
    if (!ensurePermission('CreateAccount')) return;

    const account = getAccounts().find((acc) => acc.id === accountId);
    if (!account) {
        alert('Account not found.');
        return;
    }

    const section = document.getElementById('editAccountSection');
    const idEl = document.getElementById('editAccountId');
    const userEl = document.getElementById('editAccountUsername');
    const passwordEl = document.getElementById('editAccountPassword');
    const roleEl = document.getElementById('editAccountRole');
    if (!section || !idEl || !userEl || !passwordEl || !roleEl) return;

    idEl.value = String(account.id);
    userEl.value = account.username;
    passwordEl.value = '';
    roleEl.value = account.role || 'staff';

    const permissions = account.permissions || [];
    const isSuperOwner = permissions.includes('*');
    document.querySelectorAll('.edit-permission-checkbox').forEach((cb) => {
        cb.checked = isSuperOwner || permissions.includes(cb.value);
        cb.disabled = isSuperOwner;
    });

    section.style.display = 'block';
}

function cancelEditAccount() {
    const section = document.getElementById('editAccountSection');
    const idEl = document.getElementById('editAccountId');
    const userEl = document.getElementById('editAccountUsername');
    const passwordEl = document.getElementById('editAccountPassword');
    if (section) section.style.display = 'none';
    if (idEl) idEl.value = '';
    if (userEl) userEl.value = '';
    if (passwordEl) passwordEl.value = '';
    document.querySelectorAll('.edit-permission-checkbox').forEach((cb) => {
        cb.checked = false;
        cb.disabled = false;
    });
}

function saveEditedAccount() {
    if (!ensurePermission('CreateAccount')) return;

    const idEl = document.getElementById('editAccountId');
    const userEl = document.getElementById('editAccountUsername');
    const passwordEl = document.getElementById('editAccountPassword');
    const roleEl = document.getElementById('editAccountRole');
    if (!idEl || !userEl || !passwordEl || !roleEl) return;

    const accountId = parseInt(idEl.value, 10);
    const newUsername = userEl.value.trim();
    const newPassword = passwordEl.value;
    const newRole = roleEl.value;
    const selectedPermissions = Array.from(document.querySelectorAll('.edit-permission-checkbox:checked')).map(
        (cb) => cb.value,
    );

    if (!newUsername) {
        alert('Username is required.');
        return;
    }
    if (newPassword && newPassword.length < 6) {
        alert('New password must be at least 6 characters.');
        return;
    }

    const accounts = getAccounts();
    const index = accounts.findIndex((acc) => acc.id === accountId);
    if (index === -1) {
        alert('Account not found.');
        return;
    }

    const targetAccount = accounts[index];
    const isSuperOwner = (targetAccount.permissions || []).includes('*');
    const usernameTaken = accounts.some(
        (acc) => acc.id !== accountId && acc.username.toLowerCase() === newUsername.toLowerCase(),
    );
    if (usernameTaken) {
        alert('Username already exists.');
        return;
    }

    targetAccount.username = newUsername;
    targetAccount.role = newRole;
    if (newPassword) targetAccount.password = newPassword;
    if (!isSuperOwner) {
        targetAccount.permissions = selectedPermissions.length > 0 ? selectedPermissions : ['dashboard'];
    }

    saveAccounts(accounts);

    if (currentAdminUser && currentAdminUser.id === targetAccount.id) {
        currentAdminUser = targetAccount;
        localStorage.setItem(CURRENT_ADMIN_USER_KEY, JSON.stringify(currentAdminUser));
    }

    if ((targetAccount.permissions || []).includes('*')) {
        localStorage.setItem(
            ADMIN_CREDENTIALS_KEY,
            JSON.stringify({
                username: targetAccount.username,
                password: targetAccount.password,
            }),
        );
    }

    loadAccounts();
    applyPermissionVisibility();
    cancelEditAccount();
    alert('Account updated successfully.');
}

function createAdminAccount() {
    if (!ensurePermission('CreateAccount')) return;

    const usernameEl = document.getElementById('newAccountUsername');
    const passwordEl = document.getElementById('newAccountPassword');
    const roleEl = document.getElementById('newAccountRole');
    if (!usernameEl || !passwordEl || !roleEl) return;

    const username = usernameEl.value.trim();
    const password = passwordEl.value;
    const role = roleEl.value;
    const permissions = Array.from(document.querySelectorAll('.permission-checkbox:checked')).map((cb) => cb.value);

    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    const accounts = getAccounts();
    if (accounts.some((acc) => acc.username.toLowerCase() === username.toLowerCase())) {
        alert('Username already exists.');
        return;
    }

    accounts.push({
        id: Date.now(),
        username,
        password,
        role,
        permissions: permissions.length > 0 ? permissions : ['dashboard'],
        createdAt: new Date().toISOString(),
    });
    saveAccounts(accounts);
    loadAccounts();

    usernameEl.value = '';
    passwordEl.value = '';
    document.querySelectorAll('.permission-checkbox').forEach((cb) => {
        cb.checked = cb.value === 'dashboard';
    });
    alert('Account created successfully.');
}

function deleteAdminAccount(accountId) {
    if (!ensurePermission('CreateAccount')) return;
    if (!confirm('Delete this account?')) return;

    const target = getAccounts().find((acc) => acc.id === accountId);
    if (target?.permissions?.includes('*')) {
        alert('Owner account cannot be deleted.');
        return;
    }
    if (currentAdminUser && currentAdminUser.id === accountId) {
        alert('You cannot delete the currently logged in account.');
        return;
    }

    const accounts = getAccounts().filter((acc) => acc.id !== accountId);
    saveAccounts(accounts);
    loadAccounts();
}

function addItem(type) {
    if (!ensurePermission(type)) return;
    currentEditingItem = null;
    currentEditType = type;
    currentEditId = null;

    const typeLabels = {
        menu: 'Product',
        specials: 'Special',
        categories: 'Category',
        payment: 'Payment',
    };
    document.getElementById('modalTitle').textContent = `Add ${typeLabels[type] || 'Item'}`;

    document.getElementById('menuFormFields').style.display = type === 'menu' ? 'block' : 'none';
    document.getElementById('specialsFormFields').style.display = type === 'specials' ? 'block' : 'none';
    document.getElementById('categoriesFormFields').style.display = type === 'categories' ? 'block' : 'none';
    document.getElementById('paymentFormFields').style.display = type === 'payment' ? 'block' : 'none';

    document.getElementById('itemForm').reset();
    clearImagePreview('itemImage');
    clearImagePreview('specialImage');
    populateSubCategoryDropdown();
    updateCategorySelectIcons();
    document.getElementById('modal').classList.add('show');
}

function editItem(type, id) {
    if (!ensurePermission(type)) return;
    let data, item;
    let key;

    if (type === 'menu') {
        key = DB_KEYS.PRODUCTS;
        data = getData(key);
        item = data.find((p) => p.id === id);
    } else if (type === 'specials') {
        key = DB_KEYS.SPECIALS;
        data = getData(key);
        item = data.find((s) => s.id === id);
    } else if (type === 'categories') {
        key = DB_KEYS.SUBCATEGORIES;
        data = getData(key);
        item = data.find((c) => c.id === id);
    } else if (type === 'payment') {
        key = DB_KEYS.PAYMENT;
        data = getData(key);
        item = data.find((p) => p.id === id);
    }

    if (!item) return;

    currentEditingItem = item;
    currentEditType = type;
    currentEditId = id;

    const typeLabels = {
        menu: 'Product',
        specials: 'Special',
        categories: 'Category',
        payment: 'Payment',
    };
    document.getElementById('modalTitle').textContent = `Edit ${typeLabels[type] || 'Item'}`;

    document.getElementById('menuFormFields').style.display = type === 'menu' ? 'block' : 'none';
    document.getElementById('specialsFormFields').style.display = type === 'specials' ? 'block' : 'none';
    document.getElementById('categoriesFormFields').style.display = type === 'categories' ? 'block' : 'none';
    document.getElementById('paymentFormFields').style.display = type === 'payment' ? 'block' : 'none';

    if (type === 'menu') {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemNameAm').value = item.name_am || '';
        document.getElementById('itemDescription').value = item.description || '';
        document.getElementById('itemDescriptionAm').value = item.description_am || '';
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemImage').value = item.image;
        if (item.image) {
            const preview = document.getElementById('itemImagePreview');
            if (preview) {
                preview.innerHTML =
                    '<img src="' + item.image + '" alt="Preview" onclick="clearImagePreview(\'itemImage\')">';
                preview.title = 'Click to remove';
                preview.classList.add('has-image');
            }
        }
        document.getElementById('itemMainCategory').value = item.mainCategory;
        populateSubCategoryDropdown();
        document.getElementById('itemSubCategory').value = item.subCategory || '';
    } else if (type === 'specials') {
        document.getElementById('specialName').value = item.name;
        document.getElementById('specialNameAm').value = item.name_am || '';
        document.getElementById('specialDescription').value = item.description || '';
        document.getElementById('specialDescriptionAm').value = item.description_am || '';
        document.getElementById('specialPrice').value = item.price;
        document.getElementById('specialImage').value = item.image;
        if (item.image) {
            const preview = document.getElementById('specialImagePreview');
            if (preview) {
                preview.innerHTML =
                    '<img src="' + item.image + '" alt="Preview" onclick="clearImagePreview(\'specialImage\')">';
                preview.title = 'Click to remove';
                preview.classList.add('has-image');
            }
        }
        document.getElementById('specialMainCategory').value = item.mainCategory;
    } else if (type === 'categories') {
        document.getElementById('categoryName').value = item.name;
        document.getElementById('categoryNameAm').value = item.name_am || '';
        document.getElementById('categoryMainCategory').value = item.mainCategory;
    } else if (type === 'payment') {
        document.getElementById('paymentMethod').value = item.method;
        document.getElementById('paymentType').value = item.type;
        document.getElementById('paymentHolder').value = item.holder;
        document.getElementById('paymentAccount').value = item.account;
    }

    updateCategorySelectIcons();
    document.getElementById('modal').classList.add('show');
}

function saveItem() {
    if (!ensurePermission(currentEditType)) return;

    if (currentEditType === 'menu') {
        const name = document.getElementById('itemName').value.trim();
        const price = document.getElementById('itemPrice').value;
        const mainCat = document.getElementById('itemMainCategory').value;

        if (!name) {
            alert('Product name is required.');
            return;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            alert('Please enter a valid price.');
            return;
        }
        if (!mainCat) {
            alert('Please select a main category.');
            return;
        }
    } else if (currentEditType === 'specials') {
        const name = document.getElementById('specialName').value.trim();
        const price = document.getElementById('specialPrice').value;
        const mainCat = document.getElementById('specialMainCategory').value;

        if (!name) {
            alert('Product name is required.');
            return;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            alert('Please enter a valid price.');
            return;
        }
        if (!mainCat) {
            alert('Please select a main category.');
            return;
        }
    } else if (currentEditType === 'categories') {
        const name = document.getElementById('categoryName').value.trim();
        const mainCat = document.getElementById('categoryMainCategory').value;
        const reservedNames = ['Drink', 'Food', 'Extra'];

        if (!name) {
            alert('Category name is required.');
            return;
        }
        if (reservedNames.includes(name)) {
            alert('"' + name + '" is a main category and cannot be used as a subcategory.');
            return;
        }
        if (!mainCat) {
            alert('Please select a main category.');
            return;
        }
    } else if (currentEditType === 'payment') {
        const method = document.getElementById('paymentMethod').value.trim();
        const holder = document.getElementById('paymentHolder').value.trim();
        const account = document.getElementById('paymentAccount').value.trim();

        if (!method) {
            alert('Payment method is required.');
            return;
        }
        if (!holder) {
            alert('Account holder is required.');
            return;
        }
        if (!account) {
            alert('Account number is required.');
            return;
        }
    }

    let key, data, newItem;
    const nowIso = new Date().toISOString();

    if (currentEditType === 'menu') {
        key = DB_KEYS.PRODUCTS;
        data = getData(key);

        if (currentEditingItem) {
            const index = data.findIndex((p) => p.id === currentEditId);
            const subCat = document.getElementById('itemSubCategory').value;
            data[index] = {
                ...data[index],
                name: document.getElementById('itemName').value,
                name_am: document.getElementById('itemNameAm').value,
                description: document.getElementById('itemDescription').value,
                description_am: document.getElementById('itemDescriptionAm').value,
                price: parseFloat(document.getElementById('itemPrice').value),
                image: document.getElementById('itemImage').value || 'https://via.placeholder.com/170',
                mainCategory: document.getElementById('itemMainCategory').value,
                subCategory: subCat,
                category: subCat || document.getElementById('itemMainCategory').value,
                available: data[index].available !== false,
                sortOrder: parseInt(document.getElementById('itemSortOrder').value) || 0,
                updatedAt: nowIso,
            };
        } else {
            newItem = {
                id: generateId(key),
                name: document.getElementById('itemName').value,
                name_am: document.getElementById('itemNameAm').value,
                description: document.getElementById('itemDescription').value,
                description_am: document.getElementById('itemDescriptionAm').value,
                price: parseFloat(document.getElementById('itemPrice').value),
                image: document.getElementById('itemImage').value || 'https://via.placeholder.com/170',
                mainCategory: document.getElementById('itemMainCategory').value,
                subCategory: document.getElementById('itemSubCategory').value,
                category:
                    document.getElementById('itemSubCategory').value ||
                    document.getElementById('itemMainCategory').value,
                available: true,
                sortOrder: parseInt(document.getElementById('itemSortOrder').value) || 0,
                createdAt: nowIso,
                updatedAt: nowIso,
            };
            data.push(newItem);
        }
    } else if (currentEditType === 'specials') {
        key = DB_KEYS.SPECIALS;
        data = getData(key);

        if (currentEditingItem) {
            const index = data.findIndex((s) => s.id === currentEditId);
            data[index] = {
                ...data[index],
                name: document.getElementById('specialName').value,
                name_am: document.getElementById('specialNameAm').value,
                description: document.getElementById('specialDescription').value,
                description_am: document.getElementById('specialDescriptionAm').value,
                price: parseFloat(document.getElementById('specialPrice').value),
                image: document.getElementById('specialImage').value || 'https://via.placeholder.com/400',
                mainCategory: document.getElementById('specialMainCategory').value,
                category: 'Special',
                available: data[index].available !== false,
                updatedAt: nowIso,
            };
        } else {
            newItem = {
                id: generateId(key),
                name: document.getElementById('specialName').value,
                name_am: document.getElementById('specialNameAm').value,
                description: document.getElementById('specialDescription').value,
                description_am: document.getElementById('specialDescriptionAm').value,
                price: parseFloat(document.getElementById('specialPrice').value),
                image: document.getElementById('specialImage').value || 'https://via.placeholder.com/400',
                mainCategory: document.getElementById('specialMainCategory').value,
                category: 'Special',
                available: true,
                createdAt: nowIso,
                updatedAt: nowIso,
            };
            data.push(newItem);
        }
    } else if (currentEditType === 'categories') {
        key = DB_KEYS.SUBCATEGORIES;
        data = getData(key);

        const oldName = currentEditingItem ? currentEditingItem.name : null;
        const newName = document.getElementById('categoryName').value;
        const newMainCat = document.getElementById('categoryMainCategory').value;
        const sortOrder = parseInt(document.getElementById('categorySortOrder').value) || 0;

        if (currentEditingItem) {
            const index = data.findIndex((c) => c.id === currentEditId);
            data[index] = {
                ...data[index],
                name: newName,
                name_am: document.getElementById('categoryNameAm').value,
                mainCategory: newMainCat,
                sortOrder: sortOrder,
                updatedAt: nowIso,
            };

            if (oldName && oldName !== newName) {
                updateProductsSubCategory(oldName, newName);
            }
        } else {
            newItem = {
                id: generateId(key),
                name: document.getElementById('categoryName').value,
                name_am: document.getElementById('categoryNameAm').value,
                mainCategory: document.getElementById('categoryMainCategory').value,
                sortOrder: sortOrder,
                createdAt: nowIso,
                updatedAt: nowIso,
            };
            data.push(newItem);
        }
    } else if (currentEditType === 'payment') {
        key = DB_KEYS.PAYMENT;
        data = getData(key);

        if (currentEditingItem) {
            const index = data.findIndex((p) => p.id === currentEditId);
            data[index] = {
                ...data[index],
                method: document.getElementById('paymentMethod').value,
                type: document.getElementById('paymentType').value,
                holder: document.getElementById('paymentHolder').value,
                account: document.getElementById('paymentAccount').value,
                updatedAt: nowIso,
            };
        } else {
            newItem = {
                id: generateId(key),
                method: document.getElementById('paymentMethod').value,
                type: document.getElementById('paymentType').value,
                holder: document.getElementById('paymentHolder').value,
                account: document.getElementById('paymentAccount').value,
                active: true,
                createdAt: nowIso,
                updatedAt: nowIso,
            };
            data.push(newItem);
        }
    }

    saveData(key, data);
    closeModal();

    const typeLabels = { menu: 'Product', specials: 'Special product', categories: 'Category', payment: 'Payment method' };
    alert((currentEditingItem ? 'Updated ' : 'Added ') + (typeLabels[currentEditType] || 'Item') + ' successfully!');

    if (key === DB_KEYS.PRODUCTS) {
        refreshMenuAfterDataChange();
    } else {
        loadMenuItems();
    }
    loadSpecials();
    loadCategories();
    loadPayment();
    loadDashboard();
    populateSubCategoryDropdown();
}

function deleteItem(type, id) {
    if (!ensurePermission(type)) return;
    if (!confirm('Are you sure you want to delete this item?')) return;

    let key;
    if (type === 'menu') key = DB_KEYS.PRODUCTS;
    else if (type === 'specials') key = DB_KEYS.SPECIALS;
    else if (type === 'categories') key = DB_KEYS.SUBCATEGORIES;
    else if (type === 'payment') key = DB_KEYS.PAYMENT;

    let data = getData(key);

    if (type === 'categories') {
        const categoryToDelete = data.find((c) => c.id === id);
        if (categoryToDelete) {
            clearProductsSubCategory(categoryToDelete.name);
        }
    }

    data = data.filter((item) => item.id !== id);
    saveData(key, data);

    if (type === 'menu') {
        refreshMenuAfterDataChange();
    } else {
        loadMenuItems();
    }
    loadSpecials();
    loadCategories();
    loadPayment();
    loadDashboard();
    populateSubCategoryDropdown();
}

function clearProductsSubCategory(categoryName) {
    let products = getData(DB_KEYS.PRODUCTS);
    let updated = false;

    products = products.map((p) => {
        if (p.subCategory === categoryName) {
            updated = true;
            return {
                ...p,
                subCategory: '',
                category: p.mainCategory || '',
            };
        }
        return p;
    });

    if (updated) {
        saveData(DB_KEYS.PRODUCTS, products);
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
    currentEditingItem = null;
    currentEditType = null;
    currentEditId = null;
    clearImagePreview('itemImage');
    clearImagePreview('specialImage');
}

function saveSettings() {
    if (!ensurePermission('settings')) return;
    const settings = {
        menuUrl: document.getElementById('menuUrl').value,
    };
    saveData(DB_KEYS.SETTINGS, settings);
    alert('Settings saved!');
    loadDashboard();
}

function saveRestaurantInfo() {
    if (!ensurePermission('settings')) return;
    const restaurant = {
        name: document.getElementById('restaurantName').value,
        tagline: document.getElementById('restaurantTagline').value,
        address: document.getElementById('restaurantAddress').value,
        phone: document.getElementById('restaurantPhone').value,
        hours: document.getElementById('restaurantHours').value,
    };
    saveData(DB_KEYS.RESTAURANT, restaurant);
    alert('Restaurant info saved!');
}

function exportData() {
    if (!ensurePermission('settings')) return;
    const data = {
        products: getData(DB_KEYS.PRODUCTS),
        specials: getData(DB_KEYS.SPECIALS),
        payment: getData(DB_KEYS.PAYMENT),
        reviews: getData(DB_KEYS.REVIEWS),
        settings: getData(DB_KEYS.SETTINGS),
        restaurant: getData(DB_KEYS.RESTAURANT),
        subCategories: getData(DB_KEYS.SUBCATEGORIES),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'begotas-menu-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function saveProductsToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('Excel library is not loaded. Please refresh the page.');
        return;
    }
    const products = getData(DB_KEYS.PRODUCTS);
    if (!products.length) {
        alert('No products to save.');
        return;
    }
    const exportData = products.map((p) => ({
        Name: p.name,
        NameAm: p.name_am || '',
        Price: p.price,
        Category: p.mainCategory,
        SubCategory: p.subCategory || '',
        Description: p.description || '',
        DescriptionAm: p.description_am || '',
        Image: p.image || '',
        'Sort Order': p.sortOrder || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'begotas-products.xlsx');
}

function saveCategoriesToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('Excel library is not loaded. Please refresh the page.');
        return;
    }
    const categories = getData(DB_KEYS.SUBCATEGORIES);
    if (!categories.length) {
        alert('No subcategories to save.');
        return;
    }
    const exportData = categories.map((c) => ({
        Name: c.name,
        NameAm: c.name_am || '',
        MainCategory: c.mainCategory,
        Icon: c.icon || '',
        'Sort Order': c.sortOrder || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SubCategories');
    XLSX.writeFile(wb, 'begotas-subcategories.xlsx');
}

function saveSpecialsToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('Excel library is not loaded. Please refresh the page.');
        return;
    }
    const specials = getData(DB_KEYS.SPECIALS);
    if (!specials.length) {
        alert('No special products to save.');
        return;
    }
    const exportData = specials.map((s) => ({
        Name: s.name,
        NameAm: s.name_am || '',
        Price: s.price,
        Category: s.mainCategory,
        SubCategory: s.subCategory || '',
        Description: s.description || '',
        Image: s.image || '',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Specials');
    XLSX.writeFile(wb, 'begotas-specials.xlsx');
}

function importData(event) {
    if (!ensurePermission('settings')) return;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.products) saveData(DB_KEYS.PRODUCTS, data.products);
            if (data.specials) saveData(DB_KEYS.SPECIALS, data.specials);
            if (data.payment) saveData(DB_KEYS.PAYMENT, data.payment);
            if (data.reviews) saveData(DB_KEYS.REVIEWS, data.reviews);
            if (data.settings) saveData(DB_KEYS.SETTINGS, data.settings);
            if (data.restaurant) saveData(DB_KEYS.RESTAURANT, data.restaurant);
            if (data.subCategories) saveData(DB_KEYS.SUBCATEGORIES, data.subCategories);

            alert('Data imported successfully!');
            location.reload();
        } catch (err) {
            alert('Error importing data: ' + err.message);
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (!ensurePermission('settings')) return;
    if (!confirm('Are you sure you want to reset all data? This cannot be undone!')) return;

    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(defaultMenuData.products));
    localStorage.setItem(DB_KEYS.SPECIALS, JSON.stringify(defaultMenuData.specials));
    localStorage.setItem(DB_KEYS.PAYMENT, JSON.stringify(defaultMenuData.payment));
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.SUBCATEGORIES, JSON.stringify(defaultSubCategories));

    alert('Data reset to defaults!');
    location.reload();
}

function filterMenu() {
    const category = document.getElementById('menuCategoryFilter')?.value;
    const subCategory = document.getElementById('menuSubCategoryFilter')?.value;
    const search = document.getElementById('menuSearch')?.value.toLowerCase() || '';
    const minPrice = parseFloat(document.getElementById('menuMinPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('menuMaxPrice')?.value) || Infinity;
    let products = getData(DB_KEYS.PRODUCTS);

    if (category) {
        products = products.filter((p) => p.mainCategory === category);
    }
    if (subCategory) {
        products = products.filter((p) => p.subCategory === subCategory);
    }
    if (search) {
        products = products.filter((p) => p.name.toLowerCase().includes(search));
    }
    if (minPrice > 0) {
        products = products.filter((p) => p.price >= minPrice);
    }
    if (maxPrice < Infinity) {
        products = products.filter((p) => p.price <= maxPrice);
    }

    products = products.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    filteredMenuItems = products;
    currentMenuPage = 1;
    displayMenuPage();
    populateMenuSubCategoryFilter();
    updateCategorySelectIcons();
}

function filterCategories() {
    const mainCat = document.getElementById('categoryMainFilter')?.value;
    const search = document.getElementById('categorySearch')?.value.toLowerCase() || '';
    let categories = getData(DB_KEYS.SUBCATEGORIES).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    if (mainCat) {
        categories = categories.filter((c) => c.mainCategory === mainCat);
    }
    if (search) {
        categories = categories.filter(
            (c) => c.name.toLowerCase().includes(search) || (c.name_am && c.name_am.includes(search)),
        );
    }

    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    tbody.innerHTML = categories
        .map(
            (cat, index) => `
        <tr>
            <td>${cat.name}</td>
            <td>${cat.name_am || '-'}</td>
            <td>${cat.mainCategory}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button class="sort-btn" onclick="moveCategory(${cat.id}, 'up')" ${index === 0 ? 'disabled' : ''} style="padding: 2px 6px; min-width: 25px; font-size: 12px;" title="Move Up">↑</button>
                    <button class="sort-btn" onclick="moveCategory(${cat.id}, 'down')" ${index === categories.length - 1 ? 'disabled' : ''} style="padding: 2px 6px; min-width: 25px; font-size: 12px;" title="Move Down">↓</button>
                    <span style="margin-left: 5px;">${cat.sortOrder || 0}</span>
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-edit" onclick="editItem('categories', ${cat.id})">Edit</button>
                    <button class="action-delete" onclick="deleteItem('categories', ${cat.id})">Delete</button>
                </div>
            </td>
        </tr>
    `,
        )
        .join('');
    updateCategorySelectIcons();
}

function updateProductsSubCategory(oldName, newName) {
    let products = getData(DB_KEYS.PRODUCTS);
    let updated = false;

    products = products.map((p) => {
        if (p.subCategory === oldName) {
            updated = true;
            return {
                ...p,
                subCategory: newName,
                category: p.category === oldName ? newName : p.category,
            };
        }
        return p;
    });

    if (updated) {
        saveData(DB_KEYS.PRODUCTS, products);
    }
}

function handleImageUpload(input, targetId) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById(targetId).value = e.target.result;
        const preview = document.getElementById(targetId + 'Preview');
        if (preview) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
            preview.classList.add('has-image');
        }
    };
    reader.readAsDataURL(file);
}

function clearImagePreview(targetId) {
    document.getElementById(targetId).value = '';
    const preview = document.getElementById(targetId + 'Preview');
    if (preview) {
        preview.innerHTML = '';
        preview.classList.remove('has-image');
    }
}

function normalizeDateInput(dateValue, isEnd) {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;
    if (isEnd) date.setSeconds(59, 999);
    else date.setSeconds(0, 0);
    return date;
}

function generateMenuReport() {
    if (!ensurePermission('Reports')) return;

    const startDate = normalizeDateInput(document.getElementById('reportStartDate')?.value, false);
    const endDate = normalizeDateInput(document.getElementById('reportEndDate')?.value, true);
    if (startDate && endDate && startDate > endDate) {
        alert('Begin date cannot be later than end date.');
        return;
    }

    const products = getData(DB_KEYS.PRODUCTS);
    currentReportData = products
        .filter((item) => {
            const rawDate = item.updatedAt || item.createdAt;
            if (!rawDate) return true;
            const itemDate = new Date(rawDate);
            if (Number.isNaN(itemDate.getTime())) return true;
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            return true;
        })
        .map((item) => ({
            name: item.name,
            category: item.mainCategory || '',
            subCategory: item.subCategory || '',
            price: item.price,
            date: item.updatedAt || item.createdAt || '-',
        }));

    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;
    tbody.innerHTML = currentReportData
        .map(
            (row) => `
        <tr>
            <td>${row.name}</td>
            <td>${row.category}</td>
            <td>${row.subCategory || '-'}</td>
            <td>${row.price}</td>
            <td>${row.date === '-' ? '-' : new Date(row.date).toLocaleString()}</td>
        </tr>
    `,
        )
        .join('');
    if (currentReportData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No data found in selected interval.</td></tr>';
    }
}

function exportMenuReport(type) {
    if (!ensurePermission('Reports')) return;
    if (!currentReportData.length) {
        alert('Please generate report first.');
        return;
    }

    if (type === 'json') {
        const blob = new Blob([JSON.stringify(currentReportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'menu-report.json';
        a.click();
        URL.revokeObjectURL(url);
        return;
    }

    const headers = ['Name', 'Category', 'SubCategory', 'Price', 'Date'];
    const rows = currentReportData.map((row) => [row.name, row.category, row.subCategory, row.price, row.date]);
    const csv = [headers, ...rows]
        .map((cols) => cols.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-report.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function importMenuFromExcel(event) {
    if (!ensurePermission('menu')) return;

    const file = event.target.files[0];
    if (!file) return;
    if (typeof XLSX === 'undefined') {
        alert('Excel library is not loaded. Please refresh the page.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            if (!rows.length) {
                alert('No data found in the Excel file.');
                event.target.value = '';
                return;
            }

            const products = getData(DB_KEYS.PRODUCTS);
            const mainCategories = getData(DB_KEYS.MAIN_CATEGORIES);
            const subCategories = getData(DB_KEYS.SUBCATEGORIES);
            const mainCatNames = mainCategories.map((c) => c.name);
            const subCatNames = subCategories.map((c) => c.name);

            const nowIso = new Date().toISOString();
            let addedCount = 0;
            let skippedCount = 0;
            const skippedItems = [];

            rows.forEach((row) => {
                const name = row.Name || row.name;
                if (!name) {
                    skippedCount++;
                    return;
                }

                const price = parseFloat(row.Price ?? row.price ?? 0);
                if (Number.isNaN(price) || price < 0) {
                    skippedCount++;
                    skippedItems.push(name + ' (invalid price)');
                    return;
                }

                let mainCategory = row.Category || row.category || 'Drink';
                if (!mainCatNames.includes(mainCategory)) {
                    skippedCount++;
                    skippedItems.push(name + ' (invalid category: ' + mainCategory + ')');
                    return;
                }

                const subCategory = row.Subcategory || row.SubCategory || row.subCategory || '';
                const reservedNames = ['Drink', 'Food', 'Extra'];
                if (subCategory && (!subCatNames.includes(subCategory) || reservedNames.includes(subCategory))) {
                    skippedCount++;
                    skippedItems.push(name + ' (invalid subcategory: ' + subCategory + ')');
                    return;
                }

                products.push({
                    id: generateId(DB_KEYS.PRODUCTS),
                    name: String(name),
                    name_am: String(row.NameAm || row.name_am || ''),
                    description: String(row.Description || row.description || ''),
                    description_am: String(row.DescriptionAm || row.description_am || ''),
                    price: price,
                    image: String(row.Image || row.image || 'https://via.placeholder.com/170'),
                    mainCategory: String(mainCategory),
                    subCategory: String(subCategory),
                    category: String(subCategory || mainCategory),
                    sortOrder: products.length + 1,
                    createdAt: nowIso,
                    updatedAt: nowIso,
                });
                addedCount++;
            });

            saveData(DB_KEYS.PRODUCTS, products);
            loadMenuItems();
            loadDashboard();
            populateSubCategoryDropdown();

            let message = `Successfully imported ${addedCount} product(s).`;
            if (skippedCount > 0) {
                message += `\n\nSkipped ${skippedCount} item(s):\n` + skippedItems.slice(0, 10).join('\n');
                if (skippedItems.length > 10) {
                    message += `\n...and ${skippedItems.length - 10} more.`;
                }
            }
            alert(message);
        } catch (error) {
            alert('Failed to import Excel: ' + error.message);
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsBinaryString(file);
}

window.showPage = showPage;
window.addItem = addItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.closeModal = closeModal;
window.saveItem = saveItem;
window.saveSettings = saveSettings;
window.saveRestaurantInfo = saveRestaurantInfo;
window.exportData = exportData;
window.importData = importData;
window.resetData = resetData;
window.filterMenu = filterMenu;
window.togglePaymentStatus = togglePaymentStatus;
window.filterCategories = filterCategories;
window.onMainCategoryChange = onMainCategoryChange;
window.handleImageUpload = handleImageUpload;
window.clearImagePreview = clearImagePreview;
window.updateProductsSubCategory = updateProductsSubCategory;
window.logoutAdmin = logoutAdmin;
window.changeAdminPassword = changeAdminPassword;
window.generateMenuReport = generateMenuReport;
window.exportMenuReport = exportMenuReport;
window.importMenuFromExcel = importMenuFromExcel;
window.createAdminAccount = createAdminAccount;
window.deleteAdminAccount = deleteAdminAccount;
window.startEditAccount = startEditAccount;
window.saveEditedAccount = saveEditedAccount;
window.cancelEditAccount = cancelEditAccount;
window.changeMenuPage = changeMenuPage;
window.toggleAddCategoryDropdown = toggleAddCategoryDropdown;
window.importCategoriesFromExcel = importCategoriesFromExcel;

function toggleAddCategoryDropdown() {
    const dropdown = document.getElementById('addCategoryDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('addCategoryDropdown');
    const button = event.target.closest('.dropdown > button');
    if (!button && dropdown && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

function importCategoriesFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);

            if (rows.length === 0) {
                alert('No data found in the Excel file.');
                event.target.value = '';
                return;
            }

            const mainCategories = getData(DB_KEYS.MAIN_CATEGORIES);
            const mainCatNames = mainCategories.map((c) => c.name);

            const existingCategories = getData(DB_KEYS.SUBCATEGORIES);
            const existingNames = new Set(existingCategories.map((c) => c.name.toLowerCase()));
            const reservedNames = new Set(['drink', 'food', 'extra']);
            reservedNames.forEach((n) => existingNames.add(n));

            const nowIso = new Date().toISOString();
            let addedCount = 0;
            let skippedCount = 0;

            rows.forEach((row) => {
                const name = row.Name || row.name || row['Sub Category'] || row['Subcategory'];
                if (!name) {
                    skippedCount++;
                    return;
                }

                const normalizedName = String(name).toLowerCase();
                if (existingNames.has(normalizedName)) {
                    skippedCount++;
                    return;
                }

                if (reservedNames.has(normalizedName)) {
                    skippedCount++;
                    return;
                }

                const mainCategory = row.MainCategory || row['Main Category'] || row.mainCategory || 'Drink';
                if (!mainCatNames.includes(mainCategory)) {
                    skippedCount++;
                    return;
                }

                const sortOrder = existingCategories.length + addedCount + 1;

                existingCategories.push({
                    id: generateId(DB_KEYS.SUBCATEGORIES),
                    name: String(name),
                    name_am: String(row.NameAm || row.name_am || ''),
                    mainCategory: String(mainCategory),
                    icon: String(row.Icon || row.icon || 'other'),
                    sortOrder: Number.isInteger(row['Sort Order']) ? row['Sort Order'] : sortOrder,
                    createdAt: nowIso,
                    updatedAt: nowIso,
                });

                existingNames.add(String(name).toLowerCase());
                addedCount++;
            });

            saveData(DB_KEYS.SUBCATEGORIES, existingCategories);
            loadCategories();
            filterCategories();

            let message = `Successfully imported ${addedCount} categorie(s).`;
            if (skippedCount > 0) {
                message += ` Skipped ${skippedCount} duplicate or invalid entrie(s).`;
            }
            alert(message);
        } catch (error) {
            alert('Failed to import Excel: ' + error.message);
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsBinaryString(file);
}
