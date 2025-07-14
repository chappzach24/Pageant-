const stripe = require('stripe')(process.env.SK_TEST);
const Payment = require('../models/Payment');
const Pageant = require('../models/Pageant');

exports.createCheckout = async(req, res) => {
    try {
        const { stripeAmount, categories, pageantName, organizationName, pageantStartDate, pageantEndDate, locationCity, locationState, contestantId, pageantId, userId } = req.body;
        console.log("categories", categories);
        if (!stripeAmount || isNaN(stripeAmount)) {
          return res.status(400).json({ error: 'Invalid amount' });
        }

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
            price_data: {
                currency: 'usd',
                product_data: {
                name: 'Awesome Product',
                },
                unit_amount: stripeAmount,
            },
            quantity: 1,
            },
        ],
        metadata: {
          amount: stripeAmount,
          selectedCategories: JSON.stringify(categories),
          pageantName,
          organizationName,
          pageantStartDate,
          pageantEndDate,
          locationCity,
          locationState,
          contestantId,
          pageantId,
          userId,
        },
        success_url: 'http://localhost:5173/contestant-dashboard/join-pageant/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:5173/contestant-dashboard/join-pageant/error?session_id={CHECKOUT_SESSION_ID}',
        });

        res.json({ url: session.url });
  } catch (err) {
    console.error("error creating stripe checkout", err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
} 

exports.checkoutInformation = async(req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ['payment_intent.charges'], // 👈 get payment details too
    });

    res.json(session);
  } catch (err) {
    console.error('Error fetching session:', err);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
}

exports.saveFailedPayment = async(req, res) => {
  try{
    const {
      stripeSessionId,
      stripePaymentIntentId,
      stripeCustomerId,
      transactionId,
      paymentAmount,
      paymentStatus,
      pageantId
    } = req.body;

    // Check to make sure it doesn't create two versions
    const checkPayment = await Payment.findOne({ transactionId });

    if(checkPayment){
      return;
    }

    // Check if pageant exists
    const pageant = await Pageant.findById(pageantId);
    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // Check if registration is open
    const now = new Date();
    if (pageant.status !== 'published' || now > pageant.registrationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Registration is closed for this pageant'
      });
    }

    if (transactionId && paymentAmount) {
      const payment = new Payment({
        user: req.user.id,
        pageant: pageantId,
        amount: 0,
        status: paymentStatus,
        method: 'stripe',
        transactionId,
        stripeSessionId,
        stripePaymentIntentId,
        stripeCustomerId,
        description: `Registration payment for ${pageant.name}`,
        metadata: {
          pageantName: pageant.name,
        }
      });

      await payment.save();
      res.json(payment);
    }

  }catch(err){
    console.error('Error saving failed payment:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}