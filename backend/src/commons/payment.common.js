import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey);

const createAccountLink = async () => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3001',
      return_url: 'http://localhost:3001/api/users/verify/stripe',
      type: 'account_onboarding',
    });

    return { accountLink, accountId: account.id };
  } catch (error) {
    throw new Error('Failed to create account link');
  }
};

const verifyStripeAccount = async (accountId) => {
  try {
    const account = await stripe.accounts.retrieve(accountId);

    if (account.charges_enabled && account.payouts_enabled) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error('Failed to verify account');
  }
};

const createPaymentSession = async (price, productName, transactionId, sellerStripeAccount) => {
  console.log(price, productName, transactionId, sellerStripeAccount);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'nzd',
            product_data: {
              name: productName,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(price * 100 * 0.1),
        transfer_data: {
          destination: sellerStripeAccount,
        },
      },
      mode: 'payment',
      success_url: `http://localhost:3001/successful/${transactionId}`,
      cancel_url: `http://localhost:3001/cancel/${transactionId}`,
    });
    return session;
  } catch (error) {
    throw new Error('Failed to create payment session');
  }
};

const verifyPaymentSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.status === 'complete';
  } catch (error) {
    throw new Error('Failed to verify payment session');
  }
};

export {
  createPaymentSession, verifyPaymentSession, createAccountLink, verifyStripeAccount,
};
