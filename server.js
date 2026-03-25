const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Middleware
app.use(express.static(path.join(__dirname, './')));
app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
    // Content Security Policy - prevents XSS by controlling resource loading
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://www.gstatic.com https://js.paystack.co https://cdn.tailwindcss.com https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.paystack.co; " +
        "frame-ancestors 'none';"
    );
    
    // X-Content-Type-Options - prevents MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options - prevents clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection - legacy browser XSS filtering
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy - controls referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy - controls browser features
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Strict-Transport-Security (HSTS) - enforces HTTPS
    // Note: Only enable in production after testing
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    next();
});

// HTTPS enforcement middleware (for production)
// Note: In production, configure behind a load balancer or reverse proxy
app.use((req, res, next) => {
    // Skip HTTPS redirect for localhost development
    if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
        return next();
    }
    
    // Check if request is already HTTPS
    if (req.get('X-Forwarded-Proto') === 'https' || req.protocol === 'https') {
        return next();
    }
    
    // Redirect to HTTPS
    res.redirect('https://' + req.hostname + req.url);
});

// Input sanitization middleware
app.use((req, res, next) => {
    // Sanitize URL parameters to prevent XSS
    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                // Remove script tags and event handlers
                req.query[key] = req.query[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/on\w+="[^"]*"/gi, '')
                    .replace(/on\w+='[^']*'/gi, '');
            }
        }
    }
    next();
});

// Product Generation Logic (Moved from Frontend)
const categoryData = {
    apparel: {
        keywords: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Dress", "Skirt", "Shorts", "Sweater", "Graduation Cap", "Cheongsam", "Sequins", "Trimmings", "Ice Hockey", "Rhinestones", "Men's Sets", "Muslim Skirt", "Pirate Hat", "Dance Pants", "Tactical Clothes", "Fabric Belts", "Pilot Shirt"],
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518", "https://images.unsplash.com/photo-1551028719-00167b16eac5", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"],
        moqSuffix: "Pieces"
    },
    shoes: {
        keywords: ["Sneakers", "Running Shoes", "Leather Boots", "Sandals", "Loafers", "Heels", "Home Slippers", "Fur Slippers", "Moccasin Slippers", "Moccasins", "Flats", "Slides Slippers", "Clogs Shoes", "Summer Sandals", "Beach Slippers", "Indoor Slippers", "Women Slides"],
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff", "https://images.unsplash.com/photo-1560769629-975ec94e6a86", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"],
        moqSuffix: "Pairs"
    },
    electronics: {
        keywords: ["Smartphone", "Laptop", "Smart Watch", "Bluetooth Earbuds", "Drone", "VR Headset", "Gaming Console", "Speaker Driver", "Keyboard switches", "Tf Card", "Camera Accessories", "Smart Products", "Computer Accessories", "Software", "Ethernet Adapter", "Satellite Multiswitch", "Hd Camcorder", "Uv Filter", "Camera Filters", "Soldering Mat"],
        images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2"],
        moqSuffix: "Units"
    },
    bags: {
        keywords: ["Leather Backpack", "Luxury Handbag", "Travel Suitcase", "Tote Bag", "Messenger Bag", "Beauty Case", "College Bag", "Cosmetic Case", "Bag Accessories", "Wine Bag", "Shoulder Bag", "Backpack", "Bag Chain", "Shoulder Strap", "Lipstick Bags", "Luggage Scooter", "Lipstick Case", "Bag Handle"],
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa", "https://images.unsplash.com/photo-1584917865442-de89df76afd3", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3"],
        moqSuffix: "Pieces"
    },
    beauty: {
        keywords: ["Perfume Gift Sets", "Perfume Set", "Body Mist", "Women's Perfume", "Deodorant Spray", "Deodorant", "Men's Perfume", "Cosmetic", "Nail Equipments", "Hair Removal Machine", "Makeup Sets", "Antiperspirant", "Nail Supplies", "Feminine Hygiene Products", "Laundry Soap", "After Shave Cologne", "Hair Extension Tools", "Washing Powder", "Aftershave", "Perfume Oil", "Sea Salt", "Hair Relaxers", "Breath Fresheners", "Detergent Sheets", "Detangling Brush", "Hair Mousse"],
        images: ["https://images.unsplash.com/photo-1541643600914-78b084683601", "https://images.unsplash.com/photo-1560869713-7d0a29430803", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"],
        moqSuffix: "Units"
    },
    home: {
        keywords: ["Orthopedic Mattress", "Memory Foam Pillow", "Duvet Cover", "Bedding Set", "Luxury Sofa", "Snow Spray", "Blackout Curtain", "Smart Blinds", "Bouquet", "Curtains", "Bottle", "Roses", "Window Canopy", "Vertical Awning", "Automatic Curtain", "Blind Motor", "Valances", "Shade Cloth"],
        images: ["https://images.unsplash.com/photo-1616046229478-9901c5536a45", "https://images.unsplash.com/photo-1505673539012-ee21ffb70029", "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1"],
        moqSuffix: "Sets"
    },
    sports: {
        keywords: ["Camping Gear", "Fishing Accessories", "Novelties", "Step Platforms", "Bows", "Diving Reel", "Shot Put", "Tennis Net", "Flying Car", "Suspension Trainers", "Amusement Park Products", "Volleyball Shoes", "Football Boots", "Hockey Skate", "Mtb Shoes", "Sports Gloves", "Sweatband", "Keeper Gloves"],
        images: ["https://images.unsplash.com/photo-1461896756913-c82ee49b5ae2", "https://images.unsplash.com/photo-1517649763962-0c623066013b"],
        moqSuffix: "Units"
    },
    industrial: {
        keywords: ["Welding Machine", "Laser Welders", "Air Dryer", "Farm Trailers", "Agriculture Products", "Grinder Machine", "Gasoline Engine", "Crystallizers", "Air Curtain", "Plastic Welders", "TIG Welders", "Arc Welders", "Welding Robot", "Spot Welders", "Juice Dispenser", "Food Cart", "Food Trailer"],
        images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad"],
        moqSuffix: "Units"
    },
    health: {
        keywords: ["Ecg Machine", "Insulin Syringe", "Medical Consumables", "Rehabilitation Equipment", "Veterinary Medicine", "Massage Products", "Stretcher", "Acupuncture Machine", "Scalpel Blade", "Sleeping Aid", "Pathological Analysis Equipments"],
        images: ["https://images.unsplash.com/photo-1505751172876-fa1923c5c528", "https://images.unsplash.com/photo-1584362917165-526a968579e8"],
        moqSuffix: "Units"
    },
    gifts: {
        keywords: ["Name Tag", "Promotional Business Gifts", "Amethyst", "Key Chain", "Gift Sets", "Flags", "Metal Crafts", "Lucky Cat", "Crystal Stone", "Leather Crafts", "Jewelry Tools", "Acrylic beads", "Crystal Beads", "Charms", "Amber", "Hair Sticks", "Headpiece", "Tourmaline"],
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48"],
        moqSuffix: "Pieces"
    },
    pet: {
        keywords: ["Dog Food", "Hamster Cage", "Dog Kennel", "Aquarium Filter", "Cat Tree", "Pet Accessories", "Aquariums", "Saltwater Aquarium", "Dog Ramp", "Sponge Filter", "Cat Toy", "Dog Car Seat", "Dog Crate"],
        images: ["https://images.unsplash.com/photo-1516734212186-a967f81ad0d7", "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"],
        moqSuffix: "Units"
    },
    school: {
        keywords: ["Water Color", "Paper Punch", "Bible Cover", "Cutting Plotter", "Art Supplies", "Erasers", "Medical Science", "World Globe", "Sketch Pad", "Watercolor Paper", "Id Badge Holder", "Binder Clips", "Cork Board"],
        images: ["https://images.unsplash.com/photo-1456735190827-d1262f71b8a3", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"],
        moqSuffix: "Units"
    },
    energy: {
        keywords: ["Water Turbine", "Rechargeable Batteries", "Hydro Generator", "Wind Turbine", "Battery", "Solar Panels", "Solar Energy System", "Magnet Generator", "Solar Cells", "Solar Charger", "Solar Tracker", "Turbine Generator", "Solar Kits"],
        images: ["https://images.unsplash.com/photo-1509391366360-1e96230e7fa1", "https://images.unsplash.com/photo-1466611653911-954ff21b6748"],
        moqSuffix: "Units"
    },
    electrical: {
        keywords: ["Winding Wire", "Wall Socket", "Electrical Switch", "Transformers", "Cable Connector", "Welding Cable", "Gasoline Generators", "Bnc Connector", "Generator Parts", "Aluminum Box", "Fuse Box"],
        images: ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e", "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e"],
        moqSuffix: "Units"
    },
    safety: {
        keywords: ["Work Clothing", "Parking Barrier", "Locksmith Tools", "Keys", "Locksmith Supplies", "Nvr", "Spy Camera", "Latch", "Smart Card Reader", "Rim Lock", "Military Supplies", "Reflective Fabric", "Lightning Rods"],
        images: ["https://images.unsplash.com/photo-1557597774-9d2739f8ft19", "https://images.unsplash.com/photo-1614064641938-3bbee52942c7"],
        moqSuffix: "Units"
    },
    vehicles: {
        keywords: ["Sport Car", "Pit Bike", "Used Motorcycles", "Motorcycle", "Trailers", "Electric Truck", "ATVs", "Suv Car", "Pick Up Truck", "Utility Trailer", "Dump Trailer", "Tow Truck", "Hybrid Car"],
        images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"],
        moqSuffix: "Units"
    },
    agriculture: {
        keywords: ["Absinthe", "Dory", "Coconut Water", "Vanilla Beans", "Cardamom", "Cloves", "Saffron", "Mooncakes", "Mussel", "Ramune", "Condensed Milk", "Logs", "Betel Nuts"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62", "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2"],
        moqSuffix: "kg"
    },
    service: {
        keywords: ["Fashion Design", "PC Games", "Quality Control", "Wix", "AI Chatbot", "Taobao Agent", "1688 Agent"],
        images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3", "https://images.unsplash.com/photo-1551836022-d5d88e9218df"],
        moqSuffix: "Service"
    }
};

const catalog = [];
const categories = Object.keys(categoryData);

for (let i = 1; i <= 800; i++) {
    const catKeys = categories[i % categories.length];
    const cat = categoryData[catKeys];
    const keyword = cat.keywords[i % cat.keywords.length];
    const imgBase = cat.images[i % cat.images.length];
    
    catalog.push({
        id: i,
        category: catKeys,
        title: `Wholesale ${keyword} - High Quality Premium ${i}`,
        price: `GHS ${(Math.random() * 500 + 50).toFixed(2)} - GHS ${(Math.random() * 1000 + 600).toFixed(2)}`,
        moq: `${Math.floor(Math.random() * 200 + 10)} ${cat.moqSuffix}`,
        image: `${imgBase}?auto=format&fit=crop&q=80&w=400`
    });
}

// API Endpoints
app.get('/api/products', (req, res) => {
    const { category, limit, minPrice, maxPrice } = req.query;
    let results = catalog;
    
    if (category) {
        results = results.filter(p => p.category === category);
    }
    
    // Server-side price validation - prevent manipulated prices
    if (minPrice || maxPrice) {
        results = results.filter(p => {
            // Extract price number from price string (e.g., "GHS 120.00 - GHS 200.00" -> 120)
            const priceMatch = p.price.match(/GHS\s*([\d.]+)/);
            if (!priceMatch) return true;
            
            const price = parseFloat(priceMatch[1]);
            if (minPrice && price < parseFloat(minPrice)) return false;
            if (maxPrice && price > parseFloat(maxPrice)) return false;
            return true;
        });
    }
    
    if (limit) {
        const parsedLimit = parseInt(limit);
        // Limit max results to prevent abuse
        results = results.slice(0, Math.min(parsedLimit, 100));
    }
    
    res.json(results);
});

app.get('/api/products/:id', (req, res) => {
    const product = catalog.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Fallback for HTML pages - with path traversal protection
app.get('*', (req, res) => {
    let requestedPath = req.path;
    
    // Prevent path traversal attacks
    if (requestedPath.includes('..') || requestedPath.includes('\\')) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    // Only allow access to files in the allowed list
    const allowedExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.json', '.ico'];
    const fileExt = path.extname(requestedPath).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
        return res.status(403).json({ message: 'File type not allowed' });
    }
    
    const filePath = path.join(__dirname, requestedPath.endsWith('.html') ? requestedPath : requestedPath + '.html');
    
    // Ensure the resolved path is within the project directory
    if (!filePath.startsWith(__dirname)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
