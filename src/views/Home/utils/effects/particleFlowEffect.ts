/**
 * 5. 粒子流特效 - 流量可视化风格
 * 模拟城市数据流动、交通流量、网络连接效果
 */

import { BaseEffect } from './baseEffect'

export class ParticleFlowEffect extends BaseEffect {
  apply(): void {
    console.log('[ParticleFlowEffect] 开始应用粒子流特效')

    if (!this.loca) {
      console.warn('[ParticleFlowEffect] loca 未初始化，无法应用特效')
      return
    }

    // 设置3D视角 - 倾斜角度大一些,增强3D效果
    this.setView({
      pitch: 50,
      zoom: 11.5
    })
    console.log('[ParticleFlowEffect] 调整地图视角为 3D 模式')

    const Loca = (window as any).Loca
    const centerPoint = [116.397428, 39.90923]

    // 水的配色方案 - 清澈、流动、波光粼粼
    const flowColors = [
      {
        head: '#E0F7FA', // 头部 - 冰蓝白
        trail: '#4FC3F7', // 尾部 - 天蓝色
        name: 'light'
      },
      {
        head: '#81D4FA', // 头部 - 湖水蓝
        trail: '#29B6F6', // 尾部 - 海洋蓝
        name: 'ocean'
      },
      {
        head: '#B3E5FC', // 头部 - 浅青蓝
        trail: '#03A9F4', // 尾部 - 深青蓝
        name: 'deep'
      }
    ]

    // 创建三层粒子流 - 模拟真实数据流动的层次感
    const layers: any[] = []

    // 主层 - 主要流量,中等速度,较高透明度
    const mainLayer = this.createFlowLayer(
      centerPoint,
      100,
      0.025,
      0.06,
      flowColors[0],
      {
        speed: 80000,
        lineWidth: [1200, 500],
        height: 45000,
        opacity: 0.9,
        dash: [60000, 30000, 10000, 0]
      }
    )
    layers.push(mainLayer)

    // 次层 - 辅助流量,稍慢,降低透明度
    const secondaryLayer = this.createFlowLayer(
      centerPoint,
      70,
      0.015,
      0.04,
      flowColors[1],
      {
        speed: 100000,
        lineWidth: [900, 400],
        height: 35000,
        opacity: 0.7,
        dash: [70000, 40000, 15000, 0]
      }
    )
    layers.push(secondaryLayer)

    // 内层 - 核心流量,快速度,低透明度
    const innerLayer = this.createFlowLayer(
      centerPoint,
  50,
      0.01,
      0.025,
      flowColors[2],
      {
        speed: 60000,
        lineWidth: [700, 300],
        height: 25000,
        opacity: 0.5,
        dash: [50000, 25000, 8000, 0]
      }
    )
    layers.push(innerLayer)

    // 添加所有图层
    layers.forEach((layer, index) => {
      this.loca.add(layer)
      console.log(`[ParticleFlowEffect] 第${index + 1}层粒子流已添加`)
    })

    this.setResult({ layers })
    this.loca.animate.start()
    console.log('[ParticleFlowEffect] 多层粒子流动画已启动')
  }

  /**
   * 创建流动粒子层
   * 使用贝塞尔曲线和渐变色效果
   */
  private createFlowLayer(
    centerPoint: [number, number],
    lineCount: number,
    minDistance: number,
    maxDistance: number,
    colorScheme: { head: string; trail: string; name: string },
    config: {
      speed: number
      lineWidth: [number, number]
      height: number
      opacity: number
      dash: [number, number, number, number]
    }
  ) {
    const Loca = (window as any).Loca

    // 创建贝塞尔曲线路径
    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: lineCount }, (_, i) => {
        const angle = (i / lineCount) * Math.PI * 2
        const distance = minDistance + Math.random() * (maxDistance - minDistance)

        // 计算终点
        const endX = centerPoint[0] + Math.cos(angle) * distance
        const endY = centerPoint[1] + Math.sin(angle) * distance

        // 创建两个控制点,形成S形曲线
        const control1Angle = angle + Math.PI * 0.3
        const control1Distance = distance * 0.3 + Math.random() * distance * 0.15
        const control1X = centerPoint[0] + Math.cos(control1Angle) * control1Distance
        const control1Y = centerPoint[1] + Math.sin(control1Angle) * control1Distance

        const control2Angle = angle - Math.PI * 0.2
        const control2Distance = distance * 0.6 + Math.random() * distance * 0.2
        const control2X = centerPoint[0] + Math.cos(control2Angle) * control2Distance
        const control2Y = centerPoint[1] + Math.sin(control2Angle) * control2Distance

        // 高度随机变化,增加立体感
        const heightVariation = 0.7 + Math.random() * 0.6

        return {
          type: 'Feature',
          properties: {
            headColor: colorScheme.head,
            trailColor: colorScheme.trail,
            height: config.height * heightVariation
          },
          geometry: {
            type: 'LineString',
            coordinates: [centerPoint, [control1X, control1Y], [control2X, control2Y], [endX, endY]]
          }
        }
      })
    }

    const layer = new Loca.PulseLinkLayer({
      zIndex: 16,
      opacity: config.opacity,
      visible: true,
      zooms: [2, 22]
    })

    const geoSource = new Loca.GeoJSONSource({ data: geoData })
    layer.setSource(geoSource)

    layer.setStyle({
      unit: 'meter',
      dash: config.dash,
      lineWidth: config.lineWidth,
      smoothSteps: 100, // 更平滑的曲线
      height: (_: number, feat: any) => feat?.properties?.height || config.height,
      speed: config.speed,
      flowLength: 100000,
      // 头部最亮,形成粒子头效果
      lineColors: (_: number, feat: any) => {
        const head = feat?.properties?.headColor || colorScheme.head
        const trail = feat?.properties?.trailColor || colorScheme.trail
        // 渐变: 头部亮 -> 尾部暗
        return [head, trail]
      },
      headColor: (_: number, feat: any) => {
        return feat?.properties?.headColor || colorScheme.head
      },
      trailColor: (_: number, feat: any) => {
        return feat?.properties?.trailColor || colorScheme.trail
      },
      maxHeightScale: 0.65
    })

    return layer
  }
}
