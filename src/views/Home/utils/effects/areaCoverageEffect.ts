/**
 * 10. 区域覆盖特效
 * 基于源码学习优化，使用原生 AMap.Polygon 创建专业的区域覆盖效果
 */

import { BaseEffect } from './baseEffect'

export class AreaCoverageEffect extends BaseEffect {
  private polygons: any[] = []
  private gridLines: any[] = []
  private scanLines: any[] = []
  private pulseRings: any[] = []
  private animationFrames: any[] = []
  private rotationAngle = 0

  apply(): void {
    console.log('[AreaCoverageEffect] 开始应用区域线条覆盖特效')

    if (!this.map || !this.AMap) {
      console.warn('[AreaCoverageEffect] map 或 AMap 未初始化')
      return
    }

    // 生成更复杂的区域路径（基于北京中心）
    const center = [116.397428, 39.90923]
    const areas = this.generateComplexAreas(center)

    console.log('[AreaCoverageEffect] 生成区域数量:', areas.length)

    // 创建区域多边形并添加渐进显示动画
    areas.forEach((area, index) => {
      const polygon = new this.AMap.Polygon({
        path: area.path,
        strokeColor: area.strokeColor,
        strokeWeight: area.strokeWeight,
        strokeOpacity: 0,
        strokeStyle: area.strokeStyle,
        fillColor: area.fillColor,
        fillOpacity: 0,
        zIndex: 50 + index,
        bubble: true
      })

      this.map.add(polygon)
      this.polygons.push(polygon)

      // 渐进显示动画
      this.animatePolygonAppear(polygon, area.strokeOpacity, area.fillOpacity, index * 300)
    })

    // 为每个区域添加网格线（带动画）
    this.polygons.forEach((polygon, index) => {
      setTimeout(() => this.addGridLines(polygon, index), index * 400 + 500)
    })

    // 添加旋转扫描线
    this.addScanningLines(center)

    // 添加脉冲波纹
    this.addPulseRings(center)

    // 调整地图视角
    this.setView({
      center: center,
      zoom: 14,
      pitch: 45
    })

    // 启动呼吸动画
    this.startBreathingAnimation()

    // 启动粒子流动动画
    this.startParticleFlow()

    this.setResult({
      polygons: this.polygons,
      gridLines: this.gridLines,
      scanLines: this.scanLines,
      pulseRings: this.pulseRings
    })

    console.log('[AreaCoverageEffect] 区域覆盖完成，多边形:', this.polygons.length, '网格线:', this.gridLines.length)
  }

  /**
   * 生成复杂区域路径
   */
  private generateComplexAreas(center: [number, number]): any[] {
    const areas: any[] = []

    // 颜色配置 - 使用渐变色系
    const colorSchemes = [
      {
        strokeColor: '#FF6B6B',
        fillColor: 'rgba(255, 107, 107, 0.15)',
        strokeStyle: 'solid'
      },
      {
        strokeColor: '#4ECDC4',
        fillColor: 'rgba(78, 205, 196, 0.15)',
        strokeStyle: 'dashed'
      },
      {
        strokeColor: '#FFE66D',
        fillColor: 'rgba(255, 230, 109, 0.15)',
        strokeStyle: 'solid'
      }
    ]

    // 生成多个不同形状的区域
    const areaConfigs = [
      // 区域1：菱形
      {
        offset: 0.015,
        points: 4,
        startAngle: Math.PI / 4
      },
      // 区域2：六边形
      {
        offset: 0.012,
        points: 6,
        startAngle: 0
      },
      // 区域3：八边形
      {
        offset: 0.008,
        points: 8,
        startAngle: Math.PI / 8
      }
    ]

    areaConfigs.forEach((config, index) => {
      const path = this.createPolygonPath(center, config.offset, config.points, config.startAngle)
      const scheme = colorSchemes[index % colorSchemes.length]

      areas.push({
        path,
        strokeColor: scheme.strokeColor,
        strokeWeight: 3,
        strokeOpacity: 0.9,
        strokeStyle: scheme.strokeStyle,
        fillColor: scheme.fillColor,
        fillOpacity: 0.25
      })
    })

    // 添加中心圆形区域
    const circlePath = this.createCirclePath(center, 0.005, 64)
    areas.push({
      path: circlePath,
      strokeColor: '#95E1D3',
      strokeWeight: 4,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      fillColor: 'rgba(149, 225, 211, 0.3)',
      fillOpacity: 0.3
    })

    return areas
  }

  /**
   * 创建多边形路径
   */
  private createPolygonPath(
    center: [number, number],
    offset: number,
    points: number,
    startAngle: number
  ): [number, number][] {
    const path: [number, number][] = []

    for (let i = 0; i < points; i++) {
      const angle = startAngle + (i / points) * Math.PI * 2
      const x = center[0] + Math.cos(angle) * offset
      const y = center[1] + Math.sin(angle) * offset
      path.push([x, y])
    }

    return path
  }

  /**
   * 创建圆形路径
   */
  private createCirclePath(center: [number, number], radius: number, segments: number): [number, number][] {
    const path: [number, number][] = []

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = center[0] + Math.cos(angle) * radius
      const y = center[1] + Math.sin(angle) * radius
      path.push([x, y])
    }

    return path
  }

  /**
   * 为多边形添加网格线
   */
  private addGridLines(polygon: any, index: number): void {
    const path = polygon.getPath()
    if (!path || path.length === 0) return

    const bounds = this.calculateBoundsFromPath(path)
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D']
    const color = colors[index % colors.length]

    // 创建内部网格 - 使用对角线连接
    const gridCount = 6
    for (let i = 0; i < gridCount; i++) {
      for (let j = i + 1; j < gridCount; j++) {
        const t1 = i / gridCount
        const t2 = j / gridCount

        const point1 = this.interpolatePoint(bounds, t1)
        const point2 = this.interpolatePoint(bounds, t2)

        const line = new this.AMap.Polyline({
          path: [point1, point2],
          strokeColor: color,
          strokeWeight: 1,
          strokeOpacity: 0.4,
          lineCap: 'round'
        })

        this.map.add(line)
        this.gridLines.push(line)
      }
    }

    // 添加径向线条（从边界到中心）
    const center = [(bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2]
    const radialCount = 8
    for (let i = 0; i < radialCount; i++) {
      const angle = (i / radialCount) * Math.PI * 2
      const edgePoint = [
        center[0] + Math.cos(angle) * ((bounds.maxLng - bounds.minLng) / 2),
        center[1] + Math.sin(angle) * ((bounds.maxLat - bounds.minLat) / 2)
      ]

      const line = new this.AMap.Polyline({
        path: [center, edgePoint],
        strokeColor: color,
        strokeWeight: 1.5,
        strokeOpacity: 0.5,
        lineCap: 'round'
      })

      this.map.add(line)
      this.gridLines.push(line)
    }
  }

  /**
   * 计算路径边界
   */
  private calculateBoundsFromPath(path: any[]): {
    minLng: number
    maxLng: number
    minLat: number
    maxLat: number
  } {
    const lngs = path.map((p: any) => p.lng || p[0])
    const lats = path.map((p: any) => p.lat || p[1])
    return {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats)
    }
  }

  /**
   * 在边界上插值点
   */
  private interpolatePoint(bounds: any, t: number): [number, number] {
    return [
      bounds.minLng + (bounds.maxLng - bounds.minLng) * t,
      bounds.minLat + (bounds.maxLat - bounds.minLat) * t
    ]
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    // 停止所有动画
    this.animationFrames.forEach(frameId => {
      if (frameId) cancelAnimationFrame(frameId)
    })
    this.animationFrames = []

    super.cleanup()

    // 清理多边形
    this.polygons.forEach(polygon => {
      if (polygon && this.map) {
        try {
          this.map.remove(polygon)
        } catch (error) {
          console.error('[AreaCoverageEffect] 移除多边形失败:', error)
        }
      }
    })

    // 清理网格线
    this.gridLines.forEach(line => {
      if (line && this.map) {
        try {
          this.map.remove(line)
        } catch (error) {
          console.error('[AreaCoverageEffect] 移除网格线失败:', error)
        }
      }
    })

    // 清理扫描线
    this.scanLines.forEach(line => {
      if (line && this.map) {
        try {
          this.map.remove(line)
        } catch (error) {
          console.error('[AreaCoverageEffect] 移除扫描线失败:', error)
        }
      }
    })

    // 清理脉冲环
    this.pulseRings.forEach(ring => {
      if (ring && this.map) {
        try {
          this.map.remove(ring)
        } catch (error) {
          console.error('[AreaCoverageEffect] 移除脉冲环失败:', error)
        }
      }
    })

    this.polygons = []
    this.gridLines = []
    this.scanLines = []
    this.pulseRings = []

    console.log('[AreaCoverageEffect] 资源清理完成')
  }

  /**
   * 多边形渐进显示动画
   */
  private animatePolygonAppear(polygon: any, targetStrokeOpacity: number, targetFillOpacity: number, delay: number): void {
    setTimeout(() => {
      let progress = 0
      const animate = () => {
        progress += 0.02
        if (progress > 1) progress = 1

        const eased = this.easeOutCubic(progress)
        polygon.setOptions({
          strokeOpacity: targetStrokeOpacity * eased,
          fillOpacity: targetFillOpacity * eased
        })

        if (progress < 1) {
          const frameId = requestAnimationFrame(animate)
          this.animationFrames.push(frameId)
        }
      }
      animate()
    }, delay)
  }

  /**
   * 缓动函数 - easeOutCubic
   */
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  /**
   * 添加旋转扫描线
   */
  private addScanningLines(center: [number, number]): void {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D']

    for (let i = 0; i < 3; i++) {
      const scanLine = new this.AMap.Polyline({
        path: [center, center],
        strokeColor: colors[i],
        strokeWeight: 2,
        strokeOpacity: 0,
        lineCap: 'round',
        zIndex: 100
      })

      this.map.add(scanLine)
      this.scanLines.push(scanLine)

      // 延迟显示扫描线
      setTimeout(() => {
        scanLine.setOptions({ strokeOpacity: 0.8 })
      }, 1000 + i * 200)
    }

    this.animateScanLines(center)
  }

  /**
   * 扫描线旋转动画
   */
  private animateScanLines(center: [number, number]): void {
    const animate = () => {
      this.rotationAngle += 0.01
      if (this.rotationAngle > Math.PI * 2) this.rotationAngle = 0

      const maxOffset = 0.02
      this.scanLines.forEach((scanLine, index) => {
        const angle = this.rotationAngle + (index * Math.PI * 2) / 3
        const endX = center[0] + Math.cos(angle) * maxOffset
        const endY = center[1] + Math.sin(angle) * maxOffset
        scanLine.setPath([center, [endX, endY]])

        // 透明度脉冲
        const opacity = 0.4 + Math.sin(this.rotationAngle * 3 + index) * 0.4
        scanLine.setOptions({ strokeOpacity: Math.max(0, Math.min(1, opacity)) })
      })

      const frameId = requestAnimationFrame(animate)
      this.animationFrames.push(frameId)
    }
    animate()
  }

  /**
   * 添加脉冲波纹
   */
  private addPulseRings(center: [number, number]): void {
    for (let i = 0; i < 5; i++) {
      const ring = new this.AMap.Circle({
        center: center,
        radius: 500,
        strokeColor: '#95E1D3',
        strokeWeight: 2,
        strokeOpacity: 0,
        fillOpacity: 0,
        zIndex: 80
      })

      this.map.add(ring)
      this.pulseRings.push(ring)

      // 延迟开始动画
      setTimeout(() => {
        this.animatePulseRing(ring, i * 800)
      }, 1500 + i * 400)
    }
  }

  /**
   * 脉冲波纹动画
   */
  private animatePulseRing(ring: any, delay: number): void {
    const animate = () => {
      let progress = 0
      const maxRadius = 2000
      const duration = 2000

      const startTime = performance.now()

      const ringAnimate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        progress = elapsed / duration

        if (progress > 1) progress = 1

        const radius = progress * maxRadius
        const opacity = (1 - progress) * 0.6

        ring.setRadius(radius)
        ring.setOptions({
          strokeOpacity: Math.max(0, opacity)
        })

        if (progress < 1) {
          const frameId = requestAnimationFrame(ringAnimate)
          this.animationFrames.push(frameId)
        } else {
          // 重置并循环
          setTimeout(() => this.animatePulseRing(ring, 0), 500)
        }
      }

      const frameId = requestAnimationFrame(ringAnimate)
      this.animationFrames.push(frameId)
    }

    setTimeout(animate, delay)
  }

  /**
   * 呼吸动画 - 多边形边框和填充的呼吸效果
   */
  private startBreathingAnimation(): void {
    const animate = () => {
      const time = Date.now() / 1000

      this.polygons.forEach((polygon, index) => {
        const phase = index * 0.5
        const breathing = Math.sin(time * 2 + phase) * 0.3 + 0.7

        // 边框宽度呼吸
        const baseWeight = 3
        const newWeight = baseWeight * (0.8 + breathing * 0.4)
        polygon.setOptions({ strokeWeight: newWeight })

        // 填充透明度呼吸
        const baseFillOpacity = 0.25
        const newFillOpacity = baseFillOpacity * breathing
        polygon.setOptions({ fillOpacity: newFillOpacity })
      })

      // 网格线也跟着呼吸
      this.gridLines.forEach((line, index) => {
        const phase = (index % 3) * 0.5
        const breathing = Math.sin(time * 2 + phase) * 0.3 + 0.7
        line.setOptions({ strokeOpacity: 0.4 * breathing })
      })

      const frameId = requestAnimationFrame(animate)
      this.animationFrames.push(frameId)
    }
    animate()
  }

  /**
   * 粒子流动动画 - 沿着多边形边框流动的亮点
   */
  private startParticleFlow(): void {
    const animate = () => {
      const time = Date.now() / 1000

      this.polygons.forEach((polygon, polygonIndex) => {
        const path = polygon.getPath()
        if (!path || path.length < 2) return

        const phase = polygonIndex * 0.5
        const particleCount = 5

        for (let i = 0; i < particleCount; i++) {
          const t = ((time * 0.5 + phase + i / particleCount) % 1)
          const point = this.getPointOnPath(path, t)

          // 创建临时粒子标记
          const marker = new this.AMap.Marker({
            position: point,
            content: `<div style="
              width: 8px;
              height: 8px;
              background: ${polygon.getOptions().strokeColor};
              border-radius: 50%;
              box-shadow: 0 0 10px ${polygon.getOptions().strokeColor}, 0 0 20px ${polygon.getOptions().strokeColor};
              animation: particlePulse 0.5s ease-in-out infinite alternate;
            "></div>`,
            offset: new this.AMap.Pixel(-4, -4),
            zIndex: 200
          })

          this.map.add(marker)

          // 短暂显示后移除
          setTimeout(() => {
            this.map.remove(marker)
          }, 100)
        }
      })

      const frameId = requestAnimationFrame(animate)
      this.animationFrames.push(frameId)
    }

    setTimeout(animate, 2000)
  }

  /**
   * 获取路径上的点（按比例）
   */
  private getPointOnPath(path: any[], t: number): [number, number] {
    const totalSegments = path.length
    const segmentIndex = Math.floor(t * totalSegments) % totalSegments
    const segmentT = (t * totalSegments) % 1

    const p1 = path[segmentIndex]
    const p2 = path[(segmentIndex + 1) % totalSegments]

    return [
      (1 - segmentT) * (p1.lng || p1[0]) + segmentT * (p2.lng || p2[0]),
      (1 - segmentT) * (p1.lat || p1[1]) + segmentT * (p2.lat || p2[1])
    ]
  }
}

