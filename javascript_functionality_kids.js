// JavaScript functionality for Kids pages

// Size selection functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all size options
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove 'selected' class from all siblings
            const siblings = this.parentNode.querySelectorAll('.size-option');
            siblings.forEach(sibling => {
                sibling.classList.remove('selected');
            });
            
            // Add 'selected' class to the clicked option
            this.classList.add('selected');
        });
    });
    
    // Handle hover effect for quick view buttons
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const quickViewBtn = card.querySelector('.quick-view-btn');
        
        if (quickViewBtn) {
            card.addEventListener('mouseenter', function() {
                quickViewBtn.style.opacity = '1';
                quickViewBtn.style.bottom = '10px';
            });
            
            card.addEventListener('mouseleave', function() {
                quickViewBtn.style.opacity = '0';
                quickViewBtn.style.bottom = '-40px';
            });
        }
    });

    // Initialize search functionality
    initializeSearch();

    // Initialize filter functionality
    initializeFilters();
});

// Add to cart functionality
function addToCart(productCard) {
    // Get product details
    const brand = productCard.querySelector('.product-brand').textContent;
    const name = productCard.querySelector('.product-name').textContent;
    const price = productCard.querySelector('.current-price').textContent;
    const img = productCard.querySelector('.product-image').src;
    
    // Get selected size if available
    let size = "One Size";
    const selectedSize = productCard.querySelector('.size-option.selected');
    if (selectedSize) {
        size = selectedSize.textContent;
    }
    
    // Create product object
    const product = {
        brand,
        name,
        price,
        img,
        size,
        quantity: 1
    };
    
    // Get current cart or initialize new one
    let kidsCart = JSON.parse(localStorage.getItem('kidsCart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = kidsCart.findIndex(item => 
        item.name === product.name && item.size === product.size
    );
    
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        kidsCart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        kidsCart.push(product);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('kidsCart', JSON.stringify(kidsCart));
    
    // Show confirmation message
    showNotification(`${name} (${size}) added to cart!`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Get all product cards
            const productCards = document.querySelectorAll('.product-card');
            
            // Filter products
            productCards.forEach(card => {
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Filter functionality
function initializeFilters() {
    const filterOptions = document.querySelectorAll('.filter-option input');
    
    filterOptions.forEach(option => {
        option.addEventListener('change', applyFilters);
    });
}

// Apply filters
function applyFilters() {
    // Get all checked filter options
    const checkedCategories = getCheckedValues('Category');
    const checkedBrands = getCheckedValues('Brand');
    const checkedPrices = getCheckedValues('Price Range');
    
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Filter products
    productCards.forEach(card => {
        // Example implementation - Would need to be customized based on your actual data structure
        const cardBrand = card.querySelector('.product-brand').textContent;
        
        // Simple filtering by brand as an example
        // In a real implementation, you'd check all relevant filters
        let brandMatch = checkedBrands.length === 0 || checkedBrands.some(brand => cardBrand.includes(brand));
        
        if (brandMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Helper function to get checked values for a filter type
function getCheckedValues(filterType) {
    const checkedValues = [];
    
    // Get the filter section by its title
    const filterSections = document.querySelectorAll('.filter-section');
    let targetSection;
    
    for (const section of filterSections) {
        if (section.querySelector('h3').textContent === filterType) {
            targetSection = section;
            break;
        }
    }
    
    if (targetSection) {
        const checkedInputs = targetSection.querySelectorAll('input:checked');
        checkedInputs.forEach(input => {
            checkedValues.push(input.nextElementSibling.textContent.trim());
        });
    }
    
    return checkedValues;
}

// Cart page functionality (if needed)
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        // Get cart from localStorage
        const kidsCart = JSON.parse(localStorage.getItem('kidsCart')) || [];
        
        if (kidsCart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        let cartHTML = '';
        let totalPrice = 0;
        
        // Generate HTML for each cart item
        kidsCart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace('₱', '').replace(',', ''));
            const itemTotal = itemPrice * item.quantity;
            totalPrice += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-brand">${item.brand}</div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-size">Size: ${item.size}</div>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartItemQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItemQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-total">₱${itemTotal.toFixed(2)}</div>
                    <button class="cart-item-remove" onclick="removeCartItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        // Add cart total
        cartHTML += `
            <div class="cart-total">
                <span>Total:</span>
                <span>₱${totalPrice.toFixed(2)}</span>
            </div>
            <div class="cart-buttons">
                <button class="continue-shopping">Continue Shopping</button>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Add event listeners for continue shopping button
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                window.location.href = 'kids_new_arrival.html';
            });
        }
    }
}

// Update cart item quantity (for cart page)
function updateCartItemQuantity(index, change) {
    // Get cart from localStorage
    let kidsCart = JSON.parse(localStorage.getItem('kidsCart')) || [];
    
    // Update quantity
    kidsCart[index].quantity += change;
    
    // Remove item if quantity is 0 or less
    if (kidsCart[index].quantity <= 0) {
        kidsCart.splice(index, 1);
    }
    
    // Save updated cart
    localStorage.setItem('kidsCart', JSON.stringify(kidsCart));
    
    // Reload cart items
    loadCartItems();
}

// Remove cart item (for cart page)
function removeCartItem(index) {
    // Get cart from localStorage
    let kidsCart = JSON.parse(localStorage.getItem('kidsCart')) || [];
    
    // Remove item
    kidsCart.splice(index, 1);
    
    // Save updated cart
    localStorage.setItem('kidsCart', JSON.stringify(kidsCart));
    
    // Reload cart items
    loadCartItems();
}

// Load cart items when on cart page
if (window.location.href.includes('CART_PAGE.html')) {
    document.addEventListener('DOMContentLoaded', loadCartItems);
} 