/**
 * Secure Admin Authentication Module
 * 
 * This script should be included in admin-dashboard.html AFTER the Firebase config
 * It replaces the insecure email-based admin check with Custom Claims verification
 * 
 * Include this AFTER firebase-config.js:
 * <script src="secure-admin-auth.js"></script>
 */

// Only run if firebase is available
if (typeof firebase !== 'undefined') {
    
    /**
     * Check if user has admin Custom Claims
     * This is the SECURE way to verify admin status
     */
    async function checkAdminStatus(user) {
        try {
            const idTokenResult = await user.getIdTokenResult();
            return idTokenResult.claims.admin === true;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }

    /**
     * Fallback: Check Firestore user document for admin flag
     * This is used as backup but Custom Claims is preferred
     */
    async function checkAdminFromFirestore(user) {
        try {
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                return userData.isAdmin === true;
            }
            return false;
        } catch (error) {
            console.error('Error checking Firestore:', error);
            return false;
        }
    }

    /**
     * Replace the original auth state change handler
     * This function should be called INSTEAD of the original code
     */
    function initSecureAdminAuth() {
        firebase.auth().onAuthStateChanged(async function(user) {
            const loadingScreen = document.getElementById('loading-screen');
            const loginModal = document.getElementById('login-modal');
            
            if (user) {
                // Primary: Check Custom Claims
                const isAdminClaim = await checkAdminStatus(user);
                
                if (isAdminClaim) {
                    // User has admin Custom Claims - allow access
                    if (loadingScreen) loadingScreen.classList.add('hidden');
                    showDashboard();
                    return;
                }
                
                // Fallback: Check Firestore
                const isAdminFirestore = await checkAdminFromFirestore(user);
                
                if (isAdminFirestore) {
                    if (loadingScreen) loadingScreen.classList.add('hidden');
                    showDashboard();
                } else {
                    // Not admin - show login modal
                    if (loadingScreen) loadingScreen.classList.add('hidden');
                    if (loginModal) loginModal.classList.remove('hidden');
                }
            } else {
                // Not logged in - show login modal
                if (loadingScreen) loadingScreen.classList.add('hidden');
                if (loginModal) loginModal.classList.remove('hidden');
            }
        });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecureAdminAuth);
    } else {
        initSecureAdminAuth();
    }

    console.log('Secure Admin Auth module loaded');
} else {
    console.error('Firebase SDK not loaded - secure admin auth cannot initialize');
}
