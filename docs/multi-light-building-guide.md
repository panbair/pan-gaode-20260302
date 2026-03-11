# 多光源建筑特效完整使用指南

## 目录
1. [概述](#概述)
2. [快速开始](#快速开始)
3. [基础版使用](#基础版使用)
4. [增强版使用](#增强版使用)
5. [API 参考](#api-参考)
6. [最佳实践](#最佳实践)
7. [故障排除](#故障排除)

## 概述

多光源建筑特效是基于高德地图 Loca 的 3D 建筑展示解决方案，通过多种光源的灵活配置打造科技感场景。提供两个版本：

- **基础版 (V1)**: 标准的多光源建筑展示效果
- **增强版 (V2)**: 支持预设主题、动画控制、光源开关等高级功能

### 核心特性

- ✅ 支持环境光、平行光、点光源三种光源类型
- ✅ 动态光源动画效果
- ✅ 可配置的光源参数（颜色、强度、位置等）
- ✅ 自定义建筑外观
- ✅ 完善的资源管理和清理机制
- ✅ 性能优化的渲染循环

## 快速开始

### 安装依赖

确保项目中已安装高德地图相关依赖：

```bash
npm install @amap/amap-jsapi-loader
```

### 基础使用

```typescript
import { MultiLightBuildingEffect } from './utils/effects/multiLightBuildingEffect'

// 创建特效实例
const effect = new MultiLightBuildingEffect({
  map: mapInstance,
  loca: locaInstance,
  AMap: AMap
})

// 应用特效
effect.apply()

// 清理特效
effect.cleanup()
```

## 基础版使用

### 1. 自定义光源配置

```typescript
const effect = new MultiLightBuildingEffect(context)

// 设置光源配置
const lightConfigs = [
  {
    type: 'ambient',
    color: '#ffffff',
    intensity: 0.5
  },
  {
    type: 'point',
    color: 'rgb(11,255,241)',
    position: [116.455825, 39.916603, 0],
    intensity: 5,
    distance: 500,
    showMarker: true
  },
  {
    type: 'directional',
    color: '#abffc8',
    intensity: 0.6,
    target: [0, 0, 0],
    position: [0, 3, 6]
  }
]

effect.setLightConfigs(lightConfigs)
effect.apply()
```

### 2. 自定义建筑外观

```typescript
const effect = new MultiLightBuildingEffect(context)

// 设置建筑配置
effect.setBuildingConfig({
  topColor: 'rgba(16,128,165,1)',
  sideTopColor: 'rgba(13,43,90,1)',
  sideBottomColor: 'rgba(24,212,255,1)',
  shininess: 10,
  hasSide: true
})

effect.apply()
```

### 3. 设置中心点

```typescript
const effect = new MultiLightBuildingEffect(context)

// 设置动画中心点
effect.setCenterPoint([116.397428, 39.90923])

effect.apply()
```

## 增强版使用

### 1. 使用预设主题

```typescript
import { MultiLightBuildingEffectV2 } from './utils/effects/multiLightBuildingEffectV2'

const effect = new MultiLightBuildingEffectV2(context)

// 应用预设主题
effect.applyTheme('tech')        // 科技感
effect.applyTheme('warm')        // 温暖
effect.applyTheme('cool')        // 冷色调
effect.applyTheme('cyberpunk')   // 赛博朋克

effect.apply()
```

### 2. 动画控制

```typescript
const effect = new MultiLightBuildingEffectV2(context)

// 设置动画配置
effect.setAnimationConfig({
  enabled: true,    // 是否启用动画
  speed: 1.5,      // 动画速度
  radius: 0.8,     // 旋转半径
  height: 400      // 光源高度
})

effect.apply()
```

### 3. 光源开关控制

```typescript
const effect = new MultiLightBuildingEffectV2(context)

effect.apply()

// 切换光源开关
effect.toggleLight('中心光源')
effect.toggleLight('移动光源1')
effect.toggleLight('移动光源2')
```

### 4. 自定义 GeoJSON 数据源

```typescript
const effect = new MultiLightBuildingEffectV2(context)

// 设置自定义建筑数据
effect.setCustomGeoJson('https://your-domain.com/custom-buildings.geojson')

effect.apply()
```

### 5. 完整示例

```typescript
import { MultiLightBuildingEffectV2 } from './utils/effects/multiLightBuildingEffectV2'

class BuildingLightController {
  private effect: MultiLightBuildingEffectV2

  constructor(context: EffectContext) {
    this.effect = new MultiLightBuildingEffectV2(context)
  }

  // 初始化科技感主题
  initTechTheme() {
    this.effect.applyTheme('tech')
    this.effect.setAnimationConfig({
      enabled: true,
      speed: 1,
      radius: 0.8,
      height: 400
    })
    this.effect.apply()
  }

  // 切换到赛博朋克主题
  switchToCyberpunk() {
    this.effect.applyTheme('cyberpunk')
    this.effect.setAnimationConfig({
      enabled: true,
      speed: 2,
      radius: 1.0,
      height: 500
    })
  }

  // 调整动画速度
  setAnimationSpeed(speed: number) {
    this.effect.setAnimationConfig({
      enabled: true,
      speed: speed,
      radius: 0.8,
      height: 400
    })
  }

  // 清理资源
  destroy() {
    this.effect.cleanup()
  }
}

// 使用示例
const controller = new BuildingLightController(context)
controller.initTechTheme()

// 5秒后切换主题
setTimeout(() => {
  controller.switchToCyberpunk()
}, 5000)

// 组件卸载时清理
onUnmounted(() => {
  controller.destroy()
})
```

## API 参考

### MultiLightBuildingEffect (基础版)

#### 构造函数

```typescript
constructor(context: EffectContext)
```

#### 方法

##### setLightConfigs(configs: LightConfig[]): void
设置光源配置

##### setBuildingConfig(config: Partial<BuildingConfig>): void
设置建筑配置

##### setCenterPoint(center: [number, number]): void
设置中心点

##### apply(): void
应用特效

##### cleanup(): void
清理特效

### MultiLightBuildingEffectV2 (增强版)

#### 构造函数

```typescript
constructor(context: EffectContext)
```

#### 方法

##### applyTheme(theme: ThemeType): void
应用预设主题

##### getCurrentTheme(): ThemeType
获取当前主题

##### setLightConfigs(configs: LightConfig[]): void
设置光源配置

##### setBuildingConfig(config: Partial<BuildingConfig>): void
设置建筑配置

##### setCenterPoint(center: [number, number]): void
设置中心点

##### setAnimationConfig(config: Partial<AnimationConfig>): void
设置动画配置

##### setCustomGeoJson(url: string): void
设置自定义 GeoJSON 数据源

##### toggleLight(lightName: string): void
切换光源开关

##### apply(): void
应用特效

##### cleanup(): void
清理特效

### 类型定义

#### LightConfig
```typescript
interface LightConfig {
  type: 'ambient' | 'point' | 'directional'
  color: string
  intensity: number
  position?: [number, number, number]
  target?: [number, number, number]
  distance?: number
  showMarker?: boolean
  enabled?: boolean
  name?: string
}
```

#### BuildingConfig
```typescript
interface BuildingConfig {
  topColor: string
  sideTopColor: string
  sideBottomColor: string
  shininess: number
  hasSide: boolean
}
```

#### AnimationConfig
```typescript
interface AnimationConfig {
  enabled: boolean
  speed: number
  radius: number
  height: number
}
```

#### ThemeType
```typescript
type ThemeType = 'tech' | 'warm' | 'cool' | 'cyberpunk' | 'custom'
```

## 最佳实践

### 1. 性能优化

```typescript
// ❌ 不好的做法：使用过多光源
const tooManyLights = Array(20).fill(null).map((_, i) => ({
  type: 'point',
  color: '#fff',
  position: [116.397428 + i * 0.001, 39.90923, 100],
  intensity: 10,
  distance: 1000
}))

// ✅ 好的做法：控制光源数量
const optimalLights = [
  { type: 'ambient', color: '#fff', intensity: 0.5 },
  { type: 'point', color: 'rgb(11,255,241)', position: [...], intensity: 5, distance: 500 },
  { type: 'directional', color: '#abffc8', intensity: 0.6, position: [0, 3, 6] }
]
```

### 2. 资源管理

```typescript
// ✅ 好的做法：在组件卸载时清理资源
import { onUnmounted } from 'vue'

const effect = new MultiLightBuildingEffect(context)
effect.apply()

onUnmounted(() => {
  effect.cleanup()
})
```

### 3. 错误处理

```typescript
// ✅ 好的做法：添加错误处理
try {
  const effect = new MultiLightBuildingEffect(context)
  effect.apply()
} catch (error) {
  console.error('应用特效失败:', error)
  // 显示用户友好的错误信息
  ElMessage.error('特效应用失败，请稍后重试')
}
```

### 4. 响应式更新

```typescript
// ✅ 好的做法：使用响应式数据控制特效
import { ref, watch } from 'vue'

const currentTheme = ref('tech')
const effect = new MultiLightBuildingEffectV2(context)

watch(currentTheme, (newTheme) => {
  effect.applyTheme(newTheme)
})

effect.apply()
```

## 故障排除

### 问题 1: 光源不显示

**可能原因:**
- Loca 未正确加载
- 光源强度设置为 0
- 光源位置超出地图范围

**解决方案:**
```typescript
// 检查 Loca 是否加载
if (!window.loca) {
  console.error('Loca 未加载')
  return
}

// 检查光源强度
if (lightConfig.intensity <= 0) {
  console.warn('光源强度为 0，请调整强度值')
}

// 检查光源位置
const bounds = map.getBounds()
if (!bounds.contains(lightConfig.position)) {
  console.warn('光源位置超出地图范围')
}
```

### 问题 2: 动画不流畅

**可能原因:**
- 光源数量过多
- 动画速度设置过快
- 设备性能不足

**解决方案:**
```typescript
// 减少光源数量
effect.setLightConfigs([
  { type: 'ambient', color: '#fff', intensity: 0.5 },
  { type: 'point', color: 'rgb(11,255,241)', position: [...], intensity: 5, distance: 500 }
])

// 降低动画速度
effect.setAnimationConfig({
  enabled: true,
  speed: 0.5,  // 降低速度
  radius: 0.8,
  height: 400
})
```

### 问题 3: 建筑不显示

**可能原因:**
- GeoJSON 数据加载失败
- 建筑高度数据无效
- 地图样式设置问题

**解决方案:**
```typescript
// 检查 GeoJSON 数据
geoDataSource.on('complete', () => {
  console.log('GeoJSON 数据加载完成')
})

geoDataSource.on('error', (error) => {
  console.error('GeoJSON 数据加载失败:', error)
})

// 检查建筑高度
buildingLayer.setStyle({
  height: (index, feature) => {
    const height = feature.properties.h
    if (!height || height <= 0) {
      console.warn('建筑高度无效:', feature)
      return 100  // 设置默认高度
    }
    return height
  }
})
```

### 问题 4: 内存泄漏

**可能原因:**
- 未正确清理特效
- 动画循环未停止
- 事件监听器未移除

**解决方案:**
```typescript
// ✅ 确保正确清理
class EffectManager {
  private effect: MultiLightBuildingEffect | null = null

  apply() {
    // 先清理现有特效
    if (this.effect) {
      this.effect.cleanup()
    }

    // 创建新特效
    this.effect = new MultiLightBuildingEffect(context)
    this.effect.apply()
  }

  destroy() {
    if (this.effect) {
      this.effect.cleanup()
      this.effect = null
    }
  }
}

// 在组件中使用
const manager = new EffectManager()

onMounted(() => {
  manager.apply()
})

onUnmounted(() => {
  manager.destroy()
})
```

## 总结

多光源建筑特效提供了强大而灵活的 3D 建筑展示能力：

- **基础版**适合简单的多光源展示需求
- **增强版**提供了更丰富的功能和更好的用户体验
- 合理使用预设主题可以快速实现不同风格的展示效果
- 注意性能优化和资源管理，确保应用稳定运行

如有问题，请参考故障排除部分或查看源码注释。
