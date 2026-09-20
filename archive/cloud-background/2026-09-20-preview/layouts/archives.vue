<script setup lang="ts">
import ThemeLayout from 'valaxy-theme-yun/layouts/archives.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <CloudBackgroundPreview v-if="route.query.background === 'clouds'" page="archives">
    <ThemeLayout />
  </CloudBackgroundPreview>
  <ThemeLayout v-else />
</template>
