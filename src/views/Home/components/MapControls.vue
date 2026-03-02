<template>
  <div class="map-controls">
    <el-button-group>
      <el-button @click="$emit('toggle3d')" :type="is3D ? 'primary' : 'default'">
        <el-icon><View /></el-icon>
        {{ is3D ? '3D' : '2D' }}
      </el-button>
      <el-button @click="$emit('reset')" icon="RefreshLeft">重置</el-button>
    </el-button-group>
    <div class="coordinates">
      {{ center.lng.toFixed(6) }}, {{ center.lat.toFixed(6) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { View, RefreshLeft } from '@element-plus/icons-vue'

interface Props {
  is3D: boolean
  center: { lng: number; lat: number }
}

interface Emits {
  (e: 'toggle3d'): void
  (e: 'reset'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="scss" scoped>
.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;

  .coordinates {
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    color: #666;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
