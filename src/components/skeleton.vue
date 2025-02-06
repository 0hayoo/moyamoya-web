<template>
  <div class="space-y-3">
    <div v-for="i in 5" :key="i" class="p-4 bg-gray-200 animate-pulse rounded-lg flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div class="h-4 bg-gray-300 rounded w-32"></div>
      </div>
      <div class="h-4 bg-gray-300 rounded w-12"></div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
