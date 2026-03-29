import { create } from 'zustand'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  imageUrl?: string
  category: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  discount: number
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  getTotal: () => number
  getTotalWithDiscount: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  couponCode: null,
  discount: 0,

  addItem: (product) => {
    const items = get().items
    const existing = items.find(i => i.product.id === product.id)

    if (existing) {
      set({
        items: items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      })
    } else {
      set({ items: [...items, { product, quantity: 1 }] })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter(i => i.product.id !== productId) })
  },

  clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

  applyCoupon: (code, discount) => set({ couponCode: code, discount }),

  removeCoupon: () => set({ couponCode: null, discount: 0 }),

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getTotalWithDiscount: () =>
    Math.max(0, get().getTotal() - get().discount),

  getItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}))