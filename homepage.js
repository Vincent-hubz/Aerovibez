document.addEventListener('DOMContentLoaded', function() {
    // Banner image hover effects enhancement
    const bannerItems = document.querySelectorAll('.banner-item');
    
    bannerItems.forEach(item => {
        // Smooth transition for shop now button
        const button = item.querySelector('.shop-now-btn');
        
        item.addEventListener('mouseenter', function() {
            if (button) {
                button.style.opacity = '1';
                button.style.bottom = '40px';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (button) {
                button.style.opacity = '0';
                button.style.bottom = '30px';
            }
        });
    });

    // Bottom banner animation
    const bottomBanner = document.querySelector('.bottom-banner');
    const brandShopNow = document.querySelector('.brand-shop-now');
    
    if (bottomBanner && brandShopNow) {
        // Add subtle animation to draw attention to the main banner
        setTimeout(() => {
            brandShopNow.style.transform = 'translateX(-50%) scale(1.05)';
            setTimeout(() => {
                brandShopNow.style.transform = 'translateX(-50%) scale(1)';
            }, 500);
        }, 1000);
    }

    // Add click event to the collection button
    const collectionButton = document.querySelector('.brand-shop-now');
    if (collectionButton) {
        collectionButton.addEventListener('click', function() {
            window.location.href = 'main_shop.html'; // Redirect to main shop
        });
    }

    // Shopping cart functionality
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        const cartContainer = cartIcon.closest('.icon-container');
        
        cartContainer.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'CART_PAGE.html';
        });
    }
    
    // Profile icon functionality
    const profileIcon = document.querySelector('.fa-user');
    if (profileIcon) {
        const profileContainer = profileIcon.closest('.icon-container');
        
        profileContainer.addEventListener('click', function(e) {
            e.preventDefault();
            // Check if user is logged in (simplified example)
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (isLoggedIn === 'true') {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past threshold
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease-in-out';
        } else {
            // Scrolling up or at top
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Lazy load images for better performance
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px 200px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, imgOptions);
        
        // Find all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
}); 