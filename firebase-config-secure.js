// Firebase Configuration - SECURE VERSION
// IMPORTANT: Replace these values with environment variables or use Firebase Functions
// Do NOT expose API keys in client-side code in production

// Check for environment variables first (for production)
const firebaseConfig = {
    apiKey: import.meta?.env?.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
    authDomain: import.meta?.env?.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta?.env?.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta?.env?.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: import.meta?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta?.env?.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Admin email for reference (should be managed via Custom Claims in production)
const ADMIN_EMAIL = 'admin@yourdomain.com'; // Replace with your admin email

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Function to check admin status using Custom Claims (SECURE)
// Admin status should be set via Firebase Admin SDK on the server side
async function checkAdminStatus(user) {
    if (!user) return false;
    
    try {
        // Get the ID token result which includes custom claims
        const idTokenResult = await user.getIdTokenResult();
        return idTokenResult.claims.admin === true;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// DEPRECATED: Client-side admin check is insecure
// This function is kept for backward compatibility but should NOT be used
// Use checkAdminStatus() instead which uses Custom Claims
function isClientSideAdmin(userEmail) {
    console.warn('WARNING: Client-side admin check is insecure. Use Custom Claims instead.');
    return false; // Always return false - admin status should be server-side
}

// Google Sign-In Logic
function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .then(async (result) => {
            const user = result.user;
            // Check admin status using secure Custom Claims
            const isAdmin = await checkAdminStatus(user);
            
            console.log('User email:', user.email);
            console.log('Is admin (Custom Claims):', isAdmin);
            
            // Save user to Firestore (without setting admin flag client-side)
            saveUserToFirestore(user, isAdmin);
        }).catch((error) => {
            console.error("Auth Error:", error);
            alert("Sign-in failed: " + error.message);
        });
}

function saveUserToFirestore(user, isAdmin = false) {
    // Don't set admin flag based on email client-side - use Custom Claims
    // The isAdmin parameter should come from server-side verification
    
    db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        // isAdmin should NOT be set here based on email
        // It should be managed via Firebase Custom Claims
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => {
        // Redirect based on Custom Claims (checked server-side)
        if (isAdmin) {
            alert('Admin login successful! Redirecting to dashboard...');
            window.location.href = 'admin-dashboard/admin-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    })
    .catch((error) => {
        console.error('Error saving user:', error);
        window.location.href = 'index.html';
    });
}

// Function to save order to Firestore
function saveOrderToFirestore(orderDetails) {
    const user = auth.currentUser;
    const orderData = {
        userId: user ? user.uid : 'GUEST_' + Date.now(),
        userEmail: user ? user.email : (orderDetails.delivery ? orderDetails.delivery.email : 'guest@alfredproducts.com'),
        userName: user ? user.displayName : (orderDetails.delivery ? orderDetails.delivery.fullName : 'Guest Customer'),
        items: orderDetails.items,
        total: orderDetails.total,
        reference: orderDetails.reference,
        delivery: orderDetails.delivery || {},
        status: orderDetails.status || "Paid",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log("Saving order to Firestore:", orderData);

    return db.collection("orders").add(orderData)
    .then((docRef) => {
        console.log("Order saved successfully with ID: ", docRef.id);
        return docRef.id;
    })
    .catch((error) => {
        console.error("Error saving order to Firestore:", error);
        // Fallback: save to localStorage if Firestore fails
        const localOrders = JSON.parse(localStorage.getItem('alfredOrders') || '[]');
        localOrders.push({ ...orderData, id: 'local_' + Date.now(), sync: 'pending' });
        localStorage.setItem('alfredOrders', JSON.stringify(localOrders));
        throw error;
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, checkAdminStatus, isClientSideAdmin };
}
