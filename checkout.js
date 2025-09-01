document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    let orders = [];
    let userDetails = {};
    const orderSummaryContainer = document.getElementById('order-summary-items');
    const summaryTotalElement = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const loadState = () => {
        cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        orders = JSON.parse(localStorage.getItem('foodOrders')) || [];
        userDetails = JSON.parse(localStorage.getItem('foodUserDetails')) || {};
        if (cart.length === 0) {
            window.location.href = 'index.html';
        }
    };

    const saveState = () => {
        localStorage.setItem('foodCart', JSON.stringify(cart));
        localStorage.setItem('foodOrders', JSON.stringify(orders));
        localStorage.setItem('foodUserDetails', JSON.stringify(userDetails));
    };
    const renderOrderSummary = () => {
        orderSummaryContainer.innerHTML = '';
        if (cart.length > 0) {
            cart.forEach(item => {
                const summaryItem = document.createElement('div');
                summaryItem.className = 'summary-item';
                summaryItem.innerHTML = `
                    <span class="item-name">${item.name} (x${item.quantity})</span>
                    <span class="item-price">RS ${item.price * item.quantity}</span>
                `;
                orderSummaryContainer.appendChild(summaryItem);
            });
        }
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        summaryTotalElement.textContent = `RS ${totalPrice}`;
    };

    const prefillForm = () => {
        document.getElementById('fullName').value = userDetails.fullName || '';
        document.getElementById('address').value = userDetails.address || '';
        document.getElementById('pinCode').value = userDetails.pinCode || '';
        document.getElementById('phone').value = userDetails.phone || '';
    };
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        userDetails = {
            fullName: document.getElementById('fullName').value,
            address: document.getElementById('address').value,
            pinCode: document.getElementById('pinCode').value,
            phone: document.getElementById('phone').value,
        };
        const newOrder = {
            id: Date.now().toString().slice(-6),
            date: new Date().toLocaleDateString("en-IN"),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: userDetails
        };
        orders.unshift(newOrder);
        cart = [];
        saveState();
        window.location.href = 'index.html#orders';
    });
    loadState();
    renderOrderSummary();
    prefillForm();
});

