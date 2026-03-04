/**
 * 3. 热力区域特效
 * 使用 Loca PointLayer 创建圆形热点区域效果
 */

import { BaseEffect } from './baseEffect'

export class HeatAreaEffect extends BaseEffect {
  apply(): void {
    console.log('[HeatAreaEffect] 开始应用热力区域特效')

    if (!this.loca) {
      console.warn('[HeatAreaEffect] loca 未初始化，无法应用特效')
      return
    }

    const Loca = (window as any).Loca

    // 创建中心点
    const centerPoint = [116.397428, 39.90923]

    // 生成多个圆形热点区域
    const heatAreas = this.generateHeatAreas(centerPoint, 15)

    console.log('[HeatAreaEffect] 生成热力区域数据:', heatAreas)

    // 创建 GeoJSON 数据
    const geoData = {
      type: 'FeatureCollection',
      features: heatAreas.map((area, index) => ({
        type: 'Feature',
        properties: {
          radius: area.radius,
          opacity: area.opacity,
          color: area.color,
          order: index,
          // 添加边缘发光颜色
          strokeColor: this.lightenColor(area.color, 40)
        },
        geometry: {
          type: 'Point',
          coordinates: area.center
        }
      }))
    }

    console.log('[HeatAreaEffect] GeoJSON 数据:', geoData)

    // 创建点图层
    const layer = new Loca.PointLayer({
      zIndex: 10,
      opacity: 0.8,
      visible: true,
      zooms: [2, 22]
    })

    const geoSource = new Loca.GeoJSONSource({
      data: geoData
    })

    layer.setSource(geoSource)

    layer.setStyle({
      unit: 'meter',
      radius: (index: number, feat: any) => {
        return feat.properties?.radius || 3000
      },
      color: (index: number, feat: any) => {
        return feat.properties?.color || '#3498db'
      },
      opacity: (index: number, feat: any) => {
        return feat.properties?.opacity || 0.5
      },
      borderWidth: 3,
      borderColor: (index: number, feat: any) => {
        return feat.properties?.strokeColor || '#ffffff'
      },
      borderWidth: 2
    })

    this.addLocaLayer(layer)

    // 调整地图视角到最佳观察位置
    this.setView({
      center: [centerPoint[0], centerPoint[1]],
      zoom: 13,
      pitch: 45
    })

    this.setResult({ layer })

    console.log('[HeatAreaEffect] 热力区域特效应用完成')
  }

  /**
   * 生成热力区域数据
   * @param center 中心点坐标
   * @param count 区域数量
   */
  private generateHeatAreas(center: [number, number], count: number): any[] {
    const areas: any[] = []

    // 热度颜色梯度：使用更鲜艳的颜色
    const colors = [
      '#00d2ff', // 亮蓝色
      '#00ff9d', // 亮绿色
      '#ffeb3b', // 亮黄色
      '#ff9800', // 亮橙色
      '#ff5722'  // 亮红色
    ]

    // 创建多个热点区域，从中心向外扩散
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const distance = 0.005 + Math.random() * 0.025

      // 越靠近中心，热度越高
      const heatLevel = 1 - (distance / 0.03)
      const colorIndex = Math.floor(heatLevel * (colors.length - 1))
      const color = colors[Math.max(0, Math.min(colorIndex, colors.length - 1))]

      // 半径和透明度根据热度调整，让热点更大更明显
      const radius = 3000 + (1 - heatLevel) * 5000 + Math.random() * 1000
      const opacity = 0.4 + heatLevel * 0.35 // 提高基础透明度

      areas.push({
        center: [center[0] + Math.cos(angle) * distance, center[1] + Math.sin(angle) * distance],
        radius: radius,
        opacity: opacity,
        color: color
      })
    }

    // 添加中心最热区域（多层叠加效果）
    areas.push({
      center: center,
      radius: 6000,
      opacity: 0.3,
      color: '#ff5722' // 大范围淡色
    })

    areas.push({
      center: center,
      radius: 4000,
      opacity: 0.5,
      color: '#ff5722' // 中等范围
    })

    areas.push({
      center: center,
      radius: 2000,
      opacity: 0.7,
      color: '#ffeb3b' // 中心小范围黄色
    })

    return areas
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
