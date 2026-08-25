import { createRouter, createWebHistory } from 'vue-router'
import Catalog from '@/components/Catalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'

const routes = [
    {
        path: '/',
        name: 'catalog',
        component: Catalog
    },
    {
        path: '/product/:slug',
        name: 'product-detail',
        component: ProductDetail
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router