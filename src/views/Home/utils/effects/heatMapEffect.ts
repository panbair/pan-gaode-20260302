/**
 * 3. 热力线条特效
 * 使用 Loca LinkLayer 创建连接线条效果
 */

import { BaseEffect } from './baseEffect'

export class HeatMapEffect extends BaseEffect {
  apply(): void {
    console.log('[HeatMapEffect] 开始应用热力线条特效')

    if (!this.loca) {
      console.warn('[HeatMapEffect] loca 未初始化，无法应用特效')
      return
    }

    const Loca = (window as any).Loca

    // 创建中心点
    const centerPoint = [116.397428, 39.90923]
    const lineCount = 60

    // 生成从中心辐射的线条，不同长度和颜色表示"热度"
    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: lineCount }, (_, i) => {
        const angle = (i / lineCount) * Math.PI * 2
        const heatLevel = Math.random()

        const distance = 0.02 + heatLevel * 0.06
        const endX = centerPoint[0] + Math.cos(angle) * distance
        const endY = centerPoint[1] + Math.sin(angle) * distance

        // 颜色梯度：蓝色(冷) -> 绿色 -> 黄色 -> 红色(热)
        let color
        if (heatLevel < 0.5) {
          color = '#4ECDC4'
        } else if (heatLevel < 0.7) {
          color = '#2ECC71'
        } else if (heatLevel < 0.9) {
          color = '#F39C12'
        } else {
          color = '#E74C3C'
        }

        return {
          type: 'Feature',
          properties: {
            color: color,
            heatLevel: heatLevel,
            height: heatLevel * 150000
          },
          geometry: {
            type: 'LineString',
            coordinates: [centerPoint, [endX, endY]]
          }
        }
      })
    }
    console.log('[HeatMapEffect] 热力线条数据:', geoData)

    const layer = new Loca.LinkLayer({
      zIndex: 10,
      opacity: 0.7,
      visible: true,
      zooms: [2, 22]
    })
    console.log('[HeatMapEffect] 创建 LinkLayer:', layer)

    const geoSource = new Loca.GeoJSONSource({
      data: geoData
    })
    console.log('[HeatMapEffect] 创建 GeoJSONSource:', geoSource)

    layer.setSource(geoSource)
    console.log('[HeatMapEffect] 设置数据源完成')

    layer.setStyle({
      lineColors: (index: number, feat: any) => {
        const color = feat.properties?.color || '#4ECDC4'
        return [color, color]
      },
      height: (index: number, feat: any) => {
        return feat.properties?.height || 30000
      },
      lineWidth: (index: number, feat: any) => {
        const heatLevel = feat.properties?.heatLevel || 0.5
        return 200 + heatLevel * 400
      },
      smoothSteps: 20
    })
    console.log('[HeatMapEffect] 设置样式完成')

    this.addLocaLayer(layer)
    this.setResult({ layer })
    console.log('[HeatMapEffect] 热力线条图层已添加到 loca')
  }
}
