<script setup lang="ts">
import ThemeLayout from 'valaxy-theme-yun/layouts/post.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <CloudBackgroundPreview v-if="route.query.background === 'clouds' && /^\/about\/?$/.test(route.path)" page="about">
    <ThemeLayout />
  </CloudBackgroundPreview>
  <ThemeLayout v-else />
</template>
