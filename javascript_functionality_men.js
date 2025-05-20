// Cart functionality
function addToCart(productElement) {
  const selectedSize = productElement.querySelector('.size-option.selected');
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }

  const product = {
    name: productElement.querySelector('.product-name').textContent,
    brand: productElement.querySelector('.product-brand').textContent,
    price: productElement.querySelector('.current-price').textContent,
    image: productElement.querySelector('.product-image').src,
    size: selectedSize.textContent,
    quantity: 1
  };

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart with same size
  const existingProductIndex = cart.findIndex(item => 
    item.name === product.name && 
    item.size === product.size
  );

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart!');
}

// Size selection functionality
function initializeSizeSelection() {
  document.querySelectorAll('.product-variations').forEach(variations => {
    variations.querySelectorAll('.size-option').forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options in this product
        variations.querySelectorAll('.size-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        // Add selected class to clicked option
        option.classList.add('selected');
      });
    });
  });
}

// Filter functionality
function initializeFilters() {
  // Add data-category attribute to each product based on page
  const products = document.querySelectorAll('.product-card');
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('clothing.html')) {
    // Clothing categories
    if (products.length >= 1) products[0].dataset.category = "tshirts"; // Basic Cotton T-Shirt
    if (products.length >= 2) products[1].dataset.category = "hoodies"; // Essential Pullover Hoodie
    if (products.length >= 3) products[2].dataset.category = "pants";   // Utility Cargo Pants
    if (products.length >= 4) products[3].dataset.category = "jackets"; // Classic Denim Jacket
    if (products.length >= 5) products[4].dataset.category = "shorts";  // Casual Chino Shorts
    if (products.length >= 6) products[5].dataset.category = "tshirts"; // Classic Pique Polo
  } 
  else if (currentPath.includes('shoes.html')) {
    // Shoes categories
    if (products.length >= 1) products[0].dataset.category = "sneakers"; // Nike Air Force 1
    if (products.length >= 2) products[1].dataset.category = "sneakers"; // Adidas Forum Low
    if (products.length >= 3) products[2].dataset.category = "casual";   // Puma Suede Classic
    if (products.length >= 4) products[3].dataset.category = "casual";   // Converse Chuck Taylor
    if (products.length >= 5) products[4].dataset.category = "sneakers"; // Nike Blazer
    if (products.length >= 6) products[5].dataset.category = "formal";   // Adidas Stan Smith
  }
  else if (currentPath.includes('accessories.html')) {
    // Accessories categories
    if (products.length >= 1) products[0].dataset.category = "caps";    // Baseball Cap
    if (products.length >= 2) products[1].dataset.category = "bags";    // Backpack
    if (products.length >= 3) products[2].dataset.category = "wallets"; // Leather Wallet
    if (products.length >= 4) products[3].dataset.category = "watches"; // Digital Watch
    if (products.length >= 5) products[4].dataset.category = "caps";    // Bucket Hat
    if (products.length >= 6) products[5].dataset.category = "bags";    // Sling Bag
    if (products.length >= 7) products[6].dataset.category = "wallets"; // Card Holder
    if (products.length >= 8) products[7].dataset.category = "watches"; // Sports Watch
  }
  else if (currentPath.includes('sale.html')) {
    // Sale categories (mixed)
    if (products.length >= 1) products[0].dataset.category = "shoes";       // Nike Air Force 1
    if (products.length >= 2) products[1].dataset.category = "clothing";    // Basic Cotton T-Shirt
    if (products.length >= 3) products[2].dataset.category = "clothing";    // Pullover Hoodie
    if (products.length >= 4) products[3].dataset.category = "shoes";       // Adidas Stan Smith
    if (products.length >= 5) products[4].dataset.category = "clothing";    // Cargo Pants
    if (products.length >= 6) products[5].dataset.category = "accessories"; // G-Shock Watch
  }
  else if (currentPath.includes('new_arrival.html')) {
    // New arrival categories (mixed)
    if (products.length >= 1) products[0].dataset.category = "clothing";    // Graphic Tee
    if (products.length >= 2) products[1].dataset.category = "clothing";    // Denim Jacket
    if (products.length >= 3) products[2].dataset.category = "shoes";       // Urban Street Sneakers
    if (products.length >= 4) products[3].dataset.category = "accessories"; // G-Shock Watch
  }
  
  // Add event listeners to category checkboxes (first filter section)
  const categoryFilters = document.querySelectorAll('.filter-section:first-child .filter-option input');
  
  categoryFilters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
  
  // Add event listeners to brand checkboxes (second filter section)
  const brandFilters = document.querySelectorAll('.filter-section:nth-child(2) .filter-option input');
  
  brandFilters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
  
  // Add event listeners to size/other checkboxes if they exist (third filter section)
  const otherFilters = document.querySelectorAll('.filter-section:nth-child(3) .filter-option input');
  
  otherFilters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
  
  // Add event listeners to price range radios (fourth filter section)
  const priceFilters = document.querySelectorAll('.filter-section:nth-child(4) .filter-option input');
  
  priceFilters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
  
  // Apply filters based on selected checkboxes
  function applyFilters() {
    // Get selected categories from first filter section
    const selectedCategories = Array.from(categoryFilters)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.nextElementSibling.textContent.trim().toLowerCase());
    
    // Get selected brands from second filter section
    const selectedBrands = Array.from(brandFilters)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.nextElementSibling.textContent.trim());

    // Get selected price range from fourth filter section
    const selectedPriceRange = Array.from(priceFilters)
      .filter(radio => radio.checked)
      .map(radio => radio.nextElementSibling.textContent.trim());
    
    // Show all products if no filters are selected
    if (selectedCategories.length === 0 && selectedBrands.length === 0 && selectedPriceRange.length === 0) {
      products.forEach(product => {
        product.style.display = 'block';
      });
      return;
    }
    
    // Filter products based on selected filters
    products.forEach(product => {
      const category = product.dataset.category;
      const brand = product.querySelector('.product-brand').textContent.trim();
      
      // Get product price as a number
      const priceText = product.querySelector('.current-price').textContent;
      const price = parseFloat(priceText.replace('₱', '').replace(',', ''));
      
      // Check if product matches selected category filters
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.some(c => category && category.includes(c));
      
      // Check if product matches selected brand filters
      const matchesBrand = selectedBrands.length === 0 || 
                          selectedBrands.includes(brand);
      
      // Price range check
      let matchesPrice = true;
      if (selectedPriceRange.length > 0) {
        const priceRange = selectedPriceRange[0];
        
        if (priceRange.includes('Under')) {
          // Extract the number after "Under"
          const maxPrice = parseFloat(priceRange.match(/\d+,?\d*/)[0].replace(',', ''));
          matchesPrice = price < maxPrice;
        } else if (priceRange.includes('-')) {
          // Extract min and max from range like "₱500 - ₱1,000"
          const [minPriceStr, maxPriceStr] = priceRange.split('-').map(p => p.trim());
          const minPrice = parseFloat(minPriceStr.match(/\d+,?\d*/)[0].replace(',', ''));
          const maxPrice = parseFloat(maxPriceStr.match(/\d+,?\d*/)[0].replace(',', ''));
          matchesPrice = price >= minPrice && price <= maxPrice;
        } else if (priceRange.includes('Over')) {
          // Extract the number after "Over"
          const minPrice = parseFloat(priceRange.match(/\d+,?\d*/)[0].replace(',', ''));
          matchesPrice = price > minPrice;
        }
      }
      
      // Show product if it matches all selected filters
      if (matchesCategory && matchesBrand && matchesPrice) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSizeSelection();
  initializeFilters();
}); 