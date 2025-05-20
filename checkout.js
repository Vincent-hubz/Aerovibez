document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    loadCartItems();
    
    // Initialize shipping options
    initShippingOptions();
    
    // Set up event listeners
    document.querySelector('.discount-btn').addEventListener('click', applyDiscount);
    document.querySelector('.place-order-btn').addEventListener('click', placeOrder);
    
    // Form validation
    const formInputs = document.querySelectorAll('.shipping-details input[type="text"], .shipping-details input[type="tel"]');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
    });
});

// Load cart items from localStorage
function loadCartItems() {
    let cart = getCartItems(); // Use unified_cart.js function
    const orderItemsContainer = document.querySelector('.order-details');
    const orderSummary = document.querySelector('.order-summary');
    
    // Clear existing items (except the heading and summary)
    const existingItems = document.querySelectorAll('.order-item');
    existingItems.forEach(item => item.remove());
    
    // Insert heading before order summary
    const heading = document.createElement('h2');
    heading.textContent = 'Order Details';
    orderItemsContainer.insertBefore(heading, orderSummary);
    
    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        orderItemsContainer.insertBefore(emptyMessage, orderSummary);
        
        // Update order summary
        updateOrderSummary(0);
        return;
    }
    
    // Add cart items to order details
    let subtotal = 0;
    cart.forEach(item => {
        const orderItem = createOrderItem(item);
        orderItemsContainer.insertBefore(orderItem, orderSummary);
        subtotal += item.price * item.quantity;
    });
    
    // Update order summary
    updateOrderSummary(subtotal);
}

function createOrderItem(item) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="order-item-image">
        <div class="order-item-details">
            <div class="order-item-title">${item.name}</div>
            <div class="order-item-description">${item.color}</div>
            <div class="order-item-description">Size: ${item.size}</div>
            <div class="order-item-description">Quantity: ${item.quantity}</div>
            <div class="order-item-price">₱${item.price.toLocaleString()}</div>
        </div>
    `;
    return orderItem;
}

// Update order summary with subtotal, shipping, tax, and total
function updateOrderSummary(subtotal) {
    const shippingCost = getShippingCost();
    const tax = 0; // Assuming tax is 0 for now
    const total = subtotal + shippingCost + tax;
    
    // Update the summary display
    const summary = document.querySelector('.order-summary');
    summary.innerHTML = `
        <div class="order-row">
            <span>Sub Total:</span>
            <span>₱${subtotal.toLocaleString()}</span>
        </div>
        <div class="order-row">
            <span>Shipping Cost:</span>
            <span>₱${shippingCost.toLocaleString()}</span>
        </div>
        <div class="order-row">
            <span>Tax:</span>
            <span>₱${tax.toLocaleString()}</span>
        </div>
        <div class="order-row total">
            <span>Total:</span>
            <span>₱${total.toLocaleString()}</span>
        </div>
    `;
}

// Initialize shipping options
function initShippingOptions() {
    const standardShipping = document.getElementById('standard-shipping');
    const expressDelivery = document.getElementById('express-delivery');
    
    standardShipping.addEventListener('change', function() {
        if (this.checked) {
            expressDelivery.checked = false;
            updateOrderSummary(calculateSubtotal());
        }
    });
    
    expressDelivery.addEventListener('change', function() {
        if (this.checked) {
            standardShipping.checked = false;
            updateOrderSummary(calculateSubtotal());
        }
    });
}

// Get shipping cost based on selected option
function getShippingCost() {
    const expressDelivery = document.getElementById('express-delivery');
    return expressDelivery.checked ? 150 : 0;
}

// Calculate subtotal from cart items
function calculateSubtotal() {
    return getCartTotal(); // Use unified_cart.js function
}

// Apply discount coupon
function applyDiscount() {
    // Show a simple prompt for discount code
    const code = prompt('Enter discount code:');
    if (!code) return;
    
    // Sample discount codes
    const discountCodes = {
        'WELCOME10': 0.10,
        'SUMMER20': 0.20,
        'SALE30': 0.30
    };
    
    if (discountCodes[code]) {
        showNotification(`Discount of ${discountCodes[code] * 100}% applied!`);
        const subtotal = calculateSubtotal();
        const discount = subtotal * discountCodes[code];
        updateOrderSummaryWithDiscount(subtotal, discount);
    } else {
        showNotification('Invalid discount code', 'error');
    }
}

// Update order summary with discount
function updateOrderSummaryWithDiscount(subtotal, discount) {
    const shippingCost = getShippingCost();
    const tax = 0;
    const total = subtotal - discount + shippingCost + tax;
    
    // Update the summary display
    const summary = document.querySelector('.order-summary');
    summary.innerHTML = `
        <div class="order-row">
            <span>Sub Total:</span>
            <span>₱${subtotal.toLocaleString()}</span>
        </div>
        <div class="order-row">
            <span>Discount:</span>
            <span>-₱${discount.toLocaleString()}</span>
        </div>
        <div class="order-row">
            <span>Shipping Cost:</span>
            <span>₱${shippingCost.toLocaleString()}</span>
        </div>
        <div class="order-row">
            <span>Tax:</span>
            <span>₱${tax.toLocaleString()}</span>
        </div>
        <div class="order-row total">
            <span>Total:</span>
            <span>₱${total.toLocaleString()}</span>
        </div>
    `;
}

// Form validation
function validateField(e) {
    const field = e.target;
    if (!field.value.trim()) {
        field.style.borderColor = 'red';
        return false;
    } else {
        field.style.borderColor = '#ddd';
        return true;
    }
}

// Validate the entire form
function validateForm() {
    const formInputs = document.querySelectorAll('.shipping-details input[type="text"], .shipping-details input[type="tel"]');
    let valid = true;
    
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return valid;
}

// Place order
function placeOrder() {
    if (!validateForm()) {
        showNotification('Please fill in all the required shipping details.', 'error');
        return;
    }
    
    const cart = getCartItems(); // Use unified_cart.js function
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'error');
        return;
    }
    
    // Collect shipping details
    const shippingDetails = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        region: document.getElementById('region').value,
        province: document.getElementById('province').value,
        city: document.getElementById('city').value,
        barangay: document.getElementById('barangay').value,
        street: document.getElementById('street').value,
        postalCode: document.getElementById('postalCode').value,
        shippingMethod: document.getElementById('express-delivery').checked ? 'express' : 'standard'
    };
    
    // Create order object
    const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        items: cart,
        shipping: shippingDetails,
        subtotal: calculateSubtotal(),
        shippingCost: getShippingCost(),
        tax: 0,
        total: calculateSubtotal() + getShippingCost()
    };
    
    // Save order to localStorage
    saveOrder(order);
    
    // Clear cart using the unified_cart.js function
    clearCart();
    
    // Show success message
    showNotification('Order placed successfully!');
    
    // Redirect to order confirmation page
    setTimeout(() => {
        window.location.href = 'order_confirmation.html?id=' + order.id;
    }, 1000);
}

// Generate a unique order ID
function generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Save order to localStorage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
} 