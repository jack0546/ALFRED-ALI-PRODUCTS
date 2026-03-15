// ALFRED PRODUCTS - Main Script
// This script handles product generation, category filtering, and local image mapping.

const categoryData = {
    apparel: {
        name: "Apparel & Cloth",
        keywords: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Dress", "Skirt", "Shorts", "Sweater"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
        ],
        moqSuffix: "Pieces"
    },
    shoes: {
        name: "Shoes & Footwear",
        keywords: ["Sneakers", "Running Shoes", "Leather Boots", "Sandals", "Loafers", "Heels"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
        ],
        moqSuffix: "Pairs"
    },
    electronics: {
        name: "Electronic Gadgets",
        keywords: ["Smartphone", "Laptop", "Smart Watch", "Bluetooth Earbuds", "Drone", "VR Headset", "Gaming Console"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2"
        ],
        moqSuffix: "Units"
    },
    bags: {
        name: "Bags & Suitcases",
        keywords: ["Leather Backpack", "Luxury Handbag", "Travel Suitcase", "Tote Bag", "Messenger Bag"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3"
        ],
        moqSuffix: "Pieces"
    },
    beauty: {
        name: "Hairs, Wigs & Perfumes",
        keywords: ["Perfume", "Human Hair Wig", "Lace Front Wig", "Hair Extensions", "Facial Serum", "Lipstick Set"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601",
            "https://images.unsplash.com/photo-1560869713-7d0a29430803",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
        ],
        moqSuffix: "Units"
    },
    home: {
        name: "Mattress & Pillows",
        keywords: ["Orthopedic Mattress", "Memory Foam Pillow", "Duvet Cover", "Bedding Set", "Luxury Sofa"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
            "https://images.unsplash.com/photo-1505673539012-ee21ffb70029",
            "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1"
        ],
        moqSuffix: "Sets"
    },
    mobile: {
        name: "Mobile Accessories",
        keywords: ["Phone Case", "Screen Protector", "USB-C Cable", "Fast Charger", "Phone Stand", "Power Bank"],
        fallbackImages: [
            "https://images.unsplash.com/photo-1551816230-ef5deaed4a26",
            "https://images.unsplash.com/photo-1601784551446-20c9e07cdbea",
            "https://images.unsplash.com/photo-1504274066654-52ffaf15438d"
        ],
        moqSuffix: "Pieces"
    }
};

// Generate 400 Products
const catalog = [];
const catKeys = Object.keys(categoryData);

for (let i = 1; i <= 400; i++) {
    const key = catKeys[i % catKeys.length];
    const cat = categoryData[key];
    const keyword = cat.keywords[i % cat.keywords.length];
    
    // IMAGE LOGIC: 
    // 1. Try images/products/{category}_{i}.jpg
    // 2. Fallback to Unsplash URL
    const localImg = `images/products/${key}_${i}.jpg`;
    const fallbackImg = `${cat.fallbackImages[i % cat.fallbackImages.length]}?auto=format&fit=crop&q=80&w=400`;

    catalog.push({
        id: i,
        category: key,
        title: `Wholesale ${keyword} - High Quality Premium ${i}`,
        price: `GHS ${(Math.random() * 50 + 5).toFixed(2)} - GHS ${(Math.random() * 100 + 60).toFixed(2)}`,
        moq: `${Math.floor(Math.random() * 200 + 10)} ${cat.moqSuffix}`,
        localImage: localImg,
        fallbackImage: fallbackImg
    });
}

// Function to check if an image exists locally (simulated for front-end)
// In a real static app, we just set the src and let it fail to fallback using onerror
function getImgHTML(product) {
    return `<img src="${product.localImage}" onerror="this.src='${product.fallbackImage}'; this.onerror=null;" alt="${product.title}">`;
}

function renderProducts(filterCategory = null) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';
    let filtered = filterCategory 
        ? catalog.filter(p => p.category === filterCategory) 
        : catalog.slice(0, 48); // Show 48 on homepage

    filtered.forEach(product => {
        const card = document.createElement('a');
        card.href = `product.html?id=${product.id}`;
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${getImgHTML(product)}
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">${product.price}</div>
                <div class="product-moq">Min. Order: ${product.moq}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initialize based on Page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    let activeCat = null;
    
    // Category Detection
    if (path.includes('apparel.html')) activeCat = 'apparel';
    else if (path.includes('shoes.html')) activeCat = 'shoes';
    else if (path.includes('electronics.html')) activeCat = 'electronics';
    else if (path.includes('bags.html')) activeCat = 'bags';
    else if (path.includes('beauty.html')) activeCat = 'beauty';
    else if (path.includes('home.html')) activeCat = 'home';
    else if (path.includes('mobile.html')) activeCat = 'mobile';
    
    renderProducts(activeCat);

    // Dynamic Product Detail Page
    if (path.includes('product.html')) {
        const params = new URLSearchParams(window.location.search);
        const prodId = parseInt(params.get('id'));
        const product = catalog.find(p => p.id === prodId) || catalog[0];

        const titleElem = document.getElementById('productTitle');
        const priceElem = document.getElementById('productPrice');
        const mainImgContainer = document.querySelector('.main-image');
        const moqElem = document.querySelector('.product-moq');

        if (titleElem) titleElem.innerText = product.title;
        if (priceElem) priceElem.innerText = product.price;
        if (moqElem) moqElem.innerText = `Min. Order: ${product.moq}`;
        if (mainImgContainer) {
            mainImgContainer.innerHTML = `<img id="mainImg" src="${product.localImage}" onerror="this.src='${product.fallbackImage}'; this.onerror=null;">`;
        }
    }
});

// Cart System Logic
function addToCart(productId) {
    const product = catalog.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.fallbackImage, // Use fallback for cart consistency
            quantity: 1
        });
    }

    localStorage.setItem('alfredCart', JSON.stringify(cart));
    updateCartBadge();
    
    // Feedback notification
    const btn = document.querySelector('#addCartBtn');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Added to Cart!';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
        }, 2000);
    }
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = count;
}

// Initial calls
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

// Paystack Payment Integration
function payWithPaystack() {
    const params = new URLSearchParams(window.location.search);
    const prodId = parseInt(params.get('id'));
    const product = catalog.find(p => p.id === prodId) || catalog[0];
    
    // Convert price string to number (simplified)
    const priceStr = product.price.split('-')[0].replace('GHS', '').trim();
    const amount = parseFloat(priceStr) * 100; // Paystack takes amount in kobo (NGN) or cents (USD)

    let handler = PaystackPop.setup({
        key: 'pk_live_6b9968065dc0bd4842c97ffa138e49127c862888',
        email: 'customer@example.com', // In a real app, get this from user profile
        amount: amount || 5000, 
        currency: "GHS",
        ref: 'ALFRED_' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
            custom_fields: [
                {
                    display_name: "Product Name",
                    variable_name: "product_name",
                    value: product.title
                }
            ]
        },
        callback: function(response){
            alert('Payment Successful! Reference: ' + response.reference);
            window.location.href = 'orders.html';
        },
        onClose: function(){
            alert('Transaction was not completed.');
        }
    });

    handler.openIframe();
}

// Tab Functionality
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    const target = document.getElementById(tabName);
    if (target) target.classList.add("active");
    if (evt) evt.currentTarget.classList.add("active");
}

// Image Gallery
function changeImage(type) {
    const mainImg = document.getElementById('mainImg');
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));

    if (type === 'hero') {
        thumbs[0].classList.add('active');
        // Keep current product image
    } else if (type === 'thumb1') {
        mainImg.src = 'thumb1.png';
        thumbs[1].classList.add('active');
    }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}

// Global Header User Sync
function updateHeaderWithUser(user) {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    if (user) {
        headerActions.innerHTML = `
            <a href="orders.html" class="action-item">
                <img src="${user.photoURL || 'https://via.placeholder.com/30'}" style="width: 24px; height: 24px; border-radius: 50%; margin-bottom: 2px;">
                <span>${user.displayName.split(' ')[0]}</span>
            </a>
            <a href="messages.html" class="action-item">
                <ion-icon name="mail-outline"></ion-icon>
                <span>Messages</span>
            </a>
            <a href="cart.html" class="action-item">
                <ion-icon name="cart-outline"></ion-icon>
                <span id="cartCount">0</span>
            </a>
        `;
        updateCartBadge();
    }
}

// PWA Install Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) installBtn.style.display = 'flex';
});

function triggerInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Initial initialization
if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
        updateHeaderWithUser(user);
    });
}

