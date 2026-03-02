<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const route = useRoute()
const { t } = useI18n()

const menuItems = computed(() => [
  { path: '/home', icon: '🏠', title: 'menu.home' }
])
</script>

<template>
  <div class="sidebar-container">
    <div class="logo">Demo</div>
    <el-menu
      :default-active="route.path"
      router
      background-color="transparent"
      :collapse="false"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
      >
        <template #icon>
          <span>{{ item.icon }}</span>
        </template>
        <template #title>{{ t(item.title) }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-container {
  width: 200px;
  height: 100%;
  background: var(--card-bg-color, #ffffff);
  border-right: 1px solid var(--border-color, #dcdfe6);
  display: flex;
  flex-direction: column;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: var(--el-color-primary);
    border-bottom: 1px solid var(--border-color, #dcdfe6);
  }

  :deep(.el-menu) {
    flex: 1;
    border: none;
  }
}
</style>
