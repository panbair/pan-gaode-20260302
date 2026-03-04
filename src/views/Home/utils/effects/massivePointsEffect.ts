/**
 * 11. 海量点云特效
 */

import { BaseEffect } from './baseEffect'

interface Feature {
  type: string
  properties: {
    color: string
    height: number
  }
  geometry: {
    type: string
    coordinates: number[][]
  }
}

interface FeatureProperties {
  color?: string
  height?: number
}

interface GeoData {
  type: string
  features: Feature[]
}

export class MassivePointsEffect extends BaseEffect {
  apply(): void {
    console.log('[MassivePointsEffect] 开始应用海量点云线条网格特效')

    if (!this.isLocaAvailable()) {
      console.warn('[MassivePointsEffect] loca 未初始化，无法应用特效')
      return
    }

    if (!this.isMapAvailable()) {
      console.warn('[MassivePointsEffect] map 未初始化，无法应用特效')
      return
    }

    this.setView({
      pitch: 55,
      zoom: 13
    })
    console.log('[MassivePointsEffect] 调整地图视角为 3D 模式')

    const Loca = (window as any).Loca // eslint-disable-line @typescript-eslint/no-explicit-any

    // 创建多条连接线条
    const lineCount = 200
    const centerPoints = [
      [116.397428, 39.90923],
      [116.447428, 39.92923],
      [116.347428, 39.88923],
      [116.467428, 39.88923],
      [116.367428, 39.94923]
    ]

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F39C12', '#9B59B6']

    const geoData: GeoData = {
      type: 'FeatureCollection',
      features: []
    }

    const features: Feature[] = []

    // 从每个中心点生成多条辐射线条
    centerPoints.forEach((center, centerIdx) => {
      const linesPerCenter = lineCount / centerPoints.length

      for (let i = 0; i < linesPerCenter; i++) {
        const angle = (i / linesPerCenter) * Math.PI * 2
        const distance = 0.03 + Math.random() * 0.05
        const endX = center[0] + Math.cos(angle) * distance
        const endY = center[1] + Math.sin(angle) * distance

        const height = distance * 300000 + Math.random() * 100000

        features.push({
          type: 'Feature',
          properties: {
            color: colors[centerIdx],
            height: height
          },
          geometry: {
            type: 'LineString',
            coordinates: [center, [endX, endY]]
          }
        })
      }
    })

    // 添加横向连接线
    for (let i = 0; i < 50; i++) {
      const startX = 116.347428 + Math.random() * 0.12
      const endX = startX + 0.02 + Math.random() * 0.03
      const y = 39.87923 + Math.random() * 0.08

      features.push({
        type: 'Feature',
        properties: {
          color: '#2ECC71',
          height: 50000 + Math.random() * 80000
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [startX, y],
            [endX, y]
          ]
        }
      })
    }

    geoData.features = features

    console.log('[MassivePointsEffect] 海量线条网格数据:', geoData)

    const layer = new Loca.LinkLayer({
      zIndex: 100,
      opacity: 0.6,
      visible: true,
      zooms: [2, 22]
    })
    console.log('[MassivePointsEffect] 创建 LinkLayer:', layer)

    const geoSource = new Loca.GeoJSONSource({
      data: geoData
    })
    console.log('[MassivePointsEffect] 创建 GeoJSONSource:', geoSource)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    layer.setSource(geoSource)
    console.log('[MassivePointsEffect] 设置数据源完成')

    layer.setStyle({
      lineColors: (_index: number, feat: { properties?: FeatureProperties }) => {
        const color = feat.properties?.color || '#4ECDC4'
        return [color, color]
      },
      height: (_index: number, feat: { properties?: FeatureProperties }) => {
        return feat.properties?.height || 50000
      },
      lineWidth: 300,
      smoothSteps: 30
    })
    console.log('[MassivePointsEffect] 设置样式完成')

    this.addLocaLayer(layer)
    this.setResult({ layer })
    console.log('[MassivePointsEffect] 海量线条网格图层已添加到 loca')

    this.loca.animate.start()
    console.log('[MassivePointsEffect] 动画已启动')
  }
}
