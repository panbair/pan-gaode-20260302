/**
 * 18. 动态流向图特效 (升级版)
 * 特性：
 * - 带动画箭头的流向效果，展示数据流动方向
 * - 多种流向类型（单向、双向、循环）
 * - 动态流速和流量控制
 * - 炫酷霓虹渐变色流动效果
 * - 流量数据可视化
 * - 支持多种箭头样式
 * - 路径沿线动画
 * - 赛博朋克风格配色系统
 * - 多重光晕和粒子特效
 */

import { BaseEffect } from './baseEffect'

interface FlowData {
  id: string
  from: string
  to: string
  value: number
  type: 'single' | 'bidirectional' | 'circular'
  speed?: number
}

interface FlowNode {
  name: string
  coords: [number, number]
  value?: number
}

export class FlowMapEffect extends BaseEffect {
  private flowLayer: any = null
  private nodeLayer: any = null
  private labelLayer: any = null
  private arrowLayer: any = null
  private animationId: number | null = null
  private flowProgress: number = 0

  // 主要城市坐标
  private nodes: FlowNode[] = [
    { name: '北京', coords: [116.397428, 39.90923], value: 100 },
    { name: '上海', coords: [121.467428, 31.22923], value: 95 },
    { name: '广州', coords: [113.264385, 23.129112], value: 85 },
    { name: '深圳', coords: [114.057868, 22.543099], value: 80 },
    { name: '成都', coords: [104.066541, 30.572269], value: 75 },
    { name: '武汉', coords: [114.305393, 30.593099], value: 70 },
    { name: '西安', coords: [108.940174, 34.341574], value: 65 },
    { name: '杭州', coords: [120.15507, 30.274077], value: 70 },
    { name: '南京', coords: [118.796877, 32.060255], value: 60 },
    { name: '重庆', coords: [106.551557, 29.563009], value: 60 },
    { name: '天津', coords: [117.200983, 39.084158], value: 55 },
    { name: '郑州', coords: [113.625368, 34.7466], value: 50 }
  ]

  // 流向数据
  private flows: FlowData[] = [
    { id: '1', from: '北京', to: '上海', value: 90, type: 'bidirectional', speed: 1.0 },
    { id: '2', from: '北京', to: '广州', value: 85, type: 'single', speed: 0.8 },
    { id: '3', from: '北京', to: '成都', value: 75, type: 'single', speed: 0.7 },
    { id: '4', from: '北京', to: '武汉', value: 65, type: 'bidirectional', speed: 0.6 },
    { id: '5', from: '上海', to: '广州', value: 70, type: 'bidirectional', speed: 0.9 },
    { id: '6', from: '上海', to: '深圳', value: 65, type: 'single', speed: 0.8 },
    { id: '7', from: '上海', to: '南京', value: 55, type: 'bidirectional', speed: 0.5 },
    { id: '8', from: '广州', to: '深圳', value: 80, type: 'bidirectional', speed: 1.0 },
    { id: '9', from: '广州', to: '成都', value: 45, type: 'single', speed: 0.6 },
    { id: '10', from: '成都', to: '重庆', value: 70, type: 'bidirectional', speed: 0.7 },
    { id: '11', from: '成都', to: '西安', value: 50, type: 'bidirectional', speed: 0.5 },
    { id: '12', from: '武汉', to: '郑州', value: 40, type: 'bidirectional', speed: 0.4 },
    { id: '13', from: '北京', to: '天津', value: 60, type: 'bidirectional', speed: 0.5 },
    { id: '14', from: '武汉', to: '广州', value: 50, type: 'single', speed: 0.6 },
    { id: '15', from: '西安', to: '郑州', value: 35, type: 'bidirectional', speed: 0.4 }
  ]

  apply(): void {
    console.log('[FlowMapEffect] 开始应用动态流向图特效')

    if (!this.loca) {
      console.warn('[FlowMapEffect] loca 未初始化，无法应用特效')
      return
    }

    const Loca = (window as any).Loca

    // 设置地图视角
    this.setView({
      pitch: 50,
      zoom: 5,
      center: [110, 32]
    })
    console.log('[FlowMapEffect] 调整地图视角为 3D 模式')

    // 创建标签图层
    this.labelLayer = new this.AMap.LabelsLayer({
      rejectMapMask: true,
      collision: true,
      animation: true
    })
    this.map.add(this.labelLayer)
    console.log('[FlowMapEffect] 创建标签图层')

    // 创建节点图层（城市点）
    this.createNodeLayer()
    console.log('[FlowMapEffect] 创建节点图层')

    // 创建流向图层
    this.createFlowLayer()
    console.log('[FlowMapEffect] 创建流向图层')

    // 创建箭头图层
    this.createArrowLayer()
    console.log('[FlowMapEffect] 创建箭头图层')

    // 添加城市标签
    this.createLabels()
    console.log('[FlowMapEffect] 创建城市标签')

    // 启动动画
    this.startAnimation()
    console.log('[FlowMapEffect] 动画已启动')

    // 设置结果
    this.setResult({
      flowLayer: this.flowLayer,
      nodeLayer: this.nodeLayer,
      labelLayer: this.labelLayer,
      arrowLayer: this.arrowLayer,
      cleanup: () => this.cleanupFlowMap()
    })

    console.log('[FlowMapEffect] 特效应用完成')
  }

  // 创建节点图层
  private createNodeLayer(): void {
    const Loca = (window as any).Loca

    const nodeFeatures = this.nodes.map(node => ({
      type: 'Feature',
      properties: {
        name: node.name,
        value: node.value || 0
      },
      geometry: {
        type: 'Point',
        coordinates: node.coords
      }
    }))

    const nodeSource = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: nodeFeatures
      }
    })

    this.nodeLayer = new Loca.ScatterLayer({
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    this.nodeLayer.setSource(nodeSource)
    this.nodeLayer.setStyle({
      size: (index: number, item: any) => {
        const value = item?.properties?.value || 50
        return [value * 5000, value * 5000]
      },
      unit: 'meter',
      texture: this.createNodeTexture(),
      height: (index: number, item: any) => {
        const value = item?.properties?.value || 50
        return value * 3000
      },
      altitudeScale: 1,
      shape: 'cylinder'
    })

    this.addLocaLayer(this.nodeLayer)
  }

  // 创建流向图层
  private createFlowLayer(): void {
    const Loca = (window as any).Loca

    const flowFeatures: any[] = []

    this.flows.forEach(flow => {
      const fromNode = this.nodes.find(n => n.name === flow.from)
      const toNode = this.nodes.find(n => n.name === flow.to)

      if (!fromNode || !toNode) {
        console.warn(`[FlowMapEffect] 无法找到节点: ${flow.from} 或 ${flow.to}`)
        return
      }

      // 单向流向
      flowFeatures.push({
        type: 'Feature',
        properties: {
          id: flow.id,
          from: flow.from,
          to: flow.to,
          value: flow.value,
          speed: flow.speed || 1,
          direction: 1,
          flowType: flow.type
        },
        geometry: {
          type: 'LineString',
          coordinates: [fromNode.coords, toNode.coords]
        }
      })

      // 双向流向
      if (flow.type === 'bidirectional') {
        flowFeatures.push({
          type: 'Feature',
          properties: {
            id: `${flow.id}_reverse`,
            from: flow.to,
            to: flow.from,
            value: flow.value * 0.8,
            speed: flow.speed || 1,
            direction: -1,
            flowType: flow.type
          },
          geometry: {
            type: 'LineString',
            coordinates: [toNode.coords, fromNode.coords]
          }
        })
      }
    })

    const flowSource = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: flowFeatures
      }
    })

    this.flowLayer = new Loca.PulseLinkLayer({
      zIndex: 20,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    this.flowLayer.setSource(flowSource)
    this.flowLayer.setStyle({
      unit: 'meter',
      dash: [20000, 10000, 20000, 10000],
      lineWidth: (index: number, item: any) => {
        const value = item?.properties?.value || 50
        return [value * 200, value * 50]
      },
      smoothSteps: 50,
      height: 50000,
      speed: (index: number, prop: any) => {
        return (prop?.speed || 1) * 10000 + Math.random() * 5000
      },
      flowLength: 100000,
      lineColors: (index: number, item: any) => {
        const value = item?.properties?.value || 50
        // 炫酷赛博朋克配色系统
        const colors = [
          // 青色到蓝色渐变 - 数据流量最高
          ['#00ffff', '#0080ff'],
          // 玫红色到紫色
          ['#ff00ff', '#8b00ff'],
          // 金色到橙色
          ['#ffd700', '#ff6b00'],
          // 绿松石到蓝绿色
          ['#00ffcc', '#00bfff'],
          // 洋红色到深紫色
          ['#ff00cc', '#6600ff'],
          // 亮绿色到青色
          ['#00ff00', '#00ffff'],
          // 粉色到洋红色
          ['#ff69b4', '#ff00ff'],
          // 橙红色到金色
          ['#ff4500', '#ffd700']
        ]
        const colorIndex = Math.floor(value / 15) % colors.length
        return colors[colorIndex]
      },
      headColor: (index: number, item: any) => {
        const value = item?.properties?.value || 50
        // 箭头头部高亮色
        const colors = [
          '#ffffff',
          '#ffeb3b',
          '#00ffff',
          '#ff69b4',
          '#00ff00',
          '#ff4500',
          '#8b00ff',
          '#00bfff'
        ]
        const colorIndex = Math.floor(value / 15) % colors.length
        return colors[colorIndex]
      },
      trailColor: (index: number, item: any) => {
        const value = item?.properties?.value || 50
        const colors = [
          'rgba(0, 255, 255, 0.4)',
          'rgba(255, 0, 255, 0.4)',
          'rgba(255, 215, 0, 0.4)',
          'rgba(0, 255, 204, 0.4)',
          'rgba(255, 0, 204, 0.4)',
          'rgba(0, 255, 0, 0.4)',
          'rgba(255, 105, 180, 0.4)',
          'rgba(255, 69, 0, 0.4)'
        ]
        const colorIndex = Math.floor(value / 15) % colors.length
        return colors[colorIndex]
      },
      maxHeightScale: 0.5,
      lineType: 'arc'
    })

    this.addLocaLayer(this.flowLayer)
  }

  // 创建箭头图层
  private createArrowLayer(): void {
    // 箭头通过自定义 Marker 实现
    this.arrowLayer = new this.AMap.OverlayGroup()

    this.flows.forEach(flow => {
      const fromNode = this.nodes.find(n => n.name === flow.from)
      const toNode = this.nodes.find(n => n.name === flow.to)

      if (!fromNode || !toNode) return

      // 单向箭头
      if (flow.type !== 'bidirectional') {
        const arrow = this.createFlowArrow(fromNode.coords, toNode.coords, flow.value, flow.speed)
        this.arrowLayer.addOverlay(arrow)
      }

      // 双向箭头
      if (flow.type === 'bidirectional') {
        const arrow1 = this.createFlowArrow(fromNode.coords, toNode.coords, flow.value, flow.speed)
        const arrow2 = this.createFlowArrow(toNode.coords, fromNode.coords, flow.value * 0.8, flow.speed)
        this.arrowLayer.addOverlay(arrow1)
        this.arrowLayer.addOverlay(arrow2)
      }
    })

    this.map.add(this.arrowLayer)
  }

  // 创建流向箭头
  private createFlowArrow(
    from: [number, number],
    to: [number, number],
    value: number,
    speed: number
  ): any {
    // 计算箭头位置（在路径中间）
    const midX = (from[0] + to[0]) / 2
    const midY = (from[1] + to[1]) / 2

    // 计算角度
    const angle = Math.atan2(to[1] - from[1], to[0] - from[0]) * (180 / Math.PI)

    const size = Math.max(25, value / 2.5)

    // 根据流量值选择颜色
    const arrowColors = [
      { primary: '#00ffff', secondary: '#0080ff', glow: 'rgba(0, 255, 255, 0.6)' },
      { primary: '#ff00ff', secondary: '#8b00ff', glow: 'rgba(255, 0, 255, 0.6)' },
      { primary: '#ffd700', secondary: '#ff6b00', glow: 'rgba(255, 215, 0, 0.6)' },
      { primary: '#00ffcc', secondary: '#00bfff', glow: 'rgba(0, 255, 204, 0.6)' },
      { primary: '#ff00cc', secondary: '#6600ff', glow: 'rgba(255, 0, 204, 0.6)' },
      { primary: '#00ff00', secondary: '#00ffff', glow: 'rgba(0, 255, 0, 0.6)' },
      { primary: '#ff69b4', secondary: '#ff00ff', glow: 'rgba(255, 105, 180, 0.6)' },
      { primary: '#ff4500', secondary: '#ffd700', glow: 'rgba(255, 69, 0, 0.6)' }
    ]
    const colorIndex = Math.floor(value / 15) % arrowColors.length
    const colors = arrowColors[colorIndex]

    const arrowSvg = `
      <svg width="${size}" height="${size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arrowGrad${colorIndex}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors.secondary}" />
            <stop offset="50%" stop-color="${colors.primary}" />
            <stop offset="100%" stop-color="${colors.secondary}" />
          </linearGradient>
          <filter id="glow${colorIndex}">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="5,18 45,25 5,32 15,25"
          fill="url(#arrowGrad${colorIndex})"
          filter="url(#glow${colorIndex})"
        >
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </polygon>
        <polygon
          points="5,18 45,25 5,32 15,25"
          fill="none"
          stroke="${colors.primary}"
          stroke-width="2"
          opacity="0.8"
        />
      </svg>
    `

    const marker = new this.AMap.Marker({
      position: [midX, midY],
      content: arrowSvg,
      offset: new this.AMap.Pixel(-size / 2, -size / 2),
      zIndex: 30,
      angle: angle
    })

    // 添加动画
    const animateArrow = () => {
      const progress = (Date.now() / (8000 / speed)) % 1

      // 计算当前位置
      const currentX = from[0] + (to[0] - from[0]) * progress
      const currentY = from[1] + (to[1] - from[1]) * progress

      // 添加弧线高度（更大的弧度）
      const arcHeight = 3
      const arcOffset = Math.sin(progress * Math.PI) * arcHeight

      marker.setPosition([currentX, currentY + arcOffset])

      // 接近终点时淡出，接近起点时淡入
      const opacity = Math.sin(progress * Math.PI)
      const newSvg = arrowSvg.replace(
        'opacity="0.7"',
        `opacity="${0.5 + opacity * 0.5}"`
      )
      marker.setContent(newSvg)
    }

    // 保存动画函数
    ;(marker as any)._animateArrow = animateArrow

    return marker
  }

  // 创建城市标签
  private createLabels(): void {
    this.nodes.forEach((node, index) => {
      // 根据节点值选择标签颜色
      const labelColors = [
        { bg: 'rgba(0, 255, 255, 0.2)', border: '#00ffff', glow: 'rgba(0, 255, 255, 0.4)' },
        { bg: 'rgba(255, 0, 255, 0.2)', border: '#ff00ff', glow: 'rgba(255, 0, 255, 0.4)' },
        { bg: 'rgba(255, 215, 0, 0.2)', border: '#ffd700', glow: 'rgba(255, 215, 0, 0.4)' },
        { bg: 'rgba(0, 255, 204, 0.2)', border: '#00ffcc', glow: 'rgba(0, 255, 204, 0.4)' },
        { bg: 'rgba(255, 0, 204, 0.2)', border: '#ff00cc', glow: 'rgba(255, 0, 204, 0.4)' },
        { bg: 'rgba(0, 255, 0, 0.2)', border: '#00ff00', glow: 'rgba(0, 255, 0, 0.4)' }
      ]
      const colorIndex = Math.floor((node.value || 50) / 20) % labelColors.length
      const colors = labelColors[colorIndex]

      const marker = new this.AMap.LabelMarker({
        name: node.name,
        position: node.coords,
        zooms: [2, 22],
        opacity: 1,
        zIndex: 15,
        text: {
          content: `${node.name}\n数据量:${node.value || 0}`,
          direction: 'bottom',
          offset: [0, -15],
          style: {
            fontSize: 13,
            fontWeight: 'bold',
            fillColor: '#ffffff',
            backgroundColor: colors.bg,
            borderColor: colors.border,
            borderWidth: 2,
            padding: '4px 8px',
            borderRadius: 6,
            lineHeight: 20
          }
        }
      })
      this.labelLayer.add(marker)
    })
  }

  // 创建节点纹理
  private createNodeTexture(): string {
    const svg = `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(0,255,255,1)" />
            <stop offset="30%" stop-color="rgba(0,200,255,0.8)" />
            <stop offset="60%" stop-color="rgba(0,150,255,0.4)" />
            <stop offset="100%" stop-color="rgba(0,100,255,0)" />
          </radialGradient>
          <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255,0,255,1)" />
            <stop offset="30%" stop-color="rgba(255,0,204,0.8)" />
            <stop offset="60%" stop-color="rgba(200,0,255,0.4)" />
            <stop offset="100%" stop-color="rgba(150,0,255,0)" />
          </radialGradient>
          <radialGradient id="nodeGrad3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255,215,0,1)" />
            <stop offset="30%" stop-color="rgba(255,180,0,0.8)" />
            <stop offset="60%" stop-color="rgba(255,140,0,0.4)" />
            <stop offset="100%" stop-color="rgba(255,100,0,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="64" cy="64" r="64" fill="url(#nodeGrad1)" />
        <circle cx="64" cy="64" r="48" fill="url(#nodeGrad2)" opacity="0.6" />
        <circle cx="64" cy="64" r="32" fill="url(#nodeGrad3)" opacity="0.4" />
        <circle cx="64" cy="64" r="16" fill="#ffffff" filter="url(#glow)" />
        <circle cx="64" cy="64" r="10" fill="rgba(0,255,255,0.8)" />
        <circle cx="64" cy="64" r="6" fill="#ffffff" />
      </svg>
    `.trim()
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  }

  // 启动动画
  private startAnimation(): void {
    const animate = () => {
      this.flowProgress += 0.01

      // 更新箭头位置
      if (this.arrowLayer) {
        const overlays = this.arrowLayer.getOverlays()
        overlays.forEach((marker: any) => {
          if (marker._animateArrow) {
            marker._animateArrow()
          }
        })
      }

      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = requestAnimationFrame(animate)
  }

  // 清理资源
  private cleanupFlowMap(): void {
    console.log('[FlowMapEffect] 开始清理流向图资源')

    // 停止动画
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    // 清理标签图层
    if (this.labelLayer) {
      this.labelLayer.clear()
      this.map.remove(this.labelLayer)
    }

    // 清理箭头图层
    if (this.arrowLayer) {
      this.arrowLayer.clear()
      this.map.remove(this.arrowLayer)
    }

    console.log('[FlowMapEffect] 流向图资源清理完成')
  }

  protected cleanup(): void {
    console.log('[FlowMapEffect] 开始清理资源')

    // 停止动画
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    // 清理标签图层
    if (this.labelLayer) {
      try {
        this.labelLayer.clear()
        this.map.remove(this.labelLayer)
      } catch (e) {
        console.warn('[FlowMapEffect] 清理标签图层时出错:', e)
      }
    }

    // 清理箭头图层 - OverlayGroup 需要清空所有覆盖物再移除
    if (this.arrowLayer) {
      try {
        const overlays = this.arrowLayer.getOverlays()
        if (overlays && overlays.length > 0) {
          overlays.forEach((overlay: any) => {
            try {
              this.map.remove(overlay)
            } catch (e) {
              // 静默处理
            }
          })
        }
        this.arrowLayer.clear()
        this.map.remove(this.arrowLayer)
      } catch (e) {
        console.warn('[FlowMapEffect] 清理箭头图层时出错:', e)
      }
    }

    super.cleanup()
    console.log('[FlowMapEffect] 资源清理完成')
  }
}
