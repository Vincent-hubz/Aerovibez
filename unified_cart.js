/**
 * Unified Cart System
 * 
 * This script handles cart functionality across all pages
 * It uses localStorage to store cart data
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart count badge on each page load
    updateCartBadge();
    
    // Setup add to cart button listeners if they exist on the page
    setupAddToCartButtons();
    
    // Add our new initialization
    setupBuyNowButtons();
    setupVariationOptions();
    
    // Add data attributes to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        if (!card.dataset.id) {
            card.dataset.id = generateProductId(card);
        }
        if (!card.dataset.name) {
            card.dataset.name = card.querySelector('.product-name').textContent;
        }
        if (!card.dataset.price) {
            card.dataset.price = extractPrice(card);
        }
        if (!card.dataset.image) {
            card.dataset.image = card.querySelector('.product-image').src;
        }
    });
});

/**
 * Updates the cart count badge in the header
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountBadge = document.querySelector('.cart-count');
    if (cartCountBadge) {
        cartCountBadge.textContent = cartCount;
        // Show/hide the badge based on count
        cartCountBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

/**
 * Add an item to the cart
 * @param {Object} product - The product to add to cart
 * @param {number} quantity - The quantity to add
 * @returns {boolean} - Success status
 */
function addToCart(product, quantity = 1) {
    try {
        if (!product || !product.id) {
            console.error('Invalid product object');
            return false;
        }
        
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingItemIndex !== -1) {
            // Update existing item quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart with required fields
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                color: product.color || 'Default',
                size: product.size || 'One Size',
                quantity: quantity
            };
            cart.push(cartItem);
        }
        
        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge();
        
        // Show notification
        showNotification('Item added to cart');
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

/**
 * Remove an item from cart
 * @param {number} index - The index of the item to remove
 * @returns {boolean} - Success status
 */
function removeFromCart(index) {
    try {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Remove the item
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart badge
            updateCartBadge();
            
            // Show notification
            showNotification('Item removed from cart');
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

/**
 * Update the quantity of a cart item
 * @param {number} index - The index of the item to update
 * @param {number} quantity - The new quantity
 * @returns {boolean} - Success status
 */
function updateCartItemQuantity(index, quantity) {
    try {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Update the quantity
        if (index >= 0 && index < cart.length) {
            if (quantity > 0) {
                cart[index].quantity = quantity;
                
                // Save updated cart
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart badge
                updateCartBadge();
                
                return true;
            } else {
                // If quantity is 0 or negative, remove the item
                return removeFromCart(index);
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return false;
    }
}

/**
 * Clear the entire cart
 * @returns {boolean} - Success status
 */
function clearCart() {
    try {
        // Reset cart to empty array
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Update cart badge
        updateCartBadge();
        
        // Show notification
        showNotification('Cart cleared');
        
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}

/**
 * Get all items in the cart
 * @returns {Array} - Cart items
 */
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * Calculate cart total
 * @returns {number} - Total price
 */
function getCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Set up event listeners for "Add to Cart" buttons 
 */
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get product data from data attributes
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                color: productCard.dataset.color || 'Default',
                size: productCard.dataset.size || 'One Size',
                quantity: 1
            };
            
            addToCart(product);
        });
    });
}

/**
 * Display a notification to the user
 * @param {string} message - The message to display
 */
function showNotification(message) {
    // Check if notification container exists, create if not
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(10px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Handles Buy Now functionality - adds item to cart and redirects to checkout
 */
function setupBuyNowButtons() {
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get product data from data attributes
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id || generateProductId(productCard),
                name: productCard.dataset.name || productCard.querySelector('.product-name').textContent,
                price: parseFloat(productCard.dataset.price) || extractPrice(productCard),
                image: productCard.dataset.image || productCard.querySelector('.product-image').src,
                color: getSelectedColor(productCard),
                size: getSelectedSize(productCard),
                quantity: 1
            };
            
            // Add to cart and redirect to checkout
            if (addToCart(product)) {
                window.location.href = 'CART_PAGE.html?checkout=true';
            }
        });
    });
}

/**
 * Makes variation options selectable
 */
function setupVariationOptions() {
    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from siblings
            const siblings = this.parentElement.querySelectorAll('.size-option');
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from siblings
            const siblings = this.parentElement.querySelectorAll('.color-option');
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

/**
 * Get the selected color from a product card
 */
function getSelectedColor(productCard) {
    const selectedColor = productCard.querySelector('.color-option.selected');
    if (selectedColor) {
        return selectedColor.style.backgroundColor;
    }
    
    // Default to first color if none selected
    const firstColor = productCard.querySelector('.color-option');
    if (firstColor) {
        firstColor.classList.add('selected');
        return firstColor.style.backgroundColor;
    }
    
    return 'Default';
}

/**
 * Get the selected size from a product card
 */
function getSelectedSize(productCard) {
    const selectedSize = productCard.querySelector('.size-option.selected');
    if (selectedSize) {
        return selectedSize.textContent;
    }
    
    // Default to first size if none selected
    const firstSize = productCard.querySelector('.size-option');
    if (firstSize) {
        firstSize.classList.add('selected');
        return firstSize.textContent;
    }
    
    return 'One Size';
}

/**
 * Extract price from product card
 */
function extractPrice(productCard) {
    const priceEl = productCard.querySelector('.current-price');
    if (priceEl) {
        return parseFloat(priceEl.textContent.replace(/[^\d.]/g, ''));
    }
    return 0;
}

/**
 * Generate a unique ID for products that don't have one
 */
function generateProductId(productCard) {
    const name = productCard.querySelector('.product-name').textContent;
    const brand = productCard.querySelector('.product-brand').textContent;
    return `${brand}-${name}`.replace(/\s+/g, '-').toLowerCase();
}

// Add CSS for new elements
(function addStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        .buttons-container {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .add-to-cart-btn, .buy-now-btn {
            flex: 1;
            padding: 8px 0;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s ease;
            border: none;
        }
        
        .add-to-cart-btn {
            background: #000;
            color: #fff;
        }
        
        .buy-now-btn {
            background: #ff3e3e;
            color: #fff;
        }
        
        .buy-now-btn:hover {
            background: #ff1a1a;
        }
        
        .variation-title {
            font-size: 12px;
            color: #666;
            margin: 8px 0 4px;
            text-align: left;
        }
        
        .color-options, .size-options {
            display: flex;
            gap: 5px;
            margin-bottom: 8px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .color-option {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #ddd;
            transition: transform 0.2s;
        }
        
        .color-option.selected {
            transform: scale(1.2);
            border: 2px solid #000;
        }
    `;
    document.head.appendChild(styles);
})(); 