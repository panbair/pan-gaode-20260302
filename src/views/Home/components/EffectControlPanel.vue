<template>
  <div class="effect-control-panel">
    <div class="control-header">
      <h4>{{ effect.name }}</h4>
      <el-button link @click="$emit('close')" icon="Close">关闭</el-button>
    </div>
    <div class="control-content">
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item label="分类">
          {{ getCategoryLabel(effect.category) }}
        </el-descriptions-item>
        <el-descriptions-item label="API">
          {{ effect.apiVersion }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="control-description">
        {{ effect.description }}
      </div>
      <div class="control-actions">
        <el-button type="primary" size="small" @click="$emit('refresh')" icon="Refresh">
          刷新效果
        </el-button>
        <el-button type="success" size="small" @click="$emit('showCode')" icon="DocumentCopy">
          查看代码
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapEffect } from '../config/effectsConfig'
import { CATEGORIES } from '../config/effectsConfig'
import type { Category } from '../config/effectsConfig'

interface Props {
  effect: MapEffect
}

interface Emits {
  (e: 'close'): void
  (e: 'refresh'): void
  (e: 'showCode'): void
}

defineProps<Props>()
defineEmits<Emits>()

function getCategoryLabel(category: string): string {
  const cat = CATEGORIES.find((c: Category) => c.value === category)
  return cat?.label || category
}
</script>

<style lang="scss" scoped>
.effect-control-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;

  .control-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .control-content {
    .control-description {
      margin: 12px 0;
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }

    .control-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
  }
}

@media (max-width: 768px) {
  .effect-control-panel {
    width: 280px;
  }
}
</style>
