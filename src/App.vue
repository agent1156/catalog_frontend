<script setup>
import Header from './components/Header.vue'
import CategoryFilters from './components/CategoryFilters.vue'
import Catalog from './components/Catalog.vue'

</script>

<template>
    <Header />                     <!-- Шапка на всех страницах -->
        <div class="container">
            <router-view />            <!-- Сюда подставляются страницы -->
        </div>
</template>

<style scoped>
/* Стили для App */
</style>