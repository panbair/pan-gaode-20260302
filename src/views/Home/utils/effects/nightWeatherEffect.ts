/**
 * 7. 夜晚模式特效
 * 创建宁静夜晚效果 - 星空+月亮+城市灯火
 */

import { BaseEffect } from './baseEffect'

export class NightWeatherEffect extends BaseEffect {
  apply(): void {
    console.log('[NightWeatherEffect] 开始应用夜晚天气特效')

    if (!this.loca) {
      console.warn('[NightWeatherEffect] loca 未初始化，无法应用特效')
      return
    }

    // 设置3D视角 - 仰望夜空
    const centerPoint = [116.397428, 39.90923]
    this.setView({
      pitch: 45,
      zoom: 8,
      rotation: 0,
      center: centerPoint
    })
    console.log('[NightWeatherEffect] 调整地图视角')

    // 延迟设置地图为夜间模式，确保视角设置完成
    setTimeout(() => {
      this.map.setMapStyle('amap://styles/dark')
      console.log('[NightWeatherEffect] 切换到夜间地图样式')
    }, 300)

    const Loca = (window as any).Loca

    // 创建星星
    const stars = this.createStars()

    // 创建月亮
    const moon = this.createMoon()

    // 创建城市灯火
    const cityLights = this.createCityLights()

    // 添加所有图层
    if (stars) this.loca.add(stars)
    if (moon) this.loca.add(moon)
    if (cityLights) this.loca.add(cityLights)

    this.setResult({
      stars,
      moon,
      cityLights
    })

    // 启动动画
    this.loca.animate.start()
    console.log('[NightWeatherEffect] 夜晚天气特效创建完成')
  }

  /**
   * 创建星空 - 随机分布的闪烁星星
   */
  private createStars() {
    const Loca = (window as any).Loca

    const starCount = 200
    const colors = [
      '#FFFFFF', // 纯白
      '#E8F4F8', // 冰蓝
      '#FFF8E1', // 淡黄
      '#F5F5F5'  // 银白
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: starCount }, () => {
        const x = 116.37 + Math.random() * 0.06
        const y = 39.89 + Math.random() * 0.04

        const size = 0.5 + Math.random() * 1

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
      zIndex: 146,
      opacity: 0.9,
      visible: true,
      zooms: [2, 22]
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'meter',
      radius: (idx: number, feat: any) => (feat?.properties?.radius || 1) * 3,
      color: (idx: number, feat: any) => feat?.properties?.color || '#FFFFFF'
    })

    // 星星闪烁动画 - 更快更明显
    layer.addAnimate({
      key: 'radius',
      value: [0.3, 2.5],
      duration: 1200 + Math.random() * 1000,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })

    layer.addAnimate({
      key: 'opacity',
      value: [0.4, 1],
      duration: 1500 + Math.random() * 1200,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })

    return layer
  }

  /**
   * 创建月亮 - 新月效果
   */
  private createMoon() {
    const Loca = (window as any).Loca

    // 月亮位置 - 西北方向
    const moonPoint: [number, number] = [116.38, 39.95]

    const geoData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            radius: 40
          },
          geometry: {
            type: 'Point',
            coordinates: moonPoint
          }
        }
      ]
    }

    const layer = new Loca.PointLayer({
      zIndex: 148,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'meter',
      radius: 40,
      color: '#E8E8E8',
      borderWidth: 0
    })

    // 月亮轻微闪烁 - 更柔和
    layer.addAnimate({
      key: 'radius',
      value: [36, 44],
      duration: 8000,
      easing: 'SinusoidalInOut',
      repeat: Infinity
    })

    layer.addAnimate({
      key: 'opacity',
      value: [0.85, 1],
      duration: 6000,
      easing: 'SinusoidalInOut',
      repeat: Infinity
    })

    return layer
  }

  /**
   * 创建城市灯火 - 城市的灯光点缀
   */
  private createCityLights() {
    const Loca = (window as any).Loca

    const lightCount = 150
    const colors = [
      '#FFEB3B', // 黄色路灯
      '#FFA726', // 橙色建筑灯
      '#FF7043', // 暖橙色
      '#FFB74D', // 金橙色
      '#FFCC80'  // 浅橙色
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: lightCount }, () => {
        const x = 116.39 + Math.random() * 0.02
        const y = 39.90 + Math.random() * 0.02

        const size = 2 + Math.random() * 5

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
      opacity: 0.8,
      visible: true,
      zooms: [2, 22]
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'meter',
      radius: (idx: number, feat: any) => (feat?.properties?.radius || 3) * 2,
      color: (idx: number, feat: any) => feat?.properties?.color || '#FFEB3B'
    })

    // 灯火闪烁动画 - 更有节奏感
    layer.addAnimate({
      key: 'radius',
      value: [0.6, 1.5],
      duration: 1800 + Math.random() * 1500,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })

    layer.addAnimate({
      key: 'opacity',
      value: [0.4, 1],
      duration: 2200 + Math.random() * 1300,
      easing: 'SinusoidalInOut',
      random: true,
      repeat: Infinity
    })

    return layer
  }
}
