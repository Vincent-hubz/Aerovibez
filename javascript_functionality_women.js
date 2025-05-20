// JavaScript for Women's section pages
document.addEventListener('DOMContentLoaded', function() {
    // Size selection functionality
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Find all size options in this product card
            const parentCard = this.closest('.product-card');
            const siblingOptions = parentCard.querySelectorAll('.size-option');
            
            // Remove selected class from all options
            siblingOptions.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });

    // Add hover effect for quick view button
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

    // Add to cart functionality
    window.addToCart = function(productElement) {
        const productName = productElement.querySelector('.product-name').textContent;
        const productPrice = productElement.querySelector('.current-price').textContent;
        let selectedSize = productElement.querySelector('.size-option.selected');
        
        if (!selectedSize) {
            alert('Please select a size before adding to cart.');
            return;
        }
        
        selectedSize = selectedSize.textContent;
        
        // Create cart item object
        const cartItem = {
            name: productName,
            price: productPrice,
            size: selectedSize,
            quantity: 1
        };
        
        // Get current cart from localStorage or initialize empty array
        let cart = JSON.parse(localStorage.getItem('womenCart')) || [];
        
        // Check if item already exists in cart (same product and size)
        const existingItemIndex = cart.findIndex(item => 
            item.name === cartItem.name && item.size === cartItem.size
        );
        
        if (existingItemIndex > -1) {
            // If item exists, increment quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // Otherwise add new item
            cart.push(cartItem);
        }
        
        // Save cart back to localStorage
        localStorage.setItem('womenCart', JSON.stringify(cart));
        
        // Show confirmation to user
        alert(`${productName} (Size: ${selectedSize}) added to cart!`);
        
        // Update cart count in header if element exists
        updateCartCount(cart);
    };
    
    // Function to update cart count display
    function updateCartCount(cart) {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCountElement.style.display = 'block';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }
    
    // Initialize cart count on page load
    const cart = JSON.parse(localStorage.getItem('womenCart')) || [];
    updateCartCount(cart);
    
    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim().toLowerCase();
                if (searchTerm) {
                    // Filter products based on search term
                    const products = document.querySelectorAll('.product-card');
                    let found = false;
                    
                    products.forEach(product => {
                        const productName = product.querySelector('.product-name').textContent.toLowerCase();
                        const productBrand = product.querySelector('.product-brand').textContent.toLowerCase();
                        
                        if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
                            product.style.display = 'block';
                            found = true;
                        } else {
                            product.style.display = 'none';
                        }
                    });
                    
                    if (!found) {
                        alert('No matching products found.');
                        // Reset display
                        products.forEach(product => {
                            product.style.display = 'block';
                        });
                    }
                }
            }
        });
    }
    
    // Filter functionality
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    function applyFilters() {
        const products = document.querySelectorAll('.product-card');
        
        // Get selected categories
        const selectedCategories = Array.from(
            document.querySelectorAll('.filter-section:nth-of-type(1) input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.nextElementSibling.textContent.toLowerCase());
        
        // Get selected brands
        const selectedBrands = Array.from(
            document.querySelectorAll('.filter-section:nth-of-type(2) input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.nextElementSibling.textContent.toLowerCase());
        
        products.forEach(product => {
            const productBrand = product.querySelector('.product-brand').textContent.toLowerCase();
            const productName = product.querySelector('.product-name').textContent.toLowerCase();
            
            // Simple category detection based on product name
            let matchesCategory = false;
            if (selectedCategories.length === 0) {
                matchesCategory = true;
            } else {
                for (const category of selectedCategories) {
                    if (productName.includes(category)) {
                        matchesCategory = true;
                        break;
                    }
                }
            }
            
            // Check if brand matches selected brands
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
            
            // Show/hide product based on filter
            product.style.display = (matchesCategory && matchesBrand) ? 'block' : 'none';
        });
    }
}); 