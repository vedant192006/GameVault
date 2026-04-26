// Shopping Cart Management using LocalStorage (Pure JavaScript)
class ShoppingCart {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCart();
    }
    
    setupEventListeners() {
        const proceedBtn = document.getElementById('proceedBtn');
        const continueBtn = document.getElementById('continueBtn');
        const checkoutForm = document.getElementById('checkoutForm');
        const closeModal = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        const backToStoreBtn = document.getElementById('backToStoreBtn');
        
        if (proceedBtn) proceedBtn.addEventListener('click', () => this.openCheckout());
        if (continueBtn) continueBtn.addEventListener('click', () => this.continueShopping());
        if (checkoutForm) checkoutForm.addEventListener('submit', (e) => this.placeOrder(e));
        if (closeModal) closeModal.addEventListener('click', () => this.closeCheckout());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeCheckout());
        if (backToStoreBtn) backToStoreBtn.addEventListener('click', () => this.continueShopping());
    }
    
    getCartItems() {
        const cart = localStorage.getItem('gamevault_cart');
        return cart ? JSON.parse(cart) : [];
    }
    
    saveCartItems(items) {
        localStorage.setItem('gamevault_cart', JSON.stringify(items));
        this.updateCart();
        
        // Update counts on all open pages
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        updateCartCount(count);
    }
    
    loadCart() {
        const items = this.getCartItems();
        const data = {
            items: items.map(item => ({
                ...item,
                total: item.price * item.quantity
            })),
            total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            count: items.reduce((acc, item) => acc + item.quantity, 0)
        };
        this.updateCartDisplay(data);
    }
    
    updateCartDisplay(data) {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        updateCartCount(data.count);
        
        if (data.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
            document.getElementById('proceedBtn').disabled = true;
        } else {
            cartItems.innerHTML = data.items.map(item => `
                <div class="cart-item">
                    <div class="item-details">
                        <div class="item-title">${item.title}</div>
                        <div class="item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div class="item-controls">
                        <input type="number" min="1" value="${item.quantity}" 
                               class="quantity-input" 
                               onchange="cart.updateQuantity('${item.title}', this.value)">
                        <button class="remove-btn" onclick="cart.removeItem('${item.title}')">Remove</button>
                    </div>
                    <div class="item-total">₹${item.total.toLocaleString('en-IN')}</div>
                </div>
            `).join('');
            
            document.getElementById('proceedBtn').disabled = false;
        }
        
        // Update totals
        const subtotal = data.total;
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + tax;
        
        document.getElementById('subtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
        document.getElementById('tax').textContent = '₹' + tax.toLocaleString('en-IN');
        document.getElementById('total').textContent = '₹' + total.toLocaleString('en-IN');
        
        const checkoutTotal = document.getElementById('checkoutTotal');
        if (checkoutTotal) checkoutTotal.textContent = total.toLocaleString('en-IN');
    }
    
    updateQuantity(title, quantity) {
        quantity = parseInt(quantity);
        if (quantity <= 0) {
            this.removeItem(title);
            return;
        }
        
        const items = this.getCartItems();
        const item = items.find(i => i.title === title);
        if (item) {
            item.quantity = quantity;
            this.saveCartItems(items);
        }
    }
    
    removeItem(title) {
        const items = this.getCartItems();
        const newItems = items.filter(i => i.title !== title);
        this.saveCartItems(newItems);
        this.showMessage('Item removed from cart!');
    }
    
    openCheckout() {
        document.getElementById('checkoutModal').style.display = 'block';
    }
    
    closeCheckout() {
        document.getElementById('checkoutModal').style.display = 'none';
    }
    
    continueShopping() {
        window.location.href = 'products.html';
    }
    
    placeOrder(e) {
        e.preventDefault();
        
        const items = this.getCartItems();
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = Math.round(total * 0.18);
        const finalTotal = total + tax;

        // Simulate order processing
        const orderData = {
            status: 'success',
            order_id: 'GV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            total: finalTotal
        };

        // Clear cart
        localStorage.removeItem('gamevault_cart');
        updateCartCount(0);
        
        document.getElementById('checkoutModal').style.display = 'none';
        this.showOrderSuccess(orderData);
    }
    
    showOrderSuccess(data) {
        document.getElementById('orderId').textContent = 'Order ID: ' + data.order_id;
        document.getElementById('orderAmount').textContent = 'Total Amount: ₹' + data.total.toLocaleString('en-IN');
        document.getElementById('successModal').style.display = 'block';
    }
    
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            border-radius: 8px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }
    
    updateCart() {
        this.loadCart();
    }
}

// Global Add To Cart functionality
function addToCart(gameTitle, price) {
    const quantityInput = document.getElementById(`quantity-${gameTitle}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    let cartItems = localStorage.getItem('gamevault_cart');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    
    const existingItem = cartItems.find(item => item.title === gameTitle);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            title: gameTitle,
            price: price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('gamevault_cart', JSON.stringify(cartItems));
    
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    updateCartCount(totalCount);
    
    showNotification(`${gameTitle} added to cart!`, 'success');
}

function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('#cart-count, #index-cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize cart instance
let cart;
document.addEventListener('DOMContentLoaded', () => {
    // Standardize cart count on load
    let items = localStorage.getItem('gamevault_cart');
    items = items ? JSON.parse(items) : [];
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    updateCartCount(count);

    if (document.getElementById('cartItems')) {
        cart = new ShoppingCart();
    }
});
