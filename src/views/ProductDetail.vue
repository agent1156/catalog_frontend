<template>
    <div class="product-detail" v-if="product">
        <div class="container">
            <div class="row">
                <!-- Галерея -->
                <div class="col-12 col-md-6">
                    <div class="product-gallery">
                        <img 
                            :src="mainImage" 
                            :alt="product.name"
                            class="main-image"
                        />
                        <div class="thumbnails" v-if="images.length > 1">
                            <img 
                                v-for="(img, index) in images" 
                                :key="index"
                                :src="img.image"
                                :alt="product.name"
                                @click="mainImage = img.image"
                                :class="{ active: mainImage === img.image }"
                            />
                        </div>
                    </div>
                </div>
                
                <!-- Информация -->
                <div class="col-12 col-md-6">
                    <div class="product-info">
                        <h1>{{ product.name }}</h1>
                        
                        <div class="product-category">
                            <router-link :to="`/category/${product.category.slug}`">
                                {{ product.category.name }}
                            </router-link>
                        </div>
                        
                        <!-- Цена -->
                        <div class="product-price" v-if="defaultOffer">
                            <span class="current-price">{{ defaultOffer.price }} ₽</span>
                            <span v-if="defaultOffer.old_price" class="old-price">
                                {{ defaultOffer.old_price }} ₽
                            </span>
                            <span v-if="defaultOffer.discount_percent" class="discount-badge">
                                -{{ defaultOffer.discount_percent }}%
                            </span>
                        </div>
                        
                        <!-- Выбор варианта -->
                        <div class="product-offers" v-if="product.offers.length > 1">
                            <h4>Выберите вариант:</h4>
                            <div class="offers-list">
                                <button 
                                    v-for="offer in product.offers" 
                                    :key="offer.id"
                                    @click="selectOffer(offer)"
                                    :class="{ active: selectedOffer?.id === offer.id }"
                                    class="offer-btn"
                                >
                                    <span v-if="offer.color_hex" 
                                          class="color-dot" 
                                          :style="{ background: offer.color_hex }">
                                    </span>
                                    {{ offer.name }}
                                    <span class="offer-price">{{ offer.price }} ₽</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Описание -->
                        <div class="product-description">
                            <h4>Описание</h4>
                            <p>{{ product.description }}</p>
                        </div>
                        
                        <!-- Характеристики -->
                        <div class="product-specifications" v-if="Object.keys(product.specifications).length">
                            <h4>Характеристики</h4>
                            <table class="specs-table">
                                <tr v-for="(value, key) in product.specifications" :key="key">
                                    <td>{{ key }}</td>
                                    <td>{{ value }}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- О товаре -->
                        <div class="product-about" v-if="Object.keys(product.about).length">
                            <h4>О товаре</h4>
                            <ul>
                                <li v-for="(value, key) in product.about" :key="key">
                                    <strong>{{ key }}:</strong> {{ value }}
                                </li>
                            </ul>
                        </div>
                        
                        <!-- Кнопки -->
                        <div class="product-actions">
                            <button class="btn btn-primary" @click="addToCart">
                                В корзину
                            </button>
                            <button class="btn btn-secondary" @click="addToFavorites">
                                ♥ Избранное
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Загрузка -->
    <div v-else-if="loading" class="loading">
        ⏳ Загрузка товара...
    </div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="error">
        ❌ {{ error }}
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '@/api/products'

const route = useRoute()
const router = useRouter()

// ===== СОСТОЯНИЕ =====
const product = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedOffer = ref(null)
const mainImage = ref('')

// ===== ВЫЧИСЛЯЕМЫЕ =====
const defaultOffer = computed(() => {
    if (!product.value) return null
    return product.value.offers.find(o => o.is_default) || product.value.offers[0]
})

const images = computed(() => {
    if (!selectedOffer.value) return []
    return selectedOffer.value.images || []
})

// ===== МЕТОДЫ =====
const loadProduct = async () => {
    const slug = route.params.slug
    if (!slug) {
        error.value = 'Товар не найден'
        return
    }
    
    loading.value = true
    error.value = null
    
    try {
        const response = await productAPI.getProduct(slug)
        product.value = response.data
        
        if (product.value.offers && product.value.offers.length > 0) {
            selectedOffer.value = product.value.offers.find(o => o.is_default) || product.value.offers[0]
            mainImage.value = selectedOffer.value.preview_image || product.value.preview_image
        }
        
    } catch (err) {
        console.error('Ошибка загрузки товара:', err)
        error.value = 'Товар не найден'
    } finally {
        loading.value = false
    }
}

const selectOffer = (offer) => {
    selectedOffer.value = offer
    mainImage.value = offer.preview_image || product.value.preview_image
}

const addToCart = () => {
    if (!selectedOffer.value) return
    console.log('Добавлен в корзину:', selectedOffer.value)
}

const addToFavorites = () => {
    console.log('Добавлен в избранное:', product.value)
}

watch(() => route.params.slug, () => {
    loadProduct()
})

onMounted(() => {
    loadProduct()
})
</script>

<style scoped lang="scss">
.product-detail {
    padding: 40px 0;
}

.product-gallery {
    .main-image {
        width: 100%;
        max-height: 500px;
        object-fit: contain;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
    }
    
    .thumbnails {
        display: flex;
        gap: 10px;
        margin-top: 16px;
        flex-wrap: wrap;
        
        img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s;
            
            &:hover {
                border-color: #005bff;
            }
            
            &.active {
                border-color: #005bff;
                box-shadow: 0 0 0 4px rgba(0, 91, 255, 0.2);
            }
        }
    }
}

.product-info {
    h1 {
        font-size: 28px;
        margin-bottom: 12px;
    }
    
    .product-category {
        margin-bottom: 16px;
        
        a {
            color: #005bff;
            text-decoration: none;
            
            &:hover {
                text-decoration: underline;
            }
        }
    }
    
    .product-price {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        
        .current-price {
            font-size: 32px;
            font-weight: 700;
            color: #2c3e50;
        }
        
        .old-price {
            font-size: 20px;
            color: #999;
            text-decoration: line-through;
        }
        
        .discount-badge {
            background: #e74c3c;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
        }
    }
    
    .product-offers {
        margin-bottom: 24px;
        
        h4 {
            margin-bottom: 12px;
            font-size: 16px;
        }
        
        .offers-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .offer-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
            
            &:hover {
                border-color: #005bff;
            }
            
            &.active {
                border-color: #005bff;
                background: #f0f7ff;
            }
            
            .color-dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 1px solid #e0e0e0;
            }
            
            .offer-price {
                font-weight: 600;
                color: #005bff;
            }
        }
    }
    
    .product-description {
        margin-bottom: 24px;
        
        h4 {
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        p {
            color: #4a5568;
            line-height: 1.8;
        }
    }
    
    .product-specifications {
        margin-bottom: 24px;
        
        h4 {
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .specs-table {
            width: 100%;
            border-collapse: collapse;
            
            tr {
                border-bottom: 1px solid #f0f0f0;
                
                td {
                    padding: 8px 0;
                    
                    &:first-child {
                        font-weight: 600;
                        color: #4a5568;
                        width: 40%;
                    }
                    
                    &:last-child {
                        color: #2c3e50;
                    }
                }
            }
        }
    }
    
    .product-about {
        margin-bottom: 24px;
        
        h4 {
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        ul {
            list-style: none;
            padding: 0;
            
            li {
                padding: 4px 0;
                color: #4a5568;
            }
        }
    }
    
    .product-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        
        .btn {
            padding: 12px 32px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            
            &.btn-primary {
                background: #005bff;
                color: white;
                
                &:hover {
                    background: #0047cc;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 91, 255, 0.3);
                }
            }
            
            &.btn-secondary {
                background: #f0f0f0;
                color: #2c3e50;
                
                &:hover {
                    background: #e0e0e0;
                }
            }
        }
    }
}

.loading, .error {
    text-align: center;
    padding: 60px 20px;
    font-size: 18px;
}

.error {
    color: #e74c3c;
}
</style>