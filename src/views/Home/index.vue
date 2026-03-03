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

    <EffectControlPanel
      v-if="currentEffect && !sidebarCollapsed"
      :effect="currentEffect"
      @close="handleCloseEffect"
      @refresh="handleRefreshEffect"
      @show-code="handleShowCode"
    />

    <MapControls :is3D="is3D" :center="currentCenter" @toggle3d="toggle3D" @reset="resetMap" />

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
import AMapLoader from '@amap/amap-jsapi-loader'
import type { MapEffect, Category } from './config/effectsConfig'
import { CATEGORIES, DIFFICULTY_TYPES, DEFAULT_CENTER } from './config/effectsConfig'
import { EFFECTS_LIST } from './config/effectsList'
import { MapEffectHandler } from './utils/effectHandler'
import EffectSidebar from './components/EffectSidebar.vue'
import EffectControlPanel from './components/EffectControlPanel.vue'
import MapControls from './components/MapControls.vue'
import CodeDialog from './components/CodeDialog.vue'

const AMAP_KEY = '67ffe728401f177ab6267db726d099c5' // TODO: 替换为实际的高德地图API Key

let map: any = null
let loca: any = null
let AMap: any = null
let effectHandler: MapEffectHandler | null = null

const searchKeyword = ref('')
const activeCategory = ref('all')
const sidebarCollapsed = ref(false)
const is3D = ref(false)
const currentEffect = ref<MapEffect | null>(null)
const showCodeDialog = ref(false)
const currentCenter = ref(DEFAULT_CENTER)

const effects = ref<MapEffect[]>(EFFECTS_LIST)

const filteredEffects = computed(() => {
  let result = effects.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
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
  // 如果点击的是当前已选中的特效，则取消特效
  if (currentEffect.value && currentEffect.value.id === effect.id) {
    currentEffect.value = null
    if (effectHandler) {
      effectHandler.clear()
    }
    resetMap()
    return
  }

  // 否则应用新特效
  currentEffect.value = effect
  if (effectHandler) {
    effectHandler.applyEffect(effect.id)
  }
}

function handleCloseEffect(): void {
  currentEffect.value = null
  if (effectHandler) {
    effectHandler.clear()
  }
  resetMap()
}

function handleRefreshEffect(): void {
  if (currentEffect.value && effectHandler) {
    effectHandler.applyEffect(currentEffect.value.id)
    ElMessage.success('特效已刷新')
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
  if (map) {
    if (is3D.value) {
      // 3D模式：设置倾斜角度
      map.setPitch(50)
      map.setRotation(0)
    } else {
      // 2D模式：pitch=0就是俯视效果
      map.setPitch(0)
      map.setRotation(0)
    }
  }
}

function resetMap(): void {
  if (map) {
    map.setCenter([DEFAULT_CENTER.lng, DEFAULT_CENTER.lat])
    map.setZoom(13)
    map.setPitch(0)  // 3D模式下设置为0就是俯视2D效果
    map.setRotation(0)
    map.setMapStyle('amap://styles/normal')
    // setWeather 方法不存在，移除此行
  }
}

async function initMap(): Promise<void> {
  try {
    AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Buildings', 'AMap.MarkerCluster', 'AMap.MoveAnimation'],
      Loca: {
        version: '2.0.0'
      }
    })

    window.AMap = AMap

    map = new AMap.Map('amap-container', {
      zoom: 13,
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      viewMode: '3D',  // 改为3D模式，这样所有特效都能利用3D效果
      pitch: 0,
      mapStyle: 'amap://styles/normal'
    })

    // Loca 通过全局变量创建，而不是 AMap.Loca
    if (window.Loca) {
      loca = new window.Loca.Container({
        map: map
      })
    }

    effectHandler = new MapEffectHandler(map, loca, AMap)

    map.on('moveend', () => {
      const center = map.getCenter()
      currentCenter.value = { lng: center.lng, lat: center.lat }
    })

    ElMessage.success('地图加载成功')
  } catch (error) {
    console.error('地图加载失败:', error)
    ElMessage.error('地图加载失败，请检查网络和API Key')
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.destroy()
  }
  if (loca) {
    loca.destroy()
  }
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
