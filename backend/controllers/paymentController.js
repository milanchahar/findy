import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Listing from '../models/Listing.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { listingId, amount } = req.body;

    if (!listingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listing ID and amount',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      listing: listingId,
      amount: amount * 100, // Convert to paise (cents)
      currency: 'INR',
      paymentMethod: 'stripe',
      status: 'pending',
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      metadata: {
        paymentId: payment._id.toString(),
        userId: req.user.id.toString(),
        listingId: listingId.toString(),
      },
    });

    // Update payment with intent ID
    payment.paymentIntentId = paymentIntent.id;
    await payment.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
      },
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message,
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.transactionId = paymentIntent.id;
      await payment.save();

      res.json({
        success: true,
        data: payment,
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Payment failed',
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message,
    });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('listing', 'title image price')
      .sort('-createdAt');

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
};
