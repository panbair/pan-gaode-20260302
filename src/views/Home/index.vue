<template>
  <div class="map-effect-page">
    <div id="amap-container" class="map-container"></div>

    <EffectSidebar
      v-model:collapsed="sidebarCollapsed"
      v-model:active-category="activeCategory"
      v-model:search-keyword="searchKeyword"
      v-model:selected-effect="currentEffect"
      :effects="filteredEffects"
      @select="handleEffectSelect"
    />

<!--    <EffectControlPanel
      v-if="currentEffect && !sidebarCollapsed"
      :effect="currentEffect"
      @close="handleCloseEffect"
      @refresh="handleRefreshEffect"
      @show-code="handleShowCode"
    />-->

    <MapControls :is3D="is3D" :center="currentCenter" @toggle3d="toggle3D" @reset="resetMap" />

    <MapToolbar />

    <CodeDialog
      v-model:visible="showCodeDialog"
      :code="currentEffect?.codeExample || ''"
      @copy="handleCopyCode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { MapEffect, Category } from './config/effectsConfig'
import { CATEGORIES, DIFFICULTY_TYPES, DEFAULT_CENTER } from './config/effectsConfig'
import { EFFECTS_LIST } from './config/effectsList'
import { MapEffectHandler } from './utils/effectHandler'
import { MapManager } from './utils/mapManager'
import { AnimationController } from './utils/animationController'
import EffectSidebar from './components/EffectSidebar.vue'
import EffectControlPanel from './components/EffectControlPanel.vue'
import MapControls from './components/MapControls.vue'
import MapToolbar from './components/MapToolbar.vue'
import CodeDialog from './components/CodeDialog.vue'

const searchKeyword = ref('')
const activeCategory = ref('all')
const sidebarCollapsed = ref(false)
const is3D = ref(false)
const currentEffect = ref<MapEffect | null>(null)
const showCodeDialog = ref(false)
const currentCenter = ref(DEFAULT_CENTER)
const isMapLoaded = ref(false)

const effects = ref<MapEffect[]>(EFFECTS_LIST)

const mapManager = MapManager.getInstance()
let effectHandler: MapEffectHandler | null = null
let animationController: AnimationController | null = null

const filteredEffects = computed(() => {
  let result = effects.value

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    result = result.filter(
      effect =>
        effect.name.toLowerCase().includes(keyword) ||
        effect.description.toLowerCase().includes(keyword)
    )
  }

  if (activeCategory.value !== 'all') {
    result = result.filter(effect => effect.category === activeCategory.value)
  }

  return result
})

function getDifficultyType(difficulty: string): string {
  return DIFFICULTY_TYPES[difficulty] || ''
}

function getCategoryLabel(category: string): string {
  const cat = CATEGORIES.find((c: Category) => c.value === category)
  return cat?.label || category
}

function handleEffectSelect(effect: MapEffect): void {
  if (!isMapLoaded.value) {
    ElMessage.warning('地图尚未加载完成，请稍候')
    return
  }

  if (currentEffect.value && currentEffect.value.id === effect.id) {
    currentEffect.value = null
    if (effectHandler) {
      effectHandler.clear()
    }
    // 不调用 resetMap，让特效的 cleanup 处理地图状态
    return
  }

  // 切换特效时先清除旧特效
  if (currentEffect.value && effectHandler) {
    effectHandler.clear()
  }

  currentEffect.value = effect
  if (effectHandler) {
    try {
      effectHandler.applyEffect(effect.id)
      ElMessage.success(`已应用特效: ${effect.name}`)
    } catch (error) {
      console.error('应用特效失败:', error)
      ElMessage.error(`应用特效失败: ${effect.name}`)
    }
  }
}

function handleCloseEffect(): void {
  currentEffect.value = null
  if (effectHandler) {
    effectHandler.clear()
  }
  // 不调用 resetMap，让特效的 cleanup 处理地图状态
}

function handleRefreshEffect(): void {
  if (!isMapLoaded.value) {
    ElMessage.warning('地图尚未加载完成')
    return
  }

  if (currentEffect.value && effectHandler) {
    try {
      effectHandler.applyEffect(currentEffect.value.id)
      ElMessage.success('特效已刷新')
    } catch (error) {
      console.error('刷新特效失败:', error)
      ElMessage.error('刷新特效失败')
    }
  }
}

function handleShowCode(): void {
  showCodeDialog.value = true
}

function handleCopyCode(code: string): void {
  navigator.clipboard.writeText(code).then(() => {
    ElMessage.success('代码已复制到剪贴板')
  })
}

function toggle3D(): void {
  is3D.value = !is3D.value

  if (animationController) {
    animationController.animateView({
      pitch: is3D.value ? 50 : 0,
      zoom: 13,
      duration: 1000,
    })
  }
}

function resetMap(clearEffect: boolean = true): void {
  if (animationController) {
    animationController.cancelAllAnimations()
  }

  mapManager.clear()

  mapManager.setView({
    zoom: 13,
    pitch: 0,
    rotation: 0,
    center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
  })

  if (effectHandler && clearEffect) {
    effectHandler.clear()
  }
}

async function initMap(): Promise<void> {
  try {
    ElMessage.info('正在加载地图，请稍候...')

    await mapManager.initialize('amap-container', {
      zoom: 13,
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      viewMode: '3D',
      pitch: 0,
      mapStyle: 'amap://styles/normal',
    })

    const context = mapManager.getContext()
    effectHandler = new MapEffectHandler(context.map, context.loca, context.AMap)

    animationController = new AnimationController(context.loca, context.map)

    const map = mapManager.getMap()
    map.on('moveend', () => {
      const center = map.getCenter()
      currentCenter.value = { lng: center.lng, lat: center.lat }
    })

    isMapLoaded.value = true

    if (mapManager.isLocaReady()) {
      ElMessage.success('地图和 Loca 加载成功')
    } else {
      ElMessage.warning('地图加载成功，部分特效可能不可用')
    }
  } catch (error) {
    console.error('地图加载失败:', error)
    ElMessage.error('地图加载失败，请检查网络和API Key')
    isMapLoaded.value = false
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (animationController) {
    animationController.cancelAllAnimations()
  }
  mapManager.destroy()
})
</script>

<style lang="scss" scoped>
.map-effect-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>
