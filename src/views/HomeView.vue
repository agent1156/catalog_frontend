<template>
    <div class="row g-4">
        <div class="col-12 col-md-3">
            <CategoryFilters />
        </div>
        <div class="col-12 col-md-9">
            <Catalog />
        </div>
    </div>
</template>

<script setup>
import CategoryFilters from '@/components/CategoryFilters.vue'
import Catalog from '@/components/Catalog.vue'
</script>