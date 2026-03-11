/**
 * 16. 三色灯光建筑特效 - 增强版
 * 基于国贸建筑区的三色点光源动画效果
 * 支持环境光、平行光和多个动态点光源
 * 优化：增强光源强度、添加光晕效果、优化建筑材质、加速动画
 */

import { BaseEffect } from './baseEffect'

// 声明 Loca 全局对象
declare const Loca: any

export class TriColorLightBuildingEffect extends BaseEffect {
  private buildingLayer: any = null
  private geoDataSource: any = null
  private glowLayer: any = null
  private lights: any[] = []
  private lightMarkers: any[] = []
  private glowMarkers: any[] = []
  private animationFrameId: number | null = null
  private animationTime = 0
  private centerPoint: [number, number] = [116.455825, 39.916603]
  private lightIcon: any = null

  apply(): void {
    console.log('[TriColorLightBuildingEffect] 开始应用三色灯光建筑特效')

    if (!this.isLocaAvailable()) {
      console.warn('[TriColorLightBuildingEffect] loca 未初始化，无法应用特效')
      return
    }

    if (!this.isMapAvailable()) {
      console.warn('[TriColorLightBuildingEffect] map 未初始化，无法应用特效')
      return
    }

    // 设置地图视角
    this.setMapView()

    // 创建光源
    this.createLights()

    // 创建建筑图层
    this.createBuildingLayer()

    // 启动动画
    this.startAnimation()

    // 启动 Loca 动画
    if (this.loca?.animate) {
      try {
        this.loca.animate.start()
      } catch (e) {
        console.warn('[TriColorLightBuildingEffect] 启动 Loca 动画失败:', e)
      }
    }

    this.setResult({
      buildingLayer: this.buildingLayer,
      geoDataSource: this.geoDataSource,
      glowLayer: this.glowLayer,
      lights: this.lights,
      lightMarkers: this.lightMarkers,
      glowMarkers: this.glowMarkers,
      cleanup: () => this.cleanup()
    })

    console.log('[TriColorLightBuildingEffect] 三色灯光建筑特效应用完成')
  }

  /**
   * 设置地图视角
   */
  private setMapView(): void {
    this.map.setZoomAndCenter(16.5, this.centerPoint)
    this.map.setPitch(65)
    this.map.setRotation(0)
    this.map.setMapStyle('amap://styles/dark')
  }

  /**
   * 创建光源
   */
  private createLights(): void {
    // 环境光 - 深色调增强科技感
    const ambLight = {
      intensity: 0.3,
      color: '#1a1a2e'
    }
    this.loca.ambLight = ambLight
    this.lights.push(ambLight)

    // 平行光1 - 青绿色
    const dirLight1 = {
      intensity: 0.8,
      color: '#00ffcc',
      target: [0, 0, 0],
      position: [0, 3, 6]
    }
    this.loca.dirLight = dirLight1
    this.lights.push(dirLight1)

    // 平行光2 - 紫蓝色
    const dirLight2 = {
      intensity: 0.8,
      color: '#9b59b6',
      target: [0, 0, 0],
      position: [0, -3, 6]
    }
    this.lights.push(dirLight2)

    // 创建光源图标
    this.lightIcon = new this.AMap.Icon({
      image: '/light.png',
      imageSize: new this.AMap.Size(40, 40)
    })

    // 点光源1 - 霓虹青色（中心，垂直运动）
    const pointLight1 = {
      color: 'rgb(0,255,255)',
      position: [116.455825, 39.916603, 0],
      intensity: 15,
      distance: 800
    }
    this.lights.push(pointLight1)

    const marker1 = new this.AMap.Marker({
      position: [116.455825, 39.916603, 10],
      icon: this.lightIcon,
      anchor: 'bottom-center'
    })
    this.map.add(marker1)
    this.lightMarkers.push(marker1)

    // 点光源2 - 霓虹橙色（环形运动）
    const pointLight2 = {
      color: 'rgb(255,100,0)',
      position: [116.456598, 39.923482, 400],
      intensity: 18,
      distance: 2000
    }
    this.lights.push(pointLight2)

    const marker2 = new this.AMap.Marker({
      position: [116.456598, 39.923482, 400],
      icon: this.lightIcon,
      anchor: 'bottom-center'
    })
    this.map.add(marker2)
    this.lightMarkers.push(marker2)

    // 点光源3 - 霓虹粉色（环形运动）
    const pointLight3 = {
      color: 'rgb(255,0,150)',
      position: [116.455546, 39.90867, 400],
      intensity: 18,
      distance: 2000
    }
    this.lights.push(pointLight3)

    const marker3 = new this.AMap.Marker({
      position: [116.455546, 39.90867, 400],
      icon: this.lightIcon,
      anchor: 'bottom-center'
    })
    this.map.add(marker3)
    this.lightMarkers.push(marker3)

    // 设置 Loca 点光源
    this.loca.pointLight = pointLight1
    this.loca.pointLight2 = pointLight2
    this.loca.pointLight3 = pointLight3
  }

  /**
   * 创建建筑图层
   */
  private createBuildingLayer(): void {
    const LocaConstructor = (window as any).Loca
    const geoJsonUrl = '/guomao.geojson'

    this.geoDataSource = new LocaConstructor.GeoJSONSource({
      url: geoJsonUrl
    })

    this.buildingLayer = new LocaConstructor.PolygonLayer({
      zIndex: 120,
      shininess: 30,
      hasSide: true
    })

    this.buildingLayer.setSource(this.geoDataSource)
    this.buildingLayer.setStyle({
      topColor: (index: number, feature: any) => {
        const h = feature.properties.h || 100
        // 根据高度渐变颜色
        const t = Math.min(h / 500, 1)
        return `rgba(${Math.floor(10 + t * 30)},${Math.floor(60 + t * 100)},${Math.floor(120 + t * 135)},0.9)`
      },
      sideTopColor: (index: number, feature: any) => {
        return 'rgba(20,40,80,0.95)'
      },
      sideBottomColor: (index: number, feature: any) => {
        const h = feature.properties.h || 100
        // 底部渐变色，从深蓝到霓虹蓝
        const t = Math.min(h / 400, 1)
        return `rgba(${Math.floor(30 + t * 20)},${Math.floor(60 + t * 150)},${Math.floor(150 + t * 105)},1)`
      },
      unit: 'meter',
      height: (index: number, feature: any) => {
        return feature.properties.h || 100
      },
      altitude: 0
    })

    this.buildingLayer.setCustomCenter([116.458657, 39.914862])
    this.loca.add(this.buildingLayer)
    this.locaLayers.push(this.buildingLayer)
  }

  /**
   * 启动光源动画
   */
  private startAnimation(): void {
    const radius = 0.8
    const height = 500

    const animate = () => {
      this.animationTime += 1.5

      // 计算环形运动位置 - 使用更平滑的角度变化
      const angle1 = this.animationTime
      const angle2 = this.animationTime + 120
      const angle3 = this.animationTime + 240

      const pos1 = this.transformTranslate(this.centerPoint, radius, angle1)
      const pos2 = this.transformTranslate(this.centerPoint, radius, angle2)
      const pos3 = this.transformTranslate(this.centerPoint, radius, angle3)

      // 更新点光源1（青色，快速垂直运动）
      const t = (this.animationTime * 5) % (height * 2)
      const verticalHeight = t > height ? height * 2 - t : t
      const newPos1: [number, number, number] = [this.centerPoint[0], this.centerPoint[1], verticalHeight]
      this.lightMarkers[0].setPosition(newPos1)
      this.loca.pointLight.position = newPos1

      // 更新点光源2（橙色，环形运动 + 垂直波动）
      const verticalOffset2 = Math.sin(this.animationTime * 0.1) * 100
      const newPos2: [number, number, number] = [pos1[0], pos1[1], height + verticalOffset2]
      this.lightMarkers[1].setPosition(newPos2)
      this.loca.pointLight2.position = newPos2

      // 更新点光源3（粉色，环形运动 + 垂直波动）
      const verticalOffset3 = Math.cos(this.animationTime * 0.1) * 100
      const newPos3: [number, number, number] = [pos2[0], pos2[1], height + verticalOffset3]
      this.lightMarkers[2].setPosition(newPos3)
      this.loca.pointLight3.position = newPos3

      // 动态调整光源强度（呼吸效果）
      const intensityBase = 15
      const intensityVariation = Math.sin(this.animationTime * 0.2) * 5
      this.loca.pointLight.intensity = intensityBase + intensityVariation
      this.loca.pointLight2.intensity = 18 + intensityVariation
      this.loca.pointLight3.intensity = 18 + intensityVariation

      this.animationFrameId = requestAnimationFrame(animate)
    }

    animate()
  }

  /**
   * 坐标变换（环形运动）
   */
  private transformTranslate(point: [number, number], distance: number, bearing: number): [number, number] {
    const R = 6371e3 // 地球半径（米）
    const lat1 = (point[1] * Math.PI) / 180
    const lon1 = (point[0] * Math.PI) / 180
    const dByR = distance / R
    const bearingRad = (bearing * Math.PI) / 180

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearingRad)
    )
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(dByR) * Math.cos(lat1),
        Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat2)
      )

    return [(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI]
  }

  cleanup(): void {
    super.cleanup()

    // 停止动画
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // 移除光源标记
    this.lightMarkers.forEach(marker => {
      if (marker) {
        try {
          this.map.remove(marker)
        } catch (e) {
          // 静默处理
        }
      }
    })
    this.lightMarkers = []

    // 移除光晕标记
    this.glowMarkers.forEach(marker => {
      if (marker) {
        try {
          this.map.remove(marker)
        } catch (e) {
          // 静默处理
        }
      }
    })
    this.glowMarkers = []

    // 清除光源配置
    if (this.loca) {
      this.loca.ambLight = null
      this.loca.dirLight = null
      this.loca.pointLight = null
      this.loca.pointLight2 = null
      this.loca.pointLight3 = null
    }

    console.log('[TriColorLightBuildingEffect] 特效清理完成')
  }
}
