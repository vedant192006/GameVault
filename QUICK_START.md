# Quick Start Guide - GameVault Shopping Cart

## 🚀 Running the Application

### Option 1: Using PHP Built-in Server (Recommended for Testing)
```bash
cd C:\Users\vedan\Desktop\Vedant\College\Second Year\ECOM\Vedant\GameVault\GameVault
php -S localhost:8000
```
Then open: `http://localhost:8000/index.html`

### Option 2: Using XAMPP/WAMP
1. Copy the GameVault folder to `C:\xampp\htdocs\`
2. Start Apache from XAMPP control panel
3. Open: `http://localhost/GameVault/index.html`

---

## 📂 Important Files & Their Purpose

### Backend (Server-Side)
| File | Purpose |
|------|---------|
| `cart.php` | Handles cart operations (add, remove, update) using PHP sessions |
| `checkout.php` | Processes customer orders and stores them in session |

### Frontend (Client-Side)
| File | Purpose |
|------|---------|
| `cart-script.js` | JavaScript for cart operations & AJAX communication |
| `script.js` | Product listing & filtering logic |
| `cart.html` | Shopping cart page UI |
| `products.html` | Product store page |

### Styling
| File | Purpose |
|------|---------|
| `cart-style.css` | Shopping cart page styling |
| `products.css` | Product page styling |
| `style.css` | Homepage styling |

---

## 🎮 User Actions & How They Work

### 1. Add Game to Cart
```
User clicks "Add to Cart" button
  ↓
JavaScript calls addToCart() function
  ↓
AJAX POST request to cart.php with action='add'
  ↓
PHP updates $_SESSION['cart'] array
  ↓
Returns JSON response to JavaScript
  ↓
Cart count badge updates
```

### 2. View Shopping Cart
```
User navigates to cart.html
  ↓
cart-script.js ShoppingCart class initializes
  ↓
Calls cart.php with action='get_cart'
  ↓
Getting all items from $_SESSION['cart']
  ↓
Displays items and calculates total with 18% tax
```

### 3. Checkout & Order
```
User clicks "Proceed to Checkout"
  ↓
Modal form opens for customer details
  ↓
User submits form
  ↓
AJAX POST to checkout.php with action='place_order'
  ↓
PHP creates Order ID and stores in $_SESSION['orders']
  ↓
Clears $_SESSION['cart']
  ↓
Shows success message with Order ID
```

---

## 🔑 Key PHP Functions

### cart.php
```php
// Add item to cart
case 'add':
    $_SESSION['cart'][] = ['title', 'price', 'quantity'];

// Remove item from cart
case 'remove':
    unset($_SESSION['cart'][key]);

// Get entire cart
case 'get_cart':
    return $_SESSION['cart'] with total calculation;

// Clear cart
case 'clear':
    $_SESSION['cart'] = [];
```

### checkout.php
```php
// Place order
case 'place_order':
    $order = create order from $_SESSION['cart'];
    $_SESSION['orders'][] = $order;
    $_SESSION['cart'] = []; // Clear cart
    return $order_id;
```

---

## 🛒 Session Data Structure

```
$_SESSION = [
    'cart' => [
        [
            'title' => 'Game Name',
            'price' => 2999,
            'quantity' => 2
        ],
        [
            'title' => 'Another Game',
            'price' => 3999,
            'quantity' => 1
        ]
    ],
    'orders' => [
        [
            'order_id' => 'ORD-20260420143022-5847',
            'customer_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '9876543210',
            'address' => 'Street Address...',
            'items' => [...],
            'total' => 8897,
            'order_date' => '2026-04-20 14:30:22',
            'status' => 'Pending'
        ]
    ]
]
```

---

## 📝 Form Fields in Checkout

```
Customer Information:
├── Full Name (required)
├── Email (required)
├── Phone Number (required, 10 digits)
├── Delivery Address (required, textarea)
└── Payment Method (required, dropdown)
    ├── Credit Card
    ├── Debit Card
    ├── UPI
    ├── Net Banking
    └── Cash on Delivery
```

---

## 💰 Price Calculation Formula

```
Subtotal = Sum of (Price × Quantity) for all items
Tax (18%) = Subtotal × 0.18
Total = Subtotal + Tax

Example:
  Item 1: ₹2999 × 2 = ₹5998
  Item 2: ₹3999 × 1 = ₹3999
  ─────────────────────────
  Subtotal = ₹9997
  Tax (18%) = ₹1799.46 → ₹1799 (rounded)
  Total = ₹11796
```

---

## 🔍 Debugging Tips

### Check if Session is Working
Add this to the top of cart.php:
```php
// Debug: Print session contents
echo '<pre>';
var_dump($_SESSION);
echo '</pre>';
```

### Check AJAX Requests
Open Browser DevTools (F12) → Network tab → Look for cart.php requests

### Console Logs
```javascript
// In cart-script.js, logs are added:
console.log('Cart loaded:', data);
console.log('Item added:', response);
```

---

## 📊 Session Persistence Details

### How Sessions Work
1. User visits site → PHP creates unique session ID
2. ID stored in browser cookie (PHPSESSID)
3. On each request, browser sends PHPSESSID
4. PHP looks up session file from session ID
5. $_SESSION data restored from file
6. Changes saved back to session file

### Session File Location (Windows)
```
C:\xampp\tmp\  (XAMPP)
C:\wamp\tmp\   (WAMP)
Or custom path in php.ini (session.save_path)
```

### Session ID Example
```
PHPSESSID = abc123def456ghi789jkl012mno345pq
(Sent in Set-Cookie header & request cookies)
```

---

## ⚠️ Important Notes

1. **No Database**: This implementation uses PHP sessions only (data lost on session timeout)
2. **Session Timeout**: Default 24 minutes of inactivity
3. **One User Per Browser**: If you clear cookies, new session is created
4. **No User Auth**: Cart not tied to user accounts yet
5. **Local Testing**: Works with `php -S localhost:8000`

---

## 🎯 For Production (Next Steps)

- [ ] Move order storage to MySQL database
- [ ] Add user authentication & login system
- [ ] Implement proper payment gateway (Razorpay/PayPal)
- [ ] Add email notifications for orders
- [ ] Use HTTPS/SSL encryption
- [ ] Implement CSRF token protection
- [ ] Add rate limiting for API calls
- [ ] Set up error logging
- [ ] Add admin dashboard for orders
- [ ] Implement product reviews & ratings

---

**Version**: 1.0  
**Last Updated**: April 20, 2026  
**Status**: ✅ Lab Assignment 5 Complete
