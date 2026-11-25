
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favouriteItems, setFavouriteItems] = useState([]);

  // Себетке қосу
  const addToCart = (product) => {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });
  };

  // Тауар санын көбейту
  const increaseQuantity = (id) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Тауар санын азайту
  const decreaseQuantity = (id) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Себеттен өшіру
  const removeFromCart = (id) => {
    setCartItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // Себетті тазалау
  const clearCart = () => {
    setCartItems([]);
  };

  // Таңдаулыларға қосу
  const addToFavorites = (product) => {
    setFavouriteItems((previous) => {
      const exists = previous.some((item) => item.id === product.id);

      if (exists) return previous;

      return [...previous, product];
    });
  };

  // Таңдаулылардан өшіру
  const removeFromFavorites = (id) => {
    setFavouriteItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // Жалпы баға
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        favouriteItems,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
