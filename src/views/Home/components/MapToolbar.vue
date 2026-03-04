<template>
  <div class="map-toolbar">
    <el-dropdown @command="handleStyleChange" trigger="click">
      <el-button type="primary" size="small">
        <el-icon><Brush /></el-icon>
        地图样式
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="style in MAP_STYLES"
            :key="style.style"
            :command="style.style"
          >
            <span class="style-preview" :class="{ dark: style.isDark }"></span>
            {{ style.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown @command="handleViewChange" trigger="click">
      <el-button type="success" size="small">
        <el-icon><Location /></el-icon>
        预设视角
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(preset, key) in PRESET_VIEWS"
            :key="key"
            :command="key"
          >
            {{ preset.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown @command="handleAnimationChange" trigger="click">
      <el-button type="warning" size="small">
        <el-icon><VideoPlay /></el-icon>
        视角动画
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(preset, key) in ANIMATION_PRESETS"
            :key="key"
            :command="key"
          >
            {{ preset.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { Brush, ArrowDown, Location, VideoPlay } from '@element-plus/icons-vue'
import { MapManager } from '../utils/mapManager'
import { AnimationController } from '../utils/animationController'
import { MAP_STYLES, PRESET_VIEWS, ANIMATION_PRESETS } from '../config/mapStyles'
import { ElMessage } from 'element-plus'

const mapManager = MapManager.getInstance()
let animationController: AnimationController | null = null

function handleStyleChange(style: string) {
  const map = mapManager.getMap()
  if (!map) {
    ElMessage.warning('地图尚未加载完成')
    return
  }

  console.log('[MapToolbar] 切换地图样式:', style)
  map.setMapStyle(style)
  ElMessage.success('地图样式已更新')
}

async function handleViewChange(presetKey: string) {
  const preset = PRESET_VIEWS[presetKey as keyof typeof PRESET_VIEWS]
  if (!preset) return

  if (!mapManager.isMapReady() || !mapManager.isLocaReady()) {
    ElMessage.warning('地图尚未加载完成')
    return
  }

  try {
    // 直接使用 mapManager 的 animateView 方法
    await mapManager.animateView({
      center: preset.center as [number, number],
      zoom: preset.zoom,
      pitch: preset.pitch,
      rotation: 0,
      duration: 2000,
    })
    ElMessage.success(`已切换到: ${preset.name}`)
  } catch (error) {
    console.error('[MapToolbar] 视角切换失败:', error)
    ElMessage.error('视角切换失败')
  }
}

async function handleAnimationChange(presetKey: string) {
  const preset = ANIMATION_PRESETS[presetKey as keyof typeof ANIMATION_PRESETS]
  if (!preset) return

  const map = mapManager.getMap()
  const loca = mapManager.getLoca()

  if (!map || !loca) {
    ElMessage.warning('地图尚未加载完成')
    return
  }

  if (!animationController) {
    animationController = new AnimationController(loca, map)
  }

  try {
    const animations = preset.animate(null)
    await animationController.animateSequence(animations)
    ElMessage.success(`已播放: ${preset.name}`)
  } catch (error) {
    console.error('[MapToolbar] 动画播放失败:', error)
    ElMessage.error('动画播放失败')
  }
}
</script>

<style lang="scss" scoped>
.map-toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 1000;

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .style-preview {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border-radius: 4px;
    background: linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%);
    border: 1px solid #ccc;

    &.dark {
      background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
      border-color: #666;
    }
  }
}
</style>
