/**
 * Quick Admin Setup Script
 * 
 * Instructions:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize functions: firebase init functions
 * 4. Replace the index.js content with the content from firebase-functions/index.js
 * 5. Deploy: firebase deploy --only functions
 * 6. Run this script or use Firebase Console
 */

const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Admin SDK - use your service account in production
// For local development, use: admin.initializeApp();
const serviceAccount = require('./service-account-key.json'); // Download from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

/**
 * Set admin Custom Claims for a user by email
 */
async function setAdmin(email) {
    try {
        // Get user by email
        const user = await admin.auth().getUserByEmail(email);
        
        // Set custom claims (admin: true)
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        
        console.log(`✅ Success! ${email} is now an admin`);
        console.log(`User ID: ${user.uid}`);
        
        // Also update Firestore user document
        await admin.firestore().collection('users').doc(user.uid).set({
            isAdmin: true,
            adminSince: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`✅ Firestore user document updated`);
        
    } catch (error) {
        console.error(`❌ Error:`, error.message);
    }
}

/**
 * Remove admin Custom Claims from a user
 */
async function removeAdmin(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        
        // Set custom claims to empty (remove admin)
        await admin.auth().setCustomUserClaims(user.uid, null);
        
        console.log(`✅ Success! Admin removed from ${email}`);
        
        // Update Firestore
        await admin.firestore().collection('users').doc(user.uid).set({
            isAdmin: false,
            removedAsAdmin: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
    } catch (error) {
        console.error(`❌ Error:`, error.message);
    }
}

/**
 * List all admins
 */
async function listAdmins() {
    try {
        const users = await admin.auth().listUsers();
        
        console.log(`\n📋 All Users:`);
        console.log(`=============`);
        
        users.users.forEach(user => {
            const claims = user.customClaims || {};
            if (claims.admin) {
                console.log(`✅ ${user.email} - UID: ${user.uid}`);
            } else {
                console.log(`   ${user.email}`);
            }
        });
        
    } catch (error) {
        console.error(`❌ Error:`, error.message);
    }
}

// Get email from command line argument
const args = process.argv.slice(2);
const action = args[0];
const email = args[1];

// Run the appropriate function
if (action === 'set' && email) {
    setAdmin(email);
} else if (action === 'remove' && email) {
    removeAdmin(email);
} else if (action === 'list') {
    listAdmins();
} else {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║            ALFRED PRODUCTS - ADMIN SETUP SCRIPT                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Usage:                                                          ║
║    node setup-admin.js set your-email@gmail.com    → Make admin ║
║    node setup-admin.js remove your-email@gmail.com → Remove     ║
║    node setup-admin.js list                           → List    ║
║                                                                  ║
║  Example:                                                        ║
║    node setup-admin.js set admin@gmail.com                      ║
║    node setup-admin.js list                                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);
}
