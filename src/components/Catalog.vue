<template>
    <div class=" products">
        <!-- ===== ОТЛАДКА ===== -->
        <div style="width:100%; background:#f0f0f0; padding:10px; margin-bottom:10px; border-radius:8px;">
            <strong>📊 Отладка:</strong><br>
            loading: {{ loading }}<br>
            error: {{ error }}<br>
            products count: {{ products.length }}<br>
            nextPage: {{ nextPage }}
        </div>

        <!-- ===== ЗАГРУЗКА ===== -->
        <div v-if="loading" class="loading">
            ⏳ Загрузка товаров...
        </div>

        <!-- ===== ОШИБКА ===== -->
        <div v-else-if="error" class="error">
            ❌ {{ error }}
        </div>

        <!-- ===== НЕТ ТОВАРОВ ===== -->
        <div v-else-if="products.length === 0" class="loading">
            📦 Товары не найдены
        </div>

        <!-- ===== ТОВАРЫ ===== -->
        <template v-else>
            <div 
                v-for="product in products" 
                :key="product.id"
                class="product_item"
            >
                <div class="product_item_img">
                    <a :href="`/product/${product.slug}`" @click.prevent="goToProduct(product.slug)">
                        <img 
                        :src="product.preview_image || '/placeholder.jpg'" 
                        :alt="product.name"
                        @error="handleImageError"
                    >
                    </a>
                </div>
                
                <div class="product_item_price">
                    <div class="product_item_price_base">
                        <span>{{ getPrice(product) }} ₽</span>
                    </div>
                    <div v-if="getOldPrice(product)" class="product_item_price_sale">
                        <span>{{ getOldPrice(product) }} ₽</span>
                    </div>
                    <div v-if="getDiscount(product)" class="product_item_price_procent">
                        <span>-{{ getDiscount(product) }}%</span>
                    </div>
                </div>
                
                <div class="product_item_count">
                    <span>{{ getStock(product) }} шт осталось</span>
                </div>
                
                <div class="product_item_title">
                    <span>{{ product.name }}</span>
                </div>
                
                <div class="product_item_descript">
                    {{ product.description || 'Без описания' }}
                </div>
                
                <div>
                    <button class="product_item_button">
                        {{ getButtonText(product) }}
                    </button>
                </div>
            </div>

            <!-- ===== ЗАГРУЗИТЬ ЕЩЕ ===== -->
            <div v-if="nextPage && !loading" class="load-more">
                <button @click="loadMore" :disabled="loadingMore">
                    {{ loadingMore ? 'Загрузка...' : 'Загрузить еще' }}
                </button>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productAPI } from '@/api/products'
import { useRouter } from 'vue-router'

// ===== СОСТОЯНИЕ =====
const products = ref([])
const loading = ref(true)  // ← Начинаем с true
const loadingMore = ref(false)
const error = ref(null)
const nextPage = ref(null)
const router = useRouter() 

// ===== МЕТОДЫ ДЛЯ ДАННЫХ =====
const getPrice = (product) => {
    if (product.offers && product.offers.length > 0) {
        return Number(product.offers[0].price) || 0
    }
    return Number(product.price) || 0
}

const getOldPrice = (product) => {
    if (product.offers && product.offers.length > 0) {
        return Number(product.offers[0].old_price) || null
    }
    return Number(product.old_price) || null    
}

const getDiscount = (product) => {
    const price = getPrice(product)
    const oldPrice = getOldPrice(product)
    if (oldPrice && oldPrice > price) {
        return Math.round(((oldPrice - price) / oldPrice) * 100)
    }
    return 0
}

const getStock = (product) => {
    if (product.offers && product.offers.length > 0) {
        return product.offers[0].stock || 0
    }
    return product.stock || 0
}

const getButtonText = (product) => {
    const stock = getStock(product)
    if (stock > 0) {
        return 'В корзину'
    }
    return 'Нет в наличии'
}

const handleImageError = (event) => {
    event.target.src = '/placeholder.jpg'
}

const goToProduct = (slug) => {
    router.push(`/product/${slug}`)
}

// ===== ЗАГРУЗКА =====
const loadProducts = async () => {
    console.log('🔄 loadProducts started')
    loading.value = true
    error.value = null
    
    try {
        console.log('📡 Calling API...')
        const response = await productAPI.getProducts()
        console.log('✅ Response:', response)
        
        // 🔥 ВАЖНО: response.data содержит список товаров
        const data = response.data
        
        // Если data - это массив, используем его
        if (Array.isArray(data)) {
            products.value = data
            nextPage.value = null
        } 
        // Если data.results - массив (DRF пагинация)
        else if (data.results && Array.isArray(data.results)) {
            products.value = data.results
            nextPage.value = data.next || null
        }
        // Если data - объект с другими полями
        else {
            products.value = []
            error.value = 'Неизвестный формат данных'
        }
        
        console.log('✅ Products loaded:', products.value.length)
    } catch (err) {
        console.error('❌ Ошибка:', err)
        error.value = err.message || 'Не удалось загрузить товары'
    } finally {
        loading.value = false
    }
}

const loadMore = async () => {
    if (!nextPage.value || loadingMore.value) return
    
    loadingMore.value = true
    
    try {
        const response = await productAPI.getProducts({
            page: new URL(nextPage.value).searchParams.get('page')
        })
        const data = response.data
        const newProducts = data.results || data || []
        products.value = [...products.value, ...newProducts]
        nextPage.value = data.next || null
    } catch (err) {
        console.error('Ошибка загрузки:', err)
    } finally {
        loadingMore.value = false
    }
}

// ===== ЖИЗНЕННЫЙ ЦИКЛ =====
onMounted(() => {
    console.log('🔄 Component mounted')
    loadProducts()
})

// Для отладки в консоли
window.__catalog = {
    products,
    loading,
    error,
    loadProducts,
    productAPI
}

</script>

<style lang="scss" scoped>
.products {
    display: flex;
    gap: 22px;
    flex-wrap: wrap;
    justify-content: space-between;
}

.product_item {
    width: 276px;
    min-height: 500px;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background: white;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .product_item_img {
        width: 100%;
        
        overflow: hidden;
        border-radius: 8px;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    
    .product_item_price {
        display: flex;
        align-items: end;
        gap: 14px;
        margin-top: 12px;
        
        .product_item_price_base {
            font-size: 20px;
            font-weight: 700;
            color: #F1117E;
        }
        
        .product_item_price_sale {
            color: #99a3ae;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            text-decoration: line-through;
        }
        
        .product_item_price_procent {
            font-size: 10px;
            font-weight: 700;
            color: #F1117E;
        }
    }
    
    .product_item_count {
        font-size: 12px;
        color: #718096;
        margin-top: 4px;
    }
    
    .product_item_title {
        font-size: 16px;
        font-weight: 600;
        margin-top: 8px;
        flex: 1;
        
        span {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }
    
    .product_item_descript {
        font-size: 14px;
        color: #718096;
        margin-top: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .product_item_button {
        width: 100%;
        height: 41px;
        background: #005bff;
        margin-top: 16px;
        border-radius: 10px;
        font-size: 17px;
        font-weight: bolder;
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover:not(:disabled) {
            background: #0047cc;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 91, 255, 0.3);
        }
        
        &:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
    }
}

.loading, .error {
    width: 100%;
    text-align: center;
    padding: 40px;
    font-size: 18px;
}

.error {
    color: #e74c3c;
}

.load-more {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    
    button {
        padding: 12px 40px;
        background: #005bff;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover:not(:disabled) {
            background: #0047cc;
            transform: translateY(-2px);
        }
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
}
</style>