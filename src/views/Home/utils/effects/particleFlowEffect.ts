/**
 * 5. 粒子流特效
 * 使用 Loca PulseLinkLayer 创建流动线条效果
 */

import { BaseEffect } from './baseEffect'

export class ParticleFlowEffect extends BaseEffect {
  apply(): void {
    console.log('[ParticleFlowEffect] 开始应用粒子流线条特效')

    if (!this.loca) {
      console.warn('[ParticleFlowEffect] loca 未初始化，无法应用特效')
      return
    }

    // 设置3D视角
    this.setView({
      pitch: 50,
      zoom: 14
    })
    console.log('[ParticleFlowEffect] 调整地图视角为 3D 模式')

    const Loca = (window as any).Loca

    // 创建连接中心的线条数据
    const centerPoint = [116.397428, 39.90923]
    const lineCount = 100
    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: lineCount }, (_, i) => {
        const angle = (i / lineCount) * Math.PI * 2
        const distance = 0.05 + Math.random() * 0.08
        const endX = centerPoint[0] + Math.cos(angle) * distance
        const endY = centerPoint[1] + Math.sin(angle) * distance

        // 添加中间控制点，形成曲线
        const midAngle = angle + (Math.random() - 0.5) * 0.5
        const midDistance = distance * 0.5 + Math.random() * distance * 0.3
        const midX = centerPoint[0] + Math.cos(midAngle) * midDistance
        const midY = centerPoint[1] + Math.sin(midAngle) * midDistance

        const colors = [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#F39C12',
          '#9B59B6', '#E74C3C', '#2ECC71', '#3498DB'
        ]
        const colorIndex = Math.floor(Math.random() * colors.length)

        return {
          type: 'Feature',
          properties: {
            color: colors[colorIndex],
            distance: distance * 200000
          },
          geometry: {
            type: 'LineString',
            coordinates: [centerPoint, [midX, midY], [endX, endY]]
          }
        }
      })
    }
    console.log('[ParticleFlowEffect] 粒子流线条数据:', geoData)

    const layer = new Loca.PulseLinkLayer({
      zIndex: 10,
      opacity: 0.8,
      visible: true,
      zooms: [2, 22]
    })
    console.log('[ParticleFlowEffect] 创建 PulseLinkLayer:', layer)

    const geoSource = new Loca.GeoJSONSource({
      data: geoData
    })
    console.log('[ParticleFlowEffect] 创建 GeoJSONSource:', geoSource)

    layer.setSource(geoSource)
    console.log('[ParticleFlowEffect] 设置数据源完成')

    layer.setStyle({
      unit: 'meter',
      dash: [20000, 10000, 20000, 0],
      lineWidth: [800, 300],
      smoothSteps: 50,
      height: (index: number, feat: any) => {
        return feat.properties?.distance || 30000
      },
      speed: (index: number, prop: any) => 20000 + Math.random() * 80000,
      flowLength: 80000,
      lineColors: (index: number, feat: any) => {
        const color = feat.properties?.color || '#4ECDC4'
        return [color, color]
      },
      headColor: (index: number, feat: any) => {
        return feat.properties?.color || '#4ECDC4'
      },
      trailColor: (index: number, feat: any) => {
        return feat.properties?.color || '#4ECDC4'
      },
      maxHeightScale: 0.4
    })
    console.log('[ParticleFlowEffect] 设置样式完成')

    this.loca.add(layer)
    this.setResult({ layer })
    console.log('[ParticleFlowEffect] 粒子流线条图层已添加到 loca')

    this.loca.animate.start()
    console.log('[ParticleFlowEffect] 动画已启动')
  }
}
