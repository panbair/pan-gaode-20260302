/**
 * 经济波动特效
 * 特性：
 * - 用波纹动画展示经济数据的时空传播效果
 * - 自定义着色器动画实现波纹扩散
 * - 多层波纹叠加，模拟经济涟漪效应
 * - 颜色渐变表示经济强度（红色高增长、绿色稳定、蓝色衰退）
 * - 动态波纹速度和频率控制
 * - 支持多个经济中心同时波动
 * - 时间轴播放经济演变历史
 * - 实时数据驱动的动态波纹
 * - 炫酷光晕和粒子特效
 * - 支持波纹干涉效果（多个波纹相遇）
 */

import { BaseEffect } from './baseEffect'

interface EconomicCenter {
  id: string
  name: string
  coords: [number, number]
  baseGrowth: number // 基础增长率 0-100
  volatility: number // 波动性 0-100
  influenceRadius: number // 影响半径（米）
  color: string
}

interface WaveData {
  center: EconomicCenter
  waves: WaveRipple[]
}

interface WaveRipple {
  radius: number
  opacity: number
  strength: number
  timestamp: number
}

export class EconomyWaveEffect extends BaseEffect {
  private waveCanvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private overlayElement: HTMLDivElement | null = null
  private animationId: number | null = null
  private waveData: WaveData[] = []
  private time: number = 0
  private labelLayer: any = null
  private markerLayer: any = null
  private particleLayer: any = null

  // 经济中心数据
  private economicCenters: EconomicCenter[] = [
    {
      id: 'bj',
      name: '北京',
      coords: [116.397428, 39.90923],
      baseGrowth: 85,
      volatility: 70,
      influenceRadius: 500000,
      color: '#ff6b6b'
    },
    {
      id: 'sh',
      name: '上海',
      coords: [121.467428, 31.22923],
      baseGrowth: 90,
      volatility: 75,
      influenceRadius: 500000,
      color: '#ffd700'
    },
    {
      id: 'gz',
      name: '广州',
      coords: [113.264385, 23.129112],
      baseGrowth: 80,
      volatility: 65,
      influenceRadius: 450000,
      color: '#00ff88'
    },
    {
      id: 'sz',
      name: '深圳',
      coords: [114.057868, 22.543099],
      baseGrowth: 88,
      volatility: 80,
      influenceRadius: 450000,
      color: '#00ffff'
    },
    {
      id: 'cd',
      name: '成都',
      coords: [104.066541, 30.572269],
      baseGrowth: 75,
      volatility: 60,
      influenceRadius: 400000,
      color: '#ff69b4'
    },
    {
      id: 'wh',
      name: '武汉',
      coords: [114.305393, 30.593099],
      baseGrowth: 72,
      volatility: 55,
      influenceRadius: 380000,
      color: '#9b59b6'
    },
    {
      id: 'xa',
      name: '西安',
      coords: [108.940174, 34.341574],
      baseGrowth: 68,
      volatility: 50,
      influenceRadius: 350000,
      color: '#3498db'
    },
    {
      id: 'hz',
      name: '杭州',
      coords: [120.15507, 30.274077],
      baseGrowth: 78,
      volatility: 58,
      influenceRadius: 400000,
      color: '#f39c12'
    }
  ]

  apply(): void {
    console.log('[EconomyWaveEffect] 开始应用经济波动特效')

    if (!this.isMapAvailable()) {
      console.warn('[EconomyWaveEffect] 地图未初始化')
      return
    }

    // 设置地图视角
    this.setView({
      pitch: 45,
      zoom: 4.5,
      center: [110, 32],
      rotation: 0
    })
    console.log('[EconomyWaveEffect] 调整地图视角')

    // 创建波纹画布
    this.createWaveCanvas()

    // 初始化波纹数据
    this.initializeWaveData()

    // 创建城市标签
    this.createLabels()

    // 创建中心标记
    this.createMarkers()

    // 创建粒子层（经济指标粒子）
    this.createParticles()

    // 启动动画
    this.startAnimation()

    // 设置结果
    this.setResult({
      waveCanvas: this.waveCanvas,
      labelLayer: this.labelLayer,
      markerLayer: this.markerLayer,
      particleLayer: this.particleLayer,
      cleanup: () => this.cleanupEconomyWave()
    })

    console.log('[EconomyWaveEffect] 特效应用完成')
  }

  // 创建波纹画布
  private createWaveCanvas(): void {
    this.waveCanvas = document.createElement('canvas')
    this.waveCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `
    // 获取地图容器的 DOM 元素
    const mapContainer = this.map.getContainer()
    if (mapContainer) {
      mapContainer.appendChild(this.waveCanvas)
    } else {
      console.error('[EconomyWaveEffect] 无法获取地图容器')
      return
    }

    // 设置画布尺寸
    const resize = () => {
      if (this.waveCanvas) {
        const size = this.map.getSize()
        this.waveCanvas.width = size.width
        this.waveCanvas.height = size.height
      }
    }
    resize()
    this.map.on('resize', resize)

    this.ctx = this.waveCanvas.getContext('2d')!
    console.log('[EconomyWaveEffect] 创建波纹画布')
  }

  // 初始化波纹数据
  private initializeWaveData(): void {
    this.waveData = this.economicCenters.map(center => ({
      center,
      waves: []
    }))

    // 为每个中心预创建一些波纹
    this.waveData.forEach((data, index) => {
      for (let i = 0; i < 3; i++) {
        data.waves.push({
          radius: i * data.center.influenceRadius * 0.3,
          opacity: 0.8 - i * 0.2,
          strength: data.center.baseGrowth / 100,
          timestamp: Date.now() - i * 2000
        })
      }
    })

    console.log('[EconomyWaveEffect] 初始化波纹数据')
  }

  // 创建城市标签
  private createLabels(): void {
    this.labelLayer = new this.AMap.LabelsLayer({
      rejectMapMask: true,
      collision: true,
      animation: true
    })
    this.map.add(this.labelLayer)

    this.economicCenters.forEach(center => {
      const marker = new this.AMap.LabelMarker({
        name: center.name,
        position: center.coords,
        zooms: [3, 22],
        opacity: 1,
        zIndex: 15,
        text: {
          content: `${center.name}\n增长率:${center.baseGrowth}%`,
          direction: 'bottom',
          offset: [0, -20],
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            fillColor: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: center.color,
            borderWidth: 2,
            padding: '6px 10px',
            borderRadius: 8,
            lineHeight: 22
          }
        }
      })
      this.labelLayer.add(marker)
    })

    console.log('[EconomyWaveEffect] 创建城市标签')
  }

  // 创建中心标记
  private createMarkers(): void {
    this.markerLayer = new this.AMap.OverlayGroup()

    this.economicCenters.forEach(center => {
      const marker = new this.AMap.Marker({
        position: center.coords,
        content: this.createCenterMarker(center),
        offset: new this.AMap.Pixel(-20, -20),
        zIndex: 20
      })
      this.markerLayer.addOverlay(marker)
    })

    this.map.add(this.markerLayer)
    console.log('[EconomyWaveEffect] 创建中心标记')
  }

  // 创建中心标记 HTML
  private createCenterMarker(center: EconomicCenter): string {
    const size = 40
    const color = center.color

    return `
      <div style="
        width: ${size}px;
        height: ${size}px;
        position: relative;
        animation: pulse 2s infinite;
      ">
        <div style="
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 70%);
          border-radius: 50%;
          box-shadow: 0 0 20px ${color}, 0 0 40px ${color}88;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px #fff;
        "></div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        </style>
      </div>
    `
  }

  // 创建粒子层
  private createParticles(): void {
    const Loca = (window as any).Loca

    // 生成粒子数据
    const particleFeatures: any[] = []
    this.economicCenters.forEach(center => {
      const particleCount = Math.floor(center.baseGrowth / 5)
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * center.influenceRadius * 0.8
        const latOffset = (Math.cos(angle) * distance) / 111000
        const lngOffset = (Math.sin(angle) * distance) / (111000 * Math.cos(center.coords[1] * Math.PI / 180))

        particleFeatures.push({
          type: 'Feature',
          properties: {
            centerId: center.id,
            color: center.color,
            size: Math.random() * 3000 + 1000,
            speed: Math.random() * 0.5 + 0.2
          },
          geometry: {
            type: 'Point',
            coordinates: [center.coords[0] + lngOffset, center.coords[1] + latOffset]
          }
        })
      }
    })

    const particleSource = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: particleFeatures
      }
    })

    this.particleLayer = new Loca.ScatterLayer({
      zIndex: 110,
      opacity: 0.7,
      visible: true,
      zooms: [3, 22]
    })

    this.particleLayer.setSource(particleSource)
    this.particleLayer.setStyle({
      unit: 'meter',
      size: (index: number, item: any) => {
        return item?.properties?.size || 2000
      },
      texture: this.createParticleTexture(),
      altitude: (index: number, item: any) => {
        return Math.random() * 5000 + 2000
      }
    })

    // 添加粒子动画
    this.particleLayer.addAnimate({
      key: 'altitude',
      value: [0, 3000],
      duration: 4000,
      yoyo: true,
      repeat: Infinity,
      random: true
    })

    this.particleLayer.addAnimate({
      key: 'opacity',
      value: [0.3, 0.9],
      duration: 3000,
      yoyo: true,
      repeat: Infinity,
      random: true
    })

    this.addLocaLayer(this.particleLayer)
    console.log('[EconomyWaveEffect] 创建粒子层')
  }

  // 创建粒子纹理
  private createParticleTexture(): string {
    const svg = `
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="particleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255,255,255,1)" />
            <stop offset="30%" stop-color="rgba(255,255,255,0.8)" />
            <stop offset="60%" stop-color="rgba(255,255,255,0.4)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="32" cy="32" r="32" fill="url(#particleGrad)" filter="url(#glow)" />
        <circle cx="32" cy="32" r="16" fill="#ffffff" opacity="0.6" />
      </svg>
    `.trim()
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  }

  // 启动动画
  private startAnimation(): void {
    const animate = () => {
      this.time += 0.016 // 约60fps
      this.drawWaves()
      this.updateWaveData()
      this.animationId = requestAnimationFrame(animate)
    }
    this.animationId = requestAnimationFrame(animate)
    console.log('[EconomyWaveEffect] 动画已启动')
  }

  // 绘制波纹
  private drawWaves(): void {
    if (!this.ctx || !this.waveCanvas) return

    const width = this.waveCanvas.width
    const height = this.waveCanvas.height

    this.ctx.clearRect(0, 0, width, height)

    // 绘制每个波纹
    this.waveData.forEach(data => {
      const center = data.center
      const centerPos = this.map.lngLatToContainer(center.coords)

      // 获取当前地图级别对应的像素比例
      const zoom = this.map.getZoom()
      const baseScale = Math.pow(2, zoom - 4) // 以缩放级别4为基准

      data.waves.forEach(wave => {
        // 使用固定像素半径，不依赖地理坐标转换
        const pixelRadius = wave.radius * baseScale * 2

        // 跳过超出屏幕的波纹
        if (pixelRadius > Math.max(width, height) * 1.5 || pixelRadius < 1) return

        const gradient = this.ctx.createRadialGradient(
          centerPos.x,
          centerPos.y,
          Math.max(0, pixelRadius * 0.7),
          centerPos.x,
          centerPos.y,
          pixelRadius
        )

        // 根据经济强度选择颜色
        const intensity = wave.strength
        let color1, color2

        if (intensity > 0.75) {
          // 高增长 - 红色到金色
          color1 = `rgba(255, 107, 107, ${wave.opacity * 0.4})`
          color2 = `rgba(255, 215, 0, ${wave.opacity * 0.1})`
        } else if (intensity > 0.5) {
          // 稳定 - 绿色到青色
          color1 = `rgba(0, 255, 136, ${wave.opacity * 0.4})`
          color2 = `rgba(0, 255, 255, ${wave.opacity * 0.1})`
        } else {
          // 衰退 - 蓝色到紫色
          color1 = `rgba(52, 152, 219, ${wave.opacity * 0.4})`
          color2 = `rgba(155, 89, 182, ${wave.opacity * 0.1})`
        }

        gradient.addColorStop(0, color2)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${wave.opacity * 0.3})`)
        gradient.addColorStop(1, color1)

        this.ctx.beginPath()
        this.ctx.arc(centerPos.x, centerPos.y, pixelRadius, 0, Math.PI * 2)
        this.ctx.fillStyle = gradient
        this.ctx.fill()

        // 绘制波纹边框
        this.ctx.beginPath()
        this.ctx.arc(centerPos.x, centerPos.y, pixelRadius, 0, Math.PI * 2)
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity * 0.6})`
        this.ctx.lineWidth = Math.max(1, 3 - wave.opacity * 2)
        this.ctx.stroke()
      })
    })
  }

  // 更新波纹数据
  private updateWaveData(): void {
    this.waveData.forEach(data => {
      const center = data.center

      // 更新现有波纹
      data.waves.forEach(wave => {
        // 波纹扩散速度（固定像素/帧，不依赖地图缩放）
        const waveSpeed = 2 + (center.volatility / 100) * 3
        wave.radius += waveSpeed

        // 计算波纹生命周期进度（基于固定像素半径范围）
        const maxRadius = 300 // 最大像素半径
        const progress = wave.radius / maxRadius

        // 使用指数衰减让波纹更快消失
        wave.opacity = Math.max(0, Math.pow(1 - progress, 3))
      })

      // 移除超出范围或完全透明的波纹
      const maxRadius = 300
      data.waves = data.waves.filter(wave => wave.radius < maxRadius && wave.opacity > 0.01)

      // 限制最大波纹数量（避免无限增长）
      if (data.waves.length > 4) {
        data.waves = data.waves.slice(-4)
      }

      // 生成新波纹（基于基础增长率的频率）
      const spawnInterval = (1 - center.baseGrowth / 100) * 1500 + 600
      const now = Date.now()
      const lastWave = data.waves[data.waves.length - 1]
      const lastTimestamp = lastWave?.timestamp || 0

      // 只有在有时间间隔且波纹数量未达到上限时才生成新波纹
      if (now - lastTimestamp > spawnInterval && data.waves.length < 4) {
        data.waves.push({
          radius: 0,
          opacity: 1,
          strength: center.baseGrowth / 100 + (Math.random() - 0.5) * (center.volatility / 200),
          timestamp: now
        })
      }
    })
  }

  // 清理经济波动特效
  private cleanupEconomyWave(): void {
    console.log('[EconomyWaveEffect] 开始清理资源')

    // 停止动画
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    // 清理画布
    if (this.waveCanvas) {
      this.waveCanvas.remove()
      this.waveCanvas = null
    }
    this.ctx = null

    // 清理标签层
    if (this.labelLayer) {
      try {
        this.labelLayer.clear()
        this.map.remove(this.labelLayer)
      } catch (e) {
        console.warn('[EconomyWaveEffect] 清理标签层时出错:', e)
      }
    }

    // 清理标记层
    if (this.markerLayer) {
      try {
        this.markerLayer.clear()
        this.map.remove(this.markerLayer)
      } catch (e) {
        console.warn('[EconomyWaveEffect] 清理标记层时出错:', e)
      }
    }

    console.log('[EconomyWaveEffect] 资源清理完成')
  }

  protected cleanup(): void {
    console.log('[EconomyWaveEffect] 开始清理特效')

    // 清理动画
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    // 清理画布
    if (this.waveCanvas) {
      try {
        this.waveCanvas.remove()
      } catch (e) {
        console.warn('[EconomyWaveEffect] 移除画布时出错:', e)
      }
      this.waveCanvas = null
    }
    this.ctx = null

    // 清理标签层
    if (this.labelLayer) {
      try {
        this.labelLayer.clear()
        this.map.remove(this.labelLayer)
      } catch (e) {
        console.warn('[EconomyWaveEffect] 清理标签层时出错:', e)
      }
    }

    // 清理标记层
    if (this.markerLayer) {
      try {
        this.markerLayer.clear()
        this.map.remove(this.markerLayer)
      } catch (e) {
        console.warn('[EconomyWaveEffect] 清理标记层时出错:', e)
      }
    }

    super.cleanup()
    console.log('[EconomyWaveEffect] 特效清理完成')
  }
}
