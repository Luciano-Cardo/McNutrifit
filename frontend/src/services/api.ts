import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getProducts = (category?: string) =>
  api.get('/products', { params: { category } })

export const getProductById = (id: number) =>
  api.get(`/products/${id}`)

export const getProductDownload = (id: number) =>
  api.get(`/products/${id}/download`)

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password })

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const validateCoupon = (code: string, cartTotal: number) =>
  api.post('/coupons/validate', { code, cartTotal })

export const createOrder = (items: { productId: number, quantity: number }[], couponCode?: string) =>
  api.post('/orders', { items, couponCode })

export const getMyOrders = () =>
  api.get('/orders/my')

// Mis productos
export const getMyProducts = () =>
  api.get('/my-products')

export default api