// src/context/CartContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Product {
  id: number
  sku: string
  name: string
  price: number
  image?: string
  stock: number
  displayTitle: string
  gst_rate:number
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  total: number
  itemCount: number
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
          updateTotals(parsedCart)
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart))
      } else {
        localStorage.removeItem('cart')
      }
    }
    updateTotals(cart)
  }, [cart])

  const updateTotals = (items: CartItem[]) => {
    // const totalAmount = items.reduce((sum, item) => sum + ((item.product.price * item.quantity) * item.product?.gst_rate), 0)
    const totalAmount = items.reduce((sum, item) => {
  const gstRate = Number(item.product.gst_rate); // "18.00"
  const basePrice = item.product.price * item.quantity;
  const totalWithGst = basePrice + (basePrice * gstRate) / 100;

  return sum + totalWithGst;
}, 0);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    
    setTotal(totalAmount)
    setItemCount(totalItems)
  }

  const addToCart = (product: any, quantity: number = 1) => {
    console.log('Adding to cart:', product, quantity) // Debug log
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      
      if (existingItem) {
        const newCart = prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        console.log('Updated existing item:', newCart)
        return newCart
      } else {
        const newCart = [
          ...prevCart,
          {product: {
              id: product.id,
              sku: product.sku || `Product ${product.id}`,
              displayTitle: `${product?.displayTitle}`,
              price: parseFloat(product.price) || 0,
              image: product.primary_image?.image_url || product.image,
              stock: product.stock || 10,
              gst_rate: product.gst_rate
            },
            quantity
          }
        ]
        console.log('Added new item:', newCart)
        return newCart
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCart([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      total,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}