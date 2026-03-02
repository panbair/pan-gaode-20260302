<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { computed } from 'vue'

const { locale } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

const toggleDark = () => {
  appStore.toggleDark()
}

const changeLanguage = (lang: string) => {
  appStore.setLocale(lang)
  locale.value = lang
}

const handleLogout = () => {
  userStore.logout()
}

const userInitial = computed(() => userStore.userInfo?.username?.charAt(0) || 'U')
</script>

<template>
  <div class="header-container">
    <div class="left">
      <span class="logo">Demo Admin</span>
    </div>
    <div class="right">
      <el-button circle @click="toggleDark">
        <template #icon>
          <span v-if="appStore.isDark">☀️</span>
          <span v-else>🌙</span>
        </template>
      </el-button>
      <el-dropdown @command="changeLanguage">
        <el-button circle>
          <template #icon>🌐</template>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <span class="user-info">
          <el-avatar :size="32">
            {{ userInitial }}
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--card-bg-color, #ffffff);
  border-bottom: 1px solid var(--border-color, #dcdfe6);

  .left {
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: var(--el-color-primary);
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
