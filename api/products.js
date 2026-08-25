import api from './index'

export const productAPI = {
    // Получить список товаров
    getProducts(params = {}) {
        return api.get('/products/', { params })
    },

    // Получить один товар по slug
    getProduct(slug) {
        return api.get(`/products/${slug}/`)
    },

    // Получить товары с фильтром
    getProductsByCategory(categoryId) {
        return api.get('/products/', { params: { category: categoryId } })
    },

    // Получить новинки
    getNewProducts() {
        return api.get('/products/', { params: { is_new: 'true' } })
    },

    // Поиск товаров
    searchProducts(query) {
        return api.get('/products/', { params: { search: query } })
    }
}