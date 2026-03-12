<template>
  <div class="effect-sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <h3 class="title">
        <el-icon><MagicStick /></el-icon>
        地图特效库
      </h3>
      <div class="header-actions">
        <el-button
          v-if="activeEffects.size > 0"
          link
          class="close-all-btn"
          size="small"
          @click="$emit('closeAll')"
        >
          全部关闭
        </el-button>
        <el-button
          link
          class="collapse-btn"
          :icon="collapsed ? ArrowRight : ArrowLeft"
          @click="$emit('update:collapsed', !collapsed)"
        />
      </div>
    </div>

    <div v-if="!collapsed" class="sidebar-content">
      <div class="search-box">
        <el-input
          :model-value="searchKeyword"
          placeholder="搜索特效..."
          clearable
          size="small"
          @input="$emit('update:searchKeyword', $event)"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="category-tabs">
        <el-tabs :model-value="activeCategory" @tab-change="handleTabChange">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="标记" name="marker"></el-tab-pane>
          <el-tab-pane label="路径" name="path"></el-tab-pane>
          <el-tab-pane label="区域" name="area"></el-tab-pane>
          <el-tab-pane label="3D" name="3d"></el-tab-pane>
          <el-tab-pane label="粒子" name="particle"></el-tab-pane>
          <el-tab-pane label="天气" name="weather"></el-tab-pane>
        </el-tabs>
      </div>

      <div class="effect-count" v-if="activeEffects.size > 0">
        已激活 {{ activeEffects.size }} 个特效
      </div>

      <div class="effect-list">
        <div
          v-for="effect in effects"
          :key="effect.id"
          class="effect-item"
          :class="{
            active: activeEffects.has(effect.id),
            selected: selectedEffect?.id === effect.id
          }"
          @click="$emit('select', effect)"
        >
          <div class="effect-icon" :class="`icon-${effect.category}`">
            <el-icon :size="24">
              <component :is="effect.icon" />
            </el-icon>
          </div>
          <div class="effect-info">
            <div class="effect-name">{{ effect.name }}</div>
            <div class="effect-meta">
              <el-tag :type="getDifficultyType(effect.difficulty)" size="small">
                {{ effect.difficulty }}
              </el-tag>
            </div>
          </div>
          <div class="effect-status">
            <el-icon v-if="activeEffects.has(effect.id)" class="active-icon">
              <Check />
            </el-icon>
            <div v-else class="inactive-icon"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagicStick, ArrowLeft, ArrowRight, Search, Check } from '@element-plus/icons-vue'
import type { MapEffect } from '../config/effectsConfig'
import { DIFFICULTY_TYPES } from '../config/effectsConfig'

interface Props {
  collapsed: boolean
  activeCategory: string
  searchKeyword: string
  effects: MapEffect[]
  selectedEffect: MapEffect | null
  activeEffects: Set<number>
}

interface Emits {
  (e: 'update:collapsed', value: boolean): void
  (e: 'update:activeCategory', value: string): void
  (e: 'update:searchKeyword', value: string): void
  (e: 'select', effect: MapEffect): void
  (e: 'closeAll'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function getDifficultyType(difficulty: string): string {
  return DIFFICULTY_TYPES[difficulty] || ''
}

function handleTabChange(name: string): void {
  emit('update:activeCategory', name)
}
</script>

<style lang="scss" scoped>
.effect-sidebar {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 320px;
  max-height: calc(100vh - 40px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 60px;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .close-all-btn {
      color: #f56c6c;
      font-size: 12px;

      &:hover {
        color: #f78989;
      }
    }

    .collapse-btn {
      padding: 4px;
    }
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .search-box {
    padding: 12px 16px;
  }

  .category-tabs {
    :deep(.el-tabs__header) {
      margin: 0;
    }

    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    :deep(.el-tabs__item) {
      font-size: 13px;
      padding: 0 12px;
    }
  }

  .effect-count {
    padding: 8px 16px;
    font-size: 12px;
    color: #666;
    background: #f5f7fa;
    border-left: 3px solid #67c23a;
    margin: 0 8px 8px;
    border-radius: 4px;
  }

  .effect-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .effect-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border: 2px solid transparent;

    &:hover {
      background: #f8f9fa;
    }

    &.active {
      border-color: #67c23a;
      background: rgba(103, 194, 58, 0.08);

      .effect-name {
        color: #67c23a;
        font-weight: 700;
      }

      .active-icon {
        color: #67c23a;
      }

      &.icon-marker {
        border-color: #67c23a;
      }

      &.icon-path {
        border-color: #67c23a;
      }

      &.icon-area {
        border-color: #67c23a;
      }

      &.icon-3d {
        border-color: #67c23a;
      }

      &.icon-particle {
        border-color: #67c23a;
      }

      &.icon-weather {
        border-color: #67c23a;
      }
    }

    &.selected {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: linear-gradient(180deg, #409eff 0%, #53a8ff 100%);
        border-radius: 0 4px 4px 0;
      }
    }

    .effect-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      &.icon-marker {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.icon-path {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.icon-area {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.icon-3d {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      &.icon-particle {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      &.icon-weather {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      }

      &.icon-building {
        background: linear-gradient(135deg, #eca049 0%, #daef15 100%);
      }
    }

    .effect-info {
      flex: 1;

      .effect-name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .effect-meta {
        display: flex;
        gap: 6px;
      }
    }

    .effect-status {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;

      .active-icon {
        font-size: 20px;
      }

      .inactive-icon {
        width: 20px;
        height: 20px;
        border: 2px solid #dcdfe6;
        border-radius: 50%;
      }
    }
  }
}

@media (max-width: 768px) {
  .effect-sidebar {
    width: 280px;

    &.collapsed {
      width: 50px;
    }
  }
}
</style>
