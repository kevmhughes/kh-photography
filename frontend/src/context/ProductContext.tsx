import React, { createContext, useContext, useState, useEffect } from "react";

export type Product = {
  title: string;
  variantId: number;
  retailPrice: number;
  quantity: number;
  totalPrice: number;
  img: string;
  size: string;
  fileId: number | undefined;
  sku: string
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, "totalPrice">) => void;
  removeProduct: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearProducts: () => void;
  cartTotal: number;
  totalItems: number;
  cartIsVisible: boolean;
  handleCartVisibility: () => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cart-products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart-products", JSON.stringify(products));
  }, [products]);

  // Add new product OR merge with existing one
  const addProduct = (product: Omit<Product, "totalPrice">) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.variantId === product.variantId);

      // If product exists → update quantity
      if (existing) {
        const newQty = existing.quantity + product.quantity;

        return prev.map((p) =>
          p.variantId === product.variantId
            ? {
                ...p,
                quantity: newQty,
                totalPrice: newQty * p.retailPrice,
              }
            : p
        );
      }

      // New product → calculate total price
      return [
        ...prev,
        {
          ...product,
          totalPrice: product.retailPrice * product.quantity,
        },
      ];
    });
  };

  const removeProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.variantId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.variantId === productId
          ? { ...p, quantity, totalPrice: quantity * p.retailPrice }
          : p
      )
    );
  };

  const clearProducts = () => setProducts([]);

  const [cartIsVisible, setCartIsVisible] = useState(false);

  const handleCartVisibility = () => {
    setCartIsVisible((prev) => !prev);
  };

  // Derived values
  const cartTotal = products.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        updateQuantity,
        clearProducts,
        cartTotal,
        totalItems,
        cartIsVisible,
        handleCartVisibility,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};