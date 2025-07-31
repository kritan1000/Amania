import React from 'react';
import '../styles/Cart.css';

function Cart({ cartItems, clearCart, closeCart }) {
  console.log(cartItems);
  
  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleCheckout = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to proceed with checkout');
      closeCart();
      return;
    }
    
    // Here you would typically redirect to a checkout page
    alert('Proceeding to checkout...');
    closeCart();
  };
  
  return (
    <section className="cart">
      <h2>Your Cart</h2>
      <button className="close-cart" onClick={closeCart}>Close</button>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className='cart-container'>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <span>
              <h3>{item.name}</h3>
              <p>${item.price} x {item.quantity}</p>
              </span>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
            <button onClick={handleCheckout} className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;