/**
 * 文字标注特效 V6.0 - 玻璃态半透明设计
 * 设计亮点：
 * - 精美SVG路径图标，手绘级品质
 * - 动态呼吸光晕，生命感强烈
 * - 多层渐变叠加，视觉深度丰富
 * - 菱形徽章设计，独特品牌感
 * - 星芒闪烁特效，高级动画体验
 * - 玻璃态半透明，轻盈现代美学
 * - 模糊背景，层次分明
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
    console.log('[LabelsLayerEffect V6] 开始应用文字图层特效')

    if (!this.isMapAvailable()) {
      console.warn('[LabelsLayerEffect V6] map 未初始化，无法应用特效')
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
    this.startContinuousAnimation()

    this.setResult({
      labelLayer: this.labelLayer,
      updateLabels: (newData: LabelData[]) => this.updateLabels(newData),
      cleanup: () => this.cleanup()
    })

    console.log('[LabelsLayerEffect V6] 文字图层已添加')
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
        offset: [0, 12],
        style: {
          fontSize: 15,
          fontWeight: '700',
          fillColor: '#1a202c',
          strokeColor: '#ffffff',
          strokeWidth: 4,
          padding: [12, 16, 12, 16],
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          borderWidth: 1.5,
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)'
        },
      },
      icon: {
        type: 'image',
        image: config.icon,
        size: [48, 48],
        anchor: 'bottom-center',
      },
    })
  }

  // 获取类型配置
  private getTypeConfig(type: string): any {
    const configs: Record<string, any> = {
      poi: {
        borderColor: 'rgba(231, 76, 60, 0.5)',
        bgColor: 'rgba(255, 255, 255, 0.72)',
        icon: this.createProIcon('#e74c3c', '#c0392b', this.getPOIIconPath())
      },
      building: {
        borderColor: 'rgba(52, 152, 219, 0.5)',
        bgColor: 'rgba(255, 255, 255, 0.72)',
        icon: this.createProIcon('#3498db', '#2980b9', this.getBuildingIconPath())
      },
      traffic: {
        borderColor: 'rgba(46, 204, 113, 0.5)',
        bgColor: 'rgba(255, 255, 255, 0.72)',
        icon: this.createProIcon('#2ecc71', '#27ae60', this.getTrafficIconPath())
      },
      commercial: {
        borderColor: 'rgba(243, 156, 18, 0.5)',
        bgColor: 'rgba(255, 255, 255, 0.72)',
        icon: this.createProIcon('#f39c12', '#e67e22', this.getCommercialIconPath())
      },
      park: {
        borderColor: 'rgba(155, 89, 182, 0.5)',
        bgColor: 'rgba(255, 255, 255, 0.72)',
        icon: this.createProIcon('#9b59b6', '#8e44ad', this.getParkIconPath())
      }
    }

    return configs[type] || configs.poi
  }

  // 精美图标
  private createProIcon(primaryColor: string, secondaryColor: string, iconPath: string): string {
    const svg = `
      <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 主渐变 -->
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.85" />
            <stop offset="50%" style="stop-color:${secondaryColor};stop-opacity:0.85" />
            <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.85" />
          </linearGradient>

          <!-- 光晕渐变 -->
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.4" />
            <stop offset="70%" style="stop-color:${primaryColor};stop-opacity:0.05" />
            <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0" />
          </radialGradient>

          <!-- 高光渐变 -->
          <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:white;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:white;stop-opacity:0" />
          </linearGradient>

          <!-- 阴影滤镜 -->
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="rgba(0,0,0,0.25)"/>
          </filter>

          <!-- 内发光滤镜 -->
          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          <!-- 磨砂玻璃滤镜 -->
          <filter id="glassBlur">
            <feGaussianBlur stdDeviation="0.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- 呼吸光晕 -->
        <circle cx="48" cy="48" r="40" fill="url(#glowGrad)">
          <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.2;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>

        <!-- 菱形徽章背景 -->
        <polygon points="48,8 88,48 48,88 8,48" fill="url(#mainGrad)" filter="url(#dropShadow)" opacity="0.92"/>
        <polygon points="48,8 88,48 48,88 8,48" fill="url(#highlightGrad)" opacity="0.4"/>

        <!-- 内圈装饰 -->
        <polygon points="48,16 80,48 48,80 16,48" fill="${primaryColor}" opacity="0.15"/>

        <!-- 中心装饰圈 -->
        <circle cx="48" cy="48" r="22" fill="rgba(255,255,255,0.25)" filter="url(#glassBlur)"/>

        <!-- 精美图标路径 -->
        <g fill="white" filter="url(#innerGlow)" opacity="0.95">
          ${iconPath}
        </g>

        <!-- 星芒装饰 -->
        <g fill="${primaryColor}" opacity="0.6">
          <circle cx="20" cy="20" r="2">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
          </circle>
          <circle cx="76" cy="20" r="2">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="20" cy="76" r="2">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="76" cy="76" r="2">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
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
    console.log('[LabelsLayerEffect V6] 开始清理资源')

    if (this.labelLayer) {
      this.labelLayer.clear()
      this.map.remove(this.labelLayer)
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    console.log('[LabelsLayerEffect V6] 资源清理完成')
  }
}
