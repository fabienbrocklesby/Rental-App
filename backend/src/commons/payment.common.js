import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(stripeSecretKey);

const createPaymentSession = async (price, productName, transactionId) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
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
      mode: 'payment',
      success_url: `http://localhost:3001/successful/${transactionId}`,
      cancel_url: `http://localhost:3001/payment/cancel/${transactionId}`,
    });
    return session;
  } catch (error) {
    throw new Error('Failed to create payment session');
  }
};

const verifyPaymentSession = async (sessionId) => {
  try {
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);
    console.log(session.status);
    return session.status === 'complete';
  } catch (error) {
    throw new Error('Failed to verify payment session');
  }
};

export { createPaymentSession, verifyPaymentSession };
