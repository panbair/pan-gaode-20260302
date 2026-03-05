<template>
  <div class="map-toolbar">
    <div class="toolbar-group">
      <el-dropdown @command="handleStyleChange" trigger="click">
        <div class="toolbar-button">
          <el-icon class="toolbar-icon">
            <Brush />
          </el-icon>
          <span class="toolbar-text">地图样式</span>
          <el-icon class="arrow-icon">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="style-dropdown">
            <el-dropdown-item
              v-for="style in MAP_STYLES"
              :key="style.style"
              :command="style.style"
              class="style-item"
            >
              <span class="style-name">{{ style.name }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-dropdown @command="handleViewChange" trigger="click">
        <div class="toolbar-button">
          <el-icon class="toolbar-icon">
            <Location />
          </el-icon>
          <span class="toolbar-text">预设视角</span>
          <el-icon class="arrow-icon">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="preset-dropdown">
            <el-dropdown-item
              v-for="(preset, key) in PRESET_VIEWS"
              :key="key"
              :command="key"
              class="preset-item"
            >
              <el-icon class="preset-icon">
                <View />
              </el-icon>
              <span>{{ preset.name }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-dropdown @command="handleAnimationChange" trigger="click">
        <div class="toolbar-button">
          <el-icon class="toolbar-icon">
            <VideoPlay />
          </el-icon>
          <span class="toolbar-text">视角动画</span>
          <el-icon class="arrow-icon">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="animation-dropdown">
            <el-dropdown-item
              v-for="(preset, key) in ANIMATION_PRESETS"
              :key="key"
              :command="key"
              class="animation-item"
            >
              <el-icon class="animation-icon">
                <Film />
              </el-icon>
              <span>{{ preset.name }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Brush, ArrowDown, Location, VideoPlay, View, Film } from "@element-plus/icons-vue";
import { MapManager } from "../utils/mapManager";
import { AnimationController } from "../utils/animationController";
import { MAP_STYLES, PRESET_VIEWS, ANIMATION_PRESETS } from "../config/mapStyles";
import { ElMessage } from "element-plus";

const mapManager = MapManager.getInstance();
let animationController: AnimationController | null = null;

function handleStyleChange(style: string) {
  const map = mapManager.getMap();
  if (!map) {
    ElMessage.warning("地图尚未加载完成");
    return;
  }

  console.log("[MapToolbar] 切换地图样式:", style);
  map.setMapStyle(style);
  ElMessage.success("地图样式已更新");
}

async function handleViewChange(presetKey: string) {
  const preset = PRESET_VIEWS[presetKey as keyof typeof PRESET_VIEWS];
  if (!preset) return;

  if (!mapManager.isMapReady() || !mapManager.isLocaReady()) {
    ElMessage.warning("地图尚未加载完成");
    return;
  }

  try {
    // 直接使用 mapManager 的 animateView 方法
    await mapManager.animateView({
      center: preset.center as [number, number],
      zoom: preset.zoom,
      pitch: preset.pitch,
      rotation: 0,
      duration: 2000
    });
    ElMessage.success(`已切换到: ${preset.name}`);
  } catch (error) {
    console.error("[MapToolbar] 视角切换失败:", error);
    ElMessage.error("视角切换失败");
  }
}

async function handleAnimationChange(presetKey: string) {
  const preset = ANIMATION_PRESETS[presetKey as keyof typeof ANIMATION_PRESETS];
  if (!preset) return;

  const map = mapManager.getMap();
  const loca = mapManager.getLoca();

  if (!map || !loca) {
    ElMessage.warning("地图尚未加载完成");
    return;
  }

  if (!animationController) {
    animationController = new AnimationController(loca, map);
  }

  try {
    const animations = preset.animate(null);
    await animationController.animateSequence(animations);
    ElMessage.success(`已播放: ${preset.name}`);
  } catch (error) {
    console.error("[MapToolbar] 动画播放失败:", error);
    ElMessage.error("动画播放失败");
  }
}
</script>

<style lang="scss" scoped>
.map-toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
  0 2px 8px rgba(0, 0, 0, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.8);
  z-index: 1000;

  .toolbar-group {
    display: flex;
    align-items: center;
  }

  .toolbar-divider {
    width: 1px;
    height: 24px;
    background: rgba(0, 0, 0, 0.08);
    margin: 0 4px;
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-weight: 500;
    background: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      transform: translateY(-1px);
      color: rgba(0, 0, 0, 0.95);
    }

    &:active {
      transform: translateY(0);
    }

    .toolbar-icon {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.65);
      transition: color 0.3s ease;
    }

    .toolbar-text {
      color: rgba(0, 0, 0, 0.85);
    }

    .arrow-icon {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-left: 2px;
      transition: transform 0.3s ease;
    }

    &:hover .toolbar-icon {
      color: rgba(0, 0, 0, 0.85);
    }
  }
}

.style-dropdown,
.preset-dropdown,
.animation-dropdown {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15),
  0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(16px);
  padding: 8px;
  min-width: 200px;
}

.style-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(0, 0, 0, 0.85);
  transition: all 0.2s ease;
  margin-bottom: 2px;

  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
    color: rgba(0, 0, 0, 0.95);
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  .style-preview {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      pointer-events: none;
    }

    .preview-gradient {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 50%, #e8e8e8 100%);
      transition: transform 0.3s ease;
    }

    &.dark .preview-gradient {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    }
  }

  &:hover .style-preview .preview-gradient {
    transform: scale(1.05);
  }

  .style-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .dark-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    letter-spacing: 0.5px;
  }
}

.preset-item,
.animation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  transition: all 0.2s ease;
  margin-bottom: 2px;

  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
    color: rgba(0, 0, 0, 0.95);
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  .preset-icon,
  .animation-icon {
    font-size: 18px;
    color: rgba(99, 102, 241, 0.7);
    transition: all 0.2s ease;
  }

  &:hover .preset-icon,
  &:hover .animation-icon {
    color: rgba(99, 102, 241, 0.9);
    transform: scale(1.1);
  }
}

:deep(.el-dropdown-menu) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dropdown-menu__item) {
  padding: 0;
}
</style>
