
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type CartProduct = {
  id: number | string;
  name: string;
  price: number | string;
  image?: string;
  category?: string;
  description?: string;
  quantity?: number;
};

type CartContextType = {
  cartItems: CartProduct[];
  favouriteItems: CartProduct[];
  totalPrice: number;
  addToCart: (product: CartProduct) => void;
  increaseQuantity: (id: number | string) => void;
  decreaseQuantity: (id: number | string) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  addToFavourite: (product: CartProduct) => void;
  removeFromFavourite: (id: number | string) => void;
  toggleFavourite: (product: CartProduct) => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [favouriteItems, setFavouriteItems] = useState<CartProduct[]>([]);

  const addToCart = (product: CartProduct) => {
    setCartItems((previous) => {
      const existing = previous.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: number | string) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number | string) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0)
    );
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToFavourite = (product: CartProduct) => {
    setFavouriteItems((previous) => {
      const exists = previous.some(
        (item) => item.id === product.id
      );

      return exists ? previous : [...previous, product];
    });
  };

  const removeFromFavourite = (id: number | string) => {
    setFavouriteItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const toggleFavourite = (product: CartProduct) => {
    setFavouriteItems((previous) => {
      const exists = previous.some(
        (item) => item.id === product.id
      );

      return exists
        ? previous.filter((item) => item.id !== product.id)
        : [...previous, product];
    });
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : Number(String(item.price).replace(/[^\d.]/g, ''));

    return total + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        favouriteItems,
        totalPrice,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        addToFavourite,
        removeFromFavourite,
        toggleFavourite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart CartProvider ішінде қолданылуы керек'
    );
  }

  return context;
}
