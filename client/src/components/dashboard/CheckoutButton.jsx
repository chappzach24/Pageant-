// src/components/CheckoutButton.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

const CheckoutButton = ({ amount }) => {
  const handleClick = async () => {
    try {
        const stripeAmount = amount * 100;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-checkout-session`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stripeAmount }), //  Send amount in cents
        });

        const text = await res.text(); // instead of res.json()
        
        // try to parse JSON if it looks valid
        const data = JSON.parse(text);
        window.location.href = data.url;
    } catch (error) {
        console.error("Error redirecting to Stripe payment:", error);
    }
    
  };

  return <button 
    className="btn btn-success" 
    onClick={handleClick}
    ><FontAwesomeIcon icon={faCreditCard} className='me-2'></FontAwesomeIcon>Checkout
    </button>;
};

export default CheckoutButton;
