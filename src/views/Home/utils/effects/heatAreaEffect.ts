/**
 * 3. 热力区域特效
 * 使用 AMap.Polygon 创建专业的区域覆盖效果
 * 基于源码学习优化，使用原生 AMap API 实现更平滑的区域显示
 */

import { BaseEffect } from './baseEffect'

export class HeatAreaEffect extends BaseEffect {
  private polygons: any[] = []

  apply(): void {
    console.log('[HeatAreaEffect] 开始应用热力区域特效')

    if (!this.map) {
      console.warn('[HeatAreaEffect] map 未初始化，无法应用特效')
      return
    }

    const AMap = this.AMap

    // 创建中心点（北京）
    const centerPoint = [116.397428, 39.90923]

    // 生成多个热力区域
    const heatAreas = this.generateHeatAreas(centerPoint, 12)

    console.log('[HeatAreaEffect] 生成热力区域数据:', heatAreas.length)

    // 为每个区域创建多边形
    heatAreas.forEach((area, index) => {
      const polygon = new AMap.Polygon({
        path: this.createCirclePath(area.center, area.radius),
        fillColor: area.color,
        fillOpacity: area.opacity,
        strokeColor: this.lightenColor(area.color, 30),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        zIndex: 10 + index,
        bubble: true
      })

      this.map.add(polygon)
      this.polygons.push(polygon)
    })

    // 调整地图视角到最佳观察位置
    this.setView({
      center: centerPoint,
      zoom: 13,
      pitch: 50
    })

    this.setResult({ polygons: this.polygons })

    console.log('[HeatAreaEffect] 热力区域特效应用完成，共创建', this.polygons.length, '个区域')
  }

  /**
   * 生成热力区域数据
   * @param center 中心点坐标
   * @param count 区域数量
   */
  private generateHeatAreas(center: [number, number], count: number): any[] {
    const areas: any[] = []

    // 热度颜色梯度：使用渐变色系
    const colors = [
      { color: '#00d2ff', name: '冷色' },      // 亮蓝色
      { color: '#00ff9d', name: '清凉' },      // 亮绿色
      { color: '#ffeb3b', name: '温和' },      // 亮黄色
      { color: '#ff9800', name: '暖色' },      // 亮橙色
      { color: '#ff5722', name: '热色' }        // 亮红色
    ]

    // 创建多个热点区域，从中心向外扩散
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const distance = 0.008 + Math.random() * 0.025

      // 越靠近中心，热度越高
      const heatLevel = 1 - (distance / 0.035)
      const colorIndex = Math.floor(heatLevel * (colors.length - 1))
      const colorInfo = colors[Math.max(0, Math.min(colorIndex, colors.length - 1))]

      // 半径和透明度根据热度调整
      const radius = 2500 + (1 - heatLevel) * 4000 + Math.random() * 800
      const opacity = 0.35 + heatLevel * 0.45 // 增强透明度对比

      const areaCenter = [
        center[0] + Math.cos(angle) * distance,
        center[1] + Math.sin(angle) * distance
      ] as [number, number]

      areas.push({
        center: areaCenter,
        radius: radius,
        opacity: opacity,
        color: colorInfo.color,
        level: heatLevel
      })
    }

    // 添加中心多层叠加热区（核心热点）
    const coreHotspots = [
      { radius: 7000, opacity: 0.2, color: '#ff5722' },  // 最外层淡色
      { radius: 5000, opacity: 0.35, color: '#ff5722' }, // 外层
      { radius: 3500, opacity: 0.5, color: '#ff9800' },  // 中层
      { radius: 2000, opacity: 0.65, color: '#ffeb3b' }, // 内层
      { radius: 1000, opacity: 0.8, color: '#ffffff' }    // 核心最亮
    ]

    coreHotspots.forEach(spot => {
      areas.push({
        center: center,
        radius: spot.radius,
        opacity: spot.opacity,
        color: spot.color,
        level: 1
      })
    })

    return areas
  }

  /**
   * 创建圆形路径
   * @param center 中心点
   * @param radius 半径（米）
   */
  private createCirclePath(center: [number, number], radius: number): any[] {
    const points: any[] = []
    const numPoints = 64 // 增加点数使圆形更平滑
    const earthRadius = 6378137 // 地球半径（米）

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      const lat = center[1] + (radius / earthRadius) * (180 / Math.PI) * Math.cos(angle)
      const lng = center[0] + (radius / earthRadius) * (180 / Math.PI) * Math.sin(angle) / Math.cos(center[1] * Math.PI / 180)
      points.push([lng, lat])
    }

    return points
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    super.cleanup()

    // 清理所有多边形
    this.polygons.forEach(polygon => {
      if (polygon && this.map) {
        try {
          this.map.remove(polygon)
        } catch (error) {
          console.error('[HeatAreaEffect] 移除多边形失败:', error)
        }
      }
    })

    this.polygons = []
    console.log('[HeatAreaEffect] 资源清理完成')
  }

  /**
   * 颜色提亮
   */
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, (num >> 16) + amt)
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
    const B = Math.min(255, (num & 0x0000ff) + amt)
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
  }
}
