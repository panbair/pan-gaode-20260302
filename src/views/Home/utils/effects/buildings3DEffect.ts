/**
 * 4. 3D建筑特效
 * 使用 AMap.Buildings 展示3D建筑
 */

import { BaseEffect } from './baseEffect'

export class Buildings3DEffect extends BaseEffect {
  apply(): void {
    console.log('[Buildings3DEffect] 开始应用3D建筑特效')

    if (!this.map || !this.AMap) {
      console.error('[Buildings3DEffect] 地图或 AMap 未初始化')
      return
    }

    // 获取地图容器
    const container = document.getElementById('amap-container')
    if (!container) {
      console.error('[Buildings3DEffect] 找不到地图容器')
      return
    }

    // 清理现有容器
    const existingContainer = document.getElementById('three-container')
    if (existingContainer) {
      existingContainer.remove()
    }

    // 设置3D视角（倾斜角度）
    this.map.setPitch(60) // 设置60度倾斜
    this.map.setRotation(0)

    // 移动到有建筑数据的城市中心（例如上海陆家嘴）
    this.map.setCenter([121.5025, 31.2397])
    this.map.setZoom(17)

    // 创建 Buildings 图层 - 使用单色紫色
    const buildings = new this.AMap.Buildings({
      zIndex: 100,
      opacity: 1,
      heightFactor: 2, // 2倍高度
      wallColor: '#08c3d3', // 亮蓝紫色
      roofColor: '#d9ef0a' // 粉紫色
    })

    this.map.add(buildings)
    this.map.setMapStyle('amap://styles/normal') // 标准样式，背景亮

    console.log('[Buildings3DEffect] 3D建筑特效应用完成，已切换到上海陆家嘴')
    console.log('[Buildings3DEffect] 当前视角: pitch=' + this.map.getPitch() + ', zoom=' + this.map.getZoom())

    // 存储清理函数
    this.setResult({
      layer: buildings,
      cleanup: () => {
        if (buildings) {
          this.map.remove(buildings)
          this.map.setMapStyle('amap://styles/normal')
          // 恢复默认视角
          this.map.setPitch(0)
          this.map.setRotation(0)
        }
      }
    })
  }
}
