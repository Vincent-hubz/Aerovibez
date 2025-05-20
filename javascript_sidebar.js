document.addEventListener('DOMContentLoaded', function() {
    // Check if sidebar was already added (to prevent conflicts with other js files)
    if (!document.querySelector('.sidebar')) {
        // Create and append sidebar to the body
        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-content">
                <div class="sidebar-header">
                    <i class="fas fa-times close-sidebar"></i>
                </div>
                <ul class="sidebar-menu">
                    <li><a href="index.html">HOME</a></li>
                    <li><a href="main_shop.html">SHOP</a></li>
                    <li><a href="new_arrival.html">MENS</a></li>
                    <li><a href="womens_new_arrival.html">WOMENS</a></li>
                    <li><a href="kids_new_arrival.html">KIDS</a></li>
                    <li><a href="blogpage.html">BLOG</a></li>
                    <li><a href="cart.html">CART</a></li>
                </ul>
            </div>
        `;
        document.body.appendChild(sidebar);
    }
    
    // Add click event listener to menu button
    const menuButton = document.querySelector('.menu-icon-container');
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.sidebar').classList.add('active');
        });
    }
    
    // Toggle sidebar
    const closeIcon = document.querySelector('.close-sidebar');
    if (closeIcon) {
        closeIcon.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.remove('active');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const menuIcon = document.querySelector('.menu-icon-container');
        
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            menuIcon && !menuIcon.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
}); 
