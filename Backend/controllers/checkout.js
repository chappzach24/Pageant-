const stripe = require('stripe')(process.env.SK_TEST);

exports.createCheckout = async(req, res) => {
    try {
        console.log()
        const { stripeAmount } = req.body;

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
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ url: session.url });
  } catch (err) {
    console.error("error creating stripe checkout", err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
} 