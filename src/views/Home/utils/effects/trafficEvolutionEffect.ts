/**
 * 交通演变特效
 * 特性：
 * - 展示道路/地铁网络的历史扩展过程
 * - 使用 ScatterLayer + 动态线条实现
 * - 时间轴控制，按历史阶段逐步展示
 * - 多种交通类型（高速公路、地铁、公交）
 * - 动态路径增长动画
 * - 站点脉冲动画（多层脉冲）
 * - 线路颜色渐变和光晕效果
 * - 线路流动动画（虚线流动效果）
 * - 支持播放/暂停/时间控制
 * - 炫酷的交通流动粒子
 * - 历史时间点标注
 * - 入场动画（地图视角旋转进入）
 */

import { BaseEffect } from './baseEffect'

interface TrafficNode {
  id: string
  name: string
  coords: [number, number]
  type: 'metro' | 'highway' | 'bus' | 'rail'
  buildYear: number
  passengerVolume?: number
}

interface TrafficLine {
  id: string
  name: string
  nodes: string[] // node IDs
  type: 'metro' | 'highway' | 'bus' | 'rail'
  buildYear: number
  color: string
  length?: number
}

interface TrafficEvent {
  year: number
  description: string
  lines?: string[]
  nodes?: string[]
}

export class TrafficEvolutionEffect extends BaseEffect {
  private lineLayer: any = null
  private nodeLayer: any = null
  private particleLayer: any = null
  private labelLayer: any = null
  private animationId: number | null = null
  private currentTime: number = 1990
  private isPlaying: boolean = true
  private timeSpeed: number = 80 // 毫秒/年，稍慢一点让动画更流畅
  private lastUpdateTime: number = 0

  // 交通网络数据 - 以北京为例
  private trafficNodes: TrafficNode[] = [
    // 核心站点
    { id: 't1', name: '天安门', coords: [116.397428, 39.90923], type: 'metro', buildYear: 1969, passengerVolume: 100 },
    { id: 't2', name: '北京站', coords: [116.42678, 39.903738], type: 'metro', buildYear: 1969, passengerVolume: 95 },
    { id: 't3', name: '西单', coords: [116.374525, 39.91288], type: 'metro', buildYear: 1969, passengerVolume: 90 },
    { id: 't4', name: '王府井', coords: [116.41066, 39.91364], type: 'metro', buildYear: 1969, passengerVolume: 85 },
    
    // 地铁1号线
    { id: 't5', name: '复兴门', coords: [116.3549, 39.91388], type: 'metro', buildYear: 1969 },
    { id: 't6', name: '军事博物馆', coords: [116.3225, 39.92688], type: 'metro', buildYear: 1969 },
    { id: 't7', name: '公主坟', coords: [116.3058, 39.93268], type: 'metro', buildYear: 1969 },
    { id: 't8', name: '五棵松', coords: [116.2702, 39.94208], type: 'metro', buildYear: 1969 },
    { id: 't9', name: '西四', coords: [116.3788, 39.92808], type: 'metro', buildYear: 1975 },
    { id: 't10', name: '东单', coords: [116.4256, 39.91288], type: 'metro', buildYear: 1975 },
    { id: 't11', name: '建国门', coords: [116.4451, 39.91308], type: 'metro', buildYear: 1975 },
    { id: 't12', name: '国贸', coords: [116.4585, 39.90968], type: 'metro', buildYear: 1975 },
    { id: 't13', name: '大望路', coords: [116.4785, 39.90668], type: 'metro', buildYear: 1985 },
    { id: 't14', name: '四惠', coords: [116.4978, 39.90438], type: 'metro', buildYear: 1985 },
    
    // 地铁2号线（环线）
    { id: 't15', name: '前门', coords: [116.3977, 39.89878], type: 'metro', buildYear: 1987 },
    { id: 't16', name: '崇文门', coords: [116.4231, 39.89898], type: 'metro', buildYear: 1987 },
    { id: 't17', name: '朝阳门', coords: [116.4451, 39.92218], type: 'metro', buildYear: 1987 },
    { id: 't18', name: '东直门', coords: [116.4328, 39.94128], type: 'metro', buildYear: 1987 },
    { id: 't19', name: '雍和宫', coords: [116.4099, 39.94778], type: 'metro', buildYear: 1987 },
    { id: 't20', name: '安定门', coords: [116.4184, 39.95108], type: 'metro', buildYear: 1987 },
    { id: 't21', name: '鼓楼大街', coords: [116.3933, 39.94708], type: 'metro', buildYear: 1987 },
    { id: 't22', name: '积水潭', coords: [116.3679, 39.94748], type: 'metro', buildYear: 1987 },
    { id: 't23', name: '西直门', coords: [116.3498, 39.93818], type: 'metro', buildYear: 1987 },
    { id: 't24', name: '车公庄', coords: [116.3575, 39.92398], type: 'metro', buildYear: 1987 },
    
    // 地铁4号线
    { id: 't25', name: '宣武门', coords: [116.3828, 39.90018], type: 'metro', buildYear: 2009 },
    { id: 't26', name: '菜市口', coords: [116.3758, 39.88838], type: 'metro', buildYear: 2009 },
    { id: 't27', name: '陶然亭', coords: [116.3908, 39.87528], type: 'metro', buildYear: 2009 },
    { id: 't28', name: '北京南站', coords: [116.3781, 39.86548], type: 'metro', buildYear: 2009 },
    { id: 't29', name: '魏公村', coords: [116.3178, 39.95018], type: 'metro', buildYear: 2009 },
    { id: 't30', name: '人民大学', coords: [116.3055, 39.95928], type: 'metro', buildYear: 2009 },
    { id: 't31', name: '中关村', coords: [116.3025, 39.97958], type: 'metro', buildYear: 2009 },
    
    // 地铁5号线
    { id: 't32', name: '东单', coords: [116.4256, 39.91288], type: 'metro', buildYear: 2007 },
    { id: 't33', name: '灯市口', coords: [116.4205, 39.92688], type: 'metro', buildYear: 2007 },
    { id: 't34', name: '张自忠路', coords: [116.4168, 39.93738], type: 'metro', buildYear: 2007 },
    { id: 't35', name: '和平西桥', coords: [116.4148, 39.96248], type: 'metro', buildYear: 2007 },
    { id: 't36', name: '惠新西街', coords: [116.4248, 39.98388], type: 'metro', buildYear: 2007 },
    { id: 't37', name: '惠新西街北口', coords: [116.4258, 39.99328], type: 'metro', buildYear: 2007 },
    { id: 't38', name: '大屯路东', coords: [116.4328, 40.01968], type: 'metro', buildYear: 2007 },
    
    // 高速公路节点
    { id: 'h1', name: '京沪高速起点', coords: [116.2985, 39.82568], type: 'highway', buildYear: 1990 },
    { id: 'h2', name: '京津高速起点', coords: [116.5785, 39.84568], type: 'highway', buildYear: 1992 },
    { id: 'h3', name: '京港澳高速起点', coords: [116.2285, 39.92568], type: 'highway', buildYear: 1993 },
    { id: 'h4', name: '京哈高速起点', coords: [116.6185, 39.92568], type: 'highway', buildYear: 1995 },
    { id: 'h5', name: '京开高速起点', coords: [116.3485, 39.77568], type: 'highway', buildYear: 1998 },
    
    // 铁路节点
    { id: 'r1', name: '北京西站', coords: [116.3225, 39.89468], type: 'rail', buildYear: 1996 },
    { id: 'r2', name: '北京南站', coords: [116.3781, 39.86548], type: 'rail', buildYear: 2008 },
    { id: 'r3', name: '北京北站', coords: [116.3575, 39.94688], type: 'rail', buildYear: 2009 },
  ]

  // 交通线路数据
  private trafficLines: TrafficLine[] = [
    // 地铁1号线
    {
      id: 'l1',
      name: '地铁1号线',
      nodes: ['t1', 't3', 't9', 't4', 't10', 't11', 't12', 't13', 't14'],
      type: 'metro',
      buildYear: 1969,
      color: '#E4002B'
    },
    {
      id: 'l1-west',
      name: '地铁1号线西段',
      nodes: ['t3', 't5', 't6', 't7', 't8'],
      type: 'metro',
      buildYear: 1969,
      color: '#E4002B'
    },
    // 地铁2号线
    {
      id: 'l2',
      name: '地铁2号线',
      nodes: ['t2', 't15', 't16', 't11', 't17', 't18', 't19', 't20', 't21', 't22', 't23', 't24', 't2'],
      type: 'metro',
      buildYear: 1987,
      color: '#004990'
    },
    // 地铁4号线
    {
      id: 'l4',
      name: '地铁4号线',
      nodes: ['t3', 't25', 't26', 't27', 't28'],
      type: 'metro',
      buildYear: 2009,
      color: '#00629B'
    },
    {
      id: 'l4-north',
      name: '地铁4号线北段',
      nodes: ['t3', 't29', 't30', 't31'],
      type: 'metro',
      buildYear: 2009,
      color: '#00629B'
    },
    // 地铁5号线
    {
      id: 'l5',
      name: '地铁5号线',
      nodes: ['t1', 't10', 't33', 't34', 't35', 't36', 't37', 't38'],
      type: 'metro',
      buildYear: 2007,
      color: '#A3195B'
    },
    // 高速公路
    {
      id: 'h1',
      name: '京沪高速',
      nodes: ['h1', 't13'],
      type: 'highway',
      buildYear: 1990,
      color: '#FF6B00'
    },
    {
      id: 'h2',
      name: '京津高速',
      nodes: ['h2', 't17'],
      type: 'highway',
      buildYear: 1992,
      color: '#FF9500'
    },
    {
      id: 'h3',
      name: '京港澳高速',
      nodes: ['h3', 't6'],
      type: 'highway',
      buildYear: 1993,
      color: '#FFA500'
    },
    {
      id: 'h4',
      name: '京哈高速',
      nodes: ['h4', 't17'],
      type: 'highway',
      buildYear: 1995,
      color: '#FFB800'
    },
    {
      id: 'h5',
      name: '京开高速',
      nodes: ['h5', 't26'],
      type: 'highway',
      buildYear: 1998,
      color: '#FFD000'
    },
  ]

  // 交通演变历史事件
  private trafficEvents: TrafficEvent[] = [
    { year: 1969, description: '北京地铁1号线通车，中国第一条地铁', lines: ['l1', 'l1-west'] },
    { year: 1975, description: '地铁1号线东延至建国门', lines: ['l1'] },
    { year: 1985, description: '地铁1号线延伸至四惠', lines: ['l1'] },
    { year: 1987, description: '地铁2号线全线通车，形成环线网络', lines: ['l2'] },
    { year: 1990, description: '京沪高速建成通车', lines: ['h1'] },
    { year: 1992, description: '京津高速开通', lines: ['h2'] },
    { year: 1993, description: '京港澳高速通车', lines: ['h3'] },
    { year: 1995, description: '京哈高速建成', lines: ['h4'] },
    { year: 1996, description: '北京西站启用', nodes: ['r1'] },
    { year: 1998, description: '京开高速开通', lines: ['h5'] },
    { year: 2007, description: '地铁5号线通车', lines: ['l5'] },
    { year: 2008, description: '北京南站改造完成，迎接奥运', nodes: ['r2'] },
    { year: 2009, description: '地铁4号线、北京北站开通', lines: ['l4', 'l4-north'], nodes: ['r3'] },
  ]

  apply(): void {
    console.log('[TrafficEvolutionEffect] 开始应用交通演变特效')

    if (!this.isLocaAvailable()) {
      console.warn('[TrafficEvolutionEffect] loca 未初始化')
      return
    }

    const Loca = (window as any).Loca

    // 入场动画：从旋转视角进入
    this.animateEntrance()

    console.log('[TrafficEvolutionEffect] 调整地图视角')

    // 创建线路图层
    this.createLineLayer()

    // 延迟创建其他图层，让线路先显示
    setTimeout(() => {
      this.createNodeLayer()
    }, 300)

    setTimeout(() => {
      this.createParticles()
    }, 600)

    setTimeout(() => {
      this.createLabels()
    }, 900)

    // 启动时间动画
    this.startTimelineAnimation()

    // 设置结果
    this.setResult({
      lineLayer: this.lineLayer,
      nodeLayer: this.nodeLayer,
      particleLayer: this.particleLayer,
      labelLayer: this.labelLayer,
      cleanup: () => this.cleanupTrafficEvolution()
    })

    console.log('[TrafficEvolutionEffect] 特效应用完成')
  }

  // 创建线路图层
  private createLineLayer(): void {
    const Loca = (window as any).Loca

    const lineFeatures: any[] = []

    this.trafficLines.forEach(line => {
      const coords = line.nodes.map(nodeId => {
        const node = this.trafficNodes.find(n => n.id === nodeId)
        return node?.coords
      }).filter(Boolean)

      if (coords.length >= 2) {
        lineFeatures.push({
          type: 'Feature',
          properties: {
            id: line.id,
            name: line.name,
            type: line.type,
            buildYear: line.buildYear,
            color: line.color
          },
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        })
      }
    })

    const lineSource = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: lineFeatures
      }
    })

    this.lineLayer = new Loca.LineLayer({
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    this.lineLayer.setSource(lineSource)
    this.lineLayer.setStyle({
      unit: 'meter',
      lineWidth: (index: number, item: any) => {
        const type = item?.properties?.type
        if (type === 'metro') return 400
        if (type === 'highway') return 250
        if (type === 'rail') return 180
        return 120
      },
      lineColor: (index: number, item: any) => {
        const type = item?.properties?.type
        const colors: Record<string, string> = {
          metro: '#FF0080',
          highway: '#00FFCC',
          rail: '#FFD700',
          bus: '#7B61FF'
        }
        return colors[type] || item?.properties?.color || '#FFFFFF'
      },
      altitude: 0,
      smoothSteps: 50,
      lineOpacity: 1,
      // 添加光晕效果
      glow: {
        color: (index: number, item: any) => item?.properties?.color || '#FFFFFF',
        opacity: 0.5,
        blur: 10
      }
    })

    this.addLocaLayer(this.lineLayer)

    // 添加线路宽度呼吸动画
    this.lineLayer.addAnimate({
      key: 'lineWidth',
      value: [1, 1.2],
      duration: 2000,
      yoyo: true,
      repeat: Infinity
    })

    // 添加线路透明度脉冲动画
    this.lineLayer.addAnimate({
      key: 'opacity',
      value: [0.8, 1],
      duration: 1500,
      yoyo: true,
      repeat: Infinity
    })

    console.log('[TrafficEvolutionEffect] 创建线路图层')
  }

  // 创建站点图层
  private createNodeLayer(): void {
    const Loca = (window as any).Loca

    const nodeFeatures: any[] = []

    this.trafficNodes.forEach(node => {
      nodeFeatures.push({
        type: 'Feature',
        properties: {
          id: node.id,
          name: node.name,
          type: node.type,
          buildYear: node.buildYear,
          passengerVolume: node.passengerVolume || 0,
          texture: this.getNodeTexture(node.type)
        },
        geometry: {
          type: 'Point',
          coordinates: node.coords
        }
      })
    })

    const nodeSource = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: nodeFeatures
      }
    })

    this.nodeLayer = new Loca.ScatterLayer({
      zIndex: 15,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    this.nodeLayer.setSource(nodeSource)
    this.nodeLayer.setStyle({
      unit: 'meter',
      size: (index: number, feature: any) => {
        const type = feature?.properties?.type
        // 根据客流量调整大小，主要站点更大
        const volume = feature?.properties?.passengerVolume || 0
        const baseSize = type === 'metro' ? 2500 : type === 'highway' ? 2000 : type === 'rail' ? 2200 : 1800
        const volumeMultiplier = volume > 80 ? 1.5 : volume > 50 ? 1.2 : 1.0
        return baseSize * volumeMultiplier
      },
      texture: (index: number, feature: any) => {
        return feature?.properties?.texture || this.getNodeTexture('metro')
      },
      altitude: 150
    })

    this.addLocaLayer(this.nodeLayer)

    // 添加站点透明度闪烁动画（layer 层面）
    this.nodeLayer.addAnimate({
      key: 'opacity',
      value: [0.85, 1],
      duration: 1200,
      yoyo: true,
      repeat: Infinity,
      random: true
    })

    // 添加站点缩放动画（layer 层面）
    this.nodeLayer.addAnimate({
      key: 'scale',
      value: [1, 1.08],
      duration: 1800,
      yoyo: true,
      repeat: Infinity,
      random: true
    })

    console.log('[TrafficEvolutionEffect] 创建站点图层')
  }

  // 创建粒子层
  private createParticles(): void {
    const Loca = (window as any).Loca

    const particleFeatures: any[] = []

    // 为每条线路生成更多粒子，增加密度
    this.trafficLines.forEach(line => {
      const particleCount = line.type === 'metro' ? 15 : line.type === 'highway' ? 10 : 6

      for (let i = 0; i < particleCount; i++) {
        const nodeIndex = Math.floor(Math.random() * (line.nodes.length - 1))
        const fromNode = this.trafficNodes.find(n => n.id === line.nodes[nodeIndex])
        const toNode = this.trafficNodes.find(n => n.id === line.nodes[nodeIndex + 1])

        if (fromNode && toNode) {
          const progress = Math.random()
          const lat = fromNode.coords[1] + (toNode.coords[1] - fromNode.coords[1]) * progress
          const lng = fromNode.coords[0] + (toNode.coords[0] - fromNode.coords[0]) * progress

          particleFeatures.push({
            type: 'Feature',
            properties: {
              lineId: line.id,
              lineType: line.type,
              lineColor: line.color,
              buildYear: line.buildYear,
              speed: Math.random() * 0.8 + 0.6,
              fromIndex: nodeIndex,
              toIndex: nodeIndex + 1,
              progress: progress
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          })
        }
      }
    })

    const particleSource = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: particleFeatures
      }
    })

    this.particleLayer = new Loca.PointLayer({
      zIndex: 20,
      opacity: 0.9,
      visible: true,
      zooms: [2, 22]
    })

    this.particleLayer.setSource(particleSource)
    this.particleLayer.setStyle({
      unit: 'meter',
      radius: (index: number, item: any) => {
        const type = item?.properties?.lineType
        return type === 'metro' ? 700 : type === 'highway' ? 500 : 400
      },
      color: (index: number, item: any) => {
        const type = item?.properties?.lineType
        const colors: Record<string, string> = {
          metro: '#FFFFFF',
          highway: '#FFFFFF',
          rail: '#FFFFFF',
          bus: '#FFFFFF'
        }
        return colors[type] || '#FFFFFF'
      },
      altitude: 280,
      opacity: 0.9
    })

    // 添加粒子半径动画
    this.particleLayer.addAnimate({
      key: 'radius',
      value: [0.6, 1.4],
      duration: 1200,
      yoyo: true,
      repeat: Infinity,
      random: true
    })

    // 添加粒子透明度动画
    this.particleLayer.addAnimate({
      key: 'opacity',
      value: [0.5, 1],
      duration: 800,
      yoyo: true,
      repeat: Infinity,
      random: true
    })

    // 启动粒子沿线移动动画
    this.animateParticles()

    this.addLocaLayer(this.particleLayer)
    console.log('[TrafficEvolutionEffect] 创建粒子层')
  }

  // 粒子沿线移动动画
  private animateParticles(): void {
    if (!this.particleLayer || !this.particleLayer.getSource) {
      return
    }

    const animate = () => {
      const source = this.particleLayer.getSource()
      const features = source.data.features

      features.forEach((feature: any) => {
        const props = feature.properties
        if (!props || !this.isBuilt(props.buildYear)) return

        const line = this.trafficLines.find(l => l.id === props.lineId)
        if (!line || line.nodes.length < 2) return

        // 更新进度
        props.progress += props.speed * 0.003

        // 超过当前段则进入下一段
        if (props.progress >= 1) {
          props.progress = 0
          props.toIndex += 1

          // 到达线路终点，回到起点
          if (props.toIndex >= line.nodes.length) {
            props.toIndex = 1
            props.fromIndex = 0
          } else {
            props.fromIndex += 1
          }
        }

        // 计算新位置
        const fromNode = this.trafficNodes.find(n => n.id === line.nodes[props.fromIndex])
        const toNode = this.trafficNodes.find(n => n.id === line.nodes[props.toIndex])

        if (fromNode && toNode) {
          const lat = fromNode.coords[1] + (toNode.coords[1] - fromNode.coords[1]) * props.progress
          const lng = fromNode.coords[0] + (toNode.coords[0] - fromNode.coords[0]) * props.progress

          feature.geometry.coordinates = [lng, lat]
        }
      })

      this.particleLayer.getSource().setData(source.data)
      requestAnimationFrame(animate)
    }

    animate()
  }

  // 检查是否已建成
  private isBuilt(buildYear: number): boolean {
    return buildYear <= this.currentTime
  }

  // 创建标签层
  private createLabels(): void {
    this.labelLayer = new this.AMap.LabelsLayer({
      rejectMapMask: true,
      collision: true,
      animation: true
    })
    this.map.add(this.labelLayer)

    // 为主要站点创建标签
    const mainNodes = this.trafficNodes.filter(n => n.passengerVolume && n.passengerVolume > 80)

    mainNodes.forEach((node, index) => {
      const marker = new this.AMap.LabelMarker({
        name: node.name,
        position: node.coords,
        zooms: [11, 22],
        opacity: 0, // 初始透明，用于入场动画
        zIndex: 25,
        text: {
          content: node.name,
          direction: 'bottom',
          offset: [0, -25],
          style: {
            fontSize: 13,
            fontWeight: '600',
            fillColor: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderColor: this.getNodeColor(node.type),
            borderWidth: 1.5,
            padding: '4px 10px',
            borderRadius: 6,
            lineHeight: 18
          }
        }
      })
      this.labelLayer.add(marker)

      // 标签入场动画
      setTimeout(() => {
        this.animateLabel(marker)
      }, index * 100) // 错开显示
    })

    console.log('[TrafficEvolutionEffect] 创建标签层')
  }

  // 标签入场动画
  private animateLabel(marker: any): void {
    let opacity = 0
    const animate = () => {
      opacity += 0.05
      if (opacity >= 1) {
        marker.setOpacity(1)
        return
      }
      marker.setOpacity(opacity)
      requestAnimationFrame(animate)
    }
    animate()
  }

  // 入场动画
  private animateEntrance(): void {
    const map = this.map

    // 从高空旋转视角进入
    map.setZoomAndCenter(8, [116.397428, 39.90923])
    map.setPitch(70)
    map.setRotation(45)

    // 动画过渡到最终视角
    const duration = 2000
    const steps = 60
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3)

      // 插值计算
      const currentZoom = 8 + (12 - 8) * easeOut
      const currentPitch = 70 + (55 - 70) * easeOut
      const currentRotation = 45 + (0 - 45) * easeOut

      map.setZoom(currentZoom)
      map.setPitch(currentPitch)
      map.setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  // 获取站点纹理 - 炫酷霓虹效果（增强动画版）
  private getNodeTexture(type: string): string {
    const colors: Record<string, string> = {
      metro: '#FF0080',
      highway: '#00FFCC',
      rail: '#FFD700',
      bus: '#7B61FF'
    }
    const color = colors[type] || '#FFFFFF'

    const svg = `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 外层光晕渐变 -->
          <radialGradient id="outerGlow_${type}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.6" />
            <stop offset="40%" stop-color="${color}" stop-opacity="0.25" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </radialGradient>

          <!-- 内层渐变 -->
          <radialGradient id="innerGlow_${type}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
            <stop offset="35%" stop-color="${color}" stop-opacity="0.9" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.6" />
          </radialGradient>

          <!-- 霓虹光晕滤镜 -->
          <filter id="neonGlow_${type}" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 20 -8" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- 脉冲动画渐变 -->
          <radialGradient id="pulseGrad1_${type}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.7">
              <animate attributeName="stop-opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="${color}" stop-opacity="0">
              <animate attributeName="stop-opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
            </stop>
          </radialGradient>

          <radialGradient id="pulseGrad2_${type}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.5">
              <animate attributeName="stop-opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" begin="0.5s"/>
            </stop>
            <stop offset="100%" stop-color="${color}" stop-opacity="0">
              <animate attributeName="stop-opacity" values="0.15;0;0.15" dur="2s" repeatCount="indefinite" begin="0.5s"/>
            </stop>
          </radialGradient>
        </defs>

        <!-- 第一层扩散光环 -->
        <circle cx="64" cy="64" r="40" fill="url(#pulseGrad1_${type})">
          <animate attributeName="r" values="40;46;40" dur="2s" repeatCount="indefinite"/>
        </circle>

        <!-- 第二层扩散光环（延迟） -->
        <circle cx="64" cy="64" r="38" fill="url(#pulseGrad2_${type})">
          <animate attributeName="r" values="38;44;38" dur="2s" repeatCount="indefinite" begin="0.5s"/>
        </circle>

        <!-- 中层光晕 -->
        <circle cx="64" cy="64" r="30" fill="url(#outerGlow_${type})" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.6;0.8" dur="1.5s" repeatCount="indefinite"/>
        </circle>

        <!-- 外环 -->
        <circle cx="64" cy="64" r="22" fill="none" stroke="${color}" stroke-width="2.5" opacity="0.7" filter="url(#neonGlow_${type})">
          <animate attributeName="r" values="22;24;22" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="0.7;0.9;0.7" dur="1.2s" repeatCount="indefinite"/>
        </circle>

        <!-- 中环 -->
        <circle cx="64" cy="64" r="18" fill="none" stroke="${color}" stroke-width="2" opacity="0.85">
          <animate attributeName="r" values="18;19;18" dur="0.9s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="0.85;1;0.85" dur="0.9s" repeatCount="indefinite"/>
        </circle>

        <!-- 内环 -->
        <circle cx="64" cy="64" r="14" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.9">
          <animate attributeName="r" values="14;15;14" dur="0.7s" repeatCount="indefinite"/>
        </circle>

        <!-- 核心圆 -->
        <circle cx="64" cy="64" r="10" fill="url(#innerGlow_${type})" filter="url(#neonGlow_${type})">
          <animate attributeName="r" values="10;11;10" dur="0.6s" repeatCount="indefinite"/>
        </circle>

        <!-- 中心高光点 -->
        <circle cx="64" cy="64" r="5" fill="#FFFFFF" opacity="0.95">
          <animate attributeName="r" values="5;5.5;5" dur="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.95;0.8;0.95" dur="0.4s" repeatCount="indefinite"/>
        </circle>

        <!-- 中心亮点 -->
        <circle cx="62" cy="62" r="2" fill="#FFFFFF" opacity="0.9"/>
      </svg>
    `.trim()

    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  }

  // 获取站点颜色 - 炫酷霓虹色系
  private getNodeColor(type: string): string {
    const colors: Record<string, string> = {
      metro: 'rgba(255, 0, 128, 0.9)',
      highway: 'rgba(0, 255, 204, 0.9)',
      rail: 'rgba(255, 215, 0, 0.9)',
      bus: 'rgba(123, 97, 255, 0.9)'
    }
    return colors[type] || 'rgba(255, 255, 255, 0.9)'
  }

  // 启动时间轴动画
  private startTimelineAnimation(): void {
    const animate = (timestamp: number) => {
      if (this.isPlaying && timestamp - this.lastUpdateTime > this.timeSpeed) {
        this.currentTime += 1
        this.lastUpdateTime = timestamp

        // 重置到起始年份
        if (this.currentTime > 2010) {
          this.currentTime = 1990
        }

        this.updateVisibilityByTime()
      }

      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = requestAnimationFrame(animate)
    console.log('[TrafficEvolutionEffect] 时间轴动画已启动')
  }

  // 根据时间更新可见性
  private updateVisibilityByTime(): void {
    // 更新线路可见性
    if (this.lineLayer && this.lineLayer.getSource) {
      const source = this.lineLayer.getSource()
      const features = source.data.features

      features.forEach((feature: any) => {
        const buildYear = feature.properties.buildYear
        const isBuilt = buildYear <= this.currentTime

        // 使用 opacity 控制可见性，渐入效果
        if (isBuilt) {
          const yearsSinceBuild = this.currentTime - buildYear
          if (yearsSinceBuild < 2) {
            feature.properties.opacity = 0.3 + yearsSinceBuild * 0.35
          } else {
            feature.properties.opacity = 1
          }
        } else {
          feature.properties.opacity = 0
        }
      })

      this.lineLayer.getSource().setData(source.data)
    }

    // 更新站点可见性
    if (this.nodeLayer && this.nodeLayer.getSource) {
      const source = this.nodeLayer.getSource()
      const features = source.data.features

      features.forEach((feature: any) => {
        const buildYear = feature.properties.buildYear
        const isBuilt = buildYear <= this.currentTime

        if (isBuilt) {
          const yearsSinceBuild = this.currentTime - buildYear
          if (yearsSinceBuild < 2) {
            feature.properties.opacity = 0.3 + yearsSinceBuild * 0.35
          } else {
            feature.properties.opacity = 1
          }
        } else {
          feature.properties.opacity = 0
        }
      })

      this.nodeLayer.getSource().setData(source.data)
    }

    // 更新粒子可见性
    if (this.particleLayer && this.particleLayer.getSource) {
      const source = this.particleLayer.getSource()
      const features = source.data.features

      features.forEach((feature: any) => {
        const buildYear = feature.properties.buildYear
        const isBuilt = buildYear <= this.currentTime

        if (isBuilt) {
          const yearsSinceBuild = this.currentTime - buildYear
          if (yearsSinceBuild < 2) {
            feature.properties.opacity = 0.3 + yearsSinceBuild * 0.35
          } else {
            feature.properties.opacity = 0.9
          }
        } else {
          feature.properties.opacity = 0
        }
      })

      this.particleLayer.getSource().setData(source.data)
    }

    // 更新时间显示
    this.updateTimeDisplay()
  }

  // 更新时间显示
  private updateTimeDisplay(): void {
    // 找到当前年份的事件
    const currentEvent = this.trafficEvents.find(e => e.year === this.currentTime)
    if (currentEvent) {
      console.log(`[TrafficEvolutionEffect] ${this.currentTime}年: ${currentEvent.description}`)
    }
  }

  // 清理交通演变特效
  private cleanupTrafficEvolution(): void {
    console.log('[TrafficEvolutionEffect] 开始清理资源')

    // 停止动画
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    // 清理标签层
    if (this.labelLayer) {
      try {
        this.labelLayer.clear()
        this.map.remove(this.labelLayer)
      } catch (e) {
        console.warn('[TrafficEvolutionEffect] 清理标签层时出错:', e)
      }
    }

    console.log('[TrafficEvolutionEffect] 资源清理完成')
  }

  protected cleanup(): void {
    console.log('[TrafficEvolutionEffect] 开始清理特效')

    // 停止动画
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    // 清理标签层
    if (this.labelLayer) {
      try {
        this.labelLayer.clear()
        this.map.remove(this.labelLayer)
      } catch (e) {
        console.warn('[TrafficEvolutionEffect] 清理标签层时出错:', e)
      }
    }

    super.cleanup()
    console.log('[TrafficEvolutionEffect] 特效清理完成')
  }
}
