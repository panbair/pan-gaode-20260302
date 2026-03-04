/**
 * 11. 海量点云特效 - 使用简洁的圆形图标
 * 使用 Loca.IconLayer 创建简洁美观的点云效果
 */

import { BaseEffect } from './baseEffect'

interface IconFeature {
  type: string
  properties: {
    type: number
  }
  geometry: {
    type: string
    coordinates: number[]
  }
}

interface GeoData {
  type: string
  features: IconFeature[]
}

export class MassivePointsEffect extends BaseEffect {
  private iconLayer: any = null

  apply(): void {
    console.log('[MassivePointsEffect] 开始应用海量点云特效')

    if (!this.isLocaAvailable()) {
      console.warn('[MassivePointsEffect] loca 未初始化，无法应用特效')
      return
    }

    if (!this.isMapAvailable()) {
      console.warn('[MassivePointsEffect] map 未初始化，无法应用特效')
      return
    }

    this.setView({
      pitch: 0,
      zoom: 13.54,
      center: [116.397428, 39.90923]
    })
    console.log('[MassivePointsEffect] 调整地图视角')

    const Loca = (window as any).Loca // eslint-disable-line @typescript-eslint/no-explicit-any

    // 创建图标点层
    this.createIconLayer(Loca)

    console.log('[MassivePointsEffect] 海量点云特效应用完成')
  }

  /**
   * 创建图标点层 - 使用简洁的圆形图标
   */
  private createIconLayer(Loca: any): void {
    const iconData = this.generateIconData()
    const geoSource = new Loca.GeoJSONSource({
      data: iconData
    })

    this.iconLayer = new Loca.IconLayer({
      zIndex: 10,
      opacity: 1,
      visible: false,
      zooms: [2, 22]
    })

    // 带光晕效果的霓虹图标
    const neonIcons = {
      0: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgwLDI1NSwyNTUsMSkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9InJnYmEoMCwyNTUsMjU1LDApIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9InVybCgjZzIpIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMTAiIGZpbGw9InJnYmEoMCwyNTUsMjU1LDAuOSkiLz48L3N2Zz4=',
      1: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMCwyNTUsMSkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9InJnYmEoMjU1LDAsMjU1LDApIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9InVybCgjZzIpIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMTAiIGZpbGw9InJnYmEoMjU1LDAsMjU1LDAuOSkiLz48L3N2Zz4=',
      2: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgwLDI1NSwwLDEpIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJyZ2JhKDAsMjU1LDAsMCkiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMiIgZmlsbD0idXJsKCNnMikiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIxMCIgZmlsbD0icmdiYSgwLDI1NSwwLDAuOSkiLz48L3N2Zz4=',
      3: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMTY1LDAsMSkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9InJnYmEoMjU1LDE2NSwwLDApIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9InVybCgjZzIpIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMTAiIGZpbGw9InJnYmEoMjU1LDE2NSwwLDAuOSkiLz48L3N2Zz4=',
      4: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMCwxMjgsMSkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9InJnYmEoMjU1LDAsMTI4LDApIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9InVybCgjZzIpIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMTAiIGZpbGw9InJnYmEoMjU1LDAsMTI4LDAuOSkiLz48L3N2Zz4=',
      5: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMjU1LDAsMSkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9InJnYmEoMjU1LDI1NSwwLDApIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9InVybCgjZzIpIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMTAiIGZpbGw9InJnYmEoMjU1LDI1NSwwLDAuOSkiLz48L3N2Zz4='
    }

    this.iconLayer.setSource(geoSource)
    this.iconLayer.setStyle({
      unit: 'px',
      icon: (_index: number, feature: { properties?: any }) => {
        const data = feature.properties
        const iconType = (data?.type || 0) % Object.keys(neonIcons).length
        return neonIcons[iconType as keyof typeof neonIcons]
      },
      iconSize: [48, 48],
      offset: [-24, -24],
      rotation: 0
    })

    this.addLocaLayer(this.iconLayer)

    // 延迟显示并添加动画
    setTimeout(() => {
      this.iconLayer.show()
      this.iconLayer.addAnimate({
        key: 'offset',
        value: [0, 1],
        easing: 'Linear',
        transform: 500,
        random: true,
        delay: 2000
      })
      this.iconLayer.addAnimate({
        key: 'iconSize',
        value: [0, 1],
        easing: 'Linear',
        transform: 500,
        random: true,
        delay: 2000
      })
    }, 800)

    // 启动动画循环
    this.loca.animate.start()

    console.log('[MassivePointsEffect] 图标点层已创建，点数:', iconData.features.length)
  }

  /**
   * 生成图标点数据
   */
  private generateIconData(): GeoData {
    const center = [116.397428, 39.90923]
    const features: IconFeature[] = []

    // 分层生成点云数据，创造视觉深度
    const layers = [
      { count: 100, radius: 0.04 },
      { count: 80, radius: 0.06 },
      { count: 60, radius: 0.08 },
      { count: 40, radius: 0.10 }
    ]

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + layerIndex * 0.5
        const radius = Math.random() * layer.radius

        const offsetX = Math.cos(angle) * radius
        const offsetY = Math.sin(angle) * radius * 0.7

        const x = center[0] + offsetX
        const y = center[1] + offsetY

        const iconType = Math.floor(Math.random() * 6)

        features.push({
          type: 'Feature',
          properties: {
            type: iconType
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        })
      }
    })

    return {
      type: 'FeatureCollection',
      features
    }
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    super.cleanup()

    this.iconLayer = null

    console.log('[MassivePointsEffect] 资源清理完成')
  }
}
