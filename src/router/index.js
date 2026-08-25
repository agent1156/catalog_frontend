import { createRouter, createWebHistory } from 'vue-router'
import Catalog from '@/components/Catalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
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