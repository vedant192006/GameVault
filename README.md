# GameVault Shopping Cart System - Lab Assignment 5
## Implementing a Simple Shopping Cart with Session Handling

### 📋 Project Overview
This is a complete e-commerce shopping cart implementation using **PHP for server-side session handling** and **JavaScript for client-side cart management**. The system demonstrates the tech backbone of modern e-commerce platforms.

---

## 🎯 Objectives Completed

✅ **Add-to-Cart Functionality** - Users can add games to cart with quantity selection  
✅ **Session-Based Quantity Tracking** - PHP sessions maintain cart data on the server  
✅ **Complete Checkout System** - Customer information collection and order processing  
✅ **Order Management** - Order tracking with order IDs and timestamps  
✅ **Tax Calculation** - Automatic 18% tax calculation  

---

## 📁 File Structure

### Core Files Created/Modified:

```
GameVault/
├── index.html                 (Updated - Added cart link)
├── products.html              (Updated - Added cart integration)
├── script.js                  (Updated - Enhanced with cart display logic)
├── style.css                  (Existing)
├── products.css               (Updated - Added cart button styling)
│
├── 🆕 cart.php               (NEW - Session handling backend)
├── 🆕 checkout.php           (NEW - Checkout & order processing)
├── 🆕 cart.html              (NEW - Shopping cart page)
├── 🆕 cart-style.css         (NEW - Cart page styling)
├── 🆕 cart-script.js         (NEW - Cart functionality JavaScript)
└── README.md                  (This file)
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **PHP 7.4+** | Server-side session management, order processing |
| **JavaScript (ES6)** | Client-side cart operations, AJAX communication |
| **HTML5** | Semantic markup for cart and checkout pages |
| **CSS3** | Responsive styling with gradients and animations |
| **Sessions** | Server-side cart persistence |

---

## 🔧 How It Works

### 1. **Session Initialization (cart.php)**
```php
session_start();
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = array();
}
```
- PHP automatically creates a session for each user
- Cart is stored as a PHP array in `$_SESSION['cart']`
- Persists across page navigation within the same session

### 2. **Adding Items to Cart**
**Flow:** Product Page → JavaScript → AJAX → cart.php → Session

```javascript
// Frontend (cart-script.js)
fetch('cart.php', {
    method: 'POST',
    body: `action=add&title=${gameTitle}&quantity=${qty}`
})
```

```php
// Backend (cart.php)
case 'add':
    // Check if item exists, update quantity or add new
    // Store: ['title', 'price', 'quantity']
    $_SESSION['cart'][] = $item;
```

### 3. **Cart Display**
- `cart.html` displays all items in session
- Real-time quantity updates
- Total price calculation with 18% tax

### 4. **Checkout Process**
- Customer fills checkout form (Name, Email, Phone, Address, Payment)
- Order is created with unique Order ID
- Cart is cleared after successful order
- Order stored in `$_SESSION['orders']`

---

## 🎮 User Journey

### 1. **Product Browsing**
```
index.html → products.html → Select Games + Quantity → Add to Cart
```

### 2. **Shopping Cart**
```
cart.html → View Items → Update Quantities → Proceed to Checkout
```

### 3. **Checkout & Order**
```
Checkout Form → Validate → Place Order → Success Message + Order ID
```

### 4. **After Purchase**
```
Order stored in session → Order History available
```

---

## 📝 API Endpoints (cart.php & checkout.php)

### cart.php Actions

| Action | Method | Parameters | Response |
|--------|--------|-----------|----------|
| `add` | POST | `title`, `quantity` | `{status, message, cart_count}` |
| `remove` | POST | `title` | `{status, message, cart_count}` |
| `update` | POST | `title`, `quantity` | `{status, message}` |
| `get_cart` | POST | - | `{items[], total, count}` |
| `clear` | POST | - | `{status, message}` |

### checkout.php Actions

| Action | Method | Parameters | Response |
|--------|--------|-----------|----------|
| `place_order` | POST | `name`, `email`, `phone`, `address`, `payment` | `{status, order_id, total}` |
| `get_order_history` | POST | - | `{orders[]}` |

---

## 💻 Code Examples

### Adding Item to Cart (JavaScript)
```javascript
function addToCart(gameTitle, price) {
    const quantity = document.getElementById(`quantity-${gameTitle}`).value;
    
    fetch('cart.php', {
        method: 'POST',
        body: `action=add&title=${encodeURIComponent(gameTitle)}&quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showNotification(data.message);
            updateCartCount(data.cart_count);
        }
    });
}
```

### Session-Based Cart Storage (PHP)
```php
// Each item in session:
$_SESSION['cart'][] = array(
    'title' => 'Game Name',
    'price' => 2999,
    'quantity' => 2
);

// Cart persists across requests:
// Request 1: Add item → $_SESSION['cart'] = [item1, item2]
// Request 2: Remove item → $_SESSION['cart'] = [item1]
// Request 3: Update quantity → $_SESSION['cart'] = [updated_item1]
```

### Order Processing (PHP)
```php
// Create order with timestamp
$order_id = 'ORD-' . date('YmdHis') . '-' . rand(1000, 9999);

// Store order
$_SESSION['orders'][] = array(
    'order_id' => $order_id,
    'customer_name' => $name,
    'items' => $_SESSION['cart'],
    'total' => $total,
    'order_date' => date('Y-m-d H:i:s'),
    'status' => 'Pending'
);

// Clear cart after successful order
$_SESSION['cart'] = array();
```

---

## 🎨 Key Features

### ✨ User Experience
- **Real-time Updates**: Cart count updates instantly
- **Quantity Control**: Adjust quantities or remove items
- **Price Calculation**: Automatic subtotal, tax, and total
- **Notifications**: Toast messages for user actions
- **Responsive Design**: Works on mobile, tablet, and desktop

### 🔒 Security Features
- **Input Sanitization**: Using `htmlspecialchars()` for XSS protection
- **Session Validation**: Checking for empty cart before checkout
- **Price Verification**: Price fetched from backend, not client

### 📊 Admin Data
- **Order Records**: Each order stored with full details
- **Order ID**: Unique identifier for each transaction
- **Order History**: Track all orders in session

---

## 🚀 Setup & Running

### Requirements
- **Server**: Apache or Nginx with PHP 7.4+
- **Browser**: Modern browser with JavaScript enabled
- **Session Support**: PHP sessions enabled (default)

### Setup Steps

1. **Place files in web root**
   ```
   /var/www/html/GameVault/  (Linux)
   C:\xampp\htdocs\GameVault\ (Windows XAMPP)
   ```

2. **Start PHP server** (for local testing)
   ```bash
   php -S localhost:8000
   ```

3. **Access in browser**
   ```
   http://localhost:8000/index.html
   ```

---

## 🔄 Session Flow Diagram

```
┌─────────────────────────────────────────┐
│   User Visits Website                   │
│   (Browser requests page)               │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   PHP session_start()                   │
│   Creates session ID (PHPSESSID)        │
│   Sets cookie in browser                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   User Adds Item to Cart                │
│   (AJAX POST to cart.php)               │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   cart.php receives request             │
│   Browser sends PHPSESSID cookie        │
│   PHP resumes user's session            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Update $_SESSION['cart']              │
│   Add/Update/Remove item                │
│   Return JSON response                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   JavaScript updates UI                 │
│   Show cart count & notification        │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Recommendations

### Test Cases
1. ✅ Add single item to cart
2. ✅ Add multiple quantities of same item
3. ✅ Add different items to cart
4. ✅ Update item quantity
5. ✅ Remove item from cart
6. ✅ Clear entire cart
7. ✅ Complete checkout with valid data
8. ✅ Verify tax calculation (18%)
9. ✅ Verify order ID generation
10. ✅ Check cart persistence on page reload

---

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| IE 11 | ⚠️ Partial (Fetch API needed) |

---

## 🔐 Security Notes

### Current Implementation (Development)
- Session-based storage (server-side)
- Input sanitization with htmlspecialchars()
- CORS-aware fetch requests

### For Production
- Add HTTPS/SSL
- Implement CSRF tokens
- Use prepared statements if database added
- Add rate limiting
- Store orders in database
- Add payment gateway integration
- Implement user authentication

---

## 🎓 Learning Outcomes

This lab demonstrates:

1. **Client-Server Communication**
   - AJAX for asynchronous requests
   - JSON data format
   - Request/response handling

2. **Session Management**
   - PHP session initialization
   - Persistent data storage
   - Session ID tracking

3. **E-Commerce Fundamentals**
   - Cart operations (CRUD)
   - Checkout workflow
   - Order processing

4. **Web Security Basics**
   - Input sanitization
   - Server-side validation
   - Session security

---

## 📞 Support & Troubleshooting

### Issue: "Session not found" error
**Solution**: Ensure `session_start()` is the first line in PHP files

### Issue: Cart not persisting on page reload
**Solution**: Check browser cookie settings and PHP session configuration

### Issue: AJAX requests failing
**Solution**: Verify PHP files are in same directory and server is running

---

## 🎉 Conclusion

This shopping cart system provides a complete, practical implementation of e-commerce session handling. It serves as a solid foundation for understanding how real-world online stores manage user carts and orders.

---

**Lab Status**: ✅ Complete  
**Date**: April 2026  
**Technologies**: PHP, JavaScript, HTML5, CSS3, Sessions
