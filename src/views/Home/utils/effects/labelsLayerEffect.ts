/**
 * 文字标注特效 V7.0 - 全息未来主义设计
 * 设计亮点：
 * - 全息投影效果 - 6层叠加，3D全息
 * - 霓虹故障艺术 - Cyberpunk RGB分离
 * - 量子光波 - 粒子聚散量子态
 * - 赛博网格 - 数字化矩阵覆盖
 * - 能量脉冲 - 强烈爆发动画
 * - 镜像投影 - 地面反射效果
 * - 全息纹理 - 动态扫描线
 * - 数据流 - 二进制代码流动
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
    console.log('[LabelsLayerEffect V7] 开始应用全息未来主义特效')

    if (!this.isMapAvailable()) {
      console.warn('[LabelsLayerEffect V7] map 未初始化，无法应用特效')
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
      animation: true,
    })
    this.map.add(this.labelLayer)

    // 生成标注数据
    const labelData = this.generateLabelData()

    // 添加文字标注（带动画）
    this.markers = []
    this.animationStartTime = Date.now()
    labelData.forEach((data, index) => {
      const labelsMarker = this.createLabelMarker(data, LabelMarker)
      this.labelLayer.add(labelsMarker)
      this.markers.push(labelsMarker)

      // 错落入场动画
      this.playEntranceAnimation(labelsMarker, index * 100)
    })

    // 启动持续动画
    this.startHolographicAnimation()

    this.setResult({
      labelLayer: this.labelLayer,
      updateLabels: (newData: LabelData[]) => this.updateLabels(newData),
      cleanup: () => this.cleanup()
    })

    console.log('[LabelsLayerEffect V7] 全息未来主义特效已添加')
  }

  // 生成标注数据
  private generateLabelData(): LabelData[] {
    const basePoint = {
      lng: 116.397428,
      lat: 39.90923
    }
    const points = GeoDataGenerator.generateRandomPoints(18, basePoint, 0.025)

    const types: Array<'poi' | 'building' | 'traffic' | 'commercial' | 'park'> =
      ['poi', 'building', 'traffic', 'commercial', 'park']

    const names = {
      poi: ['故宫博物院', '天坛公园', '颐和园', '圆明园遗址', '景山公园', '北海公园'],
      building: ['国贸大厦', '金融中心', '科技园区', '商务大厦', '创新基地'],
      traffic: ['地铁站', '公交枢纽', '停车场', '共享单车', '快线车站'],
      commercial: ['购物广场', '美食城', '商业步行街', '大型超市', '购物中心'],
      park: ['城市中央公园', '绿地广场', '体育公园', '湿地公园', '森林公园']
    }

    return points.map((point, index) => {
      const type = types[index % types.length]
      const typeNames = names[type] || []
      const name = typeNames[index % typeNames.length] || `${type} ${index + 1}`

      return {
        id: `label-${index}`,
        name,
        type,
        position: [point.lng, point.lat],
        rating: Math.floor(Math.random() * 2) + 3,
        visitors: (Math.random() * 100).toFixed(1) + '万'
      }
    })
  }

  // 创建标注标记
  private createLabelMarker(data: LabelData, LabelMarker: any): any {
    const config = this.getTypeConfig(data.type)

    return new LabelMarker({
      name: data.id,
      position: data.position,
      zooms: [4, 22],
      opacity: 0, // 初始透明，用于入场动画
      zIndex: 100 + parseInt(data.id.split('-')[1]),
      text: {
        content: data.name,
        direction: 'bottom',
        offset: [0, 14],
        style: {
          fontSize: 16,
          fontWeight: '800',
          fillColor: '#00ffff',
          strokeColor: '#000000',
          strokeWidth: 5,
          padding: [14, 18, 14, 18],
          backgroundColor: 'rgba(0, 15, 30, 0.92)',
          borderColor: config.borderColor,
          borderWidth: 2,
          borderRadius: 0,
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)'
        },
      },
      icon: {
        type: 'image',
        image: config.icon,
        size: [64, 64],
        anchor: 'bottom-center',
      },
    })
  }

  // 获取类型配置
  private getTypeConfig(type: string): any {
    const configs: Record<string, any> = {
      poi: {
        borderColor: '#ff0066',
        icon: this.createHolographicIcon('#ff0066', '#00ffff', this.getPOIIconPath(), 'poi')
      },
      building: {
        borderColor: '#00ffff',
        icon: this.createHolographicIcon('#00ffff', '#ff00ff', this.getBuildingIconPath(), 'building')
      },
      traffic: {
        borderColor: '#00ff00',
        icon: this.createHolographicIcon('#00ff00', '#00ffff', this.getTrafficIconPath(), 'traffic')
      },
      commercial: {
        borderColor: '#ffff00',
        icon: this.createHolographicIcon('#ffff00', '#ff0066', this.getCommercialIconPath(), 'commercial')
      },
      park: {
        borderColor: '#ff00ff',
        icon: this.createHolographicIcon('#ff00ff', '#00ff00', this.getParkIconPath(), 'park')
      }
    }

    return configs[type] || configs.poi
  }

  // 全息图标 - 未来主义设计
  private createHolographicIcon(primaryColor: string, secondaryColor: string, iconPath: string, type: string): string {
    const svg = `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 全息渐变 -->
          <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${secondaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:1" />
          </linearGradient>

          <!-- 量子光波渐变 -->
          <radialGradient id="quantumGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${secondaryColor};stop-opacity:0.8" />
            <stop offset="50%" style="stop-color:${primaryColor};stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0" />
          </radialGradient>

          <!-- 全息扫描线 -->
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0)" />
            <stop offset="50%" style="stop-color:rgba(255,255,255,0.3)" />
            <stop offset="100%" style="stop-color:rgba(255,255,255,0)" />
          </linearGradient>

          <!-- 霓虹滤镜 -->
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="${primaryColor}" flood-opacity="1"/>
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${secondaryColor}" flood-opacity="0.8"/>
            <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${primaryColor}" flood-opacity="0.5"/>
          </filter>

          <!-- 故障滤镜 -->
          <filter id="glitchFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          <!-- 量子模糊 -->
          <filter id="quantumBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- 全息光晕 - 6层量子波 -->
        <circle cx="64" cy="64" r="55" fill="url(#quantumGrad)">
          <animate attributeName="r" values="50;60;50" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite"/>
        </circle>

        <circle cx="64" cy="64" r="45" fill="url(#quantumGrad)">
          <animate attributeName="r" values="42;48;42" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
        </circle>

        <circle cx="64" cy="64" r="38" fill="url(#quantumGrad)">
          <animate attributeName="r" values="35;41;35" dur="1.8s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur="1.8s" begin="0.4s" repeatCount="indefinite"/>
        </circle>

        <!-- 赛博六边形背景 -->
        <polygon points="64,8 114,38 114,90 64,120 14,90 14,38"
                 fill="rgba(0,15,30,0.95)"
                 stroke="${primaryColor}"
                 stroke-width="2"
                 filter="url(#neonGlow)"/>

        <!-- 全息扫描线 -->
        <rect x="14" y="14" width="100" height="100" fill="url(#scanGrad)">
          <animate attributeName="y" values="14;114;14" dur="2s" repeatCount="indefinite"/>
        </rect>

        <!-- 赛博网格 -->
        <g stroke="${secondaryColor}" stroke-width="0.5" opacity="0.4">
          <line x1="64" y1="14" x2="64" y2="114"/>
          <line x1="14" y1="64" x2="114" y2="64"/>
          <line x1="28" y1="24" x2="100" y2="104"/>
          <line x1="28" y1="104" x2="100" y2="24"/>
        </g>

        <!-- 数据流动画 -->
        <g fill="${secondaryColor}" opacity="0.8">
          <text x="20" y="24" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite"/>
            10110
          </text>
          <text x="95" y="24" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.4s" begin="0.1s" repeatCount="indefinite"/>
            01101
          </text>
          <text x="20" y="110" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.2s" repeatCount="indefinite"/>
            11001
          </text>
          <text x="95" y="110" font-size="8" font-family="monospace">
            <animate attributeName="opacity" values="0;1;0" dur="0.3s" begin="0.3s" repeatCount="indefinite"/>
            00110
          </text>
        </g>

        <!-- 内六边形装饰 -->
        <polygon points="64,20 100,40 100,88 64,108 28,88 28,40"
                 fill="none"
                 stroke="${secondaryColor}"
                 stroke-width="1"
                 opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </polygon>

        <!-- 中心图标区域 -->
        <circle cx="64" cy="64" r="28" fill="rgba(0,15,30,0.9)" filter="url(#quantumBlur)"/>

        <!-- 图标路径 -->
        <g fill="${primaryColor}" filter="url(#neonGlow)" transform="translate(10, 10)">
          ${iconPath}
        </g>

        <!-- 霓虹故障效果 -->
        <g fill="${secondaryColor}" opacity="0.5" filter="url(#glitchFilter)">
          <polygon points="64,12 116,42 116,90 64,118 12,90 12,42"
                   fill="none"
                   stroke="${secondaryColor}"
                   stroke-width="1">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.2s" repeatCount="indefinite"/>
          </polygon>
        </g>

        <!-- 能量脉冲粒子 -->
        <g fill="${primaryColor}">
          <circle cx="64" cy="14" r="2">
            <animate attributeName="cy" values="14;114;14" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="64" cy="114" r="2">
            <animate attributeName="cy" values="114;14;114" dur="1.2s" begin="0.3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="1.2s" begin="0.3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="14" cy="64" r="2">
            <animate attributeName="cx" values="14;114;14" dur="0.8s" begin="0.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="0.8s" begin="0.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx="114" cy="64" r="2">
            <animate attributeName="cx" values="114;14;114" dur="0.9s" begin="0.9s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="0.9s" begin="0.9s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    `
    const utf8Bytes = new TextEncoder().encode(svg)
    const binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('')
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

  // 全息持续动画
  private startHolographicAnimation(): void {
    const animate = () => {
      const elapsed = Date.now() - this.animationStartTime

      this.markers.forEach((marker, index) => {
        // 量子波动 - 更剧烈
        const floatOffset = Math.sin(elapsed / 600 + index * 0.5) * 3 +
                         Math.cos(elapsed / 400 + index * 0.7) * 2
        const position = marker.getPosition()
        marker.setPosition([position.lng, position.lat + floatOffset * 0.0001])

        // 能量脉冲 - 更强
        const pulsePhase = elapsed / 800 + index * 0.3
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.08
        marker.setIcon({
          ...marker.getIcon(),
          size: [64 * pulseScale, 64 * pulseScale]
        })

        // 霓虹闪烁
        const neonPhase = elapsed / 1000 + index * 0.4
        const neonOpacity = 0.8 + Math.sin(neonPhase) * 0.2
        marker.setOpacity(neonOpacity)
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
    newData.forEach((data) => {
      const labelsMarker = this.createLabelMarker(data, LabelMarker)
      this.labelLayer.add(labelsMarker)
    })
  }

  // 清理资源
  private cleanup(): void {
    console.log('[LabelsLayerEffect V7] 开始清理资源')

    if (this.labelLayer) {
      this.labelLayer.clear()
      this.map.remove(this.labelLayer)
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    console.log('[LabelsLayerEffect V7] 资源清理完成')
  }
}
