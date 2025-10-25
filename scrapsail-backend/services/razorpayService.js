const Razorpay = require('razorpay');

class RazorpayService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create a payout order for withdrawal
  async createPayout(payoutData) {
    try {
      const payout = await this.razorpay.payouts.create({
        account_number: payoutData.accountNumber,
        fund_account: {
          account_type: payoutData.accountType || 'bank_account',
          bank_account: {
            name: payoutData.accountHolderName,
            ifsc: payoutData.ifscCode,
            account_number: payoutData.accountNumber
          }
        },
        amount: payoutData.amount * 100, // Convert to paise
        currency: payoutData.currency || 'INR',
        mode: payoutData.mode || 'IMPS',
        purpose: payoutData.purpose || 'payout',
        queue_if_low_balance: true,
        reference_id: payoutData.referenceId,
        narration: payoutData.narration || 'Carbon Credit Withdrawal'
      });

      return payout;
    } catch (error) {
      console.error('Razorpay payout creation error:', error);
      throw new Error(`Failed to create payout: ${error.message}`);
    }
  }

  // Get payout status
  async getPayoutStatus(payoutId) {
    try {
      const payout = await this.razorpay.payouts.fetch(payoutId);
      return payout;
    } catch (error) {
      console.error('Razorpay payout fetch error:', error);
      throw new Error(`Failed to fetch payout: ${error.message}`);
    }
  }

  // Create fund account for user
  async createFundAccount(fundAccountData) {
    try {
      const fundAccount = await this.razorpay.fundAccounts.create({
        customer_id: fundAccountData.customerId,
        account_type: fundAccountData.accountType || 'bank_account',
        bank_account: {
          name: fundAccountData.accountHolderName,
          ifsc: fundAccountData.ifscCode,
          account_number: fundAccountData.accountNumber
        }
      });

      return fundAccount;
    } catch (error) {
      console.error('Razorpay fund account creation error:', error);
      throw new Error(`Failed to create fund account: ${error.message}`);
    }
  }

  // Create customer
  async createCustomer(customerData) {
    try {
      const customer = await this.razorpay.customers.create({
        name: customerData.name,
        email: customerData.email,
        contact: customerData.contact,
        fail_existing: 0
      });

      return customer;
    } catch (error) {
      console.error('Razorpay customer creation error:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Get customer
  async getCustomer(customerId) {
    try {
      const customer = await this.razorpay.customers.fetch(customerId);
      return customer;
    } catch (error) {
      console.error('Razorpay customer fetch error:', error);
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }
  }
}

module.exports = new RazorpayService();

