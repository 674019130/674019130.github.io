<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <YunLayoutWrapper v-if="isHome" :footer="false" no-margin>
    <CloudBackgroundPreview v-if="route.query.background === 'clouds'" />
    <LetterHome v-else />
  </YunLayoutWrapper>

  <YunLayoutWrapper v-else>
    <RouterView />
  </YunLayoutWrapper>
</template>
