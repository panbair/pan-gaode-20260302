/**
 * 19. 霓虹城市夜景特效
 * 在夜晚模式基础上增强霓虹灯效果
 * 特性：
 * - 赛博朋克风格霓虹灯光
 * - 多彩霓虹建筑轮廓
 * - 霓虹招牌和广告牌
 * - 霓虹道路光带
 * - 霓虹脉冲效果
 * - 动态颜色变换
 * - 光晕和辉光效果
 * - 炫酷的夜晚城市氛围
 */

import { BaseEffect } from './baseEffect'

export class NeonCityEffect extends BaseEffect {
  private neonSignLayer: any = null
  private neonPulseLayer: any = null
  private glowOverlayLayer: any = null
  private scatterLayer: any = null

  apply(): void {
    console.log('[NeonCityEffect] 开始应用霓虹城市夜景特效')

    if (!this.loca) {
      console.warn('[NeonCityEffect] loca 未初始化，无法应用特效')
      return
    }

    // 先设置地图为夜间模式，确保背景正确
    this.map.setMapStyle('amap://styles/dark')
    console.log('[NeonCityEffect] 切换到深色地图样式')

    // 设置地图为3D夜景模式 - 降低pitch和增加zoom使粒子更明显
    this.setView({
      pitch: 30,
      zoom: 15,
      rotation: 0,
      center: [116.397428, 39.90923]
    })
    console.log('[NeonCityEffect] 调整地图视角为 3D 夜景模式')

    const Loca = (window as any).Loca

    // 配置霓虹光照系统
    this.configureNeonLighting()

    // 创建霓虹招牌图层（使用ScatterLayer实现动画效果）
    this.neonSignLayer = this.createNeonSigns()
    if (this.neonSignLayer) {
      this.loca.add(this.neonSignLayer)
      this.locaLayers.push(this.neonSignLayer)
      console.log('[NeonCityEffect] 霓虹招牌图层已添加到Loca, zIndex:', this.neonSignLayer.zIndex)
    } else {
      console.warn('[NeonCityEffect] 霓虹招牌图层创建失败')
    }

    // 创建霓虹脉冲图层（使用ScatterLayer实现动画效果）
    this.neonPulseLayer = this.createNeonPulses()
    if (this.neonPulseLayer) {
      this.loca.add(this.neonPulseLayer)
      this.locaLayers.push(this.neonPulseLayer)
      console.log('[NeonCityEffect] 霓虹脉冲图层已添加到Loca, zIndex:', this.neonPulseLayer.zIndex)
    } else {
      console.warn('[NeonCityEffect] 霓虹脉冲图层创建失败')
    }

    // 创建光晕叠加层
    this.glowOverlayLayer = this.createGlowOverlay()
    if (this.glowOverlayLayer) {
      this.loca.add(this.glowOverlayLayer)
      this.locaLayers.push(this.glowOverlayLayer)
      console.log('[NeonCityEffect] 光晕叠加层已添加到Loca, zIndex:', this.glowOverlayLayer.zIndex)
    } else {
      console.warn('[NeonCityEffect] 光晕叠加层创建失败')
    }

    // 创建霓虹粒子散布层（带呼吸动画）
    this.scatterLayer = this.createNeonScatter()
    if (this.scatterLayer) {
      this.loca.add(this.scatterLayer)
      this.locaLayers.push(this.scatterLayer)
      console.log('[NeonCityEffect] 霓虹粒子散布层已添加到Loca, zIndex:', this.scatterLayer.zIndex)
    } else {
      console.warn('[NeonCityEffect] 霓虹粒子散布层创建失败')
    }

    // 启动渲染循环，确保图层可见
    try {
      this.loca.animate.start()
      console.log('[NeonCityEffect] 启动Loca渲染循环')
    } catch (e) {
      console.warn('[NeonCityEffect] 启动渲染循环失败:', e)
    }

    // 设置结果
    this.setResult({
      neonSignLayer: this.neonSignLayer,
      neonPulseLayer: this.neonPulseLayer,
      glowOverlayLayer: this.glowOverlayLayer,
      scatterLayer: this.scatterLayer,
      cleanup: () => this.cleanupNeonCity()
    })

    console.log('[NeonCityEffect] 霓虹城市夜景特效应用完成')
  }

  /**
   * 配置霓虹光照系统
   */
  private configureNeonLighting(): void {
    if (!this.loca) return

    // 环境光 - 深蓝色氛围
    this.loca.ambLight = {
      intensity: 0.3,
      color: 'rgba(20, 30, 60, 0.8)'
    }

    // 平行光 - 偏紫的月光
    this.loca.dirLight = {
      intensity: 0.6,
      color: 'rgba(180, 100, 255, 0.5)',
      target: [116.397428, 39.90923, 0],
      position: [116.397428, 40.20923, 500000]
    }

    // 点光源1 - 霓虹粉色
    this.loca.pointLight = {
      color: 'rgb(255, 0, 128)',
      position: [116.397428, 39.90923, 50000],
      intensity: 8,
      distance: 300000
    }

    // 点光源2 - 霓虹青色
    this.loca.pointLight2 = {
      color: 'rgb(0, 255, 255)',
      position: [116.447428, 39.95923, 40000],
      intensity: 6,
      distance: 250000
    }

    console.log('[NeonCityEffect] 霓虹光照系统配置完成')
  }

  /**
   * 创建霓虹招牌 - 闪烁的霓虹灯招牌（使用PointLayer，px单位）
   */
  private createNeonSigns() {
    const Loca = (window as any).Loca

    const signCount = 80
    const signColors = [
      '#FF006E', // 粉色
      '#00F0FF', // 青色
      '#FF00FF', // 紫色
      '#00FF00', // 绿色
      '#FFFF00', // 黄色
      '#FF6600', // 橙色
      '#0066FF', // 蓝色
      '#FF0099'  // 红紫
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: signCount }, () => {
        const x = 116.35 + Math.random() * 0.08
        const y = 39.87 + Math.random() * 0.06
        const colorIndex = Math.floor(Math.random() * signColors.length)
        const baseRadius = 15 + Math.random() * 10

        return {
          type: 'Feature',
          properties: {
            colorIndex: colorIndex,
            radius: baseRadius
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        }
      })
    }

    const layer = new Loca.PointLayer({
      zIndex: 130,
      opacity: 1,
      visible: true,
      zooms: [2, 22],
      blend: 'lighter'
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'px',
      radius: (idx: number, feat: any) => feat?.properties?.radius || 20,
      color: (idx: number, feat: any) => signColors[feat?.properties?.colorIndex || 0],
      borderWidth: 0,
      blurRadius: -1
    })

    // 添加半径脉冲动画 - 模拟霓虹灯闪烁
    try {
      layer.addAnimate({
        key: 'radius',
        value: [0.5, 1.5],
        duration: 800,
        easing: 'Linear',
        transform: 1000,
        random: true,
        delay: 2000,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹招牌半径动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹招牌半径动画添加失败:', e)
    }

    // 添加透明度闪烁动画
    try {
      layer.addAnimate({
        key: 'opacity',
        value: [0.5, 1],
        duration: 600,
        easing: 'Linear',
        transform: 800,
        random: true,
        delay: 1500,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹招牌透明度动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹招牌透明度动画添加失败:', e)
    }

    console.log('[NeonCityEffect] createNeonSigns 完成, 图层数据点数:', signCount)
    return layer
  }

  /**
   * 创建霓虹粒子散布层 - 带呼吸动画的粒子效果（使用PointLayer，px单位）
   */
  private createNeonScatter() {
    const Loca = (window as any).Loca

    const scatterCount = 150
    const scatterColors = [
      '#FF006E', '#00F0FF', '#FF00FF', '#00FF00',
      '#FFFF00', '#FF6600', '#0066FF', '#FF0099'
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: scatterCount }, () => {
        const x = 116.35 + Math.random() * 0.08
        const y = 39.87 + Math.random() * 0.06
        const colorIndex = Math.floor(Math.random() * scatterColors.length)
        const baseRadius = 4 + Math.random() * 6

        return {
          type: 'Feature',
          properties: {
            colorIndex: colorIndex,
            radius: baseRadius
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        }
      })
    }

    const layer = new Loca.PointLayer({
      zIndex: 115,
      opacity: 0.9,
      visible: true,
      zooms: [2, 22],
      blend: 'lighter'
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'px',
      radius: (idx: number, feat: any) => feat?.properties?.radius || 6,
      color: (idx: number, feat: any) => scatterColors[feat?.properties?.colorIndex || 1],
      borderWidth: 0,
      blurRadius: -1
    })

    // 添加快速呼吸动画
    try {
      layer.addAnimate({
        key: 'radius',
        value: [0.2, 1.8],
        duration: 400,
        easing: 'Linear',
        transform: 600,
        random: true,
        delay: 1000,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹粒子半径动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹粒子半径动画添加失败:', e)
    }

    // 添加快速闪烁
    try {
      layer.addAnimate({
        key: 'opacity',
        value: [0.4, 1],
        duration: 300,
        easing: 'Linear',
        transform: 500,
        random: true,
        delay: 800,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹粒子透明度动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹粒子透明度动画添加失败:', e)
    }

    console.log('[NeonCityEffect] createNeonScatter 完成, 图层数据点数:', scatterCount)
    return layer
  }

  /**
   * 创建霓虹脉冲 - 流动的霓虹脉冲效果（使用PointLayer，px单位）
   */
  private createNeonPulses() {
    const Loca = (window as any).Loca

    const pulseCount = 120
    const pulseColors = [
      '#FF006E', '#00F0FF', '#FF00FF', '#00FF00',
      '#FFFF00', '#FF6600', '#0066FF', '#FF0099'
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: pulseCount }, () => {
        const x = 116.35 + Math.random() * 0.08
        const y = 39.87 + Math.random() * 0.06
        const colorIndex = Math.floor(Math.random() * pulseColors.length)
        const baseRadius = 8 + Math.random() * 8

        return {
          type: 'Feature',
          properties: {
            colorIndex: colorIndex,
            radius: baseRadius
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        }
      })
    }

    const layer = new Loca.PointLayer({
      zIndex: 125,
      opacity: 0.9,
      visible: true,
      zooms: [2, 22],
      blend: 'lighter'
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'px',
      radius: (idx: number, feat: any) => feat?.properties?.radius || 12,
      color: (idx: number, feat: any) => pulseColors[feat?.properties?.colorIndex || 1],
      borderWidth: 0,
      blurRadius: -1
    })

    // 添加快速脉冲动画
    try {
      layer.addAnimate({
        key: 'radius',
        value: [0.3, 1.7],
        duration: 500,
        easing: 'Linear',
        transform: 800,
        random: true,
        delay: 1500,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹脉冲半径动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹脉冲半径动画添加失败:', e)
    }

    // 添加透明度闪烁
    try {
      layer.addAnimate({
        key: 'opacity',
        value: [0.4, 1],
        duration: 400,
        easing: 'Linear',
        transform: 600,
        random: true,
        delay: 1000,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹脉冲透明度动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹脉冲透明度动画添加失败:', e)
    }

    console.log('[NeonCityEffect] createNeonPulses 完成, 图层数据点数:', pulseCount)
    return layer
  }

  /**
   * 创建霓虹粒子散布层 - 带呼吸动画的粒子效果（使用PointLayer，px单位）
   */
  private createNeonScatter() {
    const Loca = (window as any).Loca

    const scatterCount = 150
    const scatterColors = [
      '#FF006E', '#00F0FF', '#FF00FF', '#00FF00',
      '#FFFF00', '#FF6600', '#0066FF', '#FF0099'
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: scatterCount }, () => {
        const x = 116.35 + Math.random() * 0.08
        const y = 39.87 + Math.random() * 0.06
        const colorIndex = Math.floor(Math.random() * scatterColors.length)
        const baseRadius = 4 + Math.random() * 6

        return {
          type: 'Feature',
          properties: {
            colorIndex: colorIndex,
            radius: baseRadius
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        }
      })
    }

    const layer = new Loca.PointLayer({
      zIndex: 115,
      opacity: 0.9,
      visible: true,
      zooms: [2, 22],
      blend: 'lighter'
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'px',
      radius: (idx: number, feat: any) => feat?.properties?.radius || 6,
      color: (idx: number, feat: any) => scatterColors[feat?.properties?.colorIndex || 1],
      borderWidth: 0,
      blurRadius: -1
    })

    // 添加快速呼吸动画
    try {
      layer.addAnimate({
        key: 'radius',
        value: [0.2, 1.8],
        duration: 400,
        easing: 'Linear',
        transform: 600,
        random: true,
        delay: 1000,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹粒子半径动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹粒子半径动画添加失败:', e)
    }

    // 添加快速闪烁
    try {
      layer.addAnimate({
        key: 'opacity',
        value: [0.4, 1],
        duration: 300,
        easing: 'Linear',
        transform: 500,
        random: true,
        delay: 800,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 霓虹粒子透明度动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 霓虹粒子透明度动画添加失败:', e)
    }

    console.log('[NeonCityEffect] createNeonScatter 完成, 图层数据点数:', scatterCount)
    return layer
  }

  /**
   * 创建光晕叠加层 - 增强整体氛围（使用PointLayer，px单位）
   */
  private createGlowOverlay() {
    const Loca = (window as any).Loca

    const glowCount = 40
    const glowColors = [
      '#FF006E',
      '#00F0FF',
      '#FF00FF',
      '#00FF00',
      '#FF6600',
      '#0066FF'
    ]

    const geoData = {
      type: 'FeatureCollection',
      features: Array.from({ length: glowCount }, () => {
        const x = 116.36 + Math.random() * 0.07
        const y = 39.88 + Math.random() * 0.05
        const colorIndex = Math.floor(Math.random() * glowColors.length)
        const baseRadius = 25 + Math.random() * 15

        return {
          type: 'Feature',
          properties: {
            colorIndex: colorIndex,
            radius: baseRadius
          },
          geometry: {
            type: 'Point',
            coordinates: [x, y]
          }
        }
      })
    }

    const layer = new Loca.PointLayer({
      zIndex: 110,
      opacity: 0.5,
      visible: true,
      zooms: [2, 22],
      blend: 'lighter'
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      unit: 'px',
      radius: (idx: number, feat: any) => feat?.properties?.radius || 30,
      color: (idx: number, feat: any) => glowColors[feat?.properties?.colorIndex || 2],
      borderWidth: 0,
      blurRadius: -1
    })

    // 添加缓慢呼吸动画
    try {
      layer.addAnimate({
        key: 'radius',
        value: [0.6, 1.4],
        duration: 1500,
        easing: 'Linear',
        transform: 2000,
        random: true,
        delay: 3000,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 光晕半径动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 光晕半径动画添加失败:', e)
    }

    // 添加透明度缓慢变化
    try {
      layer.addAnimate({
        key: 'opacity',
        value: [0.3, 0.6],
        duration: 1200,
        easing: 'Linear',
        transform: 1800,
        random: true,
        delay: 2500,
        yoyo: true,
        repeat: 100000
      })
      console.log('[NeonCityEffect] 光晕透明度动画添加成功')
    } catch (e) {
      console.warn('[NeonCityEffect] 光晕透明度动画添加失败:', e)
    }

    console.log('[NeonCityEffect] createGlowOverlay 完成, 图层数据点数:', glowCount)
    return layer
  }

  /**
   * 清理资源
   */
  private cleanupNeonCity() {
    console.log('[NeonCityEffect] 开始清理霓虹城市夜景资源')

    // 恢复默认光照
    if (this.loca) {
      this.loca.ambLight = {
        intensity: 0.5,
        color: '#fff'
      }
      this.loca.dirLight = {
        intensity: 0.6,
        color: '#abffc8',
        target: [0, 0, 0],
        position: [0, 3, 6]
      }
      delete this.loca.pointLight
      delete this.loca.pointLight2
    }

    console.log('[NeonCityEffect] 霓虹城市夜景资源清理完成')
  }

  protected cleanup(): void {
    this.cleanupNeonCity()
    super.cleanup()
  }
}
