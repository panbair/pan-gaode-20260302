<script setup lang="ts">
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="layout-container">
    <Sidebar />
    <div class="main-container">
      <Header />
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
