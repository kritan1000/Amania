export const addToCart = (product) => {
    console.log(product);
    
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const existingItem = cartItems.find(item => item.id === product.id);
  let updatedCartItems;
  if (existingItem) {
    // If it exists, update the quantity
    updatedCartItems = cartItems.map(item =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    // If it doesn't exist, add it to the cart with quantity 1
    const newItem = { ...product, quantity: 1 };
    updatedCartItems = [...cartItems, newItem];
  }
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  
  // Show success message
  alert(`${product.name} has been added to your cart!`);
  
  return updatedCartItems;
}