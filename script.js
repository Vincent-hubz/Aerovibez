// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart in localStorage if it doesn't exist
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }

  // Update cart count on page load
  updateCartCount();

  // Add event listeners to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
  });

  // Add event listeners to size options
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', selectSize);
  });
});

// Function to handle size selection
function selectSize(event) {
  const productCard = event.target.closest('.product-card');
  const sizeOptions = productCard.querySelectorAll('.size-option');
  
  // Remove selected class from all size options
  sizeOptions.forEach(option => option.classList.remove('selected'));
  
  // Add selected class to clicked size option
  event.target.classList.add('selected');
}

// Function to handle adding product to cart
function addToCart(event) {
  const productCard = event.target.closest('.product-card');
  
  // Get selected size
  const selectedSize = productCard.querySelector('.size-option.selected');
  
  if (!selectedSize && productCard.querySelector('.size-option:not([data-one-size="true"])')) {
    showNotification('Please select a size');
    return;
  }
  
  // Get product details
  const productId = generateProductId(productCard);
  const productImage = productCard.querySelector('.product-image').src;
  const productName = productCard.querySelector('.product-name').textContent;
  const productBrand = productCard.querySelector('.product-brand').textContent;
  const priceText = productCard.querySelector('.current-price').textContent;
  const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
  const size = selectedSize ? selectedSize.textContent : 'One Size';
  
  // Create product object
  const product = {
    id: productId + '-' + size,
    image: productImage,
    name: productName,
    brand: productBrand,
    price: price,
    size: size,
    quantity: 1
  };
  
  // Get current cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // If item exists, increase quantity
    cart[existingItemIndex].quantity += 1;
    showNotification('Item quantity updated in cart');
  } else {
    // Add new item to cart
    cart.push(product);
    showNotification('Item added to cart');
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count badge
  updateCartCount();
}

// Helper function to generate a unique product ID
function generateProductId(productCard) {
  const productName = productCard.querySelector('.product-name').textContent;
  const productBrand = productCard.querySelector('.product-brand').textContent;
  
  return productBrand.toLowerCase().replace(/\s+/g, '-') + '-' + 
         productName.toLowerCase().replace(/\s+/g, '-');
}

// Function to update cart count badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Function to show notification
function showNotification(message) {
  // Check if notification element exists
  let notification = document.getElementById('notification');
  
  // Create notification element if it doesn't exist
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
} 