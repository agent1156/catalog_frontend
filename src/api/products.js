import axios from 'axios'

// ===== БАЗОВЫЙ URL =====
const API_BASE_URL = 'http://localhost:8000/api/'

// ===== СОЗДАЕМ ЭКЗЕМПЛЯР AXIOS =====
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// ===== ИНТЕРЦЕПТОР ДЛЯ ОТЛАДКИ =====
api.interceptors.request.use(
    (config) => {
        console.log(`📡 [${config.method.toUpperCase()}] ${config.url}`, config.params || '')
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => {
        console.log(`✅ [${response.status}] ${response.config.url}`, response.data)
        return response
    },
    (error) => {
        console.error(`❌ Ошибка:`, error.response?.status, error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// ===== API МЕТОДЫ =====
export const productAPI = {
    /**
     * Получить список товаров
     * @param {Object} params - параметры фильтрации
     * @param {number} params.page - номер страницы
     * @param {number} params.page_size - размер страницы
     * @param {number} params.category - ID категории
     * @param {string} params.search - поисковый запрос
     * @param {string} params.ordering - сортировка
     */
    getProducts(params = {}) {
        return api.get('/products/', { params })
    },

    /**
     * Получить один товар по slug
     * @param {string} slug - slug товара
     */
    getProduct(slug) {
        return api.get(`/products/${slug}/`)
    },

    /**
     * Получить товары по категории
     * @param {number} categoryId - ID категории
     */
    getProductsByCategory(categoryId) {
        return api.get('/products/', { params: { category: categoryId } })
    },

    /**
     * Получить новинки
     */
    getNewProducts() {
        return api.get('/products/', { params: { is_new: true } })
    },

    /**
     * Поиск товаров
     * @param {string} query - поисковый запрос
     */
    searchProducts(query) {
        return api.get('/products/', { params: { search: query } })
    },

    // ===== CRUD ОПЕРАЦИИ =====
    createProduct(productData) {
        return api.post('/products/', productData)
    },

    updateProduct(id, productData) {
        return api.put(`/products/${id}/`, productData)
    },

    deleteProduct(id) {
        return api.delete(`/products/${id}/`)
    }
}