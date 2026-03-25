/**
 * Alternative Admin Setup - No Functions Required!
 * 
 * This script sets admin directly via Firebase Admin SDK
 * No Cloud Functions deployment needed!
 * 
 * Usage:
 * 1. Download service account key from Firebase Console
 * 2. Place it in this folder as service-account.json
 * 3. Run: node set-admin-direct.js your-email@gmail.com
 */

// Check if email provided
const email = process.argv[2];

if (!email) {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║         DIRECT ADMIN SETUP (No Functions Required!)              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Usage:                                                          ║
║    node set-admin-direct.js your-email@gmail.com                 ║
║                                                                  ║
║  Example:                                                        ║
║    node set-admin-direct.js narhsnazzisco@gmail.com              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Instructions:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the file as "service-account.json" in this folder
4. Run the command above
    `);
    process.exit(1);
}

// Try to load Firebase Admin
let admin;
try {
    admin = require('firebase-admin');
} catch (e) {
    console.log('Installing firebase-admin...');
    const { execSync } = require('child_process');
    execSync('npm install firebase-admin', { stdio: 'inherit' });
    admin = require('firebase-admin');
}

// Try to load service account
let serviceAccount;
try {
    serviceAccount = require('./service-account.json');
} catch (e) {
    console.error('❌ Error: service-account.json not found!');
    console.log('');
    console.log('To fix:');
    console.log('1. Go to https://console.firebase.google.com');
    console.log('2. Select your project');
    console.log('3. Go to Project Settings (gear icon)');
    console.log('4. Click "Service accounts"');
    console.log('5. Click "Generate new private key"');
    console.log('6. Save as "service-account.json" in this folder');
    process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function setAdmin() {
    console.log(`\n🔄 Setting admin for: ${email}\n`);
    
    try {
        // Get user by email
        const user = await admin.auth().getUserByEmail(email);
        console.log(`👤 User found: ${user.uid}`);
        
        // Set custom claims
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log('✅ Custom Claims set: admin = true');
        
        // Also update Firestore
        try {
            await admin.firestore().collection('users').doc(user.uid).set({
                isAdmin: true,
                adminSetAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('✅ Firestore user document updated');
        } catch (fsError) {
            console.log('⚠️ Firestore update skipped (may not be available)');
        }
        
        console.log('\n🎉 SUCCESS! User is now an admin.');
        console.log('\nTo verify, the user should:');
        console.log('1. Sign out and sign back in');
        console.log('2. The admin dashboard should be accessible\n');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        
        if (error.code === 'auth/user-not-found') {
            console.log('\nTip: Make sure the user has already signed in once');
            console.log('via Firebase Authentication before trying to set admin.');
        }
        
        process.exit(1);
    }
}

setAdmin();
