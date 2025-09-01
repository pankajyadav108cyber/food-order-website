document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Hamburger Menu ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
    // --- Scroll to Top Button ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    window.onscroll = () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    };
    scrollTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    // --- State Management ---
    let cart = [];
    let orders = [];
    let isLoggedIn = false;

    // --- Element Selectors ---
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartModalBackdrop = document.getElementById('cart-modal-backdrop');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const menuContainer = document.querySelector('.main-content');
    const checkoutButton = document.getElementById('checkout-btn');
    const loginLogoutButton = document.getElementById('login-logout-button');
    const ordersContainer = document.getElementById('orders-container');
    const customAlert = document.getElementById('custom-alert');

    // --- Local Storage Functions ---
    const saveState = () => {
        localStorage.setItem('foodCart', JSON.stringify(cart));
        localStorage.setItem('foodOrders', JSON.stringify(orders));
        localStorage.setItem('foodUserLogin', JSON.stringify(isLoggedIn));
    };

    const loadState = () => {
        cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        orders = JSON.parse(localStorage.getItem('foodOrders')) || [];
        isLoggedIn = JSON.parse(localStorage.getItem('foodUserLogin')) || false;
    };

    // --- UI Update Functions ---
    const toggleCartModal = (show) => cartModalBackdrop.classList.toggle('hidden', !show);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
        cartCountElement.parentElement.classList.add('cart-bump');
        setTimeout(() => cartCountElement.parentElement.classList.remove('cart-bump'), 300);
    };

    const updateQuantity = (itemId, change) => {
        const item = cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== itemId);
            }
        }
        updateCart();
    };

    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-medium);">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>RS ${item.price}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                        <button class="remove-item" data-id="${item.id}">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartCountElement.textContent = totalItems;
        cartTotalElement.textContent = `RS ${totalPrice}`;
        saveState();
    };
    
    const renderOrders = () => {
        if (!ordersContainer) return;
        ordersContainer.innerHTML = '';
        if (!isLoggedIn || orders.length === 0) {
             ordersContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-medium);">Please log in to see your order history.</p>';
             if(isLoggedIn && orders.length === 0){
                 ordersContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-medium);">You have no past orders.</p>';
             }
        } else {
            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'order-card';
                const itemsHtml = order.items.map(item => `<div class="order-item"><span>${item.name} (x${item.quantity})</span><span>RS ${item.price * item.quantity}</span></div>`).join('');
                const shippingHtml = `
                    <div class="order-card-shipping">
                        <strong>Shipped to:</strong> ${order.shipping.fullName}<br>
                        ${order.shipping.address}, ${order.shipping.pinCode}<br>
                        Contact: ${order.shipping.phone}
                    </div>
                `;
                orderCard.innerHTML = `
                    <div class="order-card-header">
                        <h4>Order #${order.id}</h4>
                        <span>${order.date}</span>
                    </div>
                    <div class="order-card-body">
                        ${shippingHtml}
                        ${itemsHtml}
                    </div>
                    <div class="order-card-footer"><strong>Total: RS ${order.total}</strong></div>`;
                ordersContainer.appendChild(orderCard);
            });
        }
    };
    
    const updateLoginStatus = () => {
        if (!loginLogoutButton) return;
        if (isLoggedIn) {
            loginLogoutButton.textContent = 'Logout';
            loginLogoutButton.href = '#'; 
        } else {
            loginLogoutButton.textContent = 'Login';
            loginLogoutButton.href = 'login.html';
        }
    };

    const showCustomAlert = (message) => {
        if (!customAlert) return;
        customAlert.textContent = message;
        customAlert.classList.remove('hidden');
        setTimeout(() => {
            customAlert.classList.add('hidden');
        }, 3000);
    };

    // --- Event Listeners ---
    menuContainer.addEventListener('click', (e) => {
        const productBox = e.target.closest('.box');
        if (!productBox) return;

        if (!isLoggedIn) {
            showCustomAlert('Please log in to add items to your cart.');
            return;
        }

        const item = {
            id: productBox.dataset.id,
            name: productBox.dataset.name,
            price: parseInt(productBox.dataset.price),
            image: productBox.dataset.image,
        };

        if (e.target.classList.contains('add-to-cart-btn')) {
            addToCart(item);
        }
        
        if (e.target.classList.contains('buy-now-btn')) {
            addToCart(item);
            window.location.href = 'checkout.html'; 
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const itemId = target.dataset.id;
        if (target.classList.contains('quantity-btn')) {
            const change = parseInt(target.dataset.change);
            updateQuantity(itemId, change);
        }
        if (target.classList.contains('remove-item')) {
            updateQuantity(itemId, -Infinity);
        }
    });
    
    if(checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                showCustomAlert('Your cart is empty.');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    if(loginLogoutButton) {
        loginLogoutButton.addEventListener('click', (e) => {
            if (isLoggedIn) {
                e.preventDefault(); 
                isLoggedIn = false;
                orders = [];
                cart = [];
                localStorage.removeItem('foodUserDetails');
                saveState(); 
                updateLoginStatus();
                updateCart();
                renderOrders();
                showCustomAlert('You have been logged out.');
            }
        });
    }

    cartButton.addEventListener('click', (e) => { e.preventDefault(); toggleCartModal(true); });
    closeCartButton.addEventListener('click', () => toggleCartModal(false));
    cartModalBackdrop.addEventListener('click', (e) => { if (e.target === cartModalBackdrop) toggleCartModal(false); });
    
    // --- Initial Load ---
    loadState();
    updateCart();
    renderOrders();
    updateLoginStatus();
});

