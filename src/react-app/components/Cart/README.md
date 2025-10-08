# Shopping Cart Component Package

A comprehensive React shopping cart solution with global state management, built with TypeScript and Tailwind CSS.

## 🚀 Features

- **Global State Management**: React Context-based cart state management
- **Unified Component**: Combined cart icon and drawer in a single component
- **Real-time Updates**: Automatic UI updates when cart state changes
- **Quantity Management**: Add, remove, and update item quantities
- **Checkout Integration**: Built-in payment session creation
- **Responsive Design**: Mobile-friendly interface
- **TypeScript Support**: Full type safety and IntelliSense
- **Tailwind CSS**: Modern, customizable styling
- **Flexible Integration**: Use `useCart` hook for custom cart implementations

## 📦 Installation

The cart components are already included in your project. No additional installation required.

## 🛠️ Quick Start

### 1. Setup CartProvider

Wrap your application with `CartProvider` at the root level:

```tsx
import { CartProvider } from "./components/Cart";

function App() {
  return (
    <CartProvider>
      <YourApp />
    </CartProvider>
  );
}
```

### 2. Add Cart Icon

Place the `CartIcon` component anywhere in your app where you want the cart icon to appear:

```tsx
import { CartIcon } from "./components/Cart";

function Header() {
  return (
    <header>
      <h1>My Store</h1>
      <CartIcon /> {/* Cart icon with integrated drawer */}
    </header>
  );
}
```

### 3. Add Products to Cart

Use the `useCart` hook to add products to the cart:

```tsx
import { useCart } from "./components/Cart";

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

## 📚 API Reference

### CartProvider

The context provider that manages global cart state.

**Props:**

- `children: ReactNode` - Child components

**Usage:**

```tsx
<CartProvider>
  <YourApp />
</CartProvider>
```

### CartIcon

A unified component that combines the shopping cart icon and drawer functionality.

**Features:**

- Shopping bag icon with item count badge
- Integrated drawer-style cart display
- Internal state management for open/close
- Item quantity controls
- Checkout integration

**Usage:**

```tsx
<CartIcon />
```

**No props required** - The component manages its own state internally.

### Adding Items to Cart

Use the `addItem` method from the `useCart` hook to add products to the cart.

**Method:**

- `addItem(item: Omit<CartItem, "quantity">)` - Adds an item to the cart

**Usage:**

```tsx
import { useCart } from "./components/Cart";

function MyComponent() {
  const { addItem } = useCart();

  const handleAddProduct = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });
  };

  return (
    <button onClick={() => handleAddProduct(myProduct)}>Add to Cart</button>
  );
}
```

### useCart Hook

Access cart state and methods in your components.

**Returns:**

```tsx
const {
  items, // CartItem[] - Array of cart items
  addItem, // (item: Omit<CartItem, "quantity">) => void
  updateQuantity, // (id: string, quantity: number) => void
  removeItem, // (id: string) => void
  clearCart, // () => void
  getTotalItems, // () => number
  getTotalPrice, // () => number
  isInCart, // (id: string) => boolean
} = useCart();
```

**Usage:**

```tsx
import { useCart } from "./components/Cart";

function MyComponent() {
  const { items, addItem, getTotalItems } = useCart();

  return (
    <div>
      <p>Items in cart: {getTotalItems()}</p>
      {/* Your component logic */}
    </div>
  );
}
```

## 🎯 Data Types

### CartItem Interface

```tsx
interface CartItem {
  id: string; // Unique item identifier
  name: string; // Item name
  price: number; // Item price
  quantity: number; // Item quantity
  image?: string; // Item image URL (optional)
  description?: string; // Item description (optional)
}
```

## 💡 Usage Examples

### Basic E-commerce Page

```tsx
import { CartProvider, CartIcon, useCart } from "./components/Cart";

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

function ProductPage() {
  const products = [
    { id: "1", name: "Laptop", price: 999.99, image: "/laptop.jpg" },
    { id: "2", name: "Mouse", price: 29.99, image: "/mouse.jpg" },
  ];

  return (
    <CartProvider>
      <div>
        <header>
          <h1>My Store</h1>
          <CartIcon />
        </header>

        <main>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>
    </CartProvider>
  );
}
```

### Custom Cart Integration

```tsx
import { useCart } from "./components/Cart";

function CustomCartSummary() {
  const { items, getTotalPrice, clearCart } = useCart();

  return (
    <div>
      <h3>Cart Summary</h3>
      <p>Total: ${getTotalPrice().toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### Programmatic Cart Management

```tsx
import { useCart } from "./components/Cart";

function ProductManager() {
  const { addItem, removeItem, updateQuantity, isInCart } = useCart();

  const handleAddProduct = (product) => {
    if (isInCart(product.id)) {
      // Update quantity if already in cart
      updateQuantity(product.id, 2);
    } else {
      // Add new item
      addItem(product);
    }
  };

  return (
    <div>
      <button onClick={() => handleAddProduct(myProduct)}>Add to Cart</button>
    </div>
  );
}
```

## 🎨 Styling

The components use Tailwind CSS classes and can be customized by:

1. **Modifying the component files** directly
2. **Using CSS-in-JS** solutions
3. **Extending Tailwind** configuration
4. **Adding custom CSS** classes

### Custom Styling Example

```tsx
// Override default styles
<CartIcon className="custom-cart-styles" />
```

## 🔧 Configuration

### Checkout Integration

The cart automatically integrates with your payment system. Update the checkout URL in `CartIcon.tsx`:

```tsx
const response = await fetch("/api/create-checkout-session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(checkoutData),
});
```

### API Endpoints

The cart expects these API endpoints:

- `POST /api/create-checkout-session` - Create payment session
- Returns: `{ checkoutUrl: string }` or `{ error: string }`

## 🚨 Error Handling

The cart includes built-in error handling for:

- **Network errors** during checkout
- **Invalid product data**
- **API failures**
- **Empty cart states**

## 📱 Responsive Design

The cart drawer is fully responsive:

- **Desktop**: 384px width (w-96)
- **Mobile**: Full width with proper spacing
- **Touch-friendly**: Large touch targets for mobile devices

## 🧪 Testing

Test the cart components with:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, CartIcon, useCart } from "./components/Cart";

function TestComponent({ product }) {
  const { addItem } = useCart();

  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

test("adds item to cart", () => {
  const product = { id: "1", name: "Test", price: 10 };

  render(
    <CartProvider>
      <TestComponent product={product} />
      <CartIcon />
    </CartProvider>
  );

  fireEvent.click(screen.getByText("Add to Cart"));
  expect(screen.getByText("Test")).toBeInTheDocument();
});
```

## 🔄 State Persistence

Cart state is automatically persisted using localStorage. The cart will remember items between browser sessions.

## 🎯 Best Practices

1. **Always wrap with CartProvider** at the app root
2. **Use useCart hook** for adding items to cart
3. **Handle loading states** in your checkout flow
4. **Validate product data** before adding to cart
5. **Test cart functionality** thoroughly
6. **Create reusable components** for consistent UX

## 🐛 Troubleshooting

### Common Issues

**Cart not updating:**

- Ensure `CartProvider` wraps your components
- Check that `useCart` is called within the provider

**Checkout not working:**

- Verify API endpoint is correct
- Check network requests in browser dev tools
- Ensure checkout data format is correct

**Styling issues:**

- Verify Tailwind CSS is properly configured
- Check for CSS conflicts
- Use browser dev tools to inspect classes

## 📄 License

This component package is part of your project and follows the same license terms.

## 🤝 Contributing

To modify the cart components:

1. Update the component files in `/components/Cart/`
2. Test your changes thoroughly
3. Update this README if needed
4. Ensure TypeScript types are correct

---

For more examples, see the `CartExamplePage.tsx` file in your project.
