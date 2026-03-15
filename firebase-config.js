<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Featured Products - ALFRED PRODUCTS</title>
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#FF6600">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" href="1.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="firebase-config.js"></script>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-top">
                <div class="logo">
                   <a href="index.html"><a href="index.html"><img src="1.png" alt="ALFRED PRODUCTS Logo"></a></a>
                </div>
                <div class="header-actions">
                    <a href="login.html" class="action-item">
                        <ion-icon name="person-outline"></ion-icon>
                        <span>Sign In</span>
                    </a>
                    <a href="messages.html" class="action-item">
                        <ion-icon name="mail-outline"></ion-icon>
                        <span>Messages</span>
                    </a>
                    <a href="orders.html" class="action-item">
                        <ion-icon name="cart-outline"></ion-icon>
                        <span>Orders</span>
                    </a>
                </div>
            </div>
            <nav>
                <ul>
                    <li><a href="categories.html">All Categories</a></li>
                    <li><a href="featured.html" class="active">Featured Products</a></li>
                    <li><a href="trade.html">Trade Assurance</a></li>
                    <li><a href="logistics.html">Logistics Services</a></li>
                    <li><a href="help.html">Help Center</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container" style="padding: 40px 0;">
        <div style="background: linear-gradient(135deg, #FF6600 0%, #FF9900 100%); padding: 60px; border-radius: 12px; color: white; margin-bottom: 40px; text-align: center;">
            <h1 style="font-size: 36px; margin-bottom: 10px;">Weekly Featured Products</h1>
            <p>Our handpicked selection of premium quality items from verified suppliers.</p>
        </div>

        <div class="product-grid" id="productGrid">
            <!-- Interactivity from script.js will load products here -->
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>






