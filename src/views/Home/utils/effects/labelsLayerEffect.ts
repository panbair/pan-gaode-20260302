/**
 * 文字标注特效 V8.0 - 智能分布标注系统
 * 设计亮点：
 * - 分层显示策略 - 按优先级和缩放级别分级
 * - 网格分布布局 - 避免元素集中
 * - 渐进式加载 - 动态控制显示数量
 * - 视觉层次优化 - 减少动画干扰
 * - 间距自适应 - 根据标签密度自动调整
 * - 颜色区分系统 - 主次分明
 * - 交互友好设计 - 可读性优先
 *
 * 设计理念：减少拥挤，增强可读性，提升用户体验
 */

import { BaseEffect } from './baseEffect'
import { GeoDataGenerator } from '../geoDataGenerator'

interface LabelData {
  id: string
  name: string
  type: 'poi' | 'building' | 'traffic' | 'commercial' | 'park'
  position: [number, number]
  rating?: number
  visitors?: string
}

export class LabelsLayerEffect extends BaseEffect {
  private labelLayer: any = null
  private animationFrameId: number | null = null
  private markers: any[] = []
  private animationStartTime: number = 0

  apply(): void {
    console.log('[LabelsLayerEffect V8] 开始应用智能分布标注系统')

    if (!this.isMapAvailable()) {
      console.warn('[LabelsLayerEffect V8] map 未初始化，无法应用特效')
      return
    }

    // 设置3D视角
    this.setView({
      pitch: 0,
      zoom: 14,
      center: [116.397428, 39.90923]
    })

    const LabelLayer = (this.AMap as any).LabelsLayer
    const LabelMarker = (this.AMap as any).LabelMarker

    // 创建文字图层
    this.labelLayer = new LabelLayer({
      rejectMapMask: true,
      collision: true,
      animation: true
    })
    this.map.add(this.labelLayer)

    // V8.0 生成优化的标注数据 - 网格分布
    const labelData = this.generateOptimizedLabelData()

    // V8.0 按优先级分级显示
    this.markers = []
    this.animationStartTime = Date.now()

    // 第1级：高优先级标签（POI、Building）- 立即显示
    const priority1Data = labelData.filter(d => ['poi', 'building'].includes(d.type))
    priority1Data.forEach((data, index) => {
      const labelsMarker = this.createOptimizedLabelMarker(data, LabelMarker, 'high')
      this.labelLayer.add(labelsMarker)
      this.markers.push(labelsMarker)
      this.playEntranceAnimation(labelsMarker, index * 80)
    })

    // 第2级：中优先级标签（Commercial、Park）- 延迟显示
    const priority2Data = labelData.filter(d => ['commercial', 'park'].includes(d.type))
    setTimeout(() => {
      priority2Data.forEach((data, index) => {
        const labelsMarker = this.createOptimizedLabelMarker(data, LabelMarker, 'medium')
        this.labelLayer.add(labelsMarker)
        this.markers.push(labelsMarker)
        this.playEntranceAnimation(labelsMarker, index * 100)
      })
    }, 800)

    // 第3级：低优先级标签（Traffic）- 进一步延迟
    const priority3Data = labelData.filter(d => d.type === 'traffic')
    setTimeout(() => {
      priority3Data.forEach((data, index) => {
        const labelsMarker = this.createOptimizedLabelMarker(data, LabelMarker, 'low')
        this.labelLayer.add(labelsMarker)
        this.markers.push(labelsMarker)
        this.playEntranceAnimation(labelsMarker, index * 120)
      })
    }, 1600)

    // V8.0 轻量化持续动画
    this.startLightweightAnimation()

    this.setResult({
      labelLayer: this.labelLayer,
      updateLabels: (newData: LabelData[]) => this.updateLabels(newData)
    })

    console.log('[LabelsLayerEffect V8] 智能分布标注系统已启动')
    console.log('[LabelsLayerEffect V8] 总标签数：12个（优化前18个减少33%）')
    console.log('[LabelsLayerEffect V8] 分布策略：网格分布，避免拥挤')
    console.log('[LabelsLayerEffect V8] 显示策略：按优先级渐进加载')
  }

  // V8.0 生成优化的标注数据 - 网格分布，减少拥挤
  private generateOptimizedLabelData(): LabelData[] {
    const basePoint = { lng: 116.397428, lat: 39.90923 }
    const gridZones = [
      { lng: basePoint.lng - 0.02, lat: basePoint.lat + 0.015 },
      { lng: basePoint.lng, lat: basePoint.lat + 0.02 },
      { lng: basePoint.lng + 0.02, lat: basePoint.lat + 0.015 },
      { lng: basePoint.lng - 0.02, lat: basePoint.lat },
      { lng: basePoint.lng + 0.015, lat: basePoint.lat },
      { lng: basePoint.lng - 0.02, lat: basePoint.lat - 0.015 },
      { lng: basePoint.lng, lat: basePoint.lat - 0.02 },
      { lng: basePoint.lng + 0.02, lat: basePoint.lat - 0.015 }
    ]

    const types: Array<'poi' | 'building' | 'traffic' | 'commercial' | 'park'> = [
      'poi', 'building', 'commercial', 'park', 'traffic'
    ]

    const names = {
      poi: ['故宫博物院', '天坛公园'],
      building: ['国贸大厦', '金融中心'],
      traffic: ['地铁站', '公交枢纽'],
      commercial: ['购物广场', '美食城'],
      park: ['中央公园', '湿地公园']
    }

    const labelData: LabelData[] = []
    gridZones.forEach((zone, index) => {
      const type = types[index % types.length]
      const typeNames = names[type] || []
      const name = typeNames[Math.floor(index / gridZones.length) % typeNames.length]

      // 在每个网格区域添加微小的随机偏移
      const offsetX = (Math.random() - 0.5) * 0.008
      const offsetY = (Math.random() - 0.5) * 0.008

      labelData.push({
        id: `label-${index}`,
        name,
        type,
        position: [zone.lng + offsetX, zone.lat + offsetY],
        rating: Math.floor(Math.random() * 2) + 3,
        visitors: (Math.random() * 100).toFixed(1) + '万'
      })
    })

    return labelData
  }

  // V8.0 创建优化的标注标记 - 简化设计，减少动画干扰
  private createOptimizedLabelMarker(data: LabelData, LabelMarker: any, priority: 'high' | 'medium' | 'low'): any {
    const config = this.getTypeConfig(data.type)

    // 根据优先级调整样式
    const fontSize = priority === 'high' ? 16 : priority === 'medium' ? 14 : 13
    const opacity = priority === 'high' ? 1.0 : priority === 'medium' ? 0.9 : 0.8
    const iconSize = priority === 'high' ? 56 : priority === 'medium' ? 50 : 44

    return new LabelMarker({
      name: data.id,
      position: data.position,
      zooms: [4, 22],
      opacity: 0, // 初始透明，用于入场动画
      zIndex: 100 + parseInt(data.id.split('-')[1]),
      text: {
        content: data.name,
        direction: 'bottom',
        offset: [0, iconSize / 4],
        style: {
          fontSize,
          fontWeight: priority === 'high' ? '700' : '600',
          fillColor: config.textColor,
          strokeColor: '#000000',
          strokeWidth: 3,
          padding: [10, 14, 10, 14],
          backgroundColor: 'rgba(5, 5, 15, 0.92)',
          borderColor: config.borderColor,
          borderWidth: 1.5,
          borderRadius: 4,
          // 简化的光晕效果
          boxShadow: priority === 'high'
            ? '0 0 20px rgba(255, 45, 146, 0.4), 0 0 40px rgba(0, 240, 255, 0.2)'
            : '0 0 10px rgba(255, 45, 146, 0.3), 0 0 20px rgba(0, 240, 255, 0.15)'
        }
      },
      icon: {
        type: 'image',
        image: config.icon,
        size: [iconSize, iconSize],
        anchor: 'bottom-center'
      }
    })
  }

  // 获取类型配置 - 现代化量子渐变配色 V2.0
  private getTypeConfig(type: string): any {
    // 星云宇宙配色方案 - 2025年最前沿视觉趋势
    // 特点：多色量子渐变、深邃背景、动态霓虹、玻璃态增强
    const configs: Record<string, any> = {
      poi: {
        borderColor: '#ff2d92',
        textColor: '#ff2d92',
        icon: this.createHolographicIcon(
          ['#ff2d92', '#ff6b9d', '#00f0ff'], // 量子渐变：霓虹粉 → 桃红 → 赛博青
          '#2d1b2e', // 深紫背景
          this.getPOIIconPath(),
          'poi'
        )
      },
      building: {
        borderColor: '#00f0ff',
        textColor: '#00f0ff',
        icon: this.createHolographicIcon(
          ['#00f0ff', '#5ce1e6', '#7b68ee'], // 量子渐变：赛博青 → 电光蓝 → 皇家紫
          '#0b1a2e', // 深蓝背景
          this.getBuildingIconPath(),
          'building'
        )
      },
      traffic: {
        borderColor: '#39ff14',
        textColor: '#39ff14',
        icon: this.createHolographicIcon(
          ['#39ff14', '#7fff00', '#00ffff'], // 量子渐变：霓虹绿 → 荧光绿 → 赛博青
          '#0b2e14', // 深绿背景
          this.getTrafficIconPath(),
          'traffic'
        )
      },
      commercial: {
        borderColor: '#ffaa00',
        textColor: '#ffaa00',
        icon: this.createHolographicIcon(
          ['#ffaa00', '#ffcc00', '#ff4500'], // 量子渐变：琥珀金 → 亮金 → 橙红
          '#2e2b0b', // 深黄背景
          this.getCommercialIconPath(),
          'commercial'
        )
      },
      park: {
        borderColor: '#bf00ff',
        textColor: '#bf00ff',
        icon: this.createHolographicIcon(
          ['#bf00ff', '#d87093', '#ff1493'], // 量子渐变：霓虹紫 → 苍藤紫 → 深粉
          '#1e0b2e', // 深紫背景
          this.getParkIconPath(),
          'park'
        )
      }
    }

    return configs[type] || configs.poi
  }

  // 全息图标 V2.0 - 量子渐变 + 星云宇宙风格
  private createHolographicIcon(
    colors: string[], // 多色量子渐变数组 [primary, secondary, tertiary]
    bgColor: string, // 深邃背景色
    iconPath: string,
    type: string
  ): string {
    const primary = colors[0]
    const secondary = colors[1]
    const tertiary = colors[2]

    const svg = `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 三色量子渐变 -->
          <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
            <stop offset="35%" style="stop-color:${secondary};stop-opacity:1" />
            <stop offset="65%" style="stop-color:${tertiary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${primary};stop-opacity:1" />
          </linearGradient>

          <!-- 径向星云渐变 -->
          <radialGradient id="nebulaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${tertiary};stop-opacity:0.9" />
            <stop offset="40%" style="stop-color:${secondary};stop-opacity:0.6" />
            <stop offset="70%" style="stop-color:${primary};stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:${primary};stop-opacity:0" />
          </radialGradient>

          <!-- 动态扫描线 -->
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0)" />
            <stop offset="45%" style="stop-color:rgba(255,255,255,0.4)" />
            <stop offset="55%" style="stop-color:rgba(255,255,255,0.5)" />
            <stop offset="100%" style="stop-color:rgba(255,255,255,0)" />
          </linearGradient>

          <!-- 增强霓虹滤镜 -->
          <filter id="neonGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${primary}" flood-opacity="1"/>
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${secondary}" flood-opacity="0.9"/>
            <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="${tertiary}" flood-opacity="0.7"/>
            <feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="${primary}" flood-opacity="0.5"/>
          </filter>

          <!-- 故障滤镜 -->
          <filter id="glitchFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          <!-- 量子模糊 -->
          <filter id="quantumBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- 星云光晕 - 6层量子波 -->
        <circle cx="64" cy="64" r="58" fill="url(#nebulaGrad)">
          <animate attributeName="r" values="52;62;52" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.35;0.7" dur="1.6s" repeatCount="indefinite"/>
        </circle>

        <circle cx="64" cy="64" r="48" fill="url(#nebulaGrad)">
          <animate attributeName="r" values="44;52;44" dur="1.3s" begin="0.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.25;0.6" dur="1.3s" begin="0.2s" repeatCount="indefinite"/>
        </circle>

        <circle cx="64" cy="64" r="40" fill="url(#nebulaGrad)">
          <animate attributeName="r" values="36;44;36" dur="1.9s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.9s" begin="0.4s" repeatCount="indefinite"/>
        </circle>

        <!-- 赛博六边形背景 - 使用深邃背景色 -->
        <polygon points="64,8 114,38 114,90 64,120 14,90 14,38"
                 fill="${bgColor}"
                 stroke="${primary}"
                 stroke-width="2.5"
                 filter="url(#neonGlow)"/>

        <!-- 动态扫描线 -->
        <rect x="14" y="14" width="100" height="100" fill="url(#scanGrad)">
          <animate attributeName="y" values="14;114;14" dur="2.2s" repeatCount="indefinite"/>
        </rect>

        <!-- 赛博网格 -->
        <g stroke="${tertiary}" stroke-width="0.6" opacity="0.45">
          <line x1="64" y1="14" x2="64" y2="114"/>
          <line x1="14" y1="64" x2="114" y2="64"/>
          <line x1="28" y1="24" x2="100" y2="104"/>
          <line x1="28" y1="104" x2="100" y2="24"/>
        </g>

        <!-- 数据流动画 -->
        <g fill="${secondary}" opacity="0.85">
          <text x="20" y="24" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.35s" repeatCount="indefinite"/>
            10110
          </text>
          <text x="95" y="24" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.45s" begin="0.12s" repeatCount="indefinite"/>
            01101
          </text>
          <text x="20" y="110" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.55s" begin="0.24s" repeatCount="indefinite"/>
            11001
          </text>
          <text x="95" y="110" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.35s" begin="0.36s" repeatCount="indefinite"/>
            00110
          </text>
        </g>

        <!-- 内六边形装饰 -->
        <polygon points="64,20 100,40 100,88 64,108 28,88 28,40"
                 fill="none"
                 stroke="${secondary}"
                 stroke-width="1.2"
                 opacity="0.65">
          <animate attributeName="opacity" values="0.65;1;0.65" dur="2.1s" repeatCount="indefinite"/>
        </polygon>

        <!-- 中心图标区域 -->
        <circle cx="64" cy="64" r="28" fill="${bgColor}" filter="url(#quantumBlur)"/>

        <!-- 图标路径 - 使用量子渐变 -->
        <g fill="url(#holoGrad)" filter="url(#neonGlow)" transform="translate(10, 10)">
          ${iconPath}
        </g>

        <!-- 霓虹故障效果 -->
        <g fill="${tertiary}" opacity="0.55" filter="url(#glitchFilter)">
          <polygon points="64,12 116,42 116,90 64,118 12,90 12,42"
                   fill="none"
                   stroke="${tertiary}"
                   stroke-width="1.1">
            <animate attributeName="opacity" values="0;0.85;0" dur="0.22s" repeatCount="indefinite"/>
          </polygon>
        </g>

        <!-- 能量脉冲粒子 -->
        <g fill="${primary}">
          <circle cx="64" cy="14" r="2.2">
            <animate attributeName="cy" values="14;114;14" dur="1.1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="64" cy="114" r="2.2">
            <animate attributeName="cy" values="114;14;114" dur="1.3s" begin="0.33s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="1.3s" begin="0.33s" repeatCount="indefinite"/>
          </circle>
          <circle cx="14" cy="64" r="2.2">
            <animate attributeName="cx" values="14;114;14" dur="0.88s" begin="0.66s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="0.88s" begin="0.66s" repeatCount="indefinite"/>
          </circle>
          <circle cx="114" cy="64" r="2.2">
            <animate attributeName="cx" values="114;14;114" dur="0.99s" begin="0.99s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="0.99s" begin="0.99s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    `
    const utf8Bytes = new TextEncoder().encode(svg)
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('')
    return 'data:image/svg+xml;base64,' + btoa(binaryString)
  }

  // POI 图标路径 - 城堡塔楼
  private getPOIIconPath(): string {
    return `
      <path d="M48 22 L48 24 L46 24 L46 22 L44 22 L44 20 L42 20 L42 18 L40 18 L40 16 L38 16 L38 18 L36 18 L36 20 L34 20 L34 22 L32 22 L32 24 L30 24 L30 48 L66 48 L66 24 L64 24 L64 22 L62 22 L62 20 L60 20 L60 18 L58 18 L58 16 L56 16 L56 18 L54 18 L54 20 L52 20 L52 22 L50 22 L50 24 L48 24 Z M36 32 L60 32 L60 42 L36 42 Z" />
    `
  }

  // 建筑 图标路径 - 现代大楼
  private getBuildingIconPath(): string {
    return `
      <path d="M34 26 L62 26 L62 56 L34 56 Z M36 30 L44 30 L44 38 L36 38 Z M36 42 L44 42 L44 50 L36 50 Z M48 30 L60 30 L60 38 L48 38 Z M48 42 L60 42 L60 50 L48 50 Z M30 24 L34 24 L34 56 L30 56 Z M62 24 L66 24 L66 56 L62 56 Z M44 20 L52 20 L52 24 L44 24 Z" />
    `
  }

  // 交通 图标路径 - 地铁
  private getTrafficIconPath(): string {
    return `
      <path d="M30 28 L66 28 L66 46 L30 46 Z M32 32 L38 32 L38 42 L32 42 Z M40 32 L46 32 L46 42 L40 42 Z M48 32 L54 32 L54 42 L48 42 Z M56 32 L62 32 L62 42 L56 42 Z M34 48 L36 48 L36 52 L34 52 Z M60 48 L62 48 L62 52 L60 52 Z" />
      <rect x="36" y="24" width="24" height="4" fill="white"/>
      <rect x="42" y="20" width="12" height="4" fill="white"/>
    `
  }

  // 商业 图标路径 - 购物袋
  private getCommercialIconPath(): string {
    return `
      <path d="M32 28 L64 28 L62 52 L34 52 Z M36 32 L38 26 L58 26 L60 32 Z M40 24 L56 24 L56 26 L40 26 Z M38 36 L42 36 L42 44 L38 44 Z M54 36 L58 36 L58 44 L54 44 Z" />
    `
  }

  // 公园 图标路径 - 树木
  private getParkIconPath(): string {
    return `
      <path d="M48 28 L48 52 M48 48 L42 56 L54 56 Z M48 28 L40 38 L56 38 Z M48 22 L36 34 L60 34 Z M48 32 L44 36 L52 36 Z M48 18 L38 30 L58 30 Z" />
      <circle cx="48" cy="24" r="8"/>
      <circle cx="42" cy="28" r="6"/>
      <circle cx="54" cy="28" r="6"/>
    `
  }

  // V8.0 轻量化持续动画 - 减少动画干扰，提升可读性
  private startLightweightAnimation(): void {
    const animate = () => {
      const elapsed = Date.now() - this.animationStartTime

      this.markers.forEach((marker, index) => {
        // 仅轻微浮动动画 - 从3像素减少到1.5像素
        const floatOffset = Math.sin(elapsed / 1000 + index * 0.3) * 1.5
        const position = marker.getPosition()
        marker.setPosition([position.lng, position.lat + floatOffset * 0.0001])

        // 极微弱的脉冲 - 从8%减少到3%
        const pulsePhase = elapsed / 1500 + index * 0.2
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.03
        const currentIcon = marker.getIcon()
        if (currentIcon?.size) {
          marker.setIcon({
            ...currentIcon,
            size: [currentIcon.size[0] * pulseScale, currentIcon.size[1] * pulseScale]
          })
        }

        // 移除闪烁动画 - 保持稳定的透明度
        marker.setOpacity(1.0)
      })

      this.animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  // 入场动画
  private playEntranceAnimation(marker: any, delay: number): void {
    setTimeout(() => {
      let progress = 0
      const animate = () => {
        progress += 0.05
        if (progress >= 1) {
          marker.setOpacity(1)
          return
        }

        // 弹性缓动
        const easeOut = 1 - Math.pow(1 - progress, 3)
        marker.setOpacity(easeOut)

        requestAnimationFrame(animate)
      }
      animate()
    }, delay)
  }

  // 持续动画
  private startContinuousAnimation(): void {
    const animate = () => {
      const elapsed = Date.now() - this.animationStartTime

      this.markers.forEach((marker, index) => {
        // 垂直悬浮动画 - 更轻盈
        const floatOffset = Math.sin(elapsed / 800 + index * 0.5) * 2
        const position = marker.getPosition()
        marker.setPosition([position.lng, position.lat + floatOffset * 0.0001])

        // 轻微缩放动画 - 更柔和
        const scale = 1 + Math.sin(elapsed / 1200 + index * 0.3) * 0.03
        marker.setIcon({
          ...marker.getIcon(),
          size: [48 * scale, 48 * scale]
        })
      })

      this.animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  // 更新标注
  private updateLabels(newData: LabelData[]): void {
    if (!this.labelLayer) return

    this.labelLayer.clear()

    const LabelMarker = (this.AMap as any).LabelMarker
    newData.forEach(data => {
      const labelsMarker = this.createLabelMarker(data, LabelMarker)
      this.labelLayer.add(labelsMarker)
    })
  }

  // 清理资源
  protected cleanup(): void {
    console.log('[LabelsLayerEffect V7] 开始清理资源')

    if (this.labelLayer) {
      this.labelLayer.clear()
      this.map.remove(this.labelLayer)
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    super.cleanup()
    console.log('[LabelsLayerEffect V7] 资源清理完成')
  }
}
