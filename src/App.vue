<script setup>
import Header from './components/Header.vue'
import CategoryFilters from './components/CategoryFilters.vue'
import Catalog from './components/Catalog.vue'

</script>

<template>
    <Header />
    <router-view />
    <div class="container">
        <div class="row g-4">
            <!-- Фильтры -->
            <div class="col-12 col-md-3">
                <CategoryFilters />
            </div>
            
            <!-- Каталог -->
            <div class="col-12 col-md-9">
                <Catalog />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Стили для App */
</style>