/**
 * Firebase Admin Claims Setter
 * 
 * IMPORTANT: This script should ONLY be run server-side (e.g., in Firebase Functions)
 * to set admin Custom Claims for users.
 * 
 * Usage:
 * 1. Set up Firebase Admin SDK on your server
 * 2. Run this function with the admin user's email
 * 3. The admin status will be verified via Custom Claims, not client-side code
 * 
 * Example usage in Firebase Cloud Function:
 * 
 * const functions = require('firebase-functions');
 * const admin = require('firebase-admin');
 * admin.initializeApp();
 * 
 * exports.setAdminClaim = functions.https.onCall(async (data, context) => {
 *     // Only allow this function to be called by existing admins
 *     if (!context.auth) {
 *         throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
 *     }
 *     
 *     const idTokenResult = await context.auth.token;
 *     if (idTokenResult.claims.admin !== true) {
 *         throw new functions.https.HttpsError('permission-denied', 'Only admins can set admin claims');
 *     }
 *     
 *     const { email } = data;
 *     if (!email) {
 *         throw new functions.https.HttpsError('invalid-argument', 'Email is required');
 *     }
 *     
 *     // Get user by email and set admin claim
 *     const user = await admin.auth().getUserByEmail(email);
 *     await admin.auth().setCustomUserClaims(user.uid, { admin: true });
 *     
 *     return { success: true, message: `Admin claim set for ${email}` };
 * });
 */

const adminEmail = 'narhsnazzisco@gmail.com'; // Replace with your admin email

// Example function to set admin claim (run this server-side)
/**
 * Sets the admin custom claim for a user.
 * This should be called when you want to grant admin privileges.
 * 
 * @param {string} userId - The Firebase user ID
 * @param {boolean} isAdmin - Whether to grant or revoke admin privileges
 */
async function setAdminClaim(userId, isAdmin = true) {
    // This function should be implemented using Firebase Admin SDK
    // Example (Node.js):
    //
    // const admin = require('firebase-admin');
    // admin.initializeApp();
    //
    // await admin.auth().setCustomUserClaims(userId, { admin: isAdmin });
    // console.log(`Admin claim ${isAdmin ? 'granted' : 'revoked'} for user: ${userId}`);
    
    console.log(`Setting admin=${isAdmin} for user: ${userId}`);
    console.log('NOTE: This requires Firebase Admin SDK to be implemented server-side');
}

// To set admin claim for your user:
// 1. Create a Firebase Cloud Function
// 2. Or use the Firebase CLI: firebase auth:import with custom claims
// 3. Or implement this in your server.js using firebase-admin package

console.log('Admin claims management script created');
console.log('To set admin for user:', adminEmail);
console.log('Implement Firebase Admin SDK in a server-side environment');
