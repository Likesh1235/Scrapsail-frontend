// Razorpay Configuration for ScrapSail
// Simple redirect-based integration

export const RAZORPAY_CONFIG = {
  // Replace with your actual Razorpay Payment Link ID
  PAYMENT_LINK_ID: 'pl_YourPaymentLinkId', // Update this with your Razorpay payment link
  
  // Base Razorpay URL
  BASE_URL: 'https://razorpay.com/payment-button',
  
  // Default parameters
  DEFAULT_PARAMS: {
    description: 'ScrapSail Carbon Credit Redemption',
    currency: 'INR'
  }
};

// Function to generate Razorpay redirect URL
export const generateRazorpayUrl = (amount, userEmail = '', description = '') => {
  const params = new URLSearchParams({
    prefill: JSON.stringify({
      email: userEmail,
      amount: amount,
      description: description || RAZORPAY_CONFIG.DEFAULT_PARAMS.description
    })
  });
  
  return `${RAZORPAY_CONFIG.BASE_URL}/${RAZORPAY_CONFIG.PAYMENT_LINK_ID}?${params.toString()}`;
};

// Function to handle redemption redirect
export const redirectToRazorpay = (amount, userEmail = '', description = '') => {
  const url = generateRazorpayUrl(amount, userEmail, description);
  window.open(url, '_blank');
};

export default RAZORPAY_CONFIG;
