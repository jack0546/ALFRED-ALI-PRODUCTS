// ALFRED PRODUCTS - Main Script
// This script handles product generation, category filtering, and local image mapping.

const categoryData = {
    apparel: {
        name: "Apparel & Accessories",
        keywords: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Dress", "Skirt", "Shorts", "Sweater", "Graduation Cap", "Cheongsam", "Sequins", "Trimmings", "Ice Hockey", "Rhinestones", "Men's Sets", "Muslim Skirt", "Pirate Hat", "Dance Pants", "Tactical Clothes", "Fabric Belts", "Pilot Shirt"],
        fallbackImages: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518", "https://images.unsplash.com/photo-1551028719-00167b16eac5", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"],
        moqSuffix: "Pieces"
    },
    shoes: {
        name: "Shoes & Accessories",
        keywords: ["Sneakers", "Running Shoes", "Leather Boots", "Sandals", "Loafers", "Heels", "Home Slippers", "Fur Slippers", "Moccasin Slippers", "Moccasins", "Flats", "Slides Slippers", "Clogs Shoes", "Summer Sandals", "Beach Slippers", "Indoor Slippers", "Women Slides"],
        fallbackImages: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff", "https://images.unsplash.com/photo-1560769629-975ec94e6a86", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"],
        moqSuffix: "Pairs"
    },
    electronics: {
        name: "Consumer Electronics",
        keywords: ["Smartphone", "Laptop", "Smart Watch", "Bluetooth Earbuds", "Drone", "VR Headset", "Gaming Console", "Speaker Driver", "Keyboard switches", "Tf Card", "Camera Accessories", "Smart Products", "Computer Accessories", "Software", "Ethernet Adapter", "Satellite Multiswitch", "Hd Camcorder", "Uv Filter", "Camera Filters", "Soldering Mat"],
        fallbackImages: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2"],
        moqSuffix: "Units"
    },
    bags: {
        name: "Luggage, Bags & Cases",
        keywords: ["Leather Backpack", "Luxury Handbag", "Travel Suitcase", "Tote Bag", "Messenger Bag", "Beauty Case", "College Bag", "Cosmetic Case", "Bag Accessories", "Wine Bag", "Shoulder Bag", "Backpack", "Bag Chain", "Shoulder Strap", "Lipstick Bags", "Luggage Scooter", "Lipstick Case", "Bag Handle"],
        fallbackImages: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa", "https://images.unsplash.com/photo-1584917865442-de89df76afd3", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3"],
        moqSuffix: "Pieces"
    },
    beauty: {
        name: "Beauty & Personal Care",
        keywords: ["Perfume Gift Sets", "Perfume Set", "Body Mist", "Women's Perfume", "Deodorant Spray", "Deodorant", "Men's Perfume", "Cosmetic", "Nail Equipments", "Hair Removal Machine", "Makeup Sets", "Antiperspirant", "Nail Supplies", "Feminine Hygiene Products", "Laundry Soap", "After Shave Cologne", "Hair Extension Tools", "Washing Powder", "Aftershave", "Perfume Oil", "Sea Salt", "Hair Relaxers", "Breath Fresheners", "Detergent Sheets", "Detangling Brush", "Hair Mousse"],
        fallbackImages: ["https://images.unsplash.com/photo-1541643600914-78b084683601", "https://images.unsplash.com/photo-1560869713-7d0a29430803", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"],
        moqSuffix: "Units"
    },
    home: {
        name: "Home & Garden",
        keywords: ["Orthopedic Mattress", "Memory Foam Pillow", "Duvet Cover", "Bedding Set", "Luxury Sofa", "Snow Spray", "Blackout Curtain", "Smart Blinds", "Bouquet", "Curtains", "Bottle", "Roses", "Window Canopy", "Vertical Awning", "Automatic Curtain", "Blind Motor", "Valances", "Shade Cloth"],
        fallbackImages: ["https://images.unsplash.com/photo-1616046229478-9901c5536a45", "https://images.unsplash.com/photo-1505673539012-ee21ffb70029", "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1"],
        moqSuffix: "Sets"
    },
    sports: {
        name: "Sports & Entertainment",
        keywords: ["Camping Gear", "Fishing Accessories", "Novelties", "Step Platforms", "Bows", "Diving Reel", "Shot Put", "Tennis Net", "Flying Car", "Suspension Trainers", "Amusement Park Products", "Volleyball Shoes", "Football Boots", "Hockey Skate", "Mtb Shoes", "Sports Gloves", "Sweatband", "Keeper Gloves"],
        fallbackImages: ["https://images.unsplash.com/photo-1461896756913-c82ee49b5ae2", "https://images.unsplash.com/photo-1517649763962-0c623066013b"],
        moqSuffix: "Units"
    },
    industrial: {
        name: "Industrial & Commercial Machinery",
        keywords: ["Welding Machine", "Laser Welders", "Air Dryer", "Farm Trailers", "Agriculture Products", "Grinder Machine", "Gasoline Engine", "Crystallizers", "Air Curtain", "Plastic Welders", "TIG Welders", "Arc Welders", "Welding Robot", "Spot Welders", "Juice Dispenser", "Food Cart", "Food Trailer"],
        fallbackImages: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad"],
        moqSuffix: "Units"
    },
    health: {
        name: "Health & Medical",
        keywords: ["Ecg Machine", "Insulin Syringe", "Medical Consumables", "Rehabilitation Equipment", "Veterinary Medicine", "Massage Products", "Stretcher", "Acupuncture Machine", "Scalpel Blade", "Sleeping Aid", "Pathological Analysis Equipments"],
        fallbackImages: ["https://images.unsplash.com/photo-1505751172876-fa1923c5c528", "https://images.unsplash.com/photo-1584362917165-526a968579e8"],
        moqSuffix: "Units"
    },
    gifts: {
        name: "Gifts & Crafts",
        keywords: ["Name Tag", "Promotional Business Gifts", "Amethyst", "Key Chain", "Gift Sets", "Flags", "Metal Crafts", "Lucky Cat", "Crystal Stone", "Leather Crafts", "Jewelry Tools", "Acrylic beads", "Crystal Beads", "Charms", "Amber", "Hair Sticks", "Headpiece", "Tourmaline"],
        fallbackImages: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48"],
        moqSuffix: "Pieces"
    },
    pet: {
        name: "Pet Supplies",
        keywords: ["Dog Food", "Hamster Cage", "Dog Kennel", "Aquarium Filter", "Cat Tree", "Pet Accessories", "Aquariums", "Saltwater Aquarium", "Dog Ramp", "Sponge Filter", "Cat Toy", "Dog Car Seat", "Dog Crate"],
        fallbackImages: ["https://images.unsplash.com/photo-1516734212186-a967f81ad0d7", "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"],
        moqSuffix: "Units"
    },
    school: {
        name: "School & Office Supplies",
        keywords: ["Water Color", "Paper Punch", "Bible Cover", "Cutting Plotter", "Art Supplies", "Erasers", "Medical Science", "World Globe", "Sketch Pad", "Watercolor Paper", "Id Badge Holder", "Binder Clips", "Cork Board"],
        fallbackImages: ["https://images.unsplash.com/photo-1456735190827-d1262f71b8a3", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"],
        moqSuffix: "Units"
    },
    energy: {
        name: "Renewable Energy",
        keywords: ["Water Turbine", "Rechargeable Batteries", "Hydro Generator", "Wind Turbine", "Battery", "Solar Panels", "Solar Energy System", "Magnet Generator", "Solar Cells", "Solar Charger", "Solar Tracker", "Turbine Generator", "Solar Kits"],
        fallbackImages: ["https://images.unsplash.com/photo-1509391366360-1e96230e7fa1", "https://images.unsplash.com/photo-1466611653911-954ff21b6748"],
        moqSuffix: "Units"
    },
    electrical: {
        name: "Electrical Equipment & Supplies",
        keywords: ["Winding Wire", "Wall Socket", "Electrical Switch", "Transformers", "Cable Connector", "Welding Cable", "Gasoline Generators", "Bnc Connector", "Generator Parts", "Aluminum Box", "Fuse Box"],
        fallbackImages: ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e", "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e"],
        moqSuffix: "Units"
    },
    safety: {
        name: "Safety & Security",
        keywords: ["Work Clothing", "Parking Barrier", "Locksmith Tools", "Keys", "Locksmith Supplies", "Nvr", "Spy Camera", "Latch", "Smart Card Reader", "Rim Lock", "Military Supplies", "Reflective Fabric", "Lightning Rods"],
        fallbackImages: ["https://images.unsplash.com/photo-1557597774-9d2739f8ft19", "https://images.unsplash.com/photo-1614064641938-3bbee52942c7"],
        moqSuffix: "Units"
    },
    vehicles: {
        name: "Vehicles & Transportation",
        keywords: ["Sport Car", "Pit Bike", "Used Motorcycles", "Motorcycle", "Trailers", "Electric Truck", "ATVs", "Suv Car", "Pick Up Truck", "Utility Trailer", "Dump Trailer", "Tow Truck", "Hybrid Car"],
        fallbackImages: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"],
        moqSuffix: "Units"
    },
    agriculture: {
        name: "Agriculture & Food",
        keywords: ["Absinthe", "Dory", "Coconut Water", "Vanilla Beans", "Cardamom", "Cloves", "Saffron", "Mooncakes", "Mussel", "Ramune", "Condensed Milk", "Logs", "Betel Nuts"],
        fallbackImages: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62", "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2"],
        moqSuffix: "kg"
    },
    service: {
        name: "Service & Business",
        keywords: ["Fashion Design", "PC Games", "Quality Control", "Wix", "AI Chatbot", "Taobao Agent", "1688 Agent"],
        fallbackImages: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3", "https://images.unsplash.com/photo-1551836022-d5d88e9218df"],
        moqSuffix: "Service"
    }
};

// Generate 800 products to ensure all categories are represented
const catalog = [];
const catKeys = Object.keys(categoryData);

for (let i = 1; i <= 800; i++) {
    const key = catKeys[i % catKeys.length];
    const cat = categoryData[key];
    const keyword = cat.keywords[i % cat.keywords.length];
    
    const localImg = `images/products/${key}_${i}.jpg`;
    const fallbackImg = `${cat.fallbackImages[i % cat.fallbackImages.length]}?auto=format&fit=crop&q=80&w=400`;

    catalog.push({
        id: i,
        category: key,
        title: `Wholesale ${keyword} - High Quality Premium ${i}`,
        price: `GHS ${(Math.random() * 500 + 50).toFixed(2)} - GHS ${(Math.random() * 1000 + 600).toFixed(2)}`,
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
        email: (auth.currentUser ? auth.currentUser.email : 'customer@example.com'),
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
            
            // Save order to Firestore
            saveOrderToFirestore({
                items: [{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.fallbackImage,
                    quantity: 1
                }],
                total: priceStr,
                reference: response.reference
            });

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

