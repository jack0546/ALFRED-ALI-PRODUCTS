// Firebase Configuration - LIVE API KEYS
const firebaseConfig = {
    apiKey: "AIzaSyBMhNFK9ueVA6-1i22Z_NbGV_50Uy0xXjQ",
    authDomain: "project-4da600f0-7b2b-45f4-808.firebaseapp.com",
    projectId: "project-4da600f0-7b2b-45f4-808",
    storageBucket: "project-4da600f0-7b2b-45f4-808.firebasestorage.app",
    messagingSenderId: "531999731190",
    appId: "1:531999731190:web:098953626b761eafb62bd7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Google Sign-In Logic
function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // Save user to Firestore
            saveUserToFirestore(user);
        }).catch((error) => {
            console.error("Auth Error:", error);
            alert("Sign-in failed: " + error.message);
        });
}

function saveUserToFirestore(user) {
    db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => {
        window.location.href = 'index.html';
    });
}

// Function to save order to Firestore
function saveOrderToFirestore(orderDetails) {
    const user = auth.currentUser;
    if (!user) {
        console.warn("Order not saved to Firestore: No user logged in.");
        return;
    }

    db.collection("orders").add({
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        items: orderDetails.items,
        total: orderDetails.total,
        reference: orderDetails.reference,
        status: "Paid",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Order saved with ID: ", docRef.id);
    });
}
