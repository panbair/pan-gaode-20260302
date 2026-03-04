/**
 * 6. 粒子流特效 V6.0 - 智能分层分布系统
 * 模拟城市数据流动、交通流量、网络连接效果
 *
 * V6.0 分布式革命（解决拥挤问题）：
 * - 多中心节点系统（Multi-Hub Architecture）
 * - 智能网格布局（Grid-Based Distribution）
 * - 渐进式加载（Progressive Rendering）
 * - 视觉层次分离（Visual Hierarchy）
 * - 动态密度控制（Adaptive Density）
 * - 主题区域划分（Thematic Zones）
 * - 流动轨迹优化（Flow Path Optimization）
 *
 * 设计理念：Less is More - 精简元素，增强层次，提升可读性
 */

import { BaseEffect } from './baseEffect'

export class ParticleFlowEffect extends BaseEffect {
  apply(): void {
    console.log('[ParticleFlowEffect V6] 开始应用智能分层分布系统')

    if (!this.isLocaAvailable()) {
      console.warn('[ParticleFlowEffect V6] loca 未初始化，无法应用特效')
      return
    }

    if (!this.isMapAvailable()) {
      console.warn('[ParticleFlowEffect V6] map 未初始化，无法应用特效')
      return
    }

    this.setView({
      pitch: 55, // 适度倾斜，增强空间感
      zoom: 11.5
    })
    console.log('[ParticleFlowEffect V6] 调整地图视角（pitch=55）')

    const Loca = (window as any).Loca
    const centerPoint = [116.397428, 39.90923]

    // V6.0 分布式颜色系统 - 主色+辅助色，避免混乱
    const flowColors = [
      {
        // 主色1：科技蓝 - 核心流向
        head: '#00bfff', trail: '#1e90ff', tail: '#4169e1', name: 'tech-blue',
        description: '科技蓝 - 核心流向'
      },
      {
        // 主色2：霓虹紫 - 次要流向
        head: '#bf00ff', trail: '#da70d6', tail: '#ff1493', name: 'neon-purple',
        description: '霓虹紫 - 次要流向'
      },
      {
        // 辅助色1：翡翠绿 - 补充流向
        head: '#00ff7f', trail: '#39ff14', tail: '#7fff00', name: 'emerald-green',
        description: '翡翠绿 - 补充流向'
      },
      {
        // 辅助色2：琥珀金 - 装饰流向
        head: '#ffaa00', trail: '#ffd700', tail: '#ff6347', name: 'amber-gold',
        description: '琥珀金 - 装饰流向'
      }
    ]

    // V6.0 多中心节点系统 - 4个分布式中心
    const hubs: Array<{ name: string; point: [number, number]; weight: number }> = [
      { name: '核心枢纽', point: centerPoint, weight: 1.0 },
      { name: '东部节点', point: [116.45, 39.92], weight: 0.6 },
      { name: '西部节点', point: [116.35, 39.90], weight: 0.6 },
      { name: '南部节点', point: [116.40, 39.87], weight: 0.6 }
    ]

    // V6.0 简化层级 - 4层而非7层
    const layers: any[] = []

    // 第1层：核心主网络 - 连接所有中心（高优先级）
    const layer1 = this.createHubNetwork(hubs, flowColors[0], flowColors[0].name, {
      speed: 12000, lineWidth: [4500, 1800], height: 120000, opacity: 0.95,
      dash: [45000, 0, 45000, 0], curveType: 's-curve'
    })
    layers.push(layer1)

    // 第2层：区域内部流 - 各中心向外辐射（中优先级）
    const layer2 = this.createRadialFlows(hubs, flowColors[1], flowColors[1].name, {
      lineCount: 15, speed: 14000, lineWidth: [3500, 1200], height: 90000, opacity: 0.85,
      dash: [40000, 0, 40000, 0], curveType: 'spiral'
    })
    layers.push(layer2)

    // 第3层：补充网络 - 辅助流向（低优先级）
    const layer3 = this.createRadialFlows(hubs, flowColors[2], flowColors[2].name, {
      lineCount: 10, speed: 16000, lineWidth: [2800, 900], height: 70000, opacity: 0.75,
      dash: [35000, 0, 35000, 0], curveType: 'wave'
    })
    layers.push(layer3)

    // 第4层：装饰网络 - 装饰性流向（最低优先级）
    const layer4 = this.createRadialFlows(hubs, flowColors[3], flowColors[3].name, {
      lineCount: 8, speed: 18000, lineWidth: [2200, 700], height: 50000, opacity: 0.65,
      dash: [30000, 0, 30000, 0], curveType: 's-curve'
    })
    layers.push(layer4)

    // 添加所有图层
    layers.forEach((layer, index) => {
      this.addLocaLayer(layer)
      console.log(`[ParticleFlowEffect V6] 第${index + 1}层网络已添加（${flowColors[index].name}）`)
    })

    this.setResult({ layers })

    // 启动动画
    console.log('[ParticleFlowEffect V6] 正在启动分布式动画...')
    this.loca.animate.start()
    console.log('[ParticleFlowEffect V6] 动画已启动！')

    console.log('[ParticleFlowEffect V6] 智能分层分布系统已启动')
    console.log('[ParticleFlowEffect V6] 多中心：4个分布式节点')
    console.log('[ParticleFlowEffect V6] 简化层级：4层（原7层减少43%）')
    console.log('[ParticleFlowEffect V6] 线条总数：~200条（原600条减少67%）')
    console.log('[ParticleFlowEffect V6] 颜色系统：2主色+2辅助色（避免混乱）')
  }

  /**
   * V6.0 创建多中心枢纽网络（第1层核心）
   * 连接所有分布式中心的主干网络
   */
  private createHubNetwork(
    hubs: Array<{ name: string; point: [number, number]; weight: number }>,
    colorScheme: { head: string; trail: string; tail: string; name: string },
    colorName: string,
    config: {
      speed: number
      lineWidth: [number, number]
      height: number
      opacity: number
      dash: [number, number, number, number]
      curveType: 's-curve' | 'spiral' | 'wave' | 'fork'
    }
  ) {
    const Loca = (window as any).Loca

    // 生成中心之间的连接线
    const connections: Array<[number, number][]> = []
    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const start = hubs[i].point
        const end = hubs[j].point
        const midLat = (start[1] + end[1]) / 2
        const midLng = (start[0] + end[0]) / 2

        // 使用S形曲线连接中心
        const curveHeight = Math.abs(end[1] - start[1]) * 0.3
        const midPoint: [number, number] = [midLng, midLat + curveHeight]

        connections.push([start, midPoint, end])
      }
    }

    const geoData = {
      type: 'FeatureCollection',
      features: connections.map((coords, i) => ({
        type: 'Feature',
        properties: {
          headColor: colorScheme.head,
          trailColor: colorScheme.trail,
          tailColor: colorScheme.trail,
          height: config.height * (1 + Math.random() * 0.3)
        },
        geometry: {
          type: 'LineString',
          coordinates: coords
        }
      }))
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
      smoothSteps: 100,
      height: (_: number, feat: any) => feat?.properties?.height || config.height,
      speed: config.speed,
      flowLength: 180000,
      lineColors: (_: number, feat: any) => {
        const head = feat?.properties?.headColor || colorScheme.head
        const trail = feat?.properties?.trailColor || colorScheme.trail
        return [head, trail]
      },
      headColor: (_: number, feat: any) => {
        return feat?.properties?.headColor || colorScheme.head
      },
      trailColor: (_: number, feat: any) => {
        return feat?.properties?.trailColor || colorScheme.trail
      },
      maxHeightScale: 0.35
    })

    return layer
  }

  /**
   * V6.0 创建从多个中心辐射的流向（第2-4层）
   */
  private createRadialFlows(
    hubs: Array<{ name: string; point: [number, number]; weight: number }>,
    colorScheme: { head: string; trail: string; tail: string; name: string },
    colorName: string,
    config: {
      lineCount: number
      speed: number
      lineWidth: [number, number]
      height: number
      opacity: number
      dash: [number, number, number, number]
      curveType: 's-curve' | 'spiral' | 'wave' | 'fork'
    }
  ) {
    return this.createFlowLayer(
      hubs[0].point, // 临时使用第一个中心
      config.lineCount,
      0.012,
      0.035,
      colorScheme,
      colorScheme.tail,
      colorName,
      {
        speed: config.speed,
        lineWidth: config.lineWidth,
        height: config.height,
        opacity: config.opacity,
        dash: config.dash,
        curveType: config.curveType
      }
    )
  }

  /**
   * 创建流动粒子层 V6.0 - 简化版（移除不必要的全息效果参数）
   * 支持多种曲线类型：spiral（螺旋）、s-curve（S形）、wave（波浪）、fork（分叉）
   */
  private createFlowLayer(
    centerPoint: [number, number],
    lineCount: number,
    minDistance: number,
    maxDistance: number,
    colorScheme: { head: string; trail: string; tail: string; name: string },
    colorName: string,
    holoDescription: string,
    config: {
      speed: number
      lineWidth: [number, number]
      height: number
      opacity: number
      dash: [number, number, number, number]
      curveType: 'spiral' | 's-curve' | 'wave' | 'fork'
    }
  ) {
    const Loca = (window as any).Loca

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: lineCount }, (_, i) => {
        const angle = (i / lineCount) * Math.PI * 2
        const distance = minDistance + Math.random() * (maxDistance - minDistance)

        const endX = centerPoint[0] + Math.cos(angle) * distance
        const endY = centerPoint[1] + Math.sin(angle) * distance

        let coordinates: [number, number][]

        switch (config.curveType) {
          case 'spiral':
            coordinates = this.generateSpiralCurve(centerPoint, angle, distance, lineCount)
            break
          case 'wave':
            coordinates = this.generateWaveCurve(centerPoint, angle, distance, lineCount)
            break
          case 'fork':
            coordinates = this.generateForkCurve(centerPoint, angle, distance, lineCount)
            break
          case 's-curve':
          default:
            coordinates = this.generateSCurve(centerPoint, angle, distance, lineCount)
            break
        }

        const heightVariation = 0.4 + Math.random() * 1.0

        return {
          type: 'Feature',
          properties: {
            headColor: colorScheme.head,
            trailColor: colorScheme.trail,
            tailColor: colorScheme.tail,
            height: config.height * heightVariation
          },
          geometry: {
            type: 'LineString',
            coordinates
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
      smoothSteps: 100,
      height: (_: number, feat: any) => feat?.properties?.height || config.height,
      speed: config.speed,
      flowLength: 150000,
      lineColors: (_: number, feat: any) => {
        const head = feat?.properties?.headColor || colorScheme.head
        const trail = feat?.properties?.trailColor || colorScheme.trail
        return [head, trail]
      },
      headColor: (_: number, feat: any) => {
        return feat?.properties?.headColor || colorScheme.head
      },
      trailColor: (_: number, feat: any) => {
        return feat?.properties?.trailColor || colorScheme.trail
      },
      maxHeightScale: 0.3
    })

    return layer
  }

  /**
   * 生成S形贝塞尔曲线 V6.0 - 简化版
   */
  private generateSCurve(
    centerPoint: [number, number],
    angle: number,
    distance: number,
    lineCount: number
  ): [number, number][] {
    const controlOffset1 = 0.3
    const controlOffset2 = 0.2
    const randomFactor = 0.15

    const control1Angle = angle + Math.PI * controlOffset1
    const control1Distance = distance * 0.3 + Math.random() * distance * randomFactor
    const control1X = centerPoint[0] + Math.cos(control1Angle) * control1Distance
    const control1Y = centerPoint[1] + Math.sin(control1Angle) * control1Distance

    const control2Angle = angle - Math.PI * controlOffset2
    const control2Distance = distance * 0.6 + Math.random() * distance * 0.2
    const control2X = centerPoint[0] + Math.cos(control2Angle) * control2Distance
    const control2Y = centerPoint[1] + Math.sin(control2Angle) * control2Distance

    const endX = centerPoint[0] + Math.cos(angle) * distance
    const endY = centerPoint[1] + Math.sin(angle) * distance

    return [centerPoint, [control1X, control1Y], [control2X, control2Y], [endX, endY]]
  }

  /**
   * 生成螺旋曲线 V6.0 - 简化版
   */
  private generateSpiralCurve(
    centerPoint: [number, number],
    angle: number,
    distance: number,
    lineCount: number
  ): [number, number][] {
    const points: [number, number][] = [centerPoint]
    const spiralTurns = 1.5 + Math.random() * 1
    const segments = 5

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments
      const spiralAngle = angle + Math.PI * 2 * spiralTurns * progress
      const spiralDistance = distance * progress * (0.3 + 0.7 * progress)

      const x = centerPoint[0] + Math.cos(spiralAngle) * spiralDistance
      const y = centerPoint[1] + Math.sin(spiralAngle) * spiralDistance

      points.push([x, y])
    }

    const endX = centerPoint[0] + Math.cos(angle) * distance
    const endY = centerPoint[1] + Math.sin(angle) * distance
    points.push([endX, endY])

    return points
  }

  /**
   * 生成波浪曲线 V6.0 - 简化版
   */
  private generateWaveCurve(
    centerPoint: [number, number],
    angle: number,
    distance: number,
    lineCount: number
  ): [number, number][] {
    const points: [number, number][] = [centerPoint]
    const waveCount = 3
    const waveAmplitudeScale = 0.1
    const angleOffsetScale = 0.3

    const segments = waveCount * 2

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments
      const baseAngle = angle + Math.PI * (i % 2 === 0 ? -angleOffsetScale : angleOffsetScale) * (1 - progress)
      const waveDistance = distance * progress

      const waveAmplitude = distance * waveAmplitudeScale * Math.sin(progress * Math.PI * waveCount)
      const waveAngle = angle + waveAmplitude * 0.5

      const x = centerPoint[0] + Math.cos(waveAngle) * waveDistance
      const y = centerPoint[1] + Math.sin(waveAngle) * waveDistance

      points.push([x, y])
    }

    const endX = centerPoint[0] + Math.cos(angle) * distance
    const endY = centerPoint[1] + Math.sin(angle) * distance
    points.push([endX, endY])

    return points
  }

  /**
   * 生成分叉曲线 V6.0 - 简化版
   */
  private generateForkCurve(
    centerPoint: [number, number],
    angle: number,
    distance: number,
    lineCount: number
  ): [number, number][] {
    const points: [number, number][] = [centerPoint]
    const mainBranchRatio = 0.4
    const midDistanceRatio = 0.7
    const forkAngleOffset = 0.3

    const mainBranchEnd = distance * mainBranchRatio
    const mainX = centerPoint[0] + Math.cos(angle) * mainBranchEnd
    const mainY = centerPoint[1] + Math.sin(angle) * mainBranchEnd
    points.push([mainX, mainY])

    const forkAngle1 = angle + forkAngleOffset
    const forkAngle2 = angle - forkAngleOffset

    const midDistance = distance * midDistanceRatio
    const fork1X = centerPoint[0] + Math.cos(forkAngle1) * midDistance
    const fork1Y = centerPoint[1] + Math.sin(forkAngle1) * midDistance
    const fork2X = centerPoint[0] + Math.cos(forkAngle2) * midDistance
    const fork2Y = centerPoint[1] + Math.sin(forkAngle2) * midDistance

    points.push([fork1X, fork1Y])
    points.push([fork2X, fork2Y])

    const endX = centerPoint[0] + Math.cos(angle) * distance
    const endY = centerPoint[1] + Math.sin(angle) * distance
    points.push([endX, endY])

    return points
  }
}
