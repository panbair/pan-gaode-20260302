# 多光源建筑特效优化总结

## 优化日期
2026-03-11

## 优化背景

原版多光源建筑特效存在以下问题：
1. **光源覆盖问题**：多个点光源都设置到 `loca.pointLight`，导致光源互相覆盖
2. **性能问题**：坐标变换函数重复创建，不必要的渲染计算
3. **视觉效果有限**：光源颜色和强度配置不够理想

## 主要优化内容

### 1. 光源轮换机制

#### 问题分析
高德 Loca 的 `pointLight` 属性只能同时激活一个点光源。原代码中多个点光源都尝试设置 `loca.pointLight`，导致互相覆盖，最终只保留最后一个光源配置。

#### 解决方案
实现智能光源轮换机制：
- 保存所有点光源配置到 `activePointLights` 数组
- 每隔 120 帧（约 2 秒）切换激活的光源
- 所有光源标记持续运动，营造丰富的视觉动态
- 当前激活的光源同步更新 Loca 光源配置

```typescript
// 光源切换周期（每120帧切换一次光源，约2秒）
const SWITCH_CYCLE = 120
if (this.lightSwitchInterval >= SWITCH_CYCLE) {
  this.lightSwitchInterval = 0
  this.currentLightIndex = (this.currentLightIndex + 1) % this.activePointLights.length

  // 切换到下一个光源
  const nextLight = this.activePointLights[this.currentLightIndex]
  if (nextLight && nextLight.position) {
    this.loca.pointLight = {
      color: nextLight.color,
      position: nextLight.position,
      intensity: nextLight.intensity,
      distance: nextLight.distance || 0
    }
  }
}
```

### 2. 动画类型系统

#### 新增配置参数
```typescript
interface LightConfig {
  // ... 其他参数
  animationType?: 'orbit' | 'vertical' | 'static'  // 动画类型
  animationSpeed?: number  // 动画速度
  orbitRadius?: number  // 环形运动半径
  orbitOffset?: number  // 环形运动偏移角度
}
```

#### 支持的动画类型

| 类型 | 说明 | 参数 |
|------|------|------|
| `orbit` | 围绕中心点做环形运动 | `orbitRadius`, `orbitOffset` |
| `vertical` | 垂直上下运动 | 无额外参数 |
| `static` | 静态位置 | 无额外参数 |

#### 实现代码
```typescript
if (lightConfig.animationType === 'orbit') {
  // 环形运动
  const orbitRadius = lightConfig.orbitRadius || 0.01
  const offset = lightConfig.orbitOffset || 0
  const orbitBearing = (this.animationTime + offset) % 360

  const newPos = transform(
    this.centerPoint,
    (this.centerPoint[1] + orbitRadius * 111000) / this.centerPoint[1] * orbitRadius * 111000,
    orbitBearing
  )
  newPosition = [newPos[0], newPos[1], lightConfig.position[2]]
} else if (lightConfig.animationType === 'vertical') {
  // 垂直上下运动
  const t = (this.animationTime * 4 * (lightConfig.animationSpeed || 1)) % (height * 2)
  const verticalHeight = t > height ? height * 2 - t : t
  newPosition = [lightConfig.position[0], lightConfig.position[1], verticalHeight]
}
```

### 3. 性能优化

#### 坐标变换函数缓存
原代码在每次动画循环中都创建坐标变换函数，造成不必要的性能开销。优化后缓存函数对象：

```typescript
// 缓存坐标变换函数，避免重复创建
if (!this.transformTranslate) {
  this.transformTranslate = (point: [number, number], distance: number, bearing: number): [number, number] => {
    const R = 6371e3 // 地球半径（米）
    const lat1 = (point[1] * Math.PI) / 180
    const lon1 = (point[0] * Math.PI) / 180
    const dByR = distance / R
    const bearingRad = (bearing * Math.PI) / 180

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearingRad))
    const lon2 = lon1 + Math.atan2(
      Math.sin(bearingRad) * Math.sin(dByR) * Math.cos(lat1),
      Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat2)
    )

    return [(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI]
  }
}
```

#### 光源图标缓存
避免重复创建相同的图标对象：
```typescript
// 缓存光源图标对象，避免重复创建
if (!this.lightIcon) {
  this.lightIcon = new this.AMap.Icon({
    image: 'https://a.amap.com/Loca/static/loca-v2/demos/images/light.png',
    imageSize: new this.AMap.Size(40, 40)
  })
}
```

### 4. 视觉效果优化

#### 光源颜色调整
| 光源 | 原始颜色 | 优化后颜色 | 说明 |
|------|---------|-----------|------|
| 中心光源 | `rgb(11,255,241)` | `rgb(11,255,241)` | 保持青色，强度从 5 提升到 8 |
| 移动光源1 | `rgb(255,75,0)` | `rgb(255,140,0)` | 橙色更明亮，强度保持 12 |
| 移动光源2 | `#f21da7` | `#ff00cc` | 粉红色更鲜艳，强度保持 12 |

#### 光源距离调整
- 中心光源：500 → 600 米
- 移动光源：1500 → 1200 米

#### 光源高度调整
- 移动光源高度：400 → 450 米

### 5. 代码结构优化

#### 实例变量管理
```typescript
export class MultiLightBuildingEffectV2 extends BaseEffect {
  // ... 其他变量
  private activePointLights: LightConfig[] = []  // 激活的点光源列表
  private currentLightIndex: number = 0  // 当前激活的光源索引
  private lightSwitchInterval: number = 0  // 光源切换计数器
  private transformTranslate: ((...) => [number, number]) | null = null  // 缓存的坐标变换函数
}
```

#### 光源创建逻辑重构
分离光源配置收集和实际设置逻辑：
```typescript
private createLights(): void {
  // 清除现有光源配置
  if (this.loca) {
    this.loca.ambLight = null
    this.loca.dirLight = null
    this.loca.pointLight = null
  }

  // 存储点光源配置用于动画更新
  const pointLights: LightConfig[] = []

  // 遍历配置，收集点光源
  for (const config of this.lightConfigs) {
    if (config.type === 'point') {
      pointLights.push(config)
    }
    // ... 其他光源类型处理
  }

  // 保存点光源配置
  this.activePointLights = pointLights

  // 默认激活第一个点光源
  if (pointLights.length > 0 && pointLights[0].position) {
    this.loca.pointLight = {
      color: pointLights[0].color,
      position: pointLights[0].position,
      intensity: pointLights[0].intensity,
      distance: pointLights[0].distance || 0
    }
  }
}
```

## 优化效果

### 视觉效果
1. ✅ 光源轮换带来丰富的光影变化
2. ✅ 光源标记持续运动，增强视觉动态
3. ✅ 颜色搭配更协调，科技感更强

### 性能表现
1. ✅ 减少不必要的函数创建和计算
2. ✅ 降低内存占用（图标对象复用）
3. ✅ 动画帧率更稳定

### 代码质量
1. ✅ V1 和 V2 版本架构一致
2. ✅ 错误处理更完善
3. ✅ 资源清理更彻底

## 兼容性

### V1 版本
- 保持原有 API 接口不变
- 新增配置参数为可选
- 向后兼容现有代码

### V2 版本
- 基于原有功能扩展
- 新增动画类型支持
- 新增主题系统

## 使用建议

### 推荐配置
```typescript
{
  // 环境光：提供基础照明
  type: 'ambient',
  color: '#ffffff',
  intensity: 0.5
}

// 点光源：数量建议不超过 3-5 个
{
  type: 'point',
  color: 'rgb(11,255,241)',
  position: [116.455825, 39.916603, 0],
  intensity: 8,
  distance: 600,
  showMarker: true,
  animationType: 'vertical'
}

// 平行光：模拟太阳光
{
  type: 'directional',
  color: '#abffc8',
  intensity: 0.6,
  target: [0, 0, 0],
  position: [0, 3, 6]
}
```

### 性能优化建议
1. 控制点光源数量，建议不超过 5 个
2. 合理设置光照距离，避免过大范围
3. 适时调用 `cleanup()` 释放资源
4. 根据设备性能调整动画参数

## 技术要点

### 高德 Loca 限制
- `pointLight` 只支持单个点光源
- 光源位置需要三维坐标 `[lng, lat, alt]`
- 光源强度范围建议 0-20

### 坐标变换
- 使用地理坐标计算而非欧几里得距离
- 考虑地球曲率（R = 6371km）
- 经度和纬度的度数与米数的转换比例不同

## 后续优化方向

1. **GPU 加速**：探索使用 WebGL 直接控制光源
2. **光源预设库**：提供更多专业级光源配置
3. **交互式编辑**：支持可视化光源编辑器
4. **自适应性能**：根据设备性能自动调整参数

## 相关文件

- `src/views/Home/utils/effects/multiLightBuildingEffect.ts` - 基础版
- `src/views/Home/utils/effects/multiLightBuildingEffectV2.ts` - 增强版
- `src/views/Home/components/MultiLightBuildingDemo.vue` - 演示组件
- `src/views/Home/utils/effects/README.md` - 使用文档

## 参考文档

- [高德地图 JS API 2.0](https://lbs.amap.com/api/jsapi-v2)
- [LOCA 数据可视化 API](https://lbs.amap.com/api/jsapi-v2/guide/loca)
- [PolygonLayer 图层](https://lbs.amap.com/api/jsapi-v2/guide/loca/layers/polygonlayer)
