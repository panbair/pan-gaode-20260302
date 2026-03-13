/**
 * 雷达扫描特效
 * 特性：
 * - 视觉冲击力强的雷达扫描效果
 * - 多层扫描线同心旋转
 * - 扫描区域高亮显示
 * - 目标点标记和脉冲动画
 * - 扫描光束渐变效果
 * - 动态探测距离显示
 * - 扫描目标列表实时更新
 * - 赛博朋克风格配色
 * - 多重光晕和粒子效果
 */

import { BaseEffect } from './baseEffect'

interface RadarTarget {
  id: string
  name: string
  coords: [number, number]
  type: 'hostile' | 'friendly' | 'neutral' | 'unknown'
  detected: boolean
  detectionTime: number
}

export class RadarScanEffect extends BaseEffect {
  private radarCenter: [number, number] = [116.397428, 39.90923] // 北京天安门
  private scanRadius: number = 50000 // 50km 扫描半径
  private scanAngle: number = 0
  private scanSpeed: number = 2 // 扫描速度（度/帧）
  private animationId: number | null = null
  private radarCircleLayer: any = null
  private scanBeamLayer: any = null
  private targetLayer: any = null
  private particleLayer: any = null
  private glowLayer: any = null

  // 雷达目标数据
  private targets: RadarTarget[] = [
    { id: 't1', name: '目标A', coords: [116.4200, 39.9200], type: 'hostile', detected: false, detectionTime: 0 },
    { id: 't2', name: '目标B', coords: [116.3800, 39.9000], type: 'friendly', detected: false, detectionTime: 0 },
    { id: 't3', name: '目标C', coords: [116.4400, 39.8900], type: 'neutral', detected: false, detectionTime: 0 },
    { id: 't4', name: '目标D', coords: [116.3600, 39.9300], type: 'hostile', detected: false, detectionTime: 0 },
    { id: 't5', name: '目标E', coords: [116.4500, 39.9100], type: 'unknown', detected: false, detectionTime: 0 },
    { id: 't6', name: '目标F', coords: [116.3700, 39.8800], type: 'friendly', detected: false, detectionTime: 0 },
    { id: 't7', name: '目标G', coords: [116.4300, 39.9400], type: 'neutral', detected: false, detectionTime: 0 },
    { id: 't8', name: '目标H', coords: [116.3500, 39.9100], type: 'hostile', detected: false, detectionTime: 0 },
    { id: 't9', name: '目标I', coords: [116.4600, 39.8700], type: 'friendly', detected: false, detectionTime: 0 },
    { id: 't10', name: '目标J', coords: [116.3800, 39.9500], type: 'unknown', detected: false, detectionTime: 0 },
    { id: 't11', name: '目标K', coords: [116.4100, 39.8600], type: 'hostile', detected: false, detectionTime: 0 },
    { id: 't12', name: '目标L', coords: [116.3900, 39.9600], type: 'friendly', detected: false, detectionTime: 0 },
  ]

  apply(): void {
    this.log.info('[RadarScanEffect] 开始应用雷达扫描特效')

    if (!this.isLocaAvailable() || !this.isMapAvailable()) {
      this.log.warn('[RadarScanEffect] Loca 或地图不可用')
      return
    }

    const Loca = (window as any).Loca

    // 设置地图视角
    this.setView({
      zoom: 11,
      pitch: 50,
      rotation: 0,
      center: this.radarCenter
    })

    // 配置雷达光照系统
    this.setupRadarLighting()

    // 创建雷达圆环层
    this.createRadarCircles()

    // 创建扫描光束层
    this.createScanBeam()

    // 创建目标层
    this.createTargetLayer()

    // 创建粒子层
    this.createParticleLayer()

    // 创建光晕层
    this.createGlowLayer()

    // 开始扫描动画
    this.startScanAnimation()

    // 入场动画
    this.playEntranceAnimation()

    this.log.info('[RadarScanEffect] 雷达扫描特效应用完成')
  }

  private setupRadarLighting(): void {
    this.loca.ambLight = {
      intensity: 0.3,
      color: 'rgba(0, 20, 40, 0.8)'
    }
    this.loca.dirLight = {
      intensity: 0.5,
      color: 'rgba(0, 150, 255, 0.4)',
      target: [0, 0, 0],
      position: [1, -1, 2]
    }
    this.loca.pointLight = {
      color: 'rgb(0, 255, 255)',
      position: [...this.radarCenter, 10000],
      intensity: 8,
      distance: 100000
    }
  }

  private createRadarCircles(): void {
    const Loca = (window as any).Loca

    const circlesData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]] // 动态填充
          },
          properties: { radius: 10000, opacity: 0.8, width: 200 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 20000, opacity: 0.6, width: 200 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 30000, opacity: 0.5, width: 200 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 40000, opacity: 0.4, width: 200 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 50000, opacity: 0.3, width: 200 }
        }
      ]
    }

    // 填充圆环坐标
    circlesData.features.forEach((feature: any) => {
      const radius = feature.properties.radius
      const coords: [number, number][] = []
      const segments = 120
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const lng = this.radarCenter[0] + (radius * Math.cos(angle)) / 111000
        const lat = this.radarCenter[1] + (radius * Math.sin(angle)) / 111000
        coords.push([lng, lat])
      }
      coords.push(coords[0])
      feature.geometry.coordinates = [coords]
    })

    this.radarCircleLayer = new Loca.LineLayer({
      zIndex: 10,
      opacity: 0.8
    })

    // 创建 GeoJSON 数据源
    const circlesSource = new Loca.GeoJSONSource({
      data: circlesData
    })

    this.radarCircleLayer.setSource(circlesSource)
    this.radarCircleLayer.setStyle({
      unit: 'meter',
      lineWidth: (index, item) => item?.properties?.width || 200,
      lineColor: 'rgba(0, 255, 255, 0.6)',
      altitude: 0
    })
    this.addLocaLayer(this.radarCircleLayer)

    // 添加脉冲动画
    this.radarCircleLayer.addAnimate({
      key: 'opacity',
      value: [0.6, 1],
      duration: 2000,
      easing: 'SinusoidalInOut',
      yoyo: true,
      repeat: Infinity,
      random: true
    })
  }

  private createScanBeam(): void {
    const Loca = (window as any).Loca

    const beamData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { id: 'main' }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { id: 'secondary' }
        }
      ]
    }

    this.scanBeamLayer = new Loca.PolygonLayer({
      zIndex: 15,
      opacity: 0.4,
      cullface: 'none'
    })

    const beamSource = new Loca.GeoJSONSource({
      data: beamData
    })

    this.scanBeamLayer.setSource(beamSource)
    this.scanBeamLayer.setStyle({
      topColor: 'rgba(0, 255, 255, 0.3)',
      sideColor: 'rgba(0, 200, 255, 0.2)',
      height: 5000,
      altitude: 1000,
      unit: 'meter'
    })
    this.addLocaLayer(this.scanBeamLayer)
  }

  private createTargetLayer(): void {
    const Loca = (window as any).Loca

    const targetFeatures = this.targets.map(target => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: target.coords
      },
      properties: {
        id: target.id,
        name: target.name,
        type: target.type,
        detected: target.detected,
        color: this.getTargetColor(target.type),
        size: target.type === 'hostile' ? 3000 : 2000
      }
    }))

    const targetData = {
      type: 'FeatureCollection',
      features: targetFeatures
    }

    this.targetLayer = new Loca.PointLayer({
      zIndex: 20,
      opacity: 1
    })

    const targetSource = new Loca.GeoJSONSource({
      data: targetData
    })

    this.targetLayer.setSource(targetSource)
    this.targetLayer.setStyle({
      unit: 'meter',
      radius: (index, item) => item?.properties?.size || 2000,
      color: (index, item) => item?.properties?.color || '#00FFFF',
      altitude: 200
    })
    this.addLocaLayer(this.targetLayer)

    // 添加目标脉冲动画
    this.targetLayer.addAnimate({
      key: 'radius',
      value: [0.8, 1.3],
      duration: 1500,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })
    this.targetLayer.addAnimate({
      key: 'opacity',
      value: [0.6, 1],
      duration: 1200,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })
  }

  private createParticleLayer(): void {
    const Loca = (window as any).Loca

    const particleCount = 200
    const particles: any[] = []

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * this.scanRadius
      const x = this.radarCenter[0] + (distance * Math.cos(angle)) / 111000
      const y = this.radarCenter[1] + (distance * Math.sin(angle)) / 111000

      particles.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [x, y]
        },
        properties: {
          angle,
          distance,
          speed: 0.5 + Math.random() * 1.5,
          size: 200 + Math.random() * 400,
          color: '#00FFFF',
          altitude: Math.random() * 3000
        }
      })
    }

    const particleData = {
      type: 'FeatureCollection',
      features: particles
    }

    this.particleLayer = new Loca.PointLayer({
      zIndex: 18,
      opacity: 0.6
    })

    const particleSource = new Loca.GeoJSONSource({
      data: particleData
    })

    this.particleLayer.setSource(particleSource)
    this.particleLayer.setStyle({
      unit: 'meter',
      radius: (index, item) => item?.properties?.size || 300,
      color: (index, item) => item?.properties?.color || '#00FFFF',
      altitude: (index, item) => item?.properties?.altitude || 1000
    })
    this.addLocaLayer(this.particleLayer)

    // 粒子动画
    this.particleLayer.addAnimate({
      key: 'radius',
      value: [0.5, 1.5],
      duration: 1000,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })
  }

  private createGlowLayer(): void {
    const Loca = (window as any).Loca

    const glowData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 60000, opacity: 0.2 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 70000, opacity: 0.15 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: { radius: 80000, opacity: 0.1 }
        }
      ]
    }

    glowData.features.forEach((feature: any) => {
      const radius = feature.properties.radius
      const coords: [number, number][] = []
      const segments = 120
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const lng = this.radarCenter[0] + (radius * Math.cos(angle)) / 111000
        const lat = this.radarCenter[1] + (radius * Math.sin(angle)) / 111000
        coords.push([lng, lat])
      }
      coords.push(coords[0])
      feature.geometry.coordinates = [coords]
    })

    this.glowLayer = new Loca.PolygonLayer({
      zIndex: 5,
      opacity: 0.3,
      cullface: 'none'
    })

    const glowSource = new Loca.GeoJSONSource({
      data: glowData
    })

    this.glowLayer.setSource(glowSource)
    this.glowLayer.setStyle({
      topColor: 'rgba(0, 150, 255, 0.15)',
      sideColor: 'rgba(0, 100, 255, 0.1)',
      height: 100,
      altitude: 0,
      unit: 'meter'
    })
    this.addLocaLayer(this.glowLayer)

    this.glowLayer.addAnimate({
      key: 'opacity',
      value: [0.1, 0.3],
      duration: 3000,
      easing: 'SinusoidalInOut',
      yoyo: true,
      repeat: Infinity,
      random: true
    })
  }

  private startScanAnimation(): void {
    const animate = () => {
      this.scanAngle = (this.scanAngle + this.scanSpeed) % 360

      // 更新扫描光束
      this.updateScanBeam()

      // 检测目标
      this.detectTargets()

      // 更新粒子
      this.updateParticles()

      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = requestAnimationFrame(animate)
  }

  private updateScanBeam(): void {
    const beamAngle = this.scanAngle
    const beamWidth = 30 // 扫描光束宽度（度）

    // 主扫描光束
    const mainBeamCoords: [number, number][] = [
      this.radarCenter,
      ...this.generateBeamArc(beamAngle, beamWidth)
    ]

    // 次级光束（延迟）
    const secondaryBeamAngle = (beamAngle + 180) % 360
    const secondaryBeamCoords: [number, number][] = [
      this.radarCenter,
      ...this.generateBeamArc(secondaryBeamAngle, beamWidth * 0.5)
    ]

    const beamData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[...mainBeamCoords, mainBeamCoords[0]]]
          },
          properties: { id: 'main', angle: beamAngle }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[...secondaryBeamCoords, secondaryBeamCoords[0]]]
          },
          properties: { id: 'secondary', angle: secondaryBeamAngle }
        }
      ]
    }

    this.scanBeamLayer.getSource().setData(beamData)
  }

  private generateBeamArc(centerAngle: number, width: number): [number, number][] {
    const coords: [number, number][] = []
    const segments = 30
    const startAngle = centerAngle - width / 2
    const endAngle = centerAngle + width / 2

    for (let i = 0; i <= segments; i++) {
      const angle = (startAngle + (endAngle - startAngle) * (i / segments)) * (Math.PI / 180)
      const lng = this.radarCenter[0] + (this.scanRadius * Math.cos(angle)) / 111000
      const lat = this.radarCenter[1] + (this.scanRadius * Math.sin(angle)) / 111000
      coords.push([lng, lat])
    }

    return coords
  }

  private detectTargets(): void {
    const beamAngle = this.scanAngle
    const beamWidth = 30

    this.targets.forEach(target => {
      const targetAngle = this.calculateAngle(
        this.radarCenter,
        target.coords
      ) * (180 / Math.PI)

      const angleDiff = Math.abs(targetAngle - beamAngle)
      const isDetected = angleDiff < beamWidth / 2 || angleDiff > 360 - beamWidth / 2

      if (isDetected && !target.detected) {
        target.detected = true
        target.detectionTime = Date.now()
        this.log.info(`[RadarScanEffect] 检测到目标: ${target.name} (${target.type})`)
      }
    })

    // 更新目标层显示状态
    const targetFeatures = this.targets.map(target => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: target.coords
      },
      properties: {
        id: target.id,
        name: target.name,
        type: target.type,
        detected: target.detected,
        color: this.getTargetColor(target.type),
        size: target.detected
          ? target.type === 'hostile'
            ? 5000
            : 4000
          : 0,
        opacity: target.detected ? 1 : 0.3
      }
    }))

    const targetData = {
      type: 'FeatureCollection',
      features: targetFeatures
    }

    this.targetLayer.getSource().setData(targetData)
  }

  private calculateAngle(center: [number, number], point: [number, number]): number {
    const dx = point[0] - center[0]
    const dy = point[1] - center[1]
    return Math.atan2(dy, dx)
  }

  private updateParticles(): void {
    const source = this.particleLayer.getSource()
    const features = source.data.features

    features.forEach((feature: any) => {
      const props = feature.properties
      props.angle += (props.speed * Math.PI / 180) * 0.01

      const x = this.radarCenter[0] + (props.distance * Math.cos(props.angle)) / 111000
      const y = this.radarCenter[1] + (props.distance * Math.sin(props.angle)) / 111000

      feature.geometry.coordinates = [x, y]
    })

    source.setData({ type: 'FeatureCollection', features })
  }

  private playEntranceAnimation(): void {
    // 地图缩放动画
    const zoomAnimation = () => {
      const currentZoom = this.map.getZoom()
      if (currentZoom < 11) {
        this.map.setZoom(currentZoom + 0.1)
        requestAnimationFrame(zoomAnimation)
      }
    }

    // 旋转进入
    const rotationAnimation = () => {
      const currentRotation = this.map.getRotation()
      if (Math.abs(currentRotation) > 0.1) {
        this.map.setRotation(currentRotation * 0.95)
        requestAnimationFrame(rotationAnimation)
      }
    }

    // 延迟开始动画
    setTimeout(() => {
      this.map.setRotation(45)
      zoomAnimation()
      setTimeout(rotationAnimation, 500)
    }, 100)
  }

  private getTargetColor(type: string): string {
    const colors: Record<string, string> = {
      hostile: '#FF3333',
      friendly: '#33FF33',
      neutral: '#FFFF33',
      unknown: '#FFFFFF'
    }
    return colors[type] || '#00FFFF'
  }

  cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    super.cleanup()
  }
}
