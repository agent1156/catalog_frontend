<script setup>
  import Header from './components/Header.vue'
  import CategoryFilters from './components/CategoryFilters.vue'
  import Catalog from './components/Catalog.vue'
</script>

<template>
  <Header />
  <div class="container">
    <div class="row g-4">
      <br/>
      <CategoryFilters/>
      <Catalog/>
    </div>
</div>

</template>
