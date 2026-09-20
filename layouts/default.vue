<script setup lang="ts">
import ThemeLayout from 'valaxy-theme-yun/layouts/default.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <CloudBackground v-if="/^\/about\/?$/.test(route.path)" page="about">
    <ThemeLayout />
  </CloudBackground>
  <ThemeLayout v-else />
</template>
