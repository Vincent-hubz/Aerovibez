// Initialize after DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  initializeQuickViewButtons();
  initializeSizeSelection();
  initializeSearch();
  initializeFilters();
  handleCartButtonClicks();
});

// Quick view button functionality
function initializeQuickViewButtons() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const quickViewBtn = card.querySelector('.quick-view-btn');
    
    if (quickViewBtn) {
      card.addEventListener('mouseenter', () => {
        quickViewBtn.style.opacity = '1';
        quickViewBtn.style.bottom = '10px';
      });
      
      card.addEventListener('mouseleave', () => {
        quickViewBtn.style.opacity = '0';
        quickViewBtn.style.bottom = '-40px';
      });
    }
  });
}

// Size selection functionality
function initializeSizeSelection() {
  const sizeOptions = document.querySelectorAll('.size-option');
  
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from siblings
      const siblings = option.parentElement.querySelectorAll('.size-option');
      siblings.forEach(sib => sib.classList.remove('selected'));
      
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });
}

// Cart functionality
function handleCartButtonClicks() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card');
      addToCart(productCard);
    });
  });
}

// Add to cart function
function addToCart(productCard) {
  const productName = productCard.querySelector('.product-name').textContent;
  const productPrice = productCard.querySelector('.current-price').textContent;
  const productImage = productCard.querySelector('.product-image').src;
  const productBrand = productCard.querySelector('.product-brand').textContent;
  const selectedSize = productCard.querySelector('.size-option.selected');
  const genderBadge = productCard.querySelector('.gender-badge');
  
  // Check if size is selected
  if (!selectedSize && productCard.querySelectorAll('.size-option').length > 0) {
    showNotification('Please select a size');
    return;
  }
  
  const size = selectedSize ? selectedSize.textContent : 'One Size';
  
  // Determine which cart to use based on the gender badge
  let cartName = 'mainCart';
  if (genderBadge) {
    if (genderBadge.classList.contains('mens-badge')) {
      cartName = 'mensCart';
    } else if (genderBadge.classList.contains('womens-badge')) {
      cartName = 'womensCart';
    } else if (genderBadge.classList.contains('kids-badge')) {
      cartName = 'kidsCart';
    }
  }
  
  // Get cart from local storage
  let cart = JSON.parse(localStorage.getItem(cartName)) || [];
  
  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex(item => 
    item.name === productName && item.size === size
  );
  
  if (existingProductIndex >= 0) {
    // If product exists, increase quantity
    cart[existingProductIndex].quantity += 1;
  } else {
    // If product doesn't exist, add it
    const product = {
      name: productName,
      price: productPrice,
      image: productImage,
      brand: productBrand,
      size: size,
      quantity: 1
    };
    cart.push(product);
  }
  
  // Save cart back to local storage
  localStorage.setItem(cartName, JSON.stringify(cart));
  
  // Show notification
  showNotification(`${productName} added to cart`);
}

// Show notification function
function showNotification(message) {
  // Check if notification already exists
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#333',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '4px',
      zIndex: '1000',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    });
  }
  
  // Set message and show notification
  notification.textContent = message;
  notification.style.opacity = '1';
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    
    // Remove notification after fade out
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Search functionality
function initializeSearch() {
  const searchInput = document.querySelector('.search-container input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', event => {
    const query = event.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    if (query === '') {
      // Show all products if query is empty
      productCards.forEach(card => {
        card.style.display = 'block';
      });
      return;
    }
    
    // Filter products based on query
    productCards.forEach(card => {
      const productName = card.querySelector('.product-name').textContent.toLowerCase();
      const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
      
      if (productName.includes(query) || productBrand.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Filter functionality
function initializeFilters() {
  const filterOptions = document.querySelectorAll('.filter-option input');
  
  filterOptions.forEach(option => {
    option.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const productCards = document.querySelectorAll('.product-card');
  const selectedDepartments = getCheckedValues('Department');
  const selectedCategories = getCheckedValues('Category');
  const selectedBrands = getCheckedValues('Brand');
  const selectedPriceRange = getSelectedPriceRange();
  
  productCards.forEach(card => {
    let showCard = true;
    
    // Filter by department
    if (selectedDepartments.length > 0) {
      const genderBadge = card.querySelector('.gender-badge');
      if (genderBadge) {
        const isMens = genderBadge.classList.contains('mens-badge') && selectedDepartments.includes("Men's");
        const isWomens = genderBadge.classList.contains('womens-badge') && selectedDepartments.includes("Women's");
        const isKids = genderBadge.classList.contains('kids-badge') && selectedDepartments.includes("Kids'");
        
        showCard = isMens || isWomens || isKids;
      }
    }
    
    // Filter by brand
    if (showCard && selectedBrands.length > 0) {
      const brand = card.querySelector('.product-brand').textContent;
      showCard = selectedBrands.includes(brand) || selectedBrands.includes('Other Brands');
    }
    
    // Filter by price
    if (showCard && selectedPriceRange) {
      const priceText = card.querySelector('.current-price').textContent;
      const price = parseFloat(priceText.replace('₱', '').replace(',', ''));
      
      switch(selectedPriceRange) {
        case 'Under ₱500':
          showCard = price < 500;
          break;
        case '₱500 - ₱1,000':
          showCard = price >= 500 && price <= 1000;
          break;
        case '₱1,000 - ₱3,000':
          showCard = price > 1000 && price <= 3000;
          break;
        case 'Over ₱3,000':
          showCard = price > 3000;
          break;
      }
    }
    
    card.style.display = showCard ? 'block' : 'none';
  });
}

function getCheckedValues(filterType) {
  const filterSection = Array.from(document.querySelectorAll('.filter-section'))
    .find(section => section.querySelector('h3').textContent === filterType);
  
  if (!filterSection) return [];
  
  return Array.from(filterSection.querySelectorAll('.filter-option input:checked'))
    .map(input => input.nextElementSibling.textContent.trim());
}

function getSelectedPriceRange() {
  const checkedPriceOption = document.querySelector('.filter-section h3:contains("Price Range")')?.closest('.filter-section')
    .querySelector('input[name="price"]:checked');
  
  return checkedPriceOption ? 
    checkedPriceOption.nextElementSibling.textContent.trim() : null;
}

// Load cart items on cart page
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('CART_PAGE.html')) {
    loadCartItems();
  }
});

function loadCartItems() {
  const cartContainer = document.querySelector('.cart-items');
  if (!cartContainer) return;
  
  // Get all carts
  const mensCart = JSON.parse(localStorage.getItem('mensCart')) || [];
  const womensCart = JSON.parse(localStorage.getItem('womensCart')) || [];
  const kidsCart = JSON.parse(localStorage.getItem('kidsCart')) || [];
  const mainCart = JSON.parse(localStorage.getItem('mainCart')) || [];
  
  const allCarts = [
    ...mensCart.map(item => ({...item, cartType: 'mens'})),
    ...womensCart.map(item => ({...item, cartType: 'womens'})),
    ...kidsCart.map(item => ({...item, cartType: 'kids'})),
    ...mainCart.map(item => ({...item, cartType: 'main'}))
  ];
  
  // Clear cart container
  cartContainer.innerHTML = '';
  
  if (allCarts.length === 0) {
    cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    return;
  }
  
  // Add each item to cart
  allCarts.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    // Calculate item total
    const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
    const total = price * item.quantity;
    
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Size: ${item.size}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn decrease" data-index="${index}" data-cart="${item.cartType}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn increase" data-index="${index}" data-cart="${item.cartType}">+</button>
      </div>
      <div class="cart-item-total">₱${total.toFixed(2)}</div>
      <button class="remove-btn" data-index="${index}" data-cart="${item.cartType}">×</button>
    `;
    
    cartContainer.appendChild(cartItem);
  });
  
  // Calculate and update cart total
  updateCartTotal(allCarts);
  
  // Add event listeners to quantity buttons
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      const cartType = this.dataset.cart;
      const change = this.classList.contains('increase') ? 1 : -1;
      
      updateCartItemQuantity(index, change, cartType);
    });
  });
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      const cartType = this.dataset.cart;
      
      removeCartItem(index, cartType);
    });
  });
}

function updateCartItemQuantity(index, change, cartType) {
  // Get appropriate cart
  const cartName = cartType + 'Cart';
  const cart = JSON.parse(localStorage.getItem(cartName)) || [];
  
  // Update quantity
  cart[index].quantity += change;
  
  // Remove item if quantity is 0
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  
  // Save updated cart
  localStorage.setItem(cartName, JSON.stringify(cart));
  
  // Reload cart items
  loadCartItems();
}

function removeCartItem(index, cartType) {
  // Get appropriate cart
  const cartName = cartType + 'Cart';
  const cart = JSON.parse(localStorage.getItem(cartName)) || [];
  
  // Remove item
  cart.splice(index, 1);
  
  // Save updated cart
  localStorage.setItem(cartName, JSON.stringify(cart));
  
  // Reload cart items
  loadCartItems();
}

function updateCartTotal(allCarts) {
  const totalElement = document.querySelector('.cart-total .total-amount');
  if (!totalElement) return;
  
  // Calculate total
  const total = allCarts.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
    return sum + (price * item.quantity);
  }, 0);
  
  // Update total element
  totalElement.textContent = `₱${total.toFixed(2)}`;
} 