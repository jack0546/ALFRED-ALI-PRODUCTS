#!/bin/bash

# Firebase Functions Setup Script
# Run this in your terminal to set up payment verification

echo "======================================"
echo "Setting up Firebase Functions"
echo "======================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase (will open browser)
echo "Please login to Firebase..."
firebase login

# Initialize functions (choose your project when prompted)
echo "Initializing Firebase Functions..."
firebase init functions

# Ask for Paystack secret key
echo ""
echo "Enter your Paystack Secret Key (sk_live_...):"
read -r PAYSTACK_SECRET

# Set the Paystack secret key in Firebase config
echo "Setting Paystack secret key..."
firebase functions:config:set paystack.secret_key="$PAYSTACK_SECRET"

# Deploy functions
echo "Deploying Firebase Functions..."
firebase deploy --only functions

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. The payment verification function is now active"
echo "2. Update your frontend to use server verification (optional)"
echo ""
