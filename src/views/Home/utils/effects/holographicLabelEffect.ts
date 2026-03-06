/**
 * 全息标牌特效
 * 超酷炫全息立牌效果,结合Loca.ZMarkerLayer、ScatterLayer实现
 * 特性: 立体标牌、浮动图标、呼吸光环、全息扫描线、数据可视化
 */

import { BaseEffect } from './baseEffect'

export class HolographicLabelEffect extends BaseEffect {
  private zMarkerLayer: any = null
  private triangleLayer: any = null
  private scatterLayer: any[] = []
  private ringLayer: any[] = []
  private animations: any[] = []

  apply(): void {
    console.log('[HolographicLabelEffect] 开始应用全息标牌特效')

    if (!this.map || !this.loca) {
      console.error('[HolographicLabelEffect] 地图或 Loca 未初始化')
      return
    }

    // 设置3D视角 - 中国城市视角
    this.map.setPitch(60)
    this.map.setRotation(180)
    this.map.setCenter([116.590, 39.915])
    this.map.setZoom(17)
    this.map.setMapStyle('amap://styles/dark')

    // 配置 Loca 光照系统 - 全息霓虹效果
    this.loca.ambLight = {
      intensity: 0.8,
      color: '#00d9ff'
    }
    this.loca.dirLight = {
      intensity: 0.4,
      color: '#ff00e6',
      target: [0, 0, 0],
      position: [0.5, 1, 1.5]
    }
    this.loca.pointLight = {
      color: 'rgb(0, 217, 255)',
      position: [116.597005, 39.914388, 500000],
      intensity: 8,
      distance: 5000000
    }

    // 生成模拟数据
    const geoData = this.generateLabelData()
    console.log('[HolographicLabelEffect] 生成的标牌数据:', geoData)

    const geoSource = new (window as any).Loca.GeoJSONSource({
      data: geoData
    })

    console.log('[HolographicLabelEffect] GeoJSON 数据源创建完成')

    // ============ 创建立牌图层 ============
    this.zMarkerLayer = new (window as any).Loca.ZMarkerLayer({
      loca: this.loca,
      zIndex: 120,
      depth: false,
      collision: true
    })
    this.zMarkerLayer.setSource(geoSource)
    this.zMarkerLayer.setStyle({
      content: (i: number, feat: any) => this.createLabelContent(feat),
      unit: 'meter',
      rotation: 0,
      alwaysFront: true,
      size: [200, 130],
      altitude: 0
    })

    // ============ 创建浮动三角图层 ============
    this.triangleLayer = new (window as any).Loca.ZMarkerLayer({
      loca: this.loca,
      zIndex: 119,
      depth: false
    })
    this.triangleLayer.setSource(geoSource)
    this.triangleLayer.setStyle({
      content: (i: number, feat: any) => {
        const theme = feat.properties.price >= 60000 ? 'neon' : 'cyber'
        return this.createTriangleIcon(theme)
      },
      unit: 'meter',
      rotation: 0,
      alwaysFront: true,
      size: [40, 40],
      altitude: 20
    })

    // 三角浮动动画
    const triangleAnim = this.triangleLayer.addAnimate({
      key: 'altitude',
      value: [0, 3],
      random: true,
      transform: 1200,
      delay: 0,
      yoyo: true,
      repeat: 999999
    })
    this.animations.push(triangleAnim)

    // 三角旋转动画
    const triangleRotateAnim = this.triangleLayer.addAnimate({
      key: 'rotation',
      value: [0, 360],
      duration: 8000,
      easing: 'Linear',
      delay: 0,
      repeat: 999999
    })
    this.animations.push(triangleRotateAnim)

    // ============ 创建呼吸光环图层 - 霓虹主题 ============
    const scatterNeon = new (window as any).Loca.ScatterLayer({
      loca: this.loca,
      zIndex: 110,
      opacity: 1,
      visible: true,
      zooms: [2, 26],
      depth: false
    })
    scatterNeon.setSource(geoSource)
    scatterNeon.setStyle({
      unit: 'meter',
      size: (i: number, feat: any) => (feat.properties.price >= 60000 ? [60, 60] : [0, 0]),
      texture: this.createRingTexture('neon'),
      altitude: 20,
      duration: 2000,
      animate: true
    })
    this.loca.add(scatterNeon)
    this.scatterLayer.push(scatterNeon)

    // ============ 创建呼吸光环图层 - 赛博主题 ============
    const scatterCyber = new (window as any).Loca.ScatterLayer({
      loca: this.loca,
      zIndex: 110,
      opacity: 1,
      visible: true,
      zooms: [2, 26],
      depth: false
    })
    scatterCyber.setSource(geoSource)
    scatterCyber.setStyle({
      unit: 'meter',
      size: (i: number, feat: any) => (feat.properties.price < 60000 ? [60, 60] : [0, 0]),
      texture: this.createRingTexture('cyber'),
      altitude: 20,
      duration: 2000,
      animate: true
    })
    this.loca.add(scatterCyber)
    this.scatterLayer.push(scatterCyber)

    // ============ 创建全息光环动画 ============
    const hologramRing = new (window as any).Loca.ScatterLayer({
      loca: this.loca,
      zIndex: 108,
      opacity: 0.8,
      visible: true,
      zooms: [2, 26],
      depth: false
    })
    hologramRing.setSource(geoSource)
    hologramRing.setStyle({
      unit: 'meter',
      size: [80, 80],
      texture: this.createHologramRing(),
      altitude: 0,
      duration: 3000,
      animate: true
    })
    this.loca.add(hologramRing)
    this.scatterLayer.push(hologramRing)

    // 添加到 Loca 容器
    this.loca.add(this.zMarkerLayer)
    this.loca.add(this.triangleLayer)

    console.log('[HolographicLabelEffect] 图层创建完成')

    // 启动动画循环
    this.loca.animate.start()

    // ============ 创建信息提示 ============
    this.infoMarker = new this.AMap.Marker({
      anchor: 'bottom-center',
      position: [116.597005, 39.914388, 0],
      map: this.map
    })
    this.infoMarker.hide()

    // 鼠标交互事件
    this.map.on('mousemove', (e: any) => {
      // 检查 infoMarker 是否存在
      if (!this.infoMarker) {
        return
      }

      // 查找最近的点
      const features = geoData.features
      let minDist = Infinity
      let closestFeat = null

      features.forEach((feat: any) => {
        const coord = feat.geometry.coordinates
        const pixel = this.map.lngLatToContainer(new this.AMap.LngLat(coord[0], coord[1]))
        const dist = Math.sqrt(
          Math.pow(pixel.x - e.pixel.x, 2) + Math.pow(pixel.y - e.pixel.y, 2)
        )
        if (dist < minDist && dist < 100) {
          minDist = dist
          closestFeat = feat
        }
      })

      if (closestFeat) {
        this.infoMarker.show()
        const coords = closestFeat.geometry.coordinates
        this.infoMarker.setPosition([coords[0], coords[1], 50])
        this.infoMarker.setContent(this.createTooltipContent(closestFeat))
      } else {
        this.infoMarker.hide()
      }
    })

    console.log('[HolographicLabelEffect] 全息标牌应用完成')

    // 存储清理函数
    this.setResult({
      layer: this.zMarkerLayer,
      cleanup: () => {
        // 停止所有动画
        if (this.loca) {
          try {
            this.loca.animate.stop()
          } catch (e) {
            console.warn('[HolographicLabelEffect] 停止动画失败:', e)
          }
        }

        // 清除所有图层的动画
        this.animations.forEach(anim => {
          try {
            if (anim) anim.stop()
          } catch (e) {
            console.warn('[HolographicLabelEffect] 停止动画失败:', e)
          }
        })
        this.animations = []

        // 清除散点图层
        this.scatterLayer.forEach(layer => {
          try {
            if (layer && this.loca) {
              this.loca.remove(layer)
            }
          } catch (e) {
            console.warn('[HolographicLabelEffect] 清除散点图层失败:', e)
          }
        })
        this.scatterLayer = []

        // 清除标记图层
        if (this.zMarkerLayer && this.loca) {
          try {
            this.loca.remove(this.zMarkerLayer)
          } catch (e) {
            console.warn('[HolographicLabelEffect] 清除标牌图层失败:', e)
          }
          this.zMarkerLayer = null
        }

        if (this.triangleLayer && this.loca) {
          try {
            this.loca.remove(this.triangleLayer)
          } catch (e) {
            console.warn('[HolographicLabelEffect] 清除三角图层失败:', e)
          }
          this.triangleLayer = null
        }

        // 清除信息标记
        if (this.infoMarker) {
          try {
            this.infoMarker.setMap(null)
          } catch (e) {
            console.warn('[HolographicLabelEffect] 清除信息标记失败:', e)
          }
          this.infoMarker = null
        }

        // 重置地图视角
        try {
          this.map.setPitch(0)
          this.map.setRotation(0)
          this.map.setMapStyle('amap://styles/normal')
        } catch (e) {
          console.warn('[HolographicLabelEffect] 重置地图视角失败:', e)
        }
      }
    })
  }

  /**
   * 创建立牌内容 - 超酷炫全息设计
   */
  private createLabelContent(feat: any): string {
    const props = feat.properties
    const price = props.price
    const theme = price >= 60000 ? 'neon' : 'cyber'

    // 霓虹主题配色
    const neonColors = {
      primary: '#ff00e6',
      secondary: '#00d9ff',
      bgStart: 'rgba(255, 0, 230, 0.15)',
      bgEnd: 'rgba(0, 217, 255, 0.05)',
      border: 'rgba(255, 0, 230, 0.6)',
      glow: '#ff00e6'
    }

    // 赛博主题配色
    const cyberColors = {
      primary: '#00ff88',
      secondary: '#0088ff',
      bgStart: 'rgba(0, 255, 136, 0.12)',
      bgEnd: 'rgba(0, 136, 255, 0.05)',
      border: 'rgba(0, 255, 136, 0.6)',
      glow: '#00ff88'
    }

    const colors = theme === 'neon' ? neonColors : cyberColors

    return `
      <div style="
        width: 180px;
        height: 120px;
        padding: 8px;
        position: relative;
        background: linear-gradient(135deg, ${colors.bgStart}, ${colors.bgEnd});
        border: 2px solid ${colors.border};
        border-radius: 8px;
        box-shadow:
          0 0 20px ${colors.glow}40,
          0 0 40px ${colors.glow}20,
          inset 0 0 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        animation: hologram-label ${theme === 'neon' ? '2.5' : '3'}s ease-in-out infinite;
        overflow: hidden;
        box-sizing: border-box;
      ">
        <style>
          @keyframes hologram-label {
            0%, 100% {
              border-color: ${colors.border};
              box-shadow:
                0 0 20px ${colors.glow}40,
                0 0 40px ${colors.glow}20,
                inset 0 0 30px rgba(0, 0, 0, 0.3);
            }
            50% {
              border-color: ${colors.secondary};
              box-shadow:
                0 0 30px ${colors.secondary}80,
                0 0 60px ${colors.secondary}40,
                inset 0 0 40px rgba(0, 0, 0, 0.4);
            }
          }
          @keyframes scan-line {
            0% { top: -10%; opacity: 0; }
            50% { opacity: 0.8; }
            100% { top: 110%; opacity: 0; }
          }
        </style>

        <!-- 全息扫描线 -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, ${colors.primary}, transparent);
          animation: scan-line 3s linear infinite;
          z-index: 10;
        "></div>

        <!-- 装饰性网格背景 -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(${colors.primary}11 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary}11 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
        "></div>

        <!-- 内容容器 -->
        <div style="
          position: relative;
          z-index: 5;
          height: 100%;
          display: flex;
          flex-direction: column;
        ">
          <!-- 顶部信息条 -->
          <div style="
            height: 36px;
            background: linear-gradient(90deg, ${colors.bgStart}, transparent);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid ${colors.border};
            margin-bottom: 8px;
          ">
            <div style="
              font-size: 13px;
              font-weight: 800;
              color: #fff;
              text-shadow: 0 0 8px ${colors.glow}, 0 0 16px ${colors.glow};
              letter-spacing: 1px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 100%;
              padding: 0 4px;
            ">
              ${props.name}
            </div>
          </div>

          <!-- 数据展示 -->
          <div style="
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
          ">
            <div style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: radial-gradient(circle, ${colors.primary}33 0%, transparent 70%);
              border: 2px solid ${colors.primary};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              box-shadow: 0 0 12px ${colors.glow};
              flex-shrink: 0;
            ">
              ${theme === 'neon' ? '💎' : '🏢'}
            </div>

            <div style="
              flex: 1;
              min-width: 0;
            ">
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: ${colors.primary};
                text-shadow: 0 0 6px ${colors.glow};
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">
                ${(price / 10000).toFixed(1)}万/m²
              </div>
              <div style="
                font-size: 12px;
                color: ${colors.secondary};
                opacity: 0.9;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">
                ${props.count}套房源
              </div>
            </div>
          </div>

          <!-- 底部装饰线 -->
          <div style="
            margin-top: 8px;
            height: 2px;
            background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
            opacity: 0.6;
          "></div>
        </div>

        <!-- 全息边角装饰 -->
        <div style="position: absolute; top: 8px; left: 8px; width: 12px; height: 12px; border-top: 2px solid ${colors.primary}; border-left: 2px solid ${colors.primary};"></div>
        <div style="position: absolute; top: 8px; right: 8px; width: 12px; height: 12px; border-top: 2px solid ${colors.primary}; border-right: 2px solid ${colors.primary};"></div>
        <div style="position: absolute; bottom: 8px; left: 8px; width: 12px; height: 12px; border-bottom: 2px solid ${colors.primary}; border-left: 2px solid ${colors.primary};"></div>
        <div style="position: absolute; bottom: 8px; right: 8px; width: 12px; height: 12px; border-bottom: 2px solid ${colors.primary}; border-right: 2px solid ${colors.primary};"></div>

        <!-- 装饰性光点 -->
        <div style="
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${colors.primary};
          box-shadow: 0 0 12px ${colors.glow};
        "></div>
      </div>
    `
  }

  /**
   * 创建浮动三角图标
   */
  private createTriangleIcon(theme: string): string {
    const color = theme === 'neon' ? '#ff00e6' : '#00ff88'
    const bgColor = theme === 'neon' ? '#ff00e622' : '#00ff8822'

    return `
      <div style="
        width: 32px;
        height: 32px;
        position: relative;
        animation: triangle-rotate 4s linear infinite;
      ">
        <style>
          @keyframes triangle-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <!-- 外圈光环 -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid ${color};
          box-shadow: 0 0 10px ${color}80, inset 0 0 6px ${color}40;
        "></div>

        <!-- 三角形 -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 18px solid ${bgColor};
          filter: drop-shadow(0 0 6px ${color});
        "></div>

        <!-- 中心点 -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 8px ${color}, 0 0 16px ${color}80;
        "></div>
      </div>
    `
  }

  /**
   * 创建光环纹理 - Base64编码
   */
  private createRingTexture(theme: string): string {
    // 创建Canvas绘制环形渐变
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    const color = theme === 'neon' ? '255, 0, 230' : '0, 255, 136'

    // 绘制渐变环
    for (let i = 0; i < 3; i++) {
      const radius = 60 + i * 30
      const alpha = 0.6 - i * 0.2

      const gradient = ctx.createRadialGradient(128, 128, radius - 15, 128, 128, radius + 15)
      gradient.addColorStop(0, `rgba(${color}, 0)`)
      gradient.addColorStop(0.5, `rgba(${color}, ${alpha})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      ctx.beginPath()
      ctx.arc(128, 128, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    return canvas.toDataURL()
  }

  /**
   * 创建全息光环
   */
  private createHologramRing(): string {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    // 绘制全息扫描线效果
    for (let i = 0; i < 8; i++) {
      const y = (i + 1) * 32
      const alpha = 0.8 - i * 0.1

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(256, y)
      ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // 绘制外圈
    ctx.beginPath()
    ctx.arc(128, 128, 120, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)'
    ctx.lineWidth = 3
    ctx.stroke()

    return canvas.toDataURL()
  }

  /**
   * 创建提示框内容
   */
  private createTooltipContent(feat: any): string {
    const props = feat.properties
    const price = props.price
    const theme = price >= 60000 ? 'neon' : 'cyber'
    const primaryColor = theme === 'neon' ? '#ff00e6' : '#00ff88'

    return `
      <div style="
        min-width: 200px;
        padding: 16px 20px;
        background: rgba(0, 10, 20, 0.9);
        border: 2px solid ${primaryColor};
        border-radius: 12px;
        box-shadow:
          0 0 30px ${primaryColor}60,
          0 0 60px ${primaryColor}30,
          inset 0 0 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(15px);
      ">
        <div style="
          font-size: 18px;
          font-weight: 800;
          color: ${primaryColor};
          margin-bottom: 12px;
          text-shadow: 0 0 10px ${primaryColor};
          letter-spacing: 1px;
        ">
          ${props.name}
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        ">
          <div style="
            background: rgba(${primaryColor === '#ff00e6' ? '255, 0, 230' : '0, 255, 136'}, 0.15);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid ${primaryColor}40;
          ">
            <div style="
              font-size: 11px;
              color: ${primaryColor};
              margin-bottom: 6px;
              opacity: 0.8;
            ">💰 均价</div>
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #fff;
            ">${(price / 10000).toFixed(1)}万</div>
          </div>

          <div style="
            background: rgba(0, 217, 255, 0.15);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid rgba(0, 217, 255, 0.4);
          ">
            <div style="
              font-size: 11px;
              color: #00d9ff;
              margin-bottom: 6px;
              opacity: 0.8;
            ">🏠 房源</div>
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #fff;
            ">${props.count}套</div>
          </div>
        </div>

        <div style="
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 11px;
          color: #888;
          text-align: center;
        ">
          全息数据可视化
        </div>
      </div>
    `
  }

  /**
   * 生成标牌数据
   */
  private generateLabelData(): any {
    const locations = [
      {
        name: '北京新天地东区',
        coordinates: [116.60161256790161, 39.91717540663561],
        price: 62000,
        count: 639
      },
      {
        name: '龙湖长楹天街',
        coordinates: [116.59223556518555, 39.92263906258135],
        price: 76000,
        count: 12
      },
      {
        name: '远洋一方润园',
        coordinates: [116.59008979797363, 39.90058428630659],
        price: 65000,
        count: 92
      },
      {
        name: '远洋一方溪语苑',
        coordinates: [116.59378051757811, 39.89704498575387],
        price: 65000,
        count: 52
      },
      {
        name: '东会新村',
        coordinates: [116.59366250038148, 39.90657598772839],
        price: 49000,
        count: 53
      },
      {
        name: '京通苑阳光华苑',
        coordinates: [116.59092664718628, 39.913423004886894],
        price: 48000,
        count: 651
      },
      {
        name: '柏林爱乐',
        coordinates: [116.58066987991333, 39.92166814352715],
        price: 62000,
        count: 471
      },
      {
        name: '汇鸿家园',
        coordinates: [116.5806484222412, 39.91766912840225],
        price: 58000,
        count: 65
      },
      {
        name: '三间房南里',
        coordinates: [116.5688467025757, 39.91737289576941],
        price: 53000,
        count: 45
      },
      {
        name: '康惠园三号院',
        coordinates: [116.57416820526123, 39.9034814381334],
        price: 48000,
        count: 95
      },
      {
        name: '东一时区小区',
        coordinates: [116.60126924514769, 39.89893812274133],
        price: 54000,
        count: 199
      },
      {
        name: '八里桥南院',
        coordinates: [116.60905838012695, 39.90331683051646],
        price: 44000,
        count: 2
      },
      {
        name: '西马庄园',
        coordinates: [116.62437915802002, 39.9101312551376],
        price: 36000,
        count: 102
      },
      {
        name: '保利嘉园1号院',
        coordinates: [116.60266399383545, 39.929747745342944],
        price: 53000,
        count: 125
      },
      {
        name: '朝青知筑',
        coordinates: [116.56524181365967, 39.92691752490338],
        price: 80000,
        count: 36
      },
      {
        name: '北花园小区1号院',
        coordinates: [116.54335498809814, 39.903678966751734],
        price: 50000,
        count: 2
      },
      {
        name: '瑞和国际',
        coordinates: [116.54949188232422, 39.921421297504764],
        price: 49000,
        count: 74
      },
      {
        name: '天赐良园东区',
        coordinates: [116.63712501525877, 39.92444921388591],
        price: 49000,
        count: 51
      }
    ]

    return {
      type: 'FeatureCollection',
      features: locations.map((loc) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: loc.coordinates
        },
        properties: {
          name: loc.name,
          price: loc.price,
          count: loc.count
        }
      }))
    }
  }
}
