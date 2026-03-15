const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, './')));
app.use(express.json());

// Product Generation Logic (Moved from Frontend)
const categoryData = {
    apparel: {
        keywords: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Dress", "Skirt", "Shorts", "Sweater"],
        images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105"
        ],
        moqSuffix: "Pieces"
    },
    shoes: {
        keywords: ["Sneakers", "Running Shoes", "Leather Boots", "Sandals", "Loafers", "Heels", "Canvas Shoes"],
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
        ],
        moqSuffix: "Pairs"
    },
    electronics: {
        keywords: ["Smartphone", "Laptop", "Smart Watch", "Bluetooth Earbuds", "Drone", "VR Headset", "Gaming Console", "Tablet"],
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2"
        ],
        moqSuffix: "Units"
    },
    bags: {
        keywords: ["Leather Backpack", "Luxury Handbag", "Travel Suitcase", "Tote Bag", "Messenger Bag", "Wallet"],
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3"
        ],
        moqSuffix: "Pieces"
    },
    beauty: {
        keywords: ["Perfume", "Facial Serum", "Lipstick Set", "Makeup Brush", "Hair Extensions", "Human Hair Wig", "Lace Front Wig"],
        images: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
            "https://images.unsplash.com/photo-1594465919760-441fe5908ab0",
            "https://images.unsplash.com/photo-1560869713-7d0a29430803"
        ],
        moqSuffix: "Units"
    },
    home: {
        keywords: ["Orthopedic Mattress", "Memory Foam Pillow", "Duvet Cover", "Bedding Set", "Luxury Sofa", "Office Chair"],
        images: [
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
            "https://images.unsplash.com/photo-1505673539012-ee21ffb70029",
            "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1"
        ],
        moqSuffix: "Sets"
    },
    mobile: {
        keywords: ["Phone Case", "Screen Protector", "USB-C Cable", "Fast Charger", "Phone Stand", "Power Bank"],
        images: [
            "https://images.unsplash.com/photo-1551816230-ef5deaed4a26",
            "https://images.unsplash.com/photo-1601784551446-20c9e07cdbea",
            "https://images.unsplash.com/photo-1504274066654-52ffaf15438d"
        ],
        moqSuffix: "Pieces"
    }
};

const catalog = [];
const categories = Object.keys(categoryData);

for (let i = 1; i <= 400; i++) {
    const catKeys = categories[i % categories.length];
    const cat = categoryData[catKeys];
    const keyword = cat.keywords[i % cat.keywords.length];
    const imgBase = cat.images[i % cat.images.length];
    
    catalog.push({
        id: i,
        category: catKeys,
        title: `Wholesale ${keyword} - High Quality Premium ${i}`,
        price: `$${(Math.random() * 50 + 2).toFixed(2)} - $${(Math.random() * 100 + 52).toFixed(2)}`,
        moq: `${Math.floor(Math.random() * 200 + 10)} ${cat.moqSuffix}`,
        image: `${imgBase}?auto=format&fit=crop&q=80&w=400`
    });
}

// API Endpoints
app.get('/api/products', (req, res) => {
    const { category, limit } = req.query;
    let results = catalog;
    
    if (category) {
        results = results.filter(p => p.category === category);
    }
    
    if (limit) {
        results = results.slice(0, parseInt(limit));
    }
    
    res.json(results);
});

app.get('/api/products/:id', (req, res) => {
    const product = catalog.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Fallback for HTML pages
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path.endsWith('.html') ? req.path : req.path + '.html');
    res.sendFile(filePath);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
