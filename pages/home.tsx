// pages/home.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch products from the API
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleAddToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { id: product.id, quantity: 1 }]);
    }
  };

  const handleCheckout = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: cart }),
    });

    const data = await response.json();
    setTotal(data.total);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>
              {product.name} - {product.price} - Stock: {product.quantity}
            </span>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            Product {item.id} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>

      <button onClick={handleCheckout}>Checkout</button>

      {total > 0 && <h2>Total: {total}</h2>}
    </div>
  );
}
