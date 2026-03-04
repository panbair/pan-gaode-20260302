/**
 * 6. 晴天天气特效
 * 创建炫酷太阳效果 - 多层光圈+放射光芒+浮动粒子
 */

import { BaseEffect } from './baseEffect'

export class SunnyWeatherEffect extends BaseEffect {
  apply(): void {
    console.log('[SunnyWeatherEffect] 开始应用晴天天气特效')

    if (!this.loca) {
      console.warn('[SunnyWeatherEffect] loca 未初始化，无法应用特效')
      return
    }

    // 设置3D视角 - 让太阳中心成为视野中心
    const centerPoint = [116.396543, 39.916331]
    this.setView({
      pitch: 50,
      zoom: 18,
      rotation: 0,
      center: centerPoint
    })
    console.log('[SunnyWeatherEffect] 调整地图视角')

    const Loca = (window as any).Loca

    // 创建放射光芒（最底层）
    const sunRays = this.createSunRays(centerPoint)

    // 创建浮动粒子
    const floatingParticles = this.createFloatingParticles(centerPoint)

    // 添加所有图层（按层级顺序）
    if (sunRays) this.addLocaLayer(sunRays)
    if (floatingParticles) this.addLocaLayer(floatingParticles)

    this.setResult({
      sunRays,
      floatingParticles
    })

    // 启动动画
    this.loca.animate.start()
    console.log('[SunnyWeatherEffect] 晴天天气特效创建完成')
  }

  /**
   * 创建放射光芒 - 36条强烈的光束
   */
  private createSunRays(centerPoint: [number, number]) {
    const Loca = (window as any).Loca

    const rayCount = 36
    const rayLength = 0.005

    const colors = [
      '#FFFF00', // 纯黄
      '#FFD700', // 金色
      '#FFA500', // 橙色
      '#FF6347'  // 番茄红
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: rayCount }, (_, i) => {
        const angle = (i / rayCount) * Math.PI * 2
        const endX = centerPoint[0] + Math.cos(angle) * rayLength
        const endY = centerPoint[1] + Math.sin(angle) * rayLength

        return {
          type: 'Feature',
          properties: {
            color: colors[i % colors.length],
            lineWidth: 4 + (i % 4)
          },
          geometry: {
            type: 'LineString',
            coordinates: [centerPoint, [endX, endY]]
          }
        }
      })
    }

    const layer = new Loca.LineLayer({
      zIndex: 148,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      lineWidth: (idx: number, feat: any) => (feat?.properties?.lineWidth || 5) / 2,
      color: (idx: number, feat: any) => feat?.properties?.color || '#FFD700',
      lineType: 'solid'
    })

    // 光束旋转动画
    layer.addAnimate({
      key: 'rotate',
      value: [0, 360],
      duration: 45000,
      easing: 'Linear',
      repeat: Infinity
    })

    // 光束强度动画
    layer.addAnimate({
      key: 'lineWidth',
      value: [2, 7],
      duration: 1800,
      easing: 'SinusoidalInOut',
      repeat: Infinity
    })

    // 光束透明度动画
    layer.addAnimate({
      key: 'opacity',
      value: [0.6, 1],
      duration: 2200,
      easing: 'SinusoidalInOut',
      repeat: Infinity
    })

    return layer
  }

  /**
   * 创建浮动粒子 - 散布的阳光微粒
   */
  private createFloatingParticles(centerPoint: [number, number]) {
    const Loca = (window as any).Loca

    const particleCount = 300

    const colors = [
      '#FFFFFF', // 白
      '#FFFDE7', // 极浅黄
      '#FFF9C4', // 浅黄
      '#FFEB3B', // 黄色
      '#FFC107'  // 琥珀
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: particleCount }, () => {
        const angle = Math.random() * Math.PI * 2
        const distance = 0.002 + Math.random() * 0.06

        const x = centerPoint[0] + Math.cos(angle) * distance
        const y = centerPoint[1] + Math.sin(angle) * distance

        const size = 1 + Math.random() * 4

        return {
          type: 'Feature',
          properties: {
            radius: size,
            color: colors[Math.floor(Math.random() * colors.length)]
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        }
      })
    }

    const layer = new Loca.PointLayer({
      zIndex: 147,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'meter',
      radius: (idx: number, feat: any) => (feat?.properties?.radius || 20) * 4,
      color: (idx: number, feat: any) => feat?.properties?.color || '#FFEB3B'
    })

    // 粒子旋转
    layer.addAnimate({
      key: 'rotate',
      value: [0, 360],
      duration: 45000,
      easing: 'Linear',
      repeat: Infinity
    })

    // 粒子闪烁
    layer.addAnimate({
      key: 'radius',
      value: [0.5, 1.5],
      duration: 2000,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })

    // 粒子透明度
    layer.addAnimate({
      key: 'opacity',
      value: [0.4, 1],
      duration: 1800,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })

    return layer
  }
}
