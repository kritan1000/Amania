import React from 'react';
import '../styles/Cart.css';

function Cart({ cartItems, clearCart,closeCart }) {
  console.log(cartItems);
  
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
          <button onClick={clearCart}>Clear Cart</button>
        </div>
      )}
    </section>
  );
}

export default Cart;