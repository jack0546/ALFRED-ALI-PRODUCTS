// ALFRED PRODUCTS - Main Script
// This script handles product generation, category filtering, and local image mapping.

// Placeholder image for products
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTIeMmUzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Current product for delivery form
// Note: Don't use 'let' here to avoid conflicts with HTML files that also declare this variable
if (typeof currentProduct === 'undefined') {
    currentProduct = null;
}

// Open Delivery Form Modal with Paystack Payment
function openDeliveryForm(category, title, price, description, image) {
    let p = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    let d = typeof description !== 'undefined' ? description : '';
    window.location.href = 'product.html?title=' + encodeURIComponent(title) + '&price=' + p + '&desc=' + encodeURIComponent(d) + '&image=' + encodeURIComponent(image) + '&category=' + encodeURIComponent(category);
}

function closeDeliveryForm() {
    const modal = document.getElementById('deliveryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Product Comparison System
let compareList = [];
const MAX_COMPARE = 4;

function toggleCompare(product, isChecked) {
    if (isChecked) {
        if (compareList.length >= MAX_COMPARE) {
            alert(`You can only compare ${MAX_COMPARE} products at a time`);
            event.target.checked = false;
            return;
        }
        compareList.push(product);
    } else {
        compareList = compareList.filter(p => p.id !== product.id);
    }
    updateCompareBar();
}

function updateCompareBar() {
    let bar = document.getElementById('compareBar');
    if (compareList.length === 0) {
        if (bar) bar.remove();
        return;
    }
    
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'compareBar';
        bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fff;box-shadow:0 -2px 10px rgba(0,0,0,0.1);padding:15px;z-index:9999;display:flex;align-items:center;justify-content:space-between;';
        document.body.appendChild(bar);
    }
    
    bar.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-weight:600;">Compare (${compareList.length}/${MAX_COMPARE}):</span>
            ${compareList.map(p => `<span style="background:#f0f0f0;padding:5px 10px;border-radius:4px;font-size:12px;">${p.title.substring(0,20)}...</span>`).join('')}
        </div>
        <div style="display:flex;gap:10px;">
            <button onclick="showCompareModal()" style="background:#0656D3;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:600;">View Comparison</button>
            <button onclick="clearCompare()" style="background:#666;color:white;border:none;padding:10px 15px;border-radius:6px;cursor:pointer;">Clear</button>
        </div>
    `;
}

function showCompareModal() {
    if (compareList.length < 2) {
        alert('Please select at least 2 products to compare');
        return;
    }
    
    let modal = document.getElementById('compareModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'compareModal';
        modal.style.cssText = 'display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;';
        document.body.appendChild(modal);
    }
    
    const features = ['Price', 'MOQ', 'Supplier', 'Verified', 'Response Rate', 'Member Since'];
    
    modal.innerHTML = `
        <div style="background:white;padding:25px;border-radius:16px;width:95%;max-width:900px;max-height:90vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h2 style="margin:0;font-size:20px;">Product Comparison</h2>
                <button onclick="document.getElementById('compareModal').style.display='none'" style="background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>
            </div>
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr>
                        <th style="text-align:left;padding:10px;background:#f5f5f5;border:1px solid #ddd;">Feature</th>
                        ${compareList.map(p => `<th style="padding:10px;background:#f5f5f5;border:1px solid #ddd;"><img src="${p.image}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;"><br><small>${p.title}</small></th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">Price</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;color:#0abf53;font-weight:700;">${p.price}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">MOQ</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;">${p.moq || '1 Unit'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">Supplier</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;">${p.supplier || 'N/A'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">Verified</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;">${p.verified ? '✓ Yes' : '✗ No'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">Response Rate</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;">${p.responseRate || 'N/A'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">Member Since</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;">${p.onAlibabaSince || 'N/A'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;font-weight:600;">Bulk Pricing</td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;font-size:11px;">${p.bulkPricing ? p.bulkPricing.map(bp => `${bp.min}+: GHS${bp.price.toFixed(2)}`).join('<br>') : 'N/A'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;"></td>
                        ${compareList.map(p => `<td style="padding:10px;border:1px solid #ddd;"><button onclick="openDeliveryForm('${p.category}','${p.title}',${parseFloat(p.price.replace('GHS ',''))},'','${p.image}')" style="background:#0abf53;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;width:100%;">Order Now</button></td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function clearCompare() {
    compareList = [];
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateCompareBar();
}

// RFQ (Request for Quote) Form
function openRFQForm(product) {
    let modal = document.getElementById('rfqModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'rfqModal';
        modal.style.cssText = 'display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;';
        modal.innerHTML = `
            <div style="background:white;padding:30px;border-radius:16px;width:90%;max-width:500px;max-height:90vh;overflow-y:auto;position:relative;">
                <button onclick="closeRFQForm()" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
                <h2 style="margin-bottom:10px;font-size:22px;color:#1a1a1a;">Request for Quotation</h2>
                <p style="color:#666;margin-bottom:20px;font-size:14px;">Submit your requirements to get a quote from the supplier</p>
                
                <form id="rfqForm" onsubmit="event.preventDefault(); submitRFQ();">
                    <div style="display:flex;gap:15px;padding:15px;background:#f9f9f9;border-radius:10px;margin-bottom:20px;">
                        <img id="rfqProductImage" src="" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
                        <div>
                            <h3 id="rfqProductTitle" style="font-size:14px;margin:0 0 5px 0;"></h3>
                            <p id="rfqProductSupplier" style="font-size:12px;color:#666;margin:0;"></p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom:15px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Quantity Needed *</label>
                        <input type="number" id="rfqQuantity" required min="1" placeholder="Enter quantity" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Target Price (GHS) *</label>
                        <input type="number" id="rfqTargetPrice" required min="0" step="0.01" placeholder="Your target price per unit" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Your Name *</label>
                        <input type="text" id="rfqName" required placeholder="Full name" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Company Name</label>
                        <input type="text" id="rfqCompany" placeholder="Company name (optional)" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Email *</label>
                        <input type="email" id="rfqEmail" required placeholder="your@email.com" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Phone *</label>
                        <input type="tel" id="rfqPhone" required placeholder="Phone number" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="display:block;margin-bottom:5px;font-size:14px;font-weight:500;">Additional Details</label>
                        <textarea id="rfqNotes" placeholder="Any specific requirements, customization needs, shipping destination, etc." style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;height:80px;resize:none;"></textarea>
                    </div>
                    
                    <button type="submit" style="width:100%;padding:16px;background:#FF6A00;color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:background 0.3s;">
                        Submit RFQ
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('rfqProductImage').src = product.image;
    document.getElementById('rfqProductTitle').textContent = product.title;
    document.getElementById('rfqProductSupplier').textContent = 'Supplier: ' + (product.supplier || 'N/A');
    
    // Pre-fill quantity with MOQ
    const moqMatch = product.moq ? product.moq.match(/(\d+)/) : null;
    if (moqMatch) {
        document.getElementById('rfqQuantity').value = moqMatch[1];
    }
    
    // Pre-fill target price
    const priceMatch = product.price ? product.price.match(/([\d.]+)/) : null;
    if (priceMatch) {
        document.getElementById('rfqTargetPrice').value = priceMatch[1];
    }
    
    modal.style.display = 'flex';
}

function closeRFQForm() {
    const modal = document.getElementById('rfqModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function submitRFQ() {
    const rfqData = {
        product: document.getElementById('rfqProductTitle').textContent,
        quantity: document.getElementById('rfqQuantity').value,
        targetPrice: document.getElementById('rfqTargetPrice').value,
        name: document.getElementById('rfqName').value,
        company: document.getElementById('rfqCompany').value,
        email: document.getElementById('rfqEmail').value,
        phone: document.getElementById('rfqPhone').value,
        notes: document.getElementById('rfqNotes').value,
        date: new Date().toISOString()
    };
    
    console.log('RFQ Submitted:', rfqData);
    
    // Store in localStorage
    let rfqs = JSON.parse(localStorage.getItem('alfred_rfqs') || '[]');
    rfqs.push(rfqData);
    localStorage.setItem('alfred_rfqs', JSON.stringify(rfqs));
    
    alert('Your RFQ has been submitted! Suppliers will contact you soon.');
    closeRFQForm();
}

// Process Quick Payment with Paystack
function processQuickPayment() {
    if (!currentProduct) {
        alert('No product selected');
        return;
    }

    const fullName = document.getElementById('quickFullName').value;
    const phone = document.getElementById('quickPhone').value;
    const whatsapp = document.getElementById('quickWhatsapp').value;
    const region = document.getElementById('quickRegion').value;
    const city = document.getElementById('quickCity').value;
    const address = document.getElementById('quickAddress').value;

    if (!fullName || !phone || !region || !city || !address) {
        alert('Please fill in all required fields');
        return;
    }

    const deliveryInfo = {
        fullName: fullName,
        phone: phone,
        whatsapp: whatsapp || 'N/A',
        region: region,
        city: city,
        address: address
    };

    // Store delivery info
    localStorage.setItem('quickDeliveryInfo', JSON.stringify(deliveryInfo));

    // Calculate total with delivery fee
    const priceNum = currentProduct.price;
    const deliveryFee = 15;
    const totalAmount = (priceNum + deliveryFee) * 100; // Convert to kobo for Paystack

    // Initialize Paystack
    if (typeof PaystackPop === 'undefined') {
        alert('Paystack is not loaded. Please refresh and try again.');
        return;
    }

    let handler = PaystackPop.setup({
        key: 'pk_live_6b9968065dc0bd4842c97ffa138e49127c862888',
        email: 'customer@alfredproducts.com',
        amount: totalAmount,
        currency: 'GHS',
        ref: 'ALF_' + Math.floor((Math.random() * 1e9) + 1),
        metadata: {
            custom_fields: [
                { display_name: 'Customer', value: fullName },
                { display_name: 'Phone', value: phone },
                { display_name: 'Product', value: currentProduct.title },
                { display_name: 'Region', value: region },
                { display_name: 'City', value: city },
                { display_name: 'Address', value: address }
            ]
        },
        callback: function (response) {
            // Payment successful
            const orderData = {
                items: [{
                    title: currentProduct.title,
                    price: currentProduct.price,
                    image: currentProduct.image,
                    quantity: 1
                }],
                total: (currentProduct.price + deliveryFee).toFixed(2),
                reference: response.reference,
                delivery: deliveryInfo,
                status: 'Paid',
                orderDate: new Date().toISOString()
            };

            // Save order to Firestore (this also handles local storage internally)
            if (typeof saveOrderToFirestore === 'function') {
                saveOrderToFirestore(orderData)
                    .then(function(docId) {
                        console.log('Order saved to Firestore with ID:', docId);
                        localStorage.removeItem('alfredCart');
                        localStorage.removeItem('quickDeliveryInfo');
                        closeDeliveryForm();
                        alert('Payment Successful! Your order has been placed.\nReference: ' + response.reference);
                        window.location.href = 'orders.html';
                    })
                    .catch(function(error) {
                        console.error('Failed to save order to Firestore:', error);
                        localStorage.removeItem('alfredCart');
                        localStorage.removeItem('quickDeliveryInfo');
                        closeDeliveryForm();
                        alert('Payment Successful! Order saved locally.\nReference: ' + response.reference);
                        window.location.href = 'orders.html';
                    });
            } else {
                // Fallback: Save to localStorage if function is not defined
                const orders = JSON.parse(localStorage.getItem('alfredOrders') || '[]');
                orders.unshift(orderData);
                localStorage.setItem('alfredOrders', JSON.stringify(orders));
                localStorage.removeItem('alfredCart');
                localStorage.removeItem('quickDeliveryInfo');
                closeDeliveryForm();
                alert('Payment Successful! Your order has been placed.\nReference: ' + response.reference);
                window.location.href = 'orders.html';
            }
        },
        onClose: function () {
            alert('Payment cancelled. You can try again when ready.');
        }
    });

    handler.openIframe();
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('deliveryModal');
    if (modal && e.target === modal) {
        closeDeliveryForm();
    }
});

// Supplier data for mockup
const suppliers = [
    { id: 1, name: "Premium Fashion Co.", verified: true, responseRate: 98, responseTime: "1h", products: 520, orders: 1200, rating: 4.9, avatar: "P" },
    { id: 2, name: "Tech Gadgets Direct", verified: true, responseRate: 95, responseTime: "2h", products: 340, orders: 890, rating: 4.8, avatar: "T" },
    { id: 3, name: "Beauty Essentials Ltd", verified: true, responseRate: 99, responseTime: "30m", products: 280, orders: 2100, rating: 4.9, avatar: "B" },
    { id: 4, name: "Global Bags Inc.", verified: true, responseRate: 92, responseTime: "3h", products: 450, orders: 750, rating: 4.7, avatar: "G" },
    { id: 5, name: "Sports Gear Pro", verified: false, responseRate: 88, responseTime: "4h", products: 190, orders: 320, rating: 4.5, avatar: "S" },
    { id: 6, name: "Home & Living Store", verified: true, responseRate: 96, responseTime: "1h", products: 620, orders: 1500, rating: 4.8, avatar: "H" },
    { id: 7, name: "Industrial Machines Co.", verified: true, responseRate: 94, responseTime: "2h", products: 150, orders: 280, rating: 4.6, avatar: "I" },
    { id: 8, name: "Kids World Trading", verified: true, responseRate: 97, responseTime: "1h", products: 380, orders: 980, rating: 4.7, avatar: "K" }
];

// Function to render supplier cards
function renderSupplierCard(supplier) {
    return `
        <div class="supplier-card">
            <div class="supplier-header">
                <div class="supplier-avatar">${supplier.avatar}</div>
                <div class="supplier-info">
                    <h4>${supplier.name} ${supplier.verified ? '<ion-icon name="checkmark-circle" style="color: var(--primary-color); font-size: 14px;"></ion-icon>' : ''}</h4>
                    <p>${supplier.products} products | ${supplier.orders}+ orders</p>
                </div>
            </div>
            <div class="supplier-stats">
                <div class="supplier-stat">
                    <div class="supplier-stat-value">${supplier.rating}</div>
                    <div class="supplier-stat-label">Rating</div>
                </div>
                <div class="supplier-stat">
                    <div class="supplier-stat-value">${supplier.responseRate}%</div>
                    <div class="supplier-stat-label">Response</div>
                </div>
                <div class="supplier-stat">
                    <div class="supplier-stat-value">${supplier.responseTime}</div>
                    <div class="supplier-stat-label">Response</div>
                </div>
            </div>
            <a href="supplier-profile.html?id=${supplier.id}" class="supplier-card-btn">View Profile</a>
        </div>
    `;
}

// Function to render modern product card with supplier info
function renderProductCard(product) {
    const supplier = suppliers[product.id % suppliers.length];
    const rating = (4 + Math.random()).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500) + 10;
    
    // Extract price number
    let price = 0;
    if (typeof product.price === 'string') {
        const priceMatch = product.price.match(/[\d,.]+/);
        if (priceMatch) {
            price = parseFloat(priceMatch[0].replace(/,/g, ''));
        }
    } else {
        price = product.price;
    }
    
    // Get category name
    const category = product.category.charAt(0).toUpperCase() + product.category.slice(1);

    return `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" loading="lazy" alt="${product.title}" 
                     onerror="this.src='${PLACEHOLDER_IMAGE}'; this.onerror=null;"
                     onclick="event.preventDefault(); handleProductClick(${product.id})"
                     style="cursor: pointer;"
                     title="Click to buy now">
                <div class="product-actions-overlay">
                    <button class="product-action-btn" title="Add to Wishlist" onclick="event.preventDefault(); addToWishlist(${product.id})">
                        <ion-icon name="heart-outline"></ion-icon>
                    </button>
                    <button class="product-action-btn" title="Quick View" onclick="event.preventDefault();">
                        <ion-icon name="eye-outline"></ion-icon>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price} <span>/ unit</span></div>
                <div class="product-supplier">
                    <span>${supplier.name}</span>
                </div>
                <div class="product-rating">
                    <div class="rating-stars">
                        ${renderStars(rating)}
                    </div>
                    <span class="rating-count">(${reviewCount})</span>
                </div>
                <div class="product-moq">
                    <strong>MOQ:</strong> ${product.moq}
                </div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="product-card-btn" onclick="event.preventDefault(); window.location.href='messages.html?supplier=${supplier.id}'" style="flex:1; background:#666;">
                        Contact
                    </button>
                    <button class="product-card-btn" onclick="event.preventDefault(); addProductToCart('${category}', '${product.title}', ${price}, '${product.moq || 'Wholesale'}', '${product.image}')" style="flex:1;">
                        Add to Cart
                    </button>
                </div>
            </div>
        </a>
    `;
}

// Handle product image click - navigate to delivery form on product page
function handleProductClick(productId) {
    // Find the product in catalog
    const product = catalog.find(p => p.id === productId);
    if (product) {
        // Extract price number from price string (e.g., "GHS 120.00" -> 120)
        let price = 0;
        if (typeof product.price === 'string') {
            const priceMatch = product.price.match(/[\d,.]+/);
            if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(/,/g, ''));
            }
        } else {
            price = product.price;
        }
        
        // Get category display name
        const category = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        
        // Call openDeliveryForm if it exists (defined in index.html)
        if (typeof openDeliveryForm === 'function') {
            openDeliveryForm(category, product.title, price, product.moq || 'Wholesale', product.image);
        } else {
            // Fallback: navigate to product page
            window.location.href = 'product.html?id=' + productId;
        }
    } else {
        // Product not found, fallback to navigation
        window.location.href = 'product.html?id=' + productId;
    }
}

// Handle add to cart from product page - check auth
function handleAddToCart(productId) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, add to cart
            addToCart(productId);
            alert('Product added to cart!');
            updateCartBadge();
        } else {
            // User is not logged in, redirect to login
            alert('Please sign in or create an account to add items to cart.');
            window.location.href = 'login.html?redirect=product.html?id=' + productId + '&productId=' + productId;
        }
    });
}

// Helper function to render star rating
function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<ion-icon name="star"></ion-icon>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<ion-icon name="star-half"></ion-icon>';
        } else {
            stars += '<ion-icon name="star-outline"></ion-icon>';
        }
    }
    return stars;
}

// Modern render function for homepage
function renderProductsModern(filterCategory = null, keywordFilter = null, targetGridId = 'productGrid', limit = null) {
    const grid = document.getElementById(targetGridId);
    if (!grid) {
        console.log('Grid not found:', targetGridId);
        return;
    }

    grid.innerHTML = '';
    let filtered = catalog;

    if (filterCategory) {
        filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (keywordFilter) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keywordFilter.toLowerCase()));
    }

    // Apply limit
    const finalLimit = limit || filtered.length;
    filtered = filtered.slice(0, finalLimit);

    console.log('Rendering', filtered.length, 'products to', targetGridId);

    // Generate HTML for each product
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        card.style.border = '1px solid #e5e5e5';
        card.style.borderRadius = '12px';
        card.style.overflow = 'hidden';
        card.style.marginBottom = '15px';
        
        // Create clickable image wrapper
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'product-image';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.loading = 'lazy';
        img.alt = product.title;
        img.onerror = function() { this.src = 'https://via.placeholder.com/300x300?text=Product'; };
        img.style.cursor = 'pointer';
        img.style.width = '100%';
        img.style.height = '150px';
        img.style.objectFit = 'cover';
        
        // Direct onclick on image
        img.onclick = function(e) {
            e.stopPropagation();
            const price = parseFloat(product.price.replace('GHS ', '').replace(/,/g, ''));
            openDeliveryForm(product.category, product.title, price, product.moq || 'Wholesale', product.image);
        };
        
        imgWrapper.appendChild(img);
        
        const info = document.createElement('div');
        info.className = 'product-info';
        info.style.padding = '10px';
        
        // Alibaba-style: Supplier info
        const supplierDiv = document.createElement('div');
        supplierDiv.style.marginBottom = '5px';
        supplierDiv.style.fontSize = '11px';
        const verifiedBadge = product.verified 
            ? '<span style="background:#0656D3;color:white;padding:1px 4px;border-radius:3px;font-size:9px;margin-right:5px;">✓ Verified</span>'
            : '';
        supplierDiv.innerHTML = `${verifiedBadge}<span style="color:#666;">${product.supplier || 'Supplier'}</span>`;
        
        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;
        title.style.fontSize = '13px';
        title.style.marginBottom = '5px';
        
        // Alibaba-style: Bulk pricing display
        const priceDiv = document.createElement('div');
        priceDiv.style.marginBottom = '5px';
        const basePrice = product.price;
        priceDiv.innerHTML = `<span style="font-weight:700;color:#0abf53;font-size:14px;">${basePrice}</span>`;
        if (product.bulkPricing && product.bulkPricing.length > 1) {
            priceDiv.innerHTML += `<span style="font-size:10px;color:#888;margin-left:5px;">↓ Buy more save more</span>`;
        }
        
        const moq = document.createElement('span');
        moq.className = 'product-moq';
        moq.textContent = product.moq || 'MOQ: 1 Unit';
        moq.style.fontSize = '11px';
        moq.style.color = '#888';
        moq.style.display = 'block';
        moq.style.marginBottom = '8px';
        
        // Alibaba-style: Action buttons row
        const actionsDiv = document.createElement('div');
        actionsDiv.style.display = 'flex';
        actionsDiv.style.gap = '5px';
        
        // RFQ Button (Request for Quote)
        const rfqBtn = document.createElement('button');
        rfqBtn.textContent = 'RFQ';
        rfqBtn.style.flex = '1';
        rfqBtn.style.padding = '6px';
        rfqBtn.style.fontSize = '11px';
        rfqBtn.style.border = '1px solid #FF6A00';
        rfqBtn.style.background = 'white';
        rfqBtn.style.color = '#FF6A00';
        rfqBtn.style.borderRadius = '4px';
        rfqBtn.style.cursor = 'pointer';
        rfqBtn.style.fontWeight = '600';
        rfqBtn.onclick = function(e) {
            e.stopPropagation();
            openRFQForm(product);
        };
        
        // Compare checkbox
        const compareLabel = document.createElement('label');
        compareLabel.style.display = 'flex';
        compareLabel.style.alignItems = 'center';
        compareLabel.style.fontSize = '10px';
        compareLabel.style.color = '#666';
        compareLabel.style.cursor = 'pointer';
        compareLabel.style.gap = '3px';
        
        const compareCheck = document.createElement('input');
        compareCheck.type = 'checkbox';
        compareCheck.style.width = '12px';
        compareCheck.style.height = '12px';
        compareCheck.onchange = function() {
            toggleCompare(product, this.checked);
        };
        
        compareLabel.appendChild(compareCheck);
        compareLabel.appendChild(document.createTextNode('Compare'));
        
        actionsDiv.appendChild(rfqBtn);
        actionsDiv.appendChild(compareLabel);
        
        info.appendChild(supplierDiv);
        info.appendChild(title);
        info.appendChild(priceDiv);
        info.appendChild(moq);
        info.appendChild(actionsDiv);
        
        card.appendChild(imgWrapper);
        card.appendChild(info);
        
        // Also make the whole card clickable
        card.onclick = function(e) {
            // Don't trigger if clicking on RFQ button or compare checkbox
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            const price = parseFloat(product.price.replace('GHS ', '').replace(/,/g, ''));
            openDeliveryForm(product.category, product.title, price, product.moq || 'Wholesale', product.image);
        };
        
        grid.appendChild(card);
    });
}

// Product Catalog Data
const manualCatalog = [
    // SPORTS & ENTERTAINMENT
    { id: 1, category: 'sports', title: 'Camping Gear Set', price: 'GHS 120.00', moq: '10 Units', image: 'images/image5.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:120},{min:50,price:114},{min:100,price:108},{min:500,price:102},{min:1000,price:96}], responseRate: '98%', onAlibabaSince: '2018' },
    { id: 2, category: 'sports', title: 'Fishing Accessories Kit', price: 'GHS 45.00', moq: '20 Units', image: 'images/image6.jpg', supplier: 'Premium Suppliers Ltd.', verified: true, bulkPricing: [{min:1,price:45},{min:50,price:42.75},{min:100,price:40.50},{min:500,price:38.25},{min:1000,price:36}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 3, category: 'sports', title: 'Novelties Collection', price: 'GHS 28.00', moq: '30 Units', image: 'images/image7.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '92%', onAlibabaSince: '2019' },
    { id: 4, category: 'sports', title: 'Step Platforms', price: 'GHS 35.00', moq: '25 Units', image: 'images/image8.jpg', supplier: 'Wholesale Hub', verified: false, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '85%', onAlibabaSince: '2020' },
    { id: 5, category: 'sports', title: 'Sports Accessories Pack', price: 'GHS 22.00', moq: '40 Units', image: 'images/image9.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:22},{min:50,price:20.90},{min:100,price:19.80},{min:500,price:18.70},{min:1000,price:17.60}], responseRate: '97%', onAlibabaSince: '2016' },
    { id: 6, category: 'sports', title: 'Archery Bows Set', price: 'GHS 85.00', moq: '15 Units', image: 'images/image10.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:85},{min:50,price:80.75},{min:100,price:76.50},{min:500,price:72.25},{min:1000,price:68}], responseRate: '94%', onAlibabaSince: '2018' },
    { id: 7, category: 'sports', title: 'Slides Sandals', price: 'GHS 25.00', moq: '35 Units', image: 'images/image11.jpg', supplier: 'Mega Bulk Traders', verified: true, bulkPricing: [{min:1,price:25},{min:50,price:23.75},{min:100,price:22.50},{min:500,price:21.25},{min:1000,price:20}], responseRate: '91%', onAlibabaSince: '2019' },
    { id: 8, category: 'sports', title: 'Diving Reel Equipment', price: 'GHS 65.00', moq: '20 Units', image: 'images/image12.jpg', supplier: 'Quality Goods Source', verified: false, bulkPricing: [{min:1,price:65},{min:50,price:61.75},{min:100,price:58.50},{min:500,price:55.25},{min:1000,price:52}], responseRate: '88%', onAlibabaSince: '2020' },
    { id: 9, category: 'sports', title: 'Shot Put Equipment', price: 'GHS 38.00', moq: '25 Units', image: 'images/image13.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:38},{min:50,price:36.10},{min:100,price:34.20},{min:500,price:32.30},{min:1000,price:30.40}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 10, category: 'sports', title: 'Tennis Net Set', price: 'GHS 55.00', moq: '18 Units', image: 'images/test.jpg', supplier: 'Premium Suppliers Ltd.', verified: true, bulkPricing: [{min:1,price:55},{min:50,price:52.25},{min:100,price:49.50},{min:500,price:46.75},{min:1000,price:44}], responseRate: '93%', onAlibabaSince: '2018' },
    { id: 11, category: 'sports', title: 'Flying Car Toy', price: 'GHS 48.00', moq: '30 Units', image: 'images/image1.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:48},{min:50,price:45.60},{min:100,price:43.20},{min:500,price:40.80},{min:1000,price:38.40}], responseRate: '90%', onAlibabaSince: '2019' },
    { id: 12, category: 'sports', title: 'Suspension Trainers', price: 'GHS 75.00', moq: '15 Units', image: 'images/image2.jpg', supplier: 'Wholesale Hub', verified: false, bulkPricing: [{min:1,price:75},{min:50,price:71.25},{min:100,price:67.50},{min:500,price:63.75},{min:1000,price:60}], responseRate: '87%', onAlibabaSince: '2020' },
    { id: 13, category: 'sports', title: 'Amusement Park Products', price: 'GHS 95.00', moq: '12 Units', image: 'images/image3.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:95},{min:50,price:90.25},{min:100,price:85.50},{min:500,price:80.75},{min:1000,price:76}], responseRate: '95%', onAlibabaSince: '2017' },
    
    // BEAUTY
    { id: 14, category: 'beauty', title: 'Perfume Gift Sets', price: 'GHS 85.00', moq: '20 Units', image: 'images/SPRAY1.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:85},{min:50,price:80.75},{min:100,price:76.50},{min:500,price:72.25},{min:1000,price:68}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 15, category: 'beauty', title: 'Perfume Set Collection', price: 'GHS 95.00', moq: '18 Units', image: 'images/SPRAY2.jpg', supplier: 'Mega Bulk Traders', verified: true, bulkPricing: [{min:1,price:95},{min:50,price:90.25},{min:100,price:85.50},{min:500,price:80.75},{min:1000,price:76}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 16, category: 'beauty', title: 'Body Mist Spray', price: 'GHS 35.00', moq: '30 Units', image: 'images/SPRAY3.jpg', supplier: 'Quality Goods Source', verified: true, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '94%', onAlibabaSince: '2018' },
    { id: 17, category: 'beauty', title: 'Womens Perfume', price: 'GHS 75.00', moq: '22 Units', image: 'images/SPRAY1.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:75},{min:50,price:71.25},{min:100,price:67.50},{min:500,price:63.75},{min:1000,price:60}], responseRate: '97%', onAlibabaSince: '2017' },
    { id: 18, category: 'beauty', title: 'Deodorant Spray', price: 'GHS 22.00', moq: '40 Units', image: 'images/SPRAY2.jpg', supplier: 'Premium Suppliers Ltd.', verified: false, bulkPricing: [{min:1,price:22},{min:50,price:20.90},{min:100,price:19.80},{min:500,price:18.70},{min:1000,price:17.60}], responseRate: '86%', onAlibabaSince: '2019' },
    { id: 19, category: 'beauty', title: 'Deodorant Stick', price: 'GHS 18.00', moq: '45 Units', image: 'images/SPRAY3.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '92%', onAlibabaSince: '2018' },
    { id: 20, category: 'beauty', title: 'Mens Perfume', price: 'GHS 85.00', moq: '20 Units', image: 'images/SPRAY1.jpg', supplier: 'Wholesale Hub', verified: true, bulkPricing: [{min:1,price:85},{min:50,price:80.75},{min:100,price:76.50},{min:500,price:72.25},{min:1000,price:68}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 21, category: 'beauty', title: 'Cosmetic Collection', price: 'GHS 65.00', moq: '25 Units', image: 'images/SPRAY2.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:65},{min:50,price:61.75},{min:100,price:58.50},{min:500,price:55.25},{min:1000,price:52}], responseRate: '93%', onAlibabaSince: '2018' },
    { id: 22, category: 'beauty', title: 'Nail Equipment Set', price: 'GHS 48.00', moq: '28 Units', image: 'images/SPRAY3.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:48},{min:50,price:45.60},{min:100,price:43.20},{min:500,price:40.80},{min:1000,price:38.40}], responseRate: '91%', onAlibabaSince: '2019' },
    { id: 23, category: 'beauty', title: 'Hair Removal Machine', price: 'GHS 120.00', moq: '15 Units', image: 'images/SPRAY1.jpg', supplier: 'Mega Bulk Traders', verified: true, bulkPricing: [{min:1,price:120},{min:50,price:114},{min:100,price:108},{min:500,price:102},{min:1000,price:96}], responseRate: '97%', onAlibabaSince: '2016' },
    { id: 24, category: 'beauty', title: 'Makeup Sets Pro', price: 'GHS 95.00', moq: '18 Units', image: 'images/SPRAY2.jpg', supplier: 'Quality Goods Source', verified: false, bulkPricing: [{min:1,price:95},{min:50,price:90.25},{min:100,price:85.50},{min:500,price:80.75},{min:1000,price:76}], responseRate: '89%', onAlibabaSince: '2020' },
    { id: 25, category: 'beauty', title: 'Antiperspirant Roll-on', price: 'GHS 20.00', moq: '50 Units', image: 'images/SPRAY3.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:20},{min:50,price:19},{min:100,price:18},{min:500,price:17},{min:1000,price:16}], responseRate: '94%', onAlibabaSince: '2017' },
    { id: 26, category: 'beauty', title: 'Nail Supplies Kit', price: 'GHS 38.00', moq: '32 Units', image: 'images/SPRAY1.jpg', supplier: 'Premium Suppliers Ltd.', verified: true, bulkPricing: [{min:1,price:38},{min:50,price:36.10},{min:100,price:34.20},{min:500,price:32.30},{min:1000,price:30.40}], responseRate: '96%', onAlibabaSince: '2018' },
    
    // SHOES & ACCESSORIES
    { id: 27, category: 'shoes', title: 'Home Slippers', price: 'GHS 18.00', moq: '50 Units', image: 'images/SHOE1.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 28, category: 'shoes', title: 'Fur Slippers', price: 'GHS 35.00', moq: '35 Units', image: 'images/SHOE2.jpg', supplier: 'Wholesale Hub', verified: true, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 29, category: 'shoes', title: 'Moccasin Slippers', price: 'GHS 28.00', moq: '40 Units', image: 'images/SHOE3.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '93%', onAlibabaSince: '2018' },
    { id: 30, category: 'shoes', title: 'Moccasins Leather', price: 'GHS 55.00', moq: '25 Units', image: 'images/SHOE5.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:55},{min:50,price:52.25},{min:100,price:49.50},{min:500,price:46.75},{min:1000,price:44}], responseRate: '97%', onAlibabaSince: '2017' },
    { id: 31, category: 'shoes', title: 'Flats Shoes', price: 'GHS 38.00', moq: '30 Units', image: 'images/SHOE6.jpg', supplier: 'Mega Bulk Traders', verified: false, bulkPricing: [{min:1,price:38},{min:50,price:36.10},{min:100,price:34.20},{min:500,price:32.30},{min:1000,price:30.40}], responseRate: '88%', onAlibabaSince: '2019' },
    { id: 32, category: 'shoes', title: 'Slides Slippers', price: 'GHS 22.00', moq: '45 Units', image: 'images/SHOE7.jpg', supplier: 'Quality Goods Source', verified: true, bulkPricing: [{min:1,price:22},{min:50,price:20.90},{min:100,price:19.80},{min:500,price:18.70},{min:1000,price:17.60}], responseRate: '92%', onAlibabaSince: '2018' },
    { id: 33, category: 'shoes', title: 'Sandals Collection', price: 'GHS 32.00', moq: '35 Units', image: 'images/SHOE8.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:32},{min:50,price:30.40},{min:100,price:28.80},{min:500,price:27.20},{min:1000,price:25.60}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 34, category: 'shoes', title: 'Women Flats', price: 'GHS 42.00', moq: '28 Units', image: 'images/SHOE9.jpg', supplier: 'Premium Suppliers Ltd.', verified: true, bulkPricing: [{min:1,price:42},{min:50,price:39.90},{min:100,price:37.80},{min:500,price:35.70},{min:1000,price:33.60}], responseRate: '94%', onAlibabaSince: '2018' },
    { id: 35, category: 'shoes', title: 'Clogs Shoes', price: 'GHS 38.00', moq: '30 Units', image: 'images/SHOE10.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:38},{min:50,price:36.10},{min:100,price:34.20},{min:500,price:32.30},{min:1000,price:30.40}], responseRate: '91%', onAlibabaSince: '2019' },
    { id: 36, category: 'shoes', title: 'Summer Sandals', price: 'GHS 28.00', moq: '40 Units', image: 'images/SHOE11.jpg', supplier: 'Wholesale Hub', verified: false, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '87%', onAlibabaSince: '2020' },
    { id: 37, category: 'shoes', title: 'Beach Slippers', price: 'GHS 18.00', moq: '55 Units', image: 'images/SHOE12.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 38, category: 'shoes', title: 'Indoor Slippers', price: 'GHS 15.00', moq: '60 Units', image: 'images/SHOE13.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:15},{min:50,price:14.25},{min:100,price:13.50},{min:500,price:12.75},{min:1000,price:12}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 39, category: 'shoes', title: 'Women Slides', price: 'GHS 35.00', moq: '32 Units', image: 'images/SHOE14.jpg', supplier: 'Mega Bulk Traders', verified: true, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '93%', onAlibabaSince: '2018' },
    
    // PARENTS, KIDS & TOYS
    { id: 40, category: 'toys', title: 'Educational Toys Set', price: 'GHS 45.00', moq: '30 Units', image: 'images/image1.jpg', supplier: 'Quality Goods Source', verified: true, bulkPricing: [{min:1,price:45},{min:50,price:42.75},{min:100,price:40.50},{min:500,price:38.25},{min:1000,price:36}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 41, category: 'toys', title: 'Transformation Toys', price: 'GHS 68.00', moq: '22 Units', image: 'images/image2.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:68},{min:50,price:64.60},{min:100,price:61.20},{min:500,price:57.80},{min:1000,price:54.40}], responseRate: '94%', onAlibabaSince: '2018' },
    { id: 42, category: 'toys', title: 'Swimming Pool Kids', price: 'GHS 85.00', moq: '18 Units', image: 'images/image3.jpg', supplier: 'Premium Suppliers Ltd.', verified: true, bulkPricing: [{min:1,price:85},{min:50,price:80.75},{min:100,price:76.50},{min:500,price:72.25},{min:1000,price:68}], responseRate: '97%', onAlibabaSince: '2017' },
    { id: 43, category: 'toys', title: 'Children Slippers', price: 'GHS 18.00', moq: '50 Units', image: 'images/image4.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '92%', onAlibabaSince: '2018' },
    { id: 44, category: 'toys', title: 'Girls Sandals', price: 'GHS 28.00', moq: '40 Units', image: 'images/image5.jpg', supplier: 'Wholesale Hub', verified: false, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '86%', onAlibabaSince: '2019' },
    { id: 45, category: 'toys', title: 'Clogs Shoes Kids', price: 'GHS 25.00', moq: '42 Units', image: 'images/image6.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:25},{min:50,price:23.75},{min:100,price:22.50},{min:500,price:21.25},{min:1000,price:20}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 46, category: 'toys', title: 'Kids Slippers', price: 'GHS 15.00', moq: '60 Units', image: 'images/image7.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:15},{min:50,price:14.25},{min:100,price:13.50},{min:500,price:12.75},{min:1000,price:12}], responseRate: '91%', onAlibabaSince: '2018' },
    { id: 47, category: 'toys', title: 'Snow Scooters', price: 'GHS 95.00', moq: '15 Units', image: 'images/image8.jpg', supplier: 'Mega Bulk Traders', verified: true, bulkPricing: [{min:1,price:95},{min:50,price:90.25},{min:100,price:85.50},{min:500,price:80.75},{min:1000,price:76}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 48, category: 'toys', title: 'Miscellaneous Toys', price: 'GHS 32.00', moq: '35 Units', image: 'images/image9.jpg', supplier: 'Quality Goods Source', verified: false, bulkPricing: [{min:1,price:32},{min:50,price:30.40},{min:100,price:28.80},{min:500,price:27.20},{min:1000,price:25.60}], responseRate: '88%', onAlibabaSince: '2020' },
    { id: 49, category: 'toys', title: 'Pool Accessories', price: 'GHS 28.00', moq: '38 Units', image: 'images/image10.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '94%', onAlibabaSince: '2017' },
    { id: 50, category: 'toys', title: 'Kaleidoscopes', price: 'GHS 22.00', moq: '45 Units', image: 'images/image11.jpg', supplier: 'Premium Suppliers Ltd.', verified: true, bulkPricing: [{min:1,price:22},{min:50,price:20.90},{min:100,price:19.80},{min:500,price:18.70},{min:1000,price:17.60}], responseRate: '96%', onAlibabaSince: '2018' },
    { id: 51, category: 'toys', title: 'Water Toys Set', price: 'GHS 35.00', moq: '32 Units', image: 'images/image12.jpg', supplier: 'Factory Direct Inc.', verified: true, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '93%', onAlibabaSince: '2019' },
    { id: 52, category: 'toys', title: 'Party Decoration Kit', price: 'GHS 42.00', moq: '28 Units', image: 'images/image13.jpg', supplier: 'Wholesale Hub', verified: true, bulkPricing: [{min:1,price:42},{min:50,price:39.90},{min:100,price:37.80},{min:500,price:35.70},{min:1000,price:33.60}], responseRate: '95%', onAlibabaSince: '2017' },
    
    // APPAREL & ACCESSORIES
    { id: 53, category: 'apparel', title: 'Graduation Cap', price: 'GHS 15.00', moq: '60 Units', image: 'images/image1.jpg', supplier: 'Prime Manufacturing', verified: true, bulkPricing: [{min:1,price:15},{min:50,price:14.25},{min:100,price:13.50},{min:500,price:12.75},{min:1000,price:12}], responseRate: '97%', onAlibabaSince: '2016' },
    { id: 54, category: 'apparel', title: 'Cheongsam Dress', price: 'GHS 85.00', moq: '20 Units', image: 'images/image2.jpg', supplier: 'Elite Exports', verified: true, bulkPricing: [{min:1,price:85},{min:50,price:80.75},{min:100,price:76.50},{min:500,price:72.25},{min:1000,price:68}], responseRate: '94%', onAlibabaSince: '2017' },
    { id: 55, category: 'apparel', title: 'Sequins Fabric', price: 'GHS 25.00', moq: '45 Units', image: 'images/image3.jpg', supplier: 'Mega Bulk Traders', verified: true, bulkPricing: [{min:1,price:25},{min:50,price:23.75},{min:100,price:22.50},{min:500,price:21.25},{min:1000,price:20}], responseRate: '92%', onAlibabaSince: '2018' },
    { id: 56, category: 'apparel', title: 'Trimmings Lace', price: 'GHS 18.00', moq: '55 Units', image: 'images/image4.jpg', supplier: 'Quality Goods Source', verified: false, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '87%', onAlibabaSince: '2019' },
    { id: 57, category: 'apparel', title: 'Ice Hockey Gear', price: 'GHS 120.00', moq: '15 Units', image: 'images/image5.jpg', supplier: 'Global Trade Co.', verified: true, bulkPricing: [{min:1,price:120},{min:50,price:114},{min:100,price:108},{min:500,price:102},{min:1000,price:96}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 58, category: 'apparel', title: 'Rhinestones Set', price: 'GHS 22.00', moq: '48 Units', image: 'images/image6.jpg' },
    { id: 59, category: 'apparel', title: 'Mens Sets', price: 'GHS 55.00', moq: '25 Units', image: 'images/image7.jpg' },
    { id: 60, category: 'apparel', title: 'Muslim Skirt', price: 'GHS 38.00', moq: '32 Units', image: 'images/image8.jpg' },
    { id: 61, category: 'apparel', title: 'Pirate Hat', price: 'GHS 18.00', moq: '50 Units', image: 'images/image9.jpg' },
    { id: 62, category: 'apparel', title: 'Dance Pants', price: 'GHS 35.00', moq: '35 Units', image: 'images/image10.jpg' },
    { id: 63, category: 'apparel', title: 'Tactical Clothes', price: 'GHS 75.00', moq: '22 Units', image: 'images/image11.jpg' },
    { id: 64, category: 'apparel', title: 'Fabric Belts', price: 'GHS 12.00', moq: '70 Units', image: 'images/image12.jpg' },
    { id: 65, category: 'apparel', title: 'Pilot Shirt', price: 'GHS 45.00', moq: '30 Units', image: 'images/image13.jpg' },
    
    // CONSUMER ELECTRONICS
    { id: 66, category: 'electronics', title: 'Speaker Driver', price: 'GHS 85.00', moq: '20 Units', image: 'images/SMART1.jpg' },
    { id: 67, category: 'electronics', title: 'Keyboard Switches', price: 'GHS 35.00', moq: '35 Units', image: 'images/SMART2.jpg' },
    { id: 68, category: 'electronics', title: 'TF Card Storage', price: 'GHS 22.00', moq: '50 Units', image: 'images/SMART3.jpg' },
    { id: 69, category: 'electronics', title: 'Camera Accessories', price: 'GHS 65.00', moq: '25 Units', image: 'images/SMAR4.jpg' },
    { id: 70, category: 'electronics', title: 'Smart Products', price: 'GHS 120.00', moq: '15 Units', image: 'images/SMART5.jpg' },
    { id: 71, category: 'electronics', title: 'Computer Accessories', price: 'GHS 45.00', moq: '30 Units', image: 'images/SMART6.jpg' },
    { id: 72, category: 'electronics', title: 'Software License', price: 'GHS 95.00', moq: '18 Units', image: 'images/SMART7.jpg' },
    { id: 73, category: 'electronics', title: 'Ethernet Adapter', price: 'GHS 28.00', moq: '40 Units', image: 'images/SMART8.jpg' },
    { id: 74, category: 'electronics', title: 'Satellite Multiswitch', price: 'GHS 55.00', moq: '25 Units', image: 'images/SMART9.jpg' },
    { id: 75, category: 'electronics', title: 'HD Camcorder', price: 'GHS 280.00', moq: '10 Units', image: 'images/SMART1.jpg' },
    { id: 76, category: 'electronics', title: 'UV Filter', price: 'GHS 18.00', moq: '55 Units', image: 'images/SMART2.jpg' },
    { id: 77, category: 'electronics', title: 'Camera Filters Set', price: 'GHS 42.00', moq: '28 Units', image: 'images/SMART3.jpg' },
    { id: 78, category: 'electronics', title: 'Soldering Mat', price: 'GHS 15.00', moq: '60 Units', image: 'images/SMAR4.jpg' },
    
    // HOME & GARDEN
    { id: 79, category: 'home', title: 'Snow Spray', price: 'GHS 12.00', moq: '70 Units', image: 'images/image1.jpg' },
    { id: 80, category: 'home', title: 'Blackout Curtain', price: 'GHS 45.00', moq: '30 Units', image: 'images/image2.jpg' },
    { id: 81, category: 'home', title: 'Smart Blinds', price: 'GHS 85.00', moq: '20 Units', image: 'images/image3.jpg' },
    { id: 82, category: 'home', title: 'Bouquet Flowers', price: 'GHS 28.00', moq: '40 Units', image: 'images/image4.jpg' },
    { id: 83, category: 'home', title: 'Curtains Set', price: 'GHS 55.00', moq: '25 Units', image: 'images/image5.jpg' },
    { id: 84, category: 'home', title: 'Bottle Container', price: 'GHS 8.00', moq: '80 Units', image: 'images/image6.jpg' },
    { id: 85, category: 'home', title: 'Roses Decoration', price: 'GHS 22.00', moq: '50 Units', image: 'images/image7.jpg' },
    { id: 86, category: 'home', title: 'Window Canopy', price: 'GHS 75.00', moq: '22 Units', image: 'images/image8.jpg' },
    { id: 87, category: 'home', title: 'Vertical Awning', price: 'GHS 95.00', moq: '18 Units', image: 'images/image9.jpg' },
    { id: 88, category: 'home', title: 'Automatic Curtain', price: 'GHS 120.00', moq: '15 Units', image: 'images/image10.jpg' },
    { id: 89, category: 'home', title: 'Blind Motor', price: 'GHS 68.00', moq: '22 Units', image: 'images/image11.jpg' },
    { id: 90, category: 'home', title: 'Valances Window', price: 'GHS 25.00', moq: '45 Units', image: 'images/image12.jpg' },
    { id: 91, category: 'home', title: 'Shade Cloth', price: 'GHS 18.00', moq: '55 Units', image: 'images/image13.jpg' },
    
    // SPORTSWEAR & OUTDOOR
    { id: 92, category: 'outdoor', title: 'Leg Warmers', price: 'GHS 18.00', moq: '50 Units', image: 'images/image1.jpg' },
    { id: 93, category: 'outdoor', title: 'Leg Massager', price: 'GHS 65.00', moq: '25 Units', image: 'images/image2.jpg' },
    { id: 94, category: 'outdoor', title: 'Knee Support', price: 'GHS 22.00', moq: '48 Units', image: 'images/image3.jpg' },
    { id: 95, category: 'outdoor', title: 'Barefoot Shoes', price: 'GHS 42.00', moq: '30 Units', image: 'images/image4.jpg' },
    { id: 96, category: 'outdoor', title: 'Volleyball Shoes', price: 'GHS 68.00', moq: '22 Units', image: 'images/image5.jpg' },
    { id: 97, category: 'outdoor', title: 'Souvenirs Collection', price: 'GHS 28.00', moq: '40 Units', image: 'images/image6.jpg' },
    { id: 98, category: 'outdoor', title: 'Football Boots Pro', price: 'GHS 88.00', moq: '18 Units', image: 'images/image7.jpg' },
    { id: 99, category: 'outdoor', title: 'Hockey Skate', price: 'GHS 120.00', moq: '15 Units', image: 'images/image8.jpg' },
    { id: 100, category: 'outdoor', title: 'MTB Shoes', price: 'GHS 75.00', moq: '20 Units', image: 'images/image9.jpg' },
    { id: 101, category: 'outdoor', title: 'Sports Gloves', price: 'GHS 25.00', moq: '42 Units', image: 'images/image10.jpg' },
    { id: 102, category: 'outdoor', title: 'Back Support Belt', price: 'GHS 32.00', moq: '35 Units', image: 'images/image11.jpg' },
    { id: 103, category: 'outdoor', title: 'Sweatband Set', price: 'GHS 12.00', moq: '60 Units', image: 'images/image12.jpg' },
    { id: 104, category: 'outdoor', title: 'Keeper Gloves', price: 'GHS 38.00', moq: '32 Units', image: 'images/image13.jpg' },
    
    // JEWELRY, EYEWEAR & WATCHES
    { id: 105, category: 'jewelry', title: 'Jewelry Tools Set', price: 'GHS 45.00', moq: '30 Units', image: 'images/image1.jpg', supplier: 'GemStone Ltd.', verified: true, bulkPricing: [{min:1,price:45},{min:50,price:42.75},{min:100,price:40.50},{min:500,price:38.25},{min:1000,price:36}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 106, category: 'jewelry', title: 'Acrylic Beads Bulk', price: 'GHS 15.00', moq: '65 Units', image: 'images/image2.jpg', supplier: 'BeadWorks Co.', verified: true, bulkPricing: [{min:1,price:15},{min:50,price:14.25},{min:100,price:13.50},{min:500,price:12.75},{min:1000,price:12}], responseRate: '94%', onAlibabaSince: '2018' },
    { id: 107, category: 'jewelry', title: 'Crystal Beads', price: 'GHS 22.00', moq: '50 Units', image: 'images/image3.jpg', supplier: 'GemStone Ltd.', verified: true, bulkPricing: [{min:1,price:22},{min:50,price:20.90},{min:100,price:19.80},{min:500,price:18.70},{min:1000,price:17.60}], responseRate: '92%', onAlibabaSince: '2019' },
    { id: 108, category: 'jewelry', title: 'Silicone Beads', price: 'GHS 12.00', moq: '70 Units', image: 'images/image4.jpg', supplier: 'BeadWorks Co.', verified: false, bulkPricing: [{min:1,price:12},{min:50,price:11.40},{min:100,price:10.80},{min:500,price:10.20},{min:1000,price:9.60}], responseRate: '86%', onAlibabaSince: '2019' },
    { id: 109, category: 'jewelry', title: 'Glass Beads', price: 'GHS 18.00', moq: '55 Units', image: 'images/image5.jpg', supplier: 'GemStone Ltd.', verified: true, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 110, category: 'jewelry', title: 'Charms Pendant', price: 'GHS 25.00', moq: '45 Units', image: 'images/image6.jpg', supplier: 'JewelCraft Inc.', verified: true, bulkPricing: [{min:1,price:25},{min:50,price:23.75},{min:100,price:22.50},{min:500,price:21.25},{min:1000,price:20}], responseRate: '93%', onAlibabaSince: '2018' },
    { id: 111, category: 'jewelry', title: 'Amber Stone', price: 'GHS 38.00', moq: '32 Units', image: 'images/image7.jpg', supplier: 'GemStone Ltd.', verified: true, bulkPricing: [{min:1,price:38},{min:50,price:36.10},{min:100,price:34.20},{min:500,price:32.30},{min:1000,price:30.40}], responseRate: '97%', onAlibabaSince: '2016' },
    { id: 112, category: 'jewelry', title: 'Hair Sticks', price: 'GHS 8.00', moq: '80 Units', image: 'images/image8.jpg', supplier: 'BeadWorks Co.', verified: true, bulkPricing: [{min:1,price:8},{min:50,price:7.60},{min:100,price:7.20},{min:500,price:6.80},{min:1000,price:6.40}], responseRate: '91%', onAlibabaSince: '2019' },
    { id: 113, category: 'jewelry', title: 'Headpiece Crown', price: 'GHS 28.00', moq: '40 Units', image: 'images/image9.jpg', supplier: 'JewelCraft Inc.', verified: true, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '94%', onAlibabaSince: '2017' },
    { id: 114, category: 'jewelry', title: 'Tourmaline Gem', price: 'GHS 55.00', moq: '25 Units', image: 'images/image10.jpg', supplier: 'GemStone Ltd.', verified: true, bulkPricing: [{min:1,price:55},{min:50,price:52.25},{min:100,price:49.50},{min:500,price:46.75},{min:1000,price:44}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 115, category: 'jewelry', title: 'Earring Cards', price: 'GHS 10.00', moq: '75 Units', image: 'images/image11.jpg', supplier: 'BeadWorks Co.', verified: false, bulkPricing: [{min:1,price:10},{min:50,price:9.50},{min:100,price:9},{min:500,price:8.50},{min:1000,price:8}], responseRate: '87%', onAlibabaSince: '2020' },
    { id: 116, category: 'jewelry', title: 'Turquoise Stone', price: 'GHS 42.00', moq: '28 Units', image: 'images/image12.jpg', supplier: 'JewelCraft Inc.', verified: true, bulkPricing: [{min:1,price:42},{min:50,price:39.90},{min:100,price:37.80},{min:500,price:35.70},{min:1000,price:33.60}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 117, category: 'jewelry', title: 'Christmas Jewelry', price: 'GHS 35.00', moq: '35 Units', image: 'images/image13.jpg', supplier: 'GemStone Ltd.', verified: true, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '96%', onAlibabaSince: '2018' },
    
    // LUGGAGE, BAGS & CASES
    { id: 118, category: 'bags', title: 'Beauty Case', price: 'GHS 35.00', moq: '32 Units', image: 'images/BAG1.jpg', supplier: 'BagMaster Ltd.', verified: true, bulkPricing: [{min:1,price:35},{min:50,price:33.25},{min:100,price:31.50},{min:500,price:29.75},{min:1000,price:28}], responseRate: '97%', onAlibabaSince: '2016' },
    { id: 119, category: 'bags', title: 'College Bag', price: 'GHS 45.00', moq: '28 Units', image: 'images/BAG2.jpg', supplier: 'TravelGear Co.', verified: true, bulkPricing: [{min:1,price:45},{min:50,price:42.75},{min:100,price:40.50},{min:500,price:38.25},{min:1000,price:36}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 120, category: 'bags', title: 'Cosmetic Case', price: 'GHS 28.00', moq: '40 Units', image: 'images/BAG3.jpg', supplier: 'BagMaster Ltd.', verified: true, bulkPricing: [{min:1,price:28},{min:50,price:26.60},{min:100,price:25.20},{min:500,price:23.80},{min:1000,price:22.40}], responseRate: '93%', onAlibabaSince: '2018' },
    { id: 121, category: 'bags', title: 'Bag Accessories', price: 'GHS 12.00', moq: '70 Units', image: 'images/BAG4.jpg', supplier: 'TravelGear Co.', verified: false, bulkPricing: [{min:1,price:12},{min:50,price:11.40},{min:100,price:10.80},{min:500,price:10.20},{min:1000,price:9.60}], responseRate: '86%', onAlibabaSince: '2019' },
    { id: 122, category: 'bags', title: 'Wine Bag', price: 'GHS 18.00', moq: '55 Units', image: 'images/BAG5.jpg', supplier: 'BagMaster Ltd.', verified: true, bulkPricing: [{min:1,price:18},{min:50,price:17.10},{min:100,price:16.20},{min:500,price:15.30},{min:1000,price:14.40}], responseRate: '92%', onAlibabaSince: '2018' },
    { id: 123, category: 'bags', title: 'Shoulder Bag', price: 'GHS 55.00', moq: '25 Units', image: 'images/BAG6.jpg', supplier: 'TravelGear Co.', verified: true, bulkPricing: [{min:1,price:55},{min:50,price:52.25},{min:100,price:49.50},{min:500,price:46.75},{min:1000,price:44}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 124, category: 'bags', title: 'Backpack Pro', price: 'GHS 65.00', moq: '22 Units', image: 'images/BAG7.jpg', supplier: 'BagMaster Ltd.', verified: true, bulkPricing: [{min:1,price:65},{min:50,price:61.75},{min:100,price:58.50},{min:500,price:55.25},{min:1000,price:52}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 125, category: 'bags', title: 'Bag Chain', price: 'GHS 8.00', moq: '80 Units', image: 'images/BAG8.jpg', supplier: 'TravelGear Co.', verified: true, bulkPricing: [{min:1,price:8},{min:50,price:7.60},{min:100,price:7.20},{min:500,price:6.80},{min:1000,price:6.40}], responseRate: '91%', onAlibabaSince: '2019' },
    { id: 126, category: 'bags', title: 'Shoulder Strap', price: 'GHS 10.00', moq: '75 Units', image: 'images/BAG9.jpg', supplier: 'BagMaster Ltd.', verified: false, bulkPricing: [{min:1,price:10},{min:50,price:9.50},{min:100,price:9},{min:500,price:8.50},{min:1000,price:8}], responseRate: '87%', onAlibabaSince: '2020' },
    { id: 127, category: 'bags', title: 'Lipstick Bags', price: 'GHS 22.00', moq: '48 Units', image: 'images/BAG10.jpg', supplier: 'TravelGear Co.', verified: true, bulkPricing: [{min:1,price:22},{min:50,price:20.90},{min:100,price:19.80},{min:500,price:18.70},{min:1000,price:17.60}], responseRate: '94%', onAlibabaSince: '2018' },
    { id: 128, category: 'bags', title: 'Luggage Scooter', price: 'GHS 95.00', moq: '18 Units', image: 'images/BAG11.jpg', supplier: 'BagMaster Ltd.', verified: true, bulkPricing: [{min:1,price:95},{min:50,price:90.25},{min:100,price:85.50},{min:500,price:80.75},{min:1000,price:76}], responseRate: '97%', onAlibabaSince: '2017' },
    { id: 129, category: 'bags', title: 'Lipstick Case', price: 'GHS 15.00', moq: '60 Units', image: 'images/BAG12.jpg', supplier: 'TravelGear Co.', verified: true, bulkPricing: [{min:1,price:15},{min:50,price:14.25},{min:100,price:13.50},{min:500,price:12.75},{min:1000,price:12}], responseRate: '93%', onAlibabaSince: '2018' },
    { id: 130, category: 'bags', title: 'Bag Handle', price: 'GHS 8.00', moq: '85 Units', image: 'images/BAG14.jpg', supplier: 'BagMaster Ltd.', verified: true, bulkPricing: [{min:1,price:8},{min:50,price:7.60},{min:100,price:7.20},{min:500,price:6.80},{min:1000,price:6.40}], responseRate: '90%', onAlibabaSince: '2019' },
    
    // PACKAGING & PRINTING
    { id: 131, category: 'printing', title: 'Cardboard Boxes', price: 'GHS 2.50', moq: '500 Units', image: 'images/image1.jpg', supplier: 'PackPro Ltd.', verified: true, bulkPricing: [{min:1,price:2.50},{min:500,price:2.38},{min:1000,price:2.25},{min:5000,price:2.13},{min:10000,price:2}], responseRate: '98%', onAlibabaSince: '2016' },
    { id: 132, category: 'printing', title: 'Paper Bags', price: 'GHS 1.20', moq: '1000 Units', image: 'images/image2.jpg', supplier: 'BoxCo Inc.', verified: true, bulkPricing: [{min:1,price:1.20},{min:1000,price:1.14},{min:5000,price:1.08},{min:10000,price:1.02},{min:50000,price:0.96}], responseRate: '96%', onAlibabaSince: '2017' },
    { id: 133, category: 'printing', title: 'Plastic Bags', price: 'GHS 0.80', moq: '2000 Units', image: 'images/image3.jpg', supplier: 'PackPro Ltd.', verified: true, bulkPricing: [{min:1,price:0.80},{min:2000,price:0.76},{min:10000,price:0.72},{min:50000,price:0.68},{min:100000,price:0.64}], responseRate: '95%', onAlibabaSince: '2017' },
    { id: 134, category: 'printing', title: 'Glass Bottles', price: 'GHS 3.50', moq: '300 Units', image: 'images/image4.jpg', supplier: 'BoxCo Inc.', verified: false, bulkPricing: [{min:1,price:3.50},{min:300,price:3.33},{min:1000,price:3.15},{min:5000,price:2.98},{min:10000,price:2.80}], responseRate: '88%', onAlibabaSince: '2019' },
    { id: 135, category: 'printing', title: 'Labels Stickers', price: 'GHS 0.15', moq: '5000 Units', image: 'images/image5.jpg', supplier: 'PackPro Ltd.', verified: true, bulkPricing: [{min:1,price:0.15},{min:5000,price:0.14},{min:10000,price:0.135},{min:50000,price:0.128},{min:100000,price:0.12}], responseRate: '97%', onAlibabaSince: '2016' },
    { id: 136, category: 'printing', title: 'Stickers Roll', price: 'GHS 0.25', moq: '3000 Units', image: 'images/image6.jpg' },
    { id: 137, category: 'printing', title: 'Bubble Wrap', price: 'GHS 45.00', moq: '50 Units', image: 'images/image7.jpg' },
    { id: 138, category: 'printing', title: 'Express Envelopes', price: 'GHS 0.50', moq: '2000 Units', image: 'images/image8.jpg' },
    { id: 139, category: 'printing', title: 'Gift Boxes', price: 'GHS 8.00', moq: '100 Units', image: 'images/image9.jpg' },
    { id: 140, category: 'printing', title: 'Wine Boxes', price: 'GHS 5.50', moq: '150 Units', image: 'images/image10.jpg' },
    { id: 141, category: 'printing', title: 'Jewelry Packaging', price: 'GHS 2.00', moq: '500 Units', image: 'images/image11.jpg' },
    
    // PERSONAL CARE & HOME CARE
    { id: 142, category: 'personal', title: 'Feminine Hygiene Products', price: 'GHS 25.00', moq: '40 Units', image: 'images/SPRAY1.jpg' },
    { id: 143, category: 'personal', title: 'Laundry Soap', price: 'GHS 8.00', moq: '100 Units', image: 'images/SPRAY2.jpg' },
    { id: 144, category: 'personal', title: 'After Shave Cologne', price: 'GHS 35.00', moq: '30 Units', image: 'images/SPRAY3.jpg' },
    { id: 145, category: 'personal', title: 'Hair Extension Tools', price: 'GHS 45.00', moq: '25 Units', image: 'images/SPRAY1.jpg' },
    { id: 146, category: 'personal', title: 'Washing Powder', price: 'GHS 15.00', moq: '60 Units', image: 'images/SPRAY2.jpg' },
    { id: 147, category: 'personal', title: 'Aftershave Lotion', price: 'GHS 32.00', moq: '35 Units', image: 'images/SPRAY3.jpg' },
    { id: 148, category: 'personal', title: 'Perfume Oil', price: 'GHS 28.00', moq: '40 Units', image: 'images/SPRAY1.jpg' },
    { id: 149, category: 'personal', title: 'Sea Salt', price: 'GHS 12.00', moq: '70 Units', image: 'images/SPRAY2.jpg' },
    { id: 150, category: 'personal', title: 'Hair Relaxers', price: 'GHS 38.00', moq: '32 Units', image: 'images/SPRAY3.jpg' },
    { id: 151, category: 'personal', title: 'Breath Fresheners', price: 'GHS 8.00', moq: '80 Units', image: 'images/SPRAY1.jpg' },
    { id: 152, category: 'personal', title: 'Detergent Sheets', price: 'GHS 18.00', moq: '55 Units', image: 'images/SPRAY2.jpg' },
    { id: 153, category: 'personal', title: 'Detangling Brush', price: 'GHS 12.00', moq: '65 Units', image: 'images/SPRAY3.jpg' },
    { id: 154, category: 'personal', title: 'Hair Mousse', price: 'GHS 22.00', moq: '45 Units', image: 'images/SPRAY1.jpg' },
    
    // HEALTH & MEDICAL
    { id: 155, category: 'health', title: 'ECG Machine', price: 'GHS 850.00', moq: '5 Units', image: 'images/image1.jpg' },
    { id: 156, category: 'health', title: 'Insulin Syringe', price: 'GHS 15.00', moq: '100 Units', image: 'images/image2.jpg' },
    { id: 157, category: 'health', title: 'Medical Consumables', price: 'GHS 35.00', moq: '50 Units', image: 'images/image3.jpg' },
    { id: 158, category: 'health', title: 'Rehabilitation Equipment', price: 'GHS 280.00', moq: '10 Units', image: 'images/image4.jpg' },
    { id: 159, category: 'health', title: 'Veterinary Medicine', price: 'GHS 65.00', moq: '30 Units', image: 'images/image5.jpg' },
    { id: 160, category: 'health', title: 'Massage Products', price: 'GHS 45.00', moq: '35 Units', image: 'images/image6.jpg' },
    { id: 161, category: 'health', title: 'Medical Stretcher', price: 'GHS 180.00', moq: '12 Units', image: 'images/image7.jpg' },
    { id: 162, category: 'health', title: 'Acupuncture Machine', price: 'GHS 120.00', moq: '15 Units', image: 'images/image8.jpg' },
    { id: 163, category: 'health', title: 'Rehabilitation Therapy Supplies', price: 'GHS 85.00', moq: '20 Units', image: 'images/image9.jpg' },
    { id: 164, category: 'health', title: 'Wheelchair Parts', price: 'GHS 55.00', moq: '25 Units', image: 'images/image10.jpg' },
    { id: 165, category: 'health', title: 'Scalpel Blade', price: 'GHS 8.00', moq: '100 Units', image: 'images/image11.jpg' },
    { id: 166, category: 'health', title: 'Sleeping Aid', price: 'GHS 38.00', moq: '40 Units', image: 'images/image12.jpg' },
    { id: 167, category: 'health', title: 'Pathological Analysis Equipment', price: 'GHS 450.00', moq: '8 Units', image: 'images/image13.jpg' },
    
    // GIFTS & CRAFTS
    { id: 168, category: 'gifts', title: 'Name Tag', price: 'GHS 2.00', moq: '200 Units', image: 'images/image1.jpg' },
    { id: 169, category: 'gifts', title: 'Promotional Business Gifts', price: 'GHS 15.00', moq: '60 Units', image: 'images/image2.jpg' },
    { id: 170, category: 'gifts', title: 'Amethyst Stone', price: 'GHS 28.00', moq: '40 Units', image: 'images/image3.jpg' },
    { id: 171, category: 'gifts', title: 'Key Chain', price: 'GHS 5.00', moq: '150 Units', image: 'images/image4.jpg' },
    { id: 172, category: 'gifts', title: 'Gift Sets Collection', price: 'GHS 45.00', moq: '30 Units', image: 'images/image5.jpg' },
    { id: 173, category: 'gifts', title: 'Flags Pack', price: 'GHS 12.00', moq: '70 Units', image: 'images/image6.jpg' },
    { id: 174, category: 'gifts', title: 'Metal Crafts', price: 'GHS 35.00', moq: '35 Units', image: 'images/image7.jpg' },
    { id: 175, category: 'gifts', title: 'Buffalo Figurine', price: 'GHS 22.00', moq: '45 Units', image: 'images/image8.jpg' },
    { id: 176, category: 'gifts', title: 'Nameplate', price: 'GHS 18.00', moq: '55 Units', image: 'images/image9.jpg' },
    { id: 177, category: 'gifts', title: 'Lucky Cat Statue', price: 'GHS 28.00', moq: '40 Units', image: 'images/image10.jpg' },
    { id: 178, category: 'gifts', title: 'Plastic Key Chains', price: 'GHS 3.00', moq: '180 Units', image: 'images/image11.jpg' },
    { id: 179, category: 'gifts', title: 'Crystal Stone', price: 'GHS 32.00', moq: '38 Units', image: 'images/image12.jpg' },
    { id: 180, category: 'gifts', title: 'Leather Crafts', price: 'GHS 48.00', moq: '28 Units', image: 'images/image13.jpg' },
    
    // PET SUPPLIES
    { id: 181, category: 'pet', title: 'Dog Food', price: 'GHS 35.00', moq: '40 Units', image: 'images/image1.jpg' },
    { id: 182, category: 'pet', title: 'Hamster Cage', price: 'GHS 45.00', moq: '30 Units', image: 'images/image2.jpg' },
    { id: 183, category: 'pet', title: 'Dog Kennel', price: 'GHS 120.00', moq: '15 Units', image: 'images/image3.jpg' },
    { id: 184, category: 'pet', title: 'Aquarium Filter', price: 'GHS 55.00', moq: '25 Units', image: 'images/image4.jpg' },
    { id: 185, category: 'pet', title: 'Cat Tree', price: 'GHS 85.00', moq: '20 Units', image: 'images/image5.jpg' },
    { id: 186, category: 'pet', title: 'Pet Accessories', price: 'GHS 22.00', moq: '50 Units', image: 'images/image6.jpg' },
    { id: 187, category: 'pet', title: 'Aquariums', price: 'GHS 95.00', moq: '18 Units', image: 'images/image7.jpg' },
    { id: 188, category: 'pet', title: 'Saltwater Aquarium', price: 'GHS 180.00', moq: '10 Units', image: 'images/image8.jpg' },
    { id: 189, category: 'pet', title: 'Dog Ramp', price: 'GHS 65.00', moq: '22 Units', image: 'images/image9.jpg' },
    { id: 190, category: 'pet', title: 'Sponge Filter', price: 'GHS 18.00', moq: '55 Units', image: 'images/image10.jpg' },
    { id: 191, category: 'pet', title: 'Cat Toy', price: 'GHS 12.00', moq: '70 Units', image: 'images/image11.jpg' },
    { id: 192, category: 'pet', title: 'Dog Car Seat', price: 'GHS 75.00', moq: '20 Units', image: 'images/image12.jpg' },
    { id: 193, category: 'pet', title: 'Dog Crate', price: 'GHS 95.00', moq: '18 Units', image: 'images/image13.jpg' },
    
    // SCHOOL & OFFICE
    { id: 194, category: 'school', title: 'Water Color Set', price: 'GHS 18.00', moq: '55 Units', image: 'images/image1.jpg' },
    { id: 195, category: 'school', title: 'Paper Punch', price: 'GHS 12.00', moq: '65 Units', image: 'images/image2.jpg' },
    { id: 196, category: 'school', title: 'Bible Cover', price: 'GHS 15.00', moq: '60 Units', image: 'images/image3.jpg' },
    { id: 197, category: 'school', title: 'Cutting Plotter', price: 'GHS 280.00', moq: '10 Units', image: 'images/image4.jpg' },
    { id: 198, category: 'school', title: 'Art Supplies', price: 'GHS 35.00', moq: '35 Units', image: 'images/image5.jpg' },
    { id: 199, category: 'school', title: 'Erasers Pack', price: 'GHS 5.00', moq: '150 Units', image: 'images/image6.jpg' },
    { id: 200, category: 'school', title: 'Medical Science Kit', price: 'GHS 45.00', moq: '30 Units', image: 'images/image7.jpg' },
    { id: 201, category: 'school', title: 'World Globe', price: 'GHS 38.00', moq: '32 Units', image: 'images/image8.jpg' },
    { id: 202, category: 'school', title: 'Sketch Pad', price: 'GHS 12.00', moq: '70 Units', image: 'images/image9.jpg' },
    { id: 203, category: 'school', title: 'Watercolor Paper', price: 'GHS 15.00', moq: '60 Units', image: 'images/image10.jpg' },
    { id: 204, category: 'school', title: 'ID Badge Holder', price: 'GHS 8.00', moq: '100 Units', image: 'images/image11.jpg' },
    { id: 205, category: 'school', title: 'Binder Clips', price: 'GHS 5.00', moq: '180 Units', image: 'images/image12.jpg' },
    { id: 206, category: 'school', title: 'Cork Board', price: 'GHS 22.00', moq: '48 Units', image: 'images/image13.jpg' },
    
    // INDUSTRIAL MACHINERY
    { id: 207, category: 'industrial', title: 'Air Dryer', price: 'GHS 450.00', moq: '8 Units', image: 'images/image1.jpg' },
    { id: 208, category: 'industrial', title: 'Farm Trailers', price: 'GHS 850.00', moq: '5 Units', image: 'images/image2.jpg' },
    { id: 209, category: 'industrial', title: 'Agriculture Products', price: 'GHS 120.00', moq: '15 Units', image: 'images/image3.jpg' },
    { id: 210, category: 'industrial', title: 'Grinder Machine', price: 'GHS 280.00', moq: '10 Units', image: 'images/image4.jpg' },
    { id: 211, category: 'industrial', title: 'Gasoline Engine', price: 'GHS 380.00', moq: '8 Units', image: 'images/image5.jpg' },
    { id: 212, category: 'industrial', title: 'Crystallizers', price: 'GHS 650.00', moq: '5 Units', image: 'images/image6.jpg' },
    { id: 213, category: 'industrial', title: 'Air Curtain', price: 'GHS 180.00', moq: '12 Units', image: 'images/image7.jpg' },
    { id: 214, category: 'industrial', title: 'Boiler Parts', price: 'GHS 95.00', moq: '18 Units', image: 'images/image8.jpg' },
    { id: 215, category: 'industrial', title: 'Shredder Blades', price: 'GHS 55.00', moq: '25 Units', image: 'images/image9.jpg' },
    { id: 216, category: 'industrial', title: 'Machine Tools Accessories', price: 'GHS 75.00', moq: '22 Units', image: 'images/image10.jpg' },
    { id: 217, category: 'industrial', title: 'Worm Gears', price: 'GHS 85.00', moq: '20 Units', image: 'images/image11.jpg' },
    { id: 218, category: 'industrial', title: 'Ultrasonic Extractor', price: 'GHS 320.00', moq: '8 Units', image: 'images/image12.jpg' },
    { id: 219, category: 'industrial', title: 'Shafts', price: 'GHS 45.00', moq: '30 Units', image: 'images/image13.jpg' },
    
    // FURNITURE
    { id: 220, category: 'furniture', title: 'Office Chairs', price: 'GHS 120.00', moq: '15 Units', image: 'images/image1.jpg' },
    { id: 221, category: 'furniture', title: 'Sofas Set', price: 'GHS 450.00', moq: '8 Units', image: 'images/image2.jpg' },
    { id: 222, category: 'furniture', title: 'Dining Tables', price: 'GHS 280.00', moq: '10 Units', image: 'images/image3.jpg' },
    { id: 223, category: 'furniture', title: 'Beds', price: 'GHS 350.00', moq: '8 Units', image: 'images/image4.jpg' },
    { id: 224, category: 'furniture', title: 'Cabinets', price: 'GHS 180.00', moq: '12 Units', image: 'images/image5.jpg' },
    { id: 225, category: 'furniture', title: 'Desks', price: 'GHS 150.00', moq: '14 Units', image: 'images/image6.jpg' },
    { id: 226, category: 'furniture', title: 'Mattresses', price: 'GHS 220.00', moq: '12 Units', image: 'images/image7.jpg' },
    { id: 227, category: 'furniture', title: 'Outdoor Furniture', price: 'GHS 280.00', moq: '10 Units', image: 'images/image8.jpg' },
    { id: 228, category: 'furniture', title: 'Kids Furniture', price: 'GHS 95.00', moq: '18 Units', image: 'images/image9.jpg' },
    { id: 229, category: 'furniture', title: 'Hotel Furniture', price: 'GHS 550.00', moq: '5 Units', image: 'images/image10.jpg' },
    
    // LIGHTS & LIGHTING
    { id: 230, category: 'lighting', title: 'LED Bulbs', price: 'GHS 8.00', moq: '100 Units', image: 'images/image1.jpg' },
    { id: 231, category: 'lighting', title: 'Smart Lighting', price: 'GHS 45.00', moq: '30 Units', image: 'images/image2.jpg' },
    { id: 232, category: 'lighting', title: 'Outdoor Lamps', price: 'GHS 65.00', moq: '25 Units', image: 'images/image3.jpg' },
    { id: 233, category: 'lighting', title: 'Chandeliers', price: 'GHS 180.00', moq: '12 Units', image: 'images/image4.jpg' },
    { id: 234, category: 'lighting', title: 'Solar Lights', price: 'GHS 38.00', moq: '35 Units', image: 'images/image5.jpg' },
    { id: 235, category: 'lighting', title: 'Flashlights', price: 'GHS 15.00', moq: '60 Units', image: 'images/image6.jpg' },
    { id: 236, category: 'lighting', title: 'Stage Lighting', price: 'GHS 120.00', moq: '15 Units', image: 'images/image7.jpg' },
    { id: 237, category: 'lighting', title: 'Grow Lights', price: 'GHS 85.00', moq: '20 Units', image: 'images/image8.jpg' },
    { id: 238, category: 'lighting', title: 'Night Lights', price: 'GHS 12.00', moq: '70 Units', image: 'images/image9.jpg' },
    
    // HOME APPLIANCES
    { id: 239, category: 'appliances', title: 'Air Conditioners', price: 'GHS 850.00', moq: '5 Units', image: 'images/image1.jpg' },
    { id: 240, category: 'appliances', title: 'Refrigerators', price: 'GHS 680.00', moq: '6 Units', image: 'images/image2.jpg' },
    { id: 241, category: 'appliances', title: 'Washing Machines', price: 'GHS 450.00', moq: '8 Units', image: 'images/image3.jpg' },
    { id: 242, category: 'appliances', title: 'Microwaves', price: 'GHS 180.00', moq: '12 Units', image: 'images/image4.jpg' },
    { id: 243, category: 'appliances', title: 'Vacuum Cleaners', price: 'GHS 120.00', moq: '15 Units', image: 'images/image5.jpg' },
    { id: 244, category: 'appliances', title: 'Water Heaters', price: 'GHS 95.00', moq: '18 Units', image: 'images/image6.jpg' },
    { id: 245, category: 'appliances', title: 'Blenders', price: 'GHS 45.00', moq: '30 Units', image: 'images/image7.jpg' },
    { id: 246, category: 'appliances', title: 'Coffee Makers', price: 'GHS 75.00', moq: '22 Units', image: 'images/image8.jpg' },
    
    // AUTOMOTIVE & TOOLS
    { id: 247, category: 'automotive', title: 'Car Chargers', price: 'GHS 15.00', moq: '60 Units', image: 'images/image1.jpg' },
    { id: 248, category: 'automotive', title: 'Diagnostic Tools', price: 'GHS 180.00', moq: '12 Units', image: 'images/image2.jpg' },
    { id: 249, category: 'automotive', title: 'Tire Pressure Gauges', price: 'GHS 18.00', moq: '55 Units', image: 'images/image3.jpg' },
    { id: 250, category: 'automotive', title: 'Car Vacuum', price: 'GHS 65.00', moq: '25 Units', image: 'images/image4.jpg' },
    { id: 251, category: 'automotive', title: 'Wrench Sets', price: 'GHS 45.00', moq: '30 Units', image: 'images/image5.jpg' },
    { id: 252, category: 'automotive', title: 'Screwdrivers Set', price: 'GHS 25.00', moq: '45 Units', image: 'images/image6.jpg' },
    { id: 253, category: 'automotive', title: 'Jump Starters', price: 'GHS 95.00', moq: '18 Units', image: 'images/image7.jpg' },
    { id: 254, category: 'automotive', title: 'Dash Cams', price: 'GHS 85.00', moq: '20 Units', image: 'images/image8.jpg' },
    
    // RENEWABLE ENERGY
    { id: 255, category: 'renewable', title: 'Water Turbine', price: 'GHS 450.00', moq: '8 Units', image: 'images/image1.jpg' },
    { id: 256, category: 'renewable', title: 'Rechargeable Batteries', price: 'GHS 35.00', moq: '35 Units', image: 'images/image2.jpg' },
    { id: 257, category: 'renewable', title: 'Hydro Generator', price: 'GHS 680.00', moq: '5 Units', image: 'images/image3.jpg' },
    { id: 258, category: 'renewable', title: 'Wind Turbine', price: 'GHS 850.00', moq: '5 Units', image: 'images/image4.jpg' },
    { id: 259, category: 'renewable', title: 'Battery Pack', price: 'GHS 120.00', moq: '15 Units', image: 'images/image5.jpg' },
    { id: 260, category: 'renewable', title: 'Solar Panels', price: 'GHS 450.00', moq: '8 Units', image: 'images/image6.jpg' },
    { id: 261, category: 'renewable', title: 'Solar Energy System', price: 'GHS 1200.00', moq: '3 Units', image: 'images/image7.jpg' },
    { id: 262, category: 'renewable', title: 'Magnet Generator', price: 'GHS 380.00', moq: '8 Units', image: 'images/image8.jpg' },
    { id: 263, category: 'renewable', title: 'Solar Cells', price: 'GHS 280.00', moq: '10 Units', image: 'images/image9.jpg' },
    { id: 264, category: 'renewable', title: 'Solar Charger', price: 'GHS 65.00', moq: '25 Units', image: 'images/image10.jpg' },
];

// Category data with keywords for auto-generation
const categoryData = {
    apparel: { keywords: ['T-Shirt', 'Shirt', 'Jeans', 'Hoodie', 'Jacket', 'Dress', 'Skirt', 'Pants', 'Sweater', 'Coat', 'Blouse', 'Shorts'], moqSuffix: 'Units' },
    shoes: { keywords: ['Sneakers', 'Boots', 'Sandals', 'Heels', 'Loafers', 'Slippers', 'Running Shoes', 'Formal Shoes', 'Sports Shoes', 'Canvas'], moqSuffix: 'Pairs' },
    bags: { keywords: ['Backpack', 'Handbag', 'Wallet', 'Travel Bag', 'Clutch', 'Messenger Bag', 'Tote Bag', 'Laptop Bag', 'Duffel Bag', 'Crossbody'], moqSuffix: 'Units' },
    electronics: { keywords: ['Phone Case', 'Charger', 'Cable', 'Headphones', 'Earbuds', 'Speaker', 'Smart Watch', 'Power Bank', 'USB Drive', 'Mouse'], moqSuffix: 'Units' },
    beauty: { keywords: ['Skincare', 'Makeup', 'Hair Care', 'Perfume', 'Lotion', 'Cream', 'Serum', 'Moisturizer', 'Sunscreen', 'Lipstick'], moqSuffix: 'Units' },
    home: { keywords: ['Lamp', 'Cushion', 'Blanket', 'Curtain', 'Rug', 'Mirror', 'Vase', 'Clock', 'Frame', 'Organizer'], moqSuffix: 'Units' },
    industrial: { keywords: ['Machine', 'Tool', 'Equipment', 'Parts', 'Component', 'Hardware', 'Material', 'Supply', 'Device', 'Instrument'], moqSuffix: 'Units' },
    sports: { keywords: ['Ball', 'Racket', 'Mat', 'Weights', 'Bike', 'Helmet', 'Gloves', 'Shoes', 'Bag', 'Accessories'], moqSuffix: 'Units' },
    health: { keywords: ['Mask', 'Gloves', 'Bandage', 'Thermometer', 'Blood Pressure', 'Stethoscope', 'Scale', 'Massager', 'Device', 'Supplies'], moqSuffix: 'Units' },
    gifts: { keywords: ['Toy', 'Game', 'Book', 'Art', 'Craft', 'Decoration', 'Party', 'Seasonal', 'Personalized', 'Premium'], moqSuffix: 'Units' },
    toys: { keywords: ['Toy', 'Blocks', 'Doll', 'Puzzle', 'Game', 'Bike', 'Stroller', 'Car', 'Kit', 'Pool'], moqSuffix: 'Units' },
    outdoor: { keywords: ['Jersey', 'Leggings', 'Backpack', 'Tent', 'Helmet', 'Gear', 'Bag', 'Vest', 'Poles', 'Cones'], moqSuffix: 'Units' },
    jewelry: { keywords: ['Necklace', 'Earrings', 'Bracelet', 'Watch', 'Ring', 'Pendant', 'Sunglasses', 'Pouch', 'Box', 'Beads'], moqSuffix: 'Units' },
    printing: { keywords: ['Box', 'Bag', 'Bottle', 'Label', 'Envelope', 'Wrap', 'Box', 'Pouch', 'Sticker', 'Box'], moqSuffix: 'Units' },
    personal: { keywords: ['Hygiene', 'Soap', 'Shampoo', 'Lotion', 'Cream', 'Perfume', 'Brush', 'Tools', 'Oil', 'Salt'], moqSuffix: 'Units' },
    pet: { keywords: ['Food', 'Cage', 'Kennel', 'Filter', 'Tree', 'Accessories', 'Tank', 'Ramp', 'Toy', 'Crate'], moqSuffix: 'Units' },
    school: { keywords: ['Pen', 'Notebook', 'Paper', 'Marker', 'Scissors', 'Glue', 'Eraser', 'Folder', 'Binder', 'Board'], moqSuffix: 'Units' },
    furniture: { keywords: ['Chair', 'Table', 'Desk', 'Sofa', 'Bed', 'Cabinet', 'Shelf', 'Lamp', 'Mirror', 'Couch'], moqSuffix: 'Units' },
    lighting: { keywords: ['LED', 'Bulb', 'Lamp', 'Chandelier', 'Light', 'Flashlight', 'Tube', 'Strip', 'Panel', 'Solar'], moqSuffix: 'Units' },
    appliances: { keywords: ['AC', 'Fridge', 'Washer', 'Microwave', 'Heater', 'Blender', 'Iron', 'Cleaner', 'Maker', 'Oven'], moqSuffix: 'Units' },
    automotive: { keywords: ['Charger', 'Tool', 'Gauge', 'Vacuum', 'Wrench', 'Screwdriver', 'Jump Starter', 'Camera', 'Mount', 'Cover'], moqSuffix: 'Units' },
    renewable: { keywords: ['Turbine', 'Battery', 'Panel', 'Solar', 'Generator', 'Charger', 'Cell', 'Inverter', 'Controller', 'Kit'], moqSuffix: 'Units' }
};

// Image mapping for each category
const categoryImages = {
    apparel: [
        'images/SHOE1.jpg', 'images/SHOE2.jpg', 'images/SHOE3.jpg', 'images/SHOE 4.jpg',
        'images/SHOE5.jpg', 'images/SHOE6.jpg', 'images/SHOE7.jpg', 'images/SHOE8.jpg',
        'images/SHOE9.jpg', 'images/SHOE10.jpg', 'images/SHOE11.jpg', 'images/SHOE12.jpg',
        'images/SHOE13.jpg', 'images/SHOE14.jpg', 'images/SHOE15.jpg', 'images/SHOE16.jpg',
        'images/SHOE17.jpg', 'images/SHOE18.jpg', 'images/SHOE19.jpg', 'images/SHOE20.jpg',
        'images/SHOE21.jpg', 'images/SHOE22.jpg', 'images/SHOE23.jpg', 'images/SHOE24.jpg',
        'images/SHOE25.jpg', 'images/SHOE26.jpg', 'images/SHOE27.jpg', 'images/SHOE28.jpg',
        'images/SHOE29.jpg', 'images/SHOE30.jpg', 'images/SHOE31.jpg', 'images/SHOE32.jpg',
        'images/SHOE33.jpg', 'images/SHOE34.jpg', 'images/SHOE35.jpg', 'images/SHOE36.jpg',
        'images/SHOE37.jpg', 'images/SHOE38.jpg', 'images/SHOE39.jpg', 'images/SHOE40.jpg',
        'images/SHOE340#.jpg'
    ],
    bags: [
        'images/BAG1.jpg', 'images/BAG2.jpg', 'images/BAG3.jpg', 'images/BAG4.jpg',
        'images/BAG5.jpg', 'images/BAG6.jpg', 'images/BAG7.jpg', 'images/BAG8.jpg',
        'images/BAG9.jpg', 'images/BAG10.jpg', 'images/BAG11.jpg', 'images/BAG12.jpg',
        'images/BAG14.jpg', 'images/BAG15.jpg', 'images/BAG16.jpg', 'images/BAG17.jpg',
        'images/BAG18.jpg', 'images/BAG19.jpg', 'images/BAG20.jpg', 'images/BAG21.jpg',
        'images/BAG22.jpg', 'images/BAG23.jpg', 'images/BAG24.jpg', 'images/BAG25.jpg',
        'images/BAG26.jpg', 'images/BAG29.jpg', 'images/BAG30.jpg',
        'images/BAGS26.jpg', 'images/BAGS27.jpg', 'images/BAGS28.jpg'
    ],
    shoes: [
        'images/SHOE1.jpg', 'images/SHOE2.jpg', 'images/SHOE3.jpg', 'images/SHOE 4.jpg',
        'images/SHOE5.jpg', 'images/SHOE6.jpg', 'images/SHOE7.jpg', 'images/SHOE8.jpg',
        'images/SHOE9.jpg', 'images/SHOE10.jpg', 'images/SHOE11.jpg', 'images/SHOE12.jpg',
        'images/SHOE13.jpg', 'images/SHOE14.jpg', 'images/SHOE15.jpg', 'images/SHOE16.jpg',
        'images/SHOE17.jpg', 'images/SHOE18.jpg', 'images/SHOE19.jpg', 'images/SHOE20.jpg',
        'images/SHOE21.jpg', 'images/SHOE22.jpg', 'images/SHOE23.jpg', 'images/SHOE24.jpg',
        'images/SHOE25.jpg', 'images/SHOE26.jpg', 'images/SHOE27.jpg', 'images/SHOE28.jpg',
        'images/SHOE29.jpg', 'images/SHOE30.jpg', 'images/SHOE31.jpg', 'images/SHOE32.jpg',
        'images/SHOE33.jpg', 'images/SHOE34.jpg', 'images/SHOE35.jpg', 'images/SHOE36.jpg',
        'images/SHOE37.jpg', 'images/SHOE38.jpg', 'images/SHOE39.jpg', 'images/SHOE40.jpg',
        'images/SHOE340#.jpg'
    ],
    electronics: [
        'images/SMART1.jpg', 'images/SMART2.jpg', 'images/SMART3.jpg', 'images/SMAR4.jpg',
        'images/SMART5.jpg', 'images/SMART6.jpg', 'images/SMART7.jpg', 'images/SMART8.jpg',
        'images/SMART9.jpg'
    ],
    beauty: [
        'images/SPRAY1.jpg', 'images/SPRAY2.jpg', 'images/SPRAY3.jpg'
    ],
    home: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    gifts: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    toys: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    outdoor: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    jewelry: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    printing: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    personal: [
        'images/SPRAY1.jpg', 'images/SPRAY2.jpg', 'images/SPRAY3.jpg', 'images/image1.jpg',
        'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg', 'images/image5.jpg',
        'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg', 'images/image9.jpg',
        'images/image10.jpg', 'images/image11.jpg'
    ],
    pet: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    school: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    furniture: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    lighting: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    appliances: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    automotive: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    renewable: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ]
};

// Create a hash from string function for consistent unique image selection
function stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Generate catalog
const generatedCatalog = [];
const catKeysAvailable = Object.keys(categoryData);

for (let i = 16; i <= 5000; i++) {
    const key = catKeysAvailable[i % catKeysAvailable.length];
    const cat = categoryData[key];
    const itemKeyword = cat.keywords[i % cat.keywords.length];

    // Get image from category mapping
    const catImages = categoryImages[key] || [];
    const keywordHash = stringToHash(itemKeyword);
    const localImageIndex = catImages.length > 0 ? keywordHash % catImages.length : -1;
    const mappedImage = catImages.length > 0 ? catImages[localImageIndex] : '';

    // Use Unsplash with unique sig based on keyword hash
    const uniqueSig = keywordHash + (i * 1000);
    const unsplashUrl = `https://images.unsplash.com/featured/400x400?${encodeURIComponent(itemKeyword)}&sig=${uniqueSig}`;
    
    // Generate supplier info (Alibaba-style)
    const suppliers = ['Global Trade Co.', 'Premium Suppliers Ltd.', 'Factory Direct Inc.', 'Wholesale Hub', 'Prime Manufacturing', 'Elite Exports', 'Mega Bulk Traders', 'Quality Goods Source'];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const isVerified = Math.random() > 0.3; // 70% verified
    
    // Generate bulk pricing tiers (Alibaba-style)
    const basePrice = Math.random() * 500 + 50;
    const bulkPricing = [
        { min: 1, price: basePrice },
        { min: 50, price: basePrice * 0.95 },
        { min: 100, price: basePrice * 0.90 },
        { min: 500, price: basePrice * 0.85 },
        { min: 1000, price: basePrice * 0.80 }
    ];
    
    generatedCatalog.push({
        id: i,
        category: key,
        title: `Wholesale ${itemKeyword} (Order #${i})`,
        price: `GHS ${basePrice.toFixed(2)}`,
        moq: `${Math.floor(Math.random() * 200 + 10)} ${cat.moqSuffix || 'Units'}`,
        image: mappedImage || unsplashUrl,
        stockImage: unsplashUrl,
        // Alibaba-style additions
        supplier: supplier,
        verified: isVerified,
        bulkPricing: bulkPricing,
        responseRate: Math.floor(Math.random() * 30 + 70) + '%',
        onAlibabaSince: '2019'
    });
}

const catalog = [...manualCatalog, ...generatedCatalog];

// Render Engine
function renderProducts(filterCategory = null, keywordFilter = null, targetGridId = 'productGrid', limit = null) {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;

    grid.innerHTML = '';
    let filtered = catalog;

    if (filterCategory) {
        filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (keywordFilter) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keywordFilter.toLowerCase()));
    }

    // Limit display for performance
    const isHomePage = (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/'));
    const defaultLimit = isHomePage ? 48 : filtered.length;
    const finalLimit = limit || defaultLimit;

    filtered.slice(0, finalLimit).forEach(product => {
        const card = document.createElement('a');
        card.href = `product.html?id=${product.id}`;
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" loading="lazy" alt="${product.title}" 
                     onerror="this.src='${PLACEHOLDER_IMAGE}'; this.onerror=null;"
                     onclick="event.preventDefault(); event.stopPropagation(); handleProductClick(${product.id})"
                     style="cursor: pointer;"
                     title="Click to buy now">
                <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart(${product.id});" title="Add to Cart">
                    <ion-icon name="cart-outline"></ion-icon> Add to Cart
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-price">${product.price}</span>
                <span class="product-moq">${product.moq}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    let activeCat = params.get('cat');
    let keywordSubFilter = params.get('search');

    if (!activeCat) {
        if (path.includes('apparel')) activeCat = 'apparel';
        else if (path.includes('shoes')) activeCat = 'shoes';
        else if (path.includes('electronics')) activeCat = 'electronics';
        else if (path.includes('bags')) activeCat = 'bags';
        else if (path.includes('beauty')) activeCat = 'beauty';
        else if (path.includes('home')) activeCat = 'home';
        else if (path.includes('industrial')) activeCat = 'industrial';
        else if (path.includes('medical')) activeCat = 'health';
        else if (path.includes('sports')) activeCat = 'sports';
        else if (path.includes('mobile')) {
            activeCat = 'electronics';
            keywordSubFilter = 'Smartphone';
        }
    }

    renderProducts(activeCat, keywordSubFilter);

    // Populate Deals if on Index
    if (document.getElementById('dealsGrid')) {
        renderProducts('electronics', null, 'dealsGrid', 6);
    }

    // Detail Page Logic
    if (path.includes('product.html')) {
        const params = new URLSearchParams(window.location.search);
        const prodId = parseInt(params.get('id'));
        const product = catalog.find(p => p.id === prodId) || catalog[0];

        const t = document.getElementById('productTitle');
        const p = document.getElementById('productPrice');
        const im = document.querySelector('.main-image');
        const m = document.querySelector('.product-moq');

        if (t) t.innerText = product.title;
        if (p) p.innerText = product.price;
        if (m) m.innerText = product.moq;
        if (im) im.innerHTML = `<img id="mainImg" src="${product.image}" onerror="this.src='${product.stockImage || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'}'; this.onerror=null;">`;
    }

    updateCartBadge();

    // Search Bar Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                renderProducts(null, query);
                const grid = document.getElementById('productGrid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }
        };
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Load popular suppliers
    if (document.getElementById('popularSuppliers')) {
        const supplierGrid = document.getElementById('popularSuppliers');
        supplierGrid.innerHTML = suppliers.slice(0, 8).map(renderSupplierCard).join('');
    }

    // Load recommended products
    if (document.getElementById('recommendedProducts')) {
        renderProducts(null, null, 'recommendedProducts', 8);
    }
});

// Cart Functions
function addToCart(productId) {
    const product = catalog.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('alfredCart', JSON.stringify(cart));
    updateCartBadge();
    showCartNotification();
}

// Add product to cart by details (for inline products)
function addProductToCart(category, title, price, description, image) {
    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    
    // Create a unique ID based on title
    const productId = 'prod_' + title.replace(/\s+/g, '_').toLowerCase();
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: productId,
            category: category, 
            title: title, 
            price: typeof price === 'number' ? 'GHS ' + price.toFixed(2) : price, 
            description: description, 
            image: image,
            quantity: 1 
        });
    }

    localStorage.setItem('alfredCart', JSON.stringify(cart));
    updateCartBadge();
    showCartNotification();
}

// Show cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#0abf53;color:white;padding:15px 25px;border-radius:8px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:slideIn 0.3s ease;';
    notification.innerHTML = '<span style="margin-right:10px;">✓</span>Added to cart! <a href="cart.html" style="color:white;text-decoration:underline;margin-left:10px;">View Cart</a>';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// View cart and checkout
function viewCart() {
    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let modal = document.getElementById('cartModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.style.cssText = 'display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;';
        document.body.appendChild(modal);
    }
    
    let total = 0;
    let deliveryFee = 15;
    let itemsHTML = cart.map((item, index) => {
        const price = parseFloat(item.price.replace('GHS ', '').replace(/,/g, ''));
        const itemTotal = price * item.quantity;
        total += itemTotal;
        return `
            <div style="display:flex;gap:15px;padding:15px;border-bottom:1px solid #eee;align-items:center;">
                <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
                <div style="flex:1;">
                    <h4 style="margin:0 0 5px 0;font-size:14px;">${item.title}</h4>
                    <p style="margin:0;color:#666;font-size:12px;">${item.category}</p>
                    <p style="margin:5px 0 0 0;font-weight:bold;color:#0abf53;">GHS ${price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <button onclick="changeQuantity(${index}, -1)" style="width:30px;height:30px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" style="width:30px;height:30px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">+</button>
                    <button onclick="removeFromCart(${index})" style="margin-left:10px;color:red;border:none;background:none;cursor:pointer;font-size:18px;">×</button>
                </div>
            </div>
        `;
    }).join('');
    
    const grandTotal = total + deliveryFee;
    
    modal.innerHTML = `
        <div style="background:white;padding:30px;border-radius:16px;width:95%;max-width:600px;max-height:90vh;overflow-y:auto;position:relative;">
            <button onclick="closeCartModal()" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;">×</button>
            <h2 style="margin-bottom:20px;">Shopping Cart (${cart.length} items)</h2>
            
            <div style="max-height:300px;overflow-y:auto;border:1px solid #eee;border-radius:8px;">
                ${itemsHTML}
            </div>
            
            <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <span>Subtotal</span>
                    <span>GHS ${total.toFixed(2)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <span>Delivery Fee</span>
                    <span>GHS ${deliveryFee.toFixed(2)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:bold;border-top:1px solid #ddd;padding-top:10px;">
                    <span>Total</span>
                    <span style="color:#0abf53;">GHS ${grandTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <button onclick="checkoutCart()" style="width:100%;margin-top:20px;padding:16px;background:#0abf53;color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;">
                <ion-icon name="lock-closed-outline" style="vertical-align:middle;margin-right:8px;"></ion-icon>
                Pay with Paystack (GHS ${grandTotal.toFixed(2)})
            </button>
            <button onclick="closeCartModal()" style="width:100%;margin-top:10px;padding:12px;background:white;color:#666;border:1px solid #ddd;border-radius:10px;font-size:14px;cursor:pointer;">Continue Shopping</button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('alfredCart', JSON.stringify(cart));
        updateCartBadge();
        viewCart();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('alfredCart', JSON.stringify(cart));
    updateCartBadge();
    viewCart();
}

function checkoutCart() {
    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    closeCartModal();
    
    // Open delivery form for cart checkout
    let modal = document.getElementById('deliveryModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'deliveryModal';
        modal.style.cssText = 'display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;';
        document.body.appendChild(modal);
    }
    
    let total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('GHS ', '').replace(/,/g, '')) * item.quantity, 0);
    const deliveryFee = 15;
    const grandTotal = total + deliveryFee;
    
    modal.innerHTML = `
        <div style="background:white;padding:30px;border-radius:16px;width:90%;max-width:500px;max-height:90vh;overflow-y:auto;position:relative;">
            <button onclick="closeDeliveryForm()" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;">×</button>
            <h2 style="margin-bottom:20px;">Checkout - ${cart.length} Items</h2>
            
            <div style="max-height:150px;overflow-y:auto;margin-bottom:20px;border:1px solid #eee;border-radius:8px;padding:10px;">
                ${cart.map(item => `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${item.title} x${item.quantity}</span><span>GHS ${(parseFloat(item.price.replace('GHS ', '').replace(/,/g, '')) * item.quantity).toFixed(2)}</span></div>`).join('')}
            </div>
            
            <form id="cartCheckoutForm" onsubmit="event.preventDefault(); processCartPayment();">
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;font-weight:500;">Full Name *</label>
                    <input type="text" id="cartFullName" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;font-weight:500;">Phone Number *</label>
                    <input type="tel" id="cartPhone" required placeholder="0551234567" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;font-weight:500;">Region *</label>
                    <select id="cartRegion" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;background:white;">
                        <option value="">Select Region</option>
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                        <option value="Central">Central</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Western">Western</option>
                        <option value="Volta">Volta</option>
                        <option value="Northern">Northern</option>
                        <option value="Upper East">Upper East</option>
                        <option value="Upper West">Upper West</option>
                    </select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;font-weight:500;">City/Town *</label>
                    <input type="text" id="cartCity" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;">
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:5px;font-weight:500;">Delivery Address *</label>
                    <textarea id="cartAddress" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;height:80px;"></textarea>
                </div>
                
                <div style="background:#f0fdf4;padding:15px;border-radius:10px;margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span>Subtotal</span>
                        <span>GHS ${total.toFixed(2)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span>Delivery Fee</span>
                        <span>GHS ${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:bold;border-top:1px solid #ddd;padding-top:10px;">
                        <span>Total</span>
                        <span style="color:#0abf53;">GHS ${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
                
                <button type="submit" style="width:100%;padding:16px;background:#0abf53;color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;">
                    <ion-icon name="lock-closed-outline" style="vertical-align:middle;margin-right:8px;"></ion-icon>
                    Pay with Paystack
                </button>
            </form>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function processCartPayment() {
    const fullName = document.getElementById('cartFullName').value;
    const phone = document.getElementById('cartPhone').value;
    const region = document.getElementById('cartRegion').value;
    const city = document.getElementById('cartCity').value;
    const address = document.getElementById('cartAddress').value;
    
    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    let total = cart.reduce((sum, item) => sum + parseFloat(String(item.price).replace('GHS ', '').replace(/,/g, '')) * item.quantity, 0);
    const deliveryFee = 15;
    const grandTotal = Math.round((total + deliveryFee) * 100); // Convert to pesewas
    
    if (typeof PaystackPop === 'undefined') {
        alert('Paystack is not loaded. Please refresh and try again.');
        return;
    }
    
    const currentUser = typeof firebase !== 'undefined' ? firebase.auth().currentUser : null;
    
    let handler = PaystackPop.setup({
        key: 'pk_live_f89c4456a0860888a7fe1b1451f2808c32493',
        email: currentUser ? currentUser.email : 'customer@alfredproducts.com',
        amount: grandTotal,
        currency: 'GHS',
        ref: 'ALF_CART_' + Math.floor((Math.random() * 1e9) + 1),
        metadata: {
            custom_fields: [
                { display_name: 'Customer', variable_name: 'customer_name', value: fullName },
                { display_name: 'Phone', variable_name: 'phone', value: phone },
                { display_name: 'Items', variable_name: 'item_count', value: cart.length + ' items' },
                { display_name: 'Region', variable_name: 'region', value: region },
                { display_name: 'Address', variable_name: 'address', value: address + ', ' + city }
            ]
        },
        callback: function (response) {
            console.log('Cart payment success, ref:', response.reference);
            
            // Normalise cart items for admin dashboard display
            const normalisedItems = cart.map(item => ({
                title: item.title || item.name || 'Product',
                price: parseFloat(String(item.price).replace('GHS ', '').replace(/,/g, '')) || 0,
                quantity: item.quantity || 1,
                image: item.image || ''
            }));
            
            const orderData = {
                items: normalisedItems,
                total: (total + deliveryFee).toFixed(2),
                reference: response.reference,
                delivery: { fullName, phone, region, city, address },
                userName: fullName,
                status: 'Paid',
                orderDate: new Date().toISOString()
            };
            
            // Save to Firestore via the shared function
            saveOrderToFirestore(orderData);
            
            localStorage.setItem('alfredCart', JSON.stringify([]));
            updateCartBadge();
            closeDeliveryForm();
            
            setTimeout(function() { window.location.href = 'orders.html'; }, 1500);
        },
        onClose: function() {
            console.log('Cart payment dialog closed.');
        }
    });
    
    handler.openIframe();
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badges = document.querySelectorAll('#cartBadge, #cartCount');
    badges.forEach(badge => {
        if (badge) badge.textContent = totalItems;
    });
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('alfredWishlist')) || [];
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('alfredWishlist', JSON.stringify(wishlist));
        alert('Product added to wishlist!');
    } else {
        alert('Product is already in your wishlist!');
    }
}

// Validate Cart and Pay Function
function validateAndPay() {
    validateCartAndPay();
}

function validateCartAndPay() {
    const form = document.getElementById('deliveryForm');
    if (!form || !form.checkValidity()) {
        form ? form.reportValidity() : alert('Please fill in all delivery details.');
        return;
    }

    const deliveryInfo = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        whatsappNumber: document.getElementById('whatsappNumber').value || 'N/A',
        region: document.getElementById('region').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value
    };

    localStorage.setItem('tempDeliveryInfo', JSON.stringify(deliveryInfo));
    payWithPaystack();
}

function payWithPaystack() {
    const params = new URLSearchParams(window.location.search);
    const prodId = parseInt(params.get('id'));
    const product = (catalog && catalog.find(p => p.id === prodId)) || {
        title: params.get('title') || 'Product',
        price: 'GHS ' + (params.get('price') || '0'),
        image: params.get('image') || '',
        category: params.get('category') || ''
    };

    const deliveryInfo = JSON.parse(localStorage.getItem('tempDeliveryInfo'));
    if (!deliveryInfo) {
        alert('Missing delivery information.');
        return;
    }

    const priceStr = String(product.price || '0').replace('GHS', '').replace(/,/g, '').trim();
    const priceNum = parseFloat(priceStr) || 0;
    const amount = Math.round(priceNum * 100);

    const currentUser = firebase.auth().currentUser;

    let handler = PaystackPop.setup({
        key: 'pk_live_6b9968065dc0bd4842c97ffa138e49127c862888',
        email: (currentUser ? currentUser.email : 'customer@alfredproducts.com'),
        amount: amount,
        currency: "GHS",
        ref: 'ALF_' + Math.floor((Math.random() * 1e9) + 1),
        metadata: {
            custom_fields: [
                { display_name: "Customer", variable_name: "customer_name", value: deliveryInfo.fullName },
                { display_name: "Phone", variable_name: "phone", value: deliveryInfo.phoneNumber },
                { display_name: "Address", variable_name: "address", value: (deliveryInfo.address || '') + ', ' + (deliveryInfo.city || '') }
            ]
        },
        callback: function (response) {
            console.log('Paystack payment success, ref:', response.reference);
            
            const orderData = {
                items: [{ title: product.title, price: priceNum, quantity: 1, image: product.image || '', category: product.category || '' }],
                total: priceNum.toFixed(2),
                reference: response.reference,
                delivery: deliveryInfo,
                userName: deliveryInfo.fullName,
                status: 'Paid'
            };
            
            // Wait for Firestore save to complete before redirecting
            saveOrderToFirestore(orderData)
                .then(function(docId) {
                    console.log('Order saved to Firestore with ID:', docId);
                    localStorage.removeItem('tempDeliveryInfo');
                    window.location.href = 'orders.html';
                })
                .catch(function(error) {
                    console.error('Failed to save order to Firestore:', error);
                    localStorage.removeItem('tempDeliveryInfo');
                    window.location.href = 'orders.html';
                });
        },
        onClose: function() {
            console.log('Payment dialog closed.');
        }
    });
    handler.openIframe();
}

// Tab and Gallery Logic
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) tabcontent[i].classList.remove("active");
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function changeImage(type) {
    const mainImg = document.getElementById('mainImg');
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    if (type === 'hero') thumbs[0].classList.add('active');
    else if (type === 'thumb1') {
        mainImg.src = 'thumbnew_logo.png';
        thumbs[1].classList.add('active');
    }
}

// Save order to Firestore (works for ALL customers - logged in or not)
function saveOrderToFirestore(orderData) {
    console.log('saveOrderToFirestore called with:', orderData);
    
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded!');
        alert('Error: Firebase not loaded. Order saved locally only.');
        saveOrderLocally(orderData);
        return;
    }
    
    try {
        // Ensure Firebase is initialized
        if (!firebase.apps.length) {
            console.log('Initializing Firebase...');
            firebase.initializeApp({
                apiKey: "AIzaSyBMhNFK9ueVA6-1i22Z_NbGV_50Uy0xXjQ",
                authDomain: "project-4da600f0-7b2b-45f4-808.firebaseapp.com",
                projectId: "project-4da600f0-7b2b-45f4-808",
                storageBucket: "project-4da600f0-7b2b-45f4-808.firebasestorage.app",
                messagingSenderId: "531999731190",
                appId: "1:531999731190:web:098953626b761eafb62bd7"
            });
        }
        
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;
        const guestId = 'GUEST_' + Date.now();
        
        console.log('Current user:', user ? user.email : 'Guest (no login)');
        
        // Build a clean order record compatible with admin dashboard
        const orderRecord = {
            items: orderData.items || [],
            total: orderData.total || '0.00',
            reference: orderData.reference || ('REF_' + Date.now()),
            status: orderData.status || 'Paid',
            delivery: orderData.delivery || {},
            userId: user ? user.uid : (localStorage.getItem('alfredGuestId') || guestId),
            userEmail: user ? user.email : (orderData.delivery && orderData.delivery.email ? orderData.delivery.email : 'guest@alfredproducts.com'),
            userName: orderData.userName || (orderData.delivery ? orderData.delivery.fullName : (user ? (user.displayName || user.email) : 'Guest Customer')),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('Writing to Firestore orders collection:', orderRecord);
        
        db.collection('orders').add(orderRecord)
        .then((docRef) => {
            console.log('ORDER SAVED TO FIRESTORE! Doc ID:', docRef.id);
            // Always save locally as a backup copy
            saveOrderLocally({...orderRecord, id: docRef.id, timestamp: new Date().toISOString()});
            if (!orderData._silentSave) {
                alert('Order saved successfully! Ref: ' + orderRecord.reference);
            }
        })
        .catch((error) => {
            console.error('Firestore save failed:', error.code, error.message);
            alert('WARNING: Could not sync order to database.\nError: ' + error.message + '\n\nYour order is saved on this device.');
            saveOrderLocally(orderRecord);
        });
    } catch (error) {
        console.error('Exception in saveOrderToFirestore:', error);
        saveOrderLocally(orderData);
    }
}

// Backup function to save orders locally
function saveOrderLocally(orderData) {
    const localOrders = JSON.parse(localStorage.getItem('alfredOrders') || '[]');
    localOrders.unshift(orderData);
    localStorage.setItem('alfredOrders', JSON.stringify(localOrders));
    console.log('Order saved to localStorage');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { catalog, renderProducts, addToCart, updateCartBadge };
}
