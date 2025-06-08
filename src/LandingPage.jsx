import { useState } from 'react';

export default function AmaniaLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
  ];

  const products = [
    {
      id: 1,
      name: "Summer Dress",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Casual Shirt",
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Designer Jeans",
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Winter Jacket",
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop"
    }
  ];

  const goToLogin = () => {
    alert('Redirecting to login page...');
  };

  const goToSignUp = () => {
    alert('Redirecting to sign up page...');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">AMANIA</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-500">Home</a>
              <a href="#products" className="text-gray-700 hover:text-pink-500">Products</a>
              <a href="#about" className="text-gray-700 hover:text-pink-500">About</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-500">Contact</a>
            </nav>

            <div className="flex space-x-4">
              <button 
                onClick={goToLogin}
                className="text-gray-700 hover:text-pink-500 font-medium"
              >
                Login
              </button>
              <button 
                onClick={goToSignUp}
                className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <section id="home" className="relative h-96 bg-pink-50">
        <div className="absolute inset-0">
          <img 
            src={heroImages[currentSlide]}
            alt="Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div>
            <h2 className="text-5xl font-bold mb-4">Welcome to AMANIA</h2>
            <p className="text-xl mb-8">Discover Your Perfect Style</p>
            <button className="bg-amber-700 text-white px-8 py-3 rounded-lg text-lg hover:bg-amber-800 transition-colors">
              Shop Now
            </button>
          </div>
        </div>

       
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
        >
          ←
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
        >
          →
        </button>
      </section>

     
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h3>
            <p className="text-gray-600">Discover our latest fashion collection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h4>
                  <p className="text-pink-500 font-bold text-xl">{product.price}</p>
                  <button className="w-full mt-4 bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">About AMANIA</h3>
              <p className="text-gray-600 mb-6">
                AMANIA is your premier destination for fashion-forward clothing and accessories. 
                We believe that style is a form of self-expression, and our carefully curated 
                collection helps you tell your unique story.
              </p>
              <p className="text-gray-600 mb-6">
                From casual wear to formal attire, we offer high-quality fashion pieces 
                that combine comfort, style, and affordability. Join thousands of satisfied 
                customers who trust AMANIA for their fashion needs.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="text-2xl font-bold text-pink-500">1000+</h4>
                  <p className="text-gray-600">Products</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-pink-500">5000+</h4>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-pink-500">24/7</h4>
                  <p className="text-gray-600">Support</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                alt="About Us"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-8">Subscribe to our newsletter for the latest fashion trends and exclusive offers</p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-pink-500"
            />
            <button className="bg-amber-700 text-white px-6 py-3 rounded-r-lg hover:bg-amber-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">AMANIA</h4>
              <p className="text-gray-400">
                Your trusted fashion partner for style and comfort.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#products" className="hover:text-white">Products</a></li>
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Customer Service</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
              </ul>
            </div>
            <div>
              
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AMANIA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}