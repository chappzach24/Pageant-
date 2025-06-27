const stripe = require('stripe')(process.env.SK_TEST);

exports.createCheckout = async(req, res) => {
    try {
        const { stripeAmount, categories, pageantName, organizationName, pageantStartDate, pageantEndDate, locationCity, locationState, userId } = req.body;
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
          userId,
        },
        success_url: 'http://localhost:5173/contestant-dashboard/join-pageant/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cancel',
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