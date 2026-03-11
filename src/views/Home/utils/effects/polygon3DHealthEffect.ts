/**
 * 3D立体面健康度特效 - 赛博朋克升级版
 * 基于高德官方demo优化实现，添加炫酷视觉效果
 * 使用 Loca.PolygonLayer 实现立体面健康度可视化
 * 特性: 赛博朋克光照、呼吸动画、霓虹边框、粒子效果、动态扫描线
 */

import { BaseEffect } from './baseEffect'

export class Polygon3DHealthEffect extends BaseEffect {
  private polygonLayer: any = null
  private legend: any = null
  private infoText: any = null
  private particleLayer: any = null
  private scatterLayer: any = null

  // 赛博朋克风格健康度颜色梯度 - 从低到高
  // 紫色 -> 蓝色 -> 青色 -> 绿色 -> 黄色 -> 金色
  private readonly colors = [
    '#FFD700', // 金色 100%
    '#FFA500', // 橙色 90-95%
    '#FF69B4', // 粉色 80-85%
    '#00CED1', // 青色 70-75%
    '#00BFFF', // 深天蓝 60-65%
    '#4169E1', // 皇家蓝 50-55%
    '#8A2BE2', // 紫罗兰 40-45%
    '#9932CC', // 深兰花紫 30-35%
    '#4B0082'  // 靛青 20-25%
  ]

  // 高度映射 - 从低健康度到高健康度
  private readonly heights = [5000, 7000, 9000, 11000, 13000, 15000, 17000, 19000, 21000]

  // 霓虹边框颜色
  private readonly neonColors = [
    '#FF4500', // 橙红
    '#FF6347', // 番茄红
    '#FFD700', // 金色
    '#00FF7F', // 春绿
    '#00FFFF', // 青色
    '#1E90FF', // 道奇蓝
    '#FF69B4', // 粉色
    '#FF00FF'  // 洋红
  ]

  apply(): void {
    console.log('[Polygon3DHealthEffect] 开始应用3D立体面健康度特效 - 赛博朋克版')

    if (!this.map || !this.loca) {
      console.error('[Polygon3DHealthEffect] 地图或 Loca 未初始化')
      return
    }

    // 设置3D视角 - 杭州视野
    this.map.setPitch(50)
    this.map.setRotation(0)
    this.map.setCenter([120.109233, 30.246411])
    this.map.setZoom(11.14)
    this.map.setMapStyle('amap://styles/dark')

    // 配置赛博朋克光照系统 - 多光源动态效果
    this.loca.ambLight = {
      intensity: 0.4,
      color: 'rgba(100, 200, 255, 0.8)'
    }
    this.loca.dirLight = {
      intensity: 0.8,
      color: 'rgba(255, 200, 100, 0.9)',
      target: [0, 0, 0],
      position: [1, -1, 2]
    }
    this.loca.pointLight = {
      color: 'rgb(100, 255, 200)',
      position: [120.24289, 30.341335, 30000],
      intensity: 4,
      distance: 80000
    }

    // 添加第二个点光源 - 紫色
    this.loca.pointLight2 = {
      color: 'rgb(255, 100, 255)',
      position: [120.109233, 30.246411, 25000],
      intensity: 3,
      distance: 60000
    }

    // 生成模拟数据 - 杭州功能区数据
    const geoData = this.generateHangzhouData()

    console.log('[Polygon3DHealthEffect] 生成的杭州数据:', geoData)

    // 创建多边形图层 - 玻璃质感+霓虹边框
    this.polygonLayer = new (window as any).Loca.PolygonLayer({
      zIndex: 120,
      opacity: 0.75,
      shininess: 30,
      hasSide: true,
      acceptLight: true,
      cullface: 'none'
    })

    // 创建 GeoJSON 数据源
    const geoSource = new (window as any).Loca.GeoJSONSource({
      data: geoData
    })

    this.polygonLayer.setSource(geoSource)

    // 设置样式 - 赛博朋克渐变配色
    this.polygonLayer.setStyle({
      topColor: (index: number, feature: any) => {
        const v = feature.properties.health * 100
        return v < 25 ? this.colors[8] :
          v < 35 ? this.colors[7] :
          v < 45 ? this.colors[6] :
          v < 55 ? this.colors[5] :
          v < 65 ? this.colors[4] :
          v < 75 ? this.colors[3] :
          v < 85 ? this.colors[2] :
          v < 95 ? this.colors[1] :
          v < 100 ? this.colors[0] : this.colors[0]
      },
      sideTopColor: (index: number, feature: any) => {
        const v = feature.properties.health * 100
        return v < 25 ? this.colors[8] :
          v < 35 ? this.colors[7] :
          v < 45 ? this.colors[6] :
          v < 55 ? this.colors[5] :
          v < 65 ? this.colors[4] :
          v < 75 ? this.colors[3] :
          v < 85 ? this.colors[2] :
          v < 95 ? this.colors[1] :
          v < 100 ? this.colors[0] : this.colors[0]
      },
      sideBottomColor: (index: number, feature: any) => {
        const v = feature.properties.health * 100
        // 底部颜色更深，增强立体感
        const darkFactor = 0.6
        const baseColor = v < 25 ? this.colors[8] :
          v < 35 ? this.colors[7] :
          v < 45 ? this.colors[6] :
          v < 55 ? this.colors[5] :
          v < 65 ? this.colors[4] :
          v < 75 ? this.colors[3] :
          v < 85 ? this.colors[2] :
          v < 95 ? this.colors[1] :
          v < 100 ? this.colors[0] : this.colors[0]
        return this.darkenColor(baseColor, darkFactor)
      },
      height: (index: number, feature: any) => {
        const v = feature.properties.health * 100
        return v < 25 ? this.heights[8] :
          v < 35 ? this.heights[7] :
          v < 45 ? this.heights[6] :
          v < 55 ? this.heights[5] :
          v < 65 ? this.heights[4] :
          v < 75 ? this.heights[3] :
          v < 85 ? this.heights[2] :
          v < 95 ? this.heights[1] :
          v < 100 ? this.heights[0] : this.heights[0]
      },
      altitude: 0,
      unit: 'meter'
    })

    // 添加到 Loca 容器
    this.loca.add(this.polygonLayer)

    console.log('[Polygon3DHealthEffect] 多边形图层已添加')

    // 创建炫酷悬浮提示文本 - 赛博朋克风格
    this.infoText = new this.AMap.Text({
      text: '健康度',
      anchor: 'center',
      draggable: true,
      cursor: 'pointer',
      angle: 0,
      visible: false,
      offset: [0, -30],
      style: {
        padding: '8px 16px',
        marginBottom: '1rem',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 20, 40, 0.9)',
        border: '2px solid #00FFFF',
        borderWidth: '2px',
        borderColor: '#00FFFF',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)',
        textAlign: 'center',
        fontSize: '18px',
        color: '#00FFFF',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
        fontWeight: 'bold'
      }
    })
    this.infoText.setMap(this.map)

    // 创建粒子效果层 - 在健康度高的区域添加漂浮粒子
    this.createParticleEffects(geoData)

    // 鼠标交互 - 悬浮高亮效果（与demo一致）
    this.map.on('mousemove', (e: any) => {
      if (!this.polygonLayer) return

      // 使用与demo一致的方式查询要素
      const feat = this.polygonLayer.queryFeature(e.pixel.toArray())

      if (feat) {
        this.infoText.show()
        const health = feat.properties.health
        this.infoText.setContent(feat.properties.name + ' 健康度：' + parseInt(health * 100) + '%')
        this.infoText.setPosition(e.lnglat)

        // 高亮当前悬停区域 - 赛博朋克霓虹效果
        this.polygonLayer.setStyle({
          topColor: (index: number, feature: any) => {
            if (feature === feat) {
              return [255, 255, 0, 0.8] // 霓虹黄
            }
            const v = feature.properties.health * 100
            return v < 25 ? this.colors[8] :
              v < 35 ? this.colors[7] :
              v < 45 ? this.colors[6] :
              v < 55 ? this.colors[5] :
              v < 65 ? this.colors[4] :
              v < 75 ? this.colors[3] :
              v < 85 ? this.colors[2] :
              v < 95 ? this.colors[1] :
              v < 100 ? this.colors[0] : this.colors[0]
          },
          sideTopColor: (index: number, feature: any) => {
            if (feature === feat) {
              return [255, 165, 0, 0.8] // 橙色
            }
            const v = feature.properties.health * 100
            return v < 25 ? this.colors[8] :
              v < 35 ? this.colors[7] :
              v < 45 ? this.colors[6] :
              v < 55 ? this.colors[5] :
              v < 65 ? this.colors[4] :
              v < 75 ? this.colors[3] :
              v < 85 ? this.colors[2] :
              v < 95 ? this.colors[1] :
              v < 100 ? this.colors[0] : this.colors[0]
          },
          sideBottomColor: (index: number, feature: any) => {
            if (feature === feat) {
              return [255, 69, 0, 0.8] // 红橙
            }
            const v = feature.properties.health * 100
            return this.darkenColor(
              v < 25 ? this.colors[8] :
              v < 35 ? this.colors[7] :
              v < 45 ? this.colors[6] :
              v < 55 ? this.colors[5] :
              v < 65 ? this.colors[4] :
              v < 75 ? this.colors[3] :
              v < 85 ? this.colors[2] :
              v < 95 ? this.colors[1] :
              v < 100 ? this.colors[0] : this.colors[0],
              0.6
            )
          },
          height: (index: number, feature: any) => {
            const v = feature.properties.health * 100
            const baseHeight = v < 25 ? this.heights[8] :
              v < 35 ? this.heights[7] :
              v < 45 ? this.heights[6] :
              v < 55 ? this.heights[5] :
              v < 65 ? this.heights[4] :
              v < 75 ? this.heights[3] :
              v < 85 ? this.heights[2] :
              v < 95 ? this.heights[1] :
              v < 100 ? this.heights[0] : this.heights[0]
            return feature === feat ? baseHeight * 1.2 : baseHeight // 悬停时增加高度
          },
          altitude: 0,
          unit: 'meter'
        })
      } else {
        this.infoText.hide()
        // 恢复原始样式
        this.polygonLayer.setStyle({
          topColor: (index: number, feature: any) => {
            const v = feature.properties.health * 100
            return v < 25 ? this.colors[8] :
              v < 35 ? this.colors[7] :
              v < 45 ? this.colors[6] :
              v < 55 ? this.colors[5] :
              v < 65 ? this.colors[4] :
              v < 75 ? this.colors[3] :
              v < 85 ? this.colors[2] :
              v < 95 ? this.colors[1] :
              v < 100 ? this.colors[0] : this.colors[0]
          },
          sideTopColor: (index: number, feature: any) => {
            const v = feature.properties.health * 100
            return v < 25 ? this.colors[8] :
              v < 35 ? this.colors[7] :
              v < 45 ? this.colors[6] :
              v < 55 ? this.colors[5] :
              v < 65 ? this.colors[4] :
              v < 75 ? this.colors[3] :
              v < 85 ? this.colors[2] :
              v < 95 ? this.colors[1] :
              v < 100 ? this.colors[0] : this.colors[0]
          },
          sideBottomColor: (index: number, feature: any) => {
            const v = feature.properties.health * 100
            return this.darkenColor(
              v < 25 ? this.colors[8] :
              v < 35 ? this.colors[7] :
              v < 45 ? this.colors[6] :
              v < 55 ? this.colors[5] :
              v < 65 ? this.colors[4] :
              v < 75 ? this.colors[3] :
              v < 85 ? this.colors[2] :
              v < 95 ? this.colors[1] :
              v < 100 ? this.colors[0] : this.colors[0],
              0.6
            )
          },
          height: (index: number, feature: any) => {
            const v = feature.properties.health * 100
            return v < 25 ? this.heights[8] :
              v < 35 ? this.heights[7] :
              v < 45 ? this.heights[6] :
              v < 55 ? this.heights[5] :
              v < 65 ? this.heights[4] :
              v < 75 ? this.heights[3] :
              v < 85 ? this.heights[2] :
              v < 95 ? this.heights[1] :
              v < 100 ? this.heights[0] : this.heights[0]
          },
          altitude: 0,
          unit: 'meter'
        })
      }
    })

    // 创建图例
    this.createLegend()

    // 添加生长动画 - 与demo一致的配置
    this.polygonLayer.addAnimate({
      key: 'height',
      value: [0, 1],
      duration: 1000,
      easing: 'CubicInOut'
    })

    this.loca.animate.start()
    console.log('[Polygon3DHealthEffect] 动画已启动')

    console.log('[Polygon3DHealthEffect] 3D立体面应用完成 - 赛博朋克版')

    // 存储清理函数
    this.setResult({
      layer: this.polygonLayer,
      cleanup: () => {
        // 停止动画
        if (this.loca) {
          try {
            this.loca.animate.stop()
          } catch (e) {
            console.warn('[Polygon3DHealthEffect] 停止动画失败:', e)
          }
        }

        // 清除信息文本
        if (this.infoText) {
          try {
            this.infoText.setMap(null)
          } catch (e) {
            console.warn('[Polygon3DHealthEffect] 清除信息文本失败:', e)
          }
          this.infoText = null
        }

        // 清除图例
        if (this.legend) {
          try {
            this.legend.destroy()
          } catch (e) {
            console.warn('[Polygon3DHealthEffect] 清除图例失败:', e)
          }
          this.legend = null
        }

        // 清除粒子图层
        if (this.particleLayer && this.loca) {
          try {
            this.loca.remove(this.particleLayer)
          } catch (e) {
            console.warn('[Polygon3DHealthEffect] 清除粒子图层失败:', e)
          }
          this.particleLayer = null
        }

        // 清除多边形图层
        if (this.polygonLayer && this.loca) {
          try {
            this.loca.remove(this.polygonLayer)
          } catch (e) {
            console.warn('[Polygon3DHealthEffect] 从 Loca 容器移除图层失败:', e)
          }
          this.polygonLayer = null
        }

        // 重置地图视角
        try {
          this.map.setPitch(0)
          this.map.setRotation(0)
          this.map.setMapStyle('amap://styles/normal')
        } catch (e) {
          console.warn('[Polygon3DHealthEffect] 重置地图视角失败:', e)
        }
      }
    })
  }

  /**
   * 创建图例 - 赛博朋克风格
   */
  private createLegend(): void {
    this.legend = new (window as any).Loca.Legend({
      loca: this.loca,
      title: {
        label: '健康度',
        fontColor: '#00FFFF',
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold'
      },
      style: {
        backgroundColor: 'rgba(0, 20, 40, 0.9)',
        border: '2px solid #00FFFF',
        borderWidth: '2px',
        borderColor: '#00FFFF',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
        left: '20px',
        bottom: '40px',
        padding: '15px',
        borderRadius: '8px'
      },
      dataMap: [
        { label: 100, color: this.colors[0] },
        { label: 90, color: this.colors[1] },
        { label: 80, color: this.colors[2] },
        { label: 70, color: this.colors[3] },
        { label: 60, color: this.colors[4] },
        { label: 50, color: this.colors[5] },
        { label: 40, color: this.colors[6] },
        { label: 30, color: this.colors[7] },
        { label: 20, color: this.colors[8] }
      ]
    })
  }

  /**
   * 生成杭州功能区模拟数据
   */
  private generateHangzhouData(): any {
    // 杭州主要功能区数据
    const areas = [
      {
        name: '西湖景区',
        health: 0.92,
        coordinates: [
          [120.120, 30.240],
          [120.130, 30.235],
          [120.140, 30.240],
          [120.145, 30.250],
          [120.135, 30.260],
          [120.120, 30.255],
          [120.110, 30.245]
        ]
      },
      {
        name: '滨江高新',
        health: 0.88,
        coordinates: [
          [120.200, 30.200],
          [120.220, 30.195],
          [120.235, 30.205],
          [120.230, 30.225],
          [120.210, 30.230],
          [120.195, 30.220]
        ]
      },
      {
        name: '下城中心',
        health: 0.85,
        coordinates: [
          [120.170, 30.260],
          [120.190, 30.255],
          [120.200, 30.270],
          [120.190, 30.285],
          [120.170, 30.280],
          [120.160, 30.270]
        ]
      },
      {
        name: '江干新城',
        health: 0.78,
        coordinates: [
          [120.210, 30.280],
          [120.235, 30.275],
          [120.245, 30.290],
          [120.235, 30.305],
          [120.210, 30.300],
          [120.200, 30.290]
        ]
      },
      {
        name: '拱墅工业区',
        health: 0.65,
        coordinates: [
          [120.140, 30.290],
          [120.160, 30.285],
          [120.170, 30.300],
          [120.160, 30.315],
          [120.140, 30.310],
          [120.130, 30.300]
        ]
      },
      {
        name: '萧山机场',
        health: 0.72,
        coordinates: [
          [120.420, 30.220],
          [120.450, 30.215],
          [120.460, 30.235],
          [120.450, 30.250],
          [120.420, 30.245],
          [120.410, 30.230]
        ]
      },
      {
        name: '余杭科技',
        health: 0.80,
        coordinates: [
          [120.020, 30.260],
          [120.050, 30.255],
          [120.060, 30.275],
          [120.050, 30.295],
          [120.020, 30.290],
          [120.010, 30.275]
        ]
      },
      {
        name: '临平新城',
        health: 0.68,
        coordinates: [
          [120.280, 30.380],
          [120.310, 30.375],
          [120.320, 30.395],
          [120.310, 30.410],
          [120.280, 30.405],
          [120.270, 30.390]
        ]
      },
      {
        name: '富阳景区',
        health: 0.90,
        coordinates: [
          [119.950, 30.070],
          [119.980, 30.065],
          [119.990, 30.085],
          [119.980, 30.100],
          [119.950, 30.095],
          [119.940, 30.080]
        ]
      },
      {
        name: '桐庐生态',
        health: 0.95,
        coordinates: [
          [119.650, 29.800],
          [119.690, 29.795],
          [119.700, 29.820],
          [119.690, 29.840],
          [119.650, 29.835],
          [119.640, 29.815]
        ]
      }
    ]

    // 构建 GeoJSON FeatureCollection
    const features = areas.map(area => ({
      type: 'Feature',
      properties: {
        name: area.name,
        health: area.health
      },
      geometry: {
        type: 'Polygon',
        coordinates: [area.coordinates]
      }
    }))

    return {
      type: 'FeatureCollection',
      features
    }
  }

  /**
   * 创建粒子特效 - 在健康度高的区域添加漂浮粒子
   */
  private createParticleEffects(geoData: any): void {
    // 过滤健康度高的区域
    const highHealthAreas = geoData.features.filter(
      (f: any) => f.properties.health >= 0.8
    )

    if (highHealthAreas.length === 0) return

    // 创建粒子数据
    const particleData = []
    highHealthAreas.forEach((feature: any) => {
      const coords = feature.geometry.coordinates[0]
      const center = this.getPolygonCenter(coords)

      // 每个区域添加多个粒子
      for (let i = 0; i < 8; i++) {
        particleData.push({
          type: 'Feature',
          properties: {
            color: feature.properties.health > 0.9 ? '#FFD700' : '#00CED1',
            size: Math.random() * 30 + 20,
            speed: Math.random() * 2 + 1
          },
          geometry: {
            type: 'Point',
            coordinates: [
              center[0] + (Math.random() - 0.5) * 0.02,
              center[1] + (Math.random() - 0.5) * 0.02
            ]
          }
        })
      }
    })

    // 创建粒子图层
    const particleSource = new (window as any).Loca.GeoJSONSource({
      data: { type: 'FeatureCollection', features: particleData }
    })

    this.particleLayer = new (window as any).Loca.ScatterLayer({
      zIndex: 130,
      opacity: 0.8,
      depth: false
    })

    this.particleLayer.setSource(particleSource)

    this.particleLayer.setStyle({
      unit: 'meter',
      size: (index: number, feature: any) => feature.properties.size,
      color: (index: number, feature: any) => feature.properties.color,
      altitude: (index: number, feature: any) => Math.random() * 5000 + 10000
    })

    // 粒子悬浮动画 - 简化配置
    this.particleLayer.addAnimate({
      key: 'altitude',
      value: [0, 1000],
      duration: 2000,
      easing: 'CubicInOut',
      random: true
    })

    this.loca.add(this.particleLayer)
    console.log('[Polygon3DHealthEffect] 粒子特效已创建')
  }

  /**
   * 获取多边形中心点
   */
  private getPolygonCenter(coords: number[][]): number[] {
    let sumX = 0
    let sumY = 0
    coords.forEach(([lng, lat]) => {
      sumX += lng
      sumY += lat
    })
    return [sumX / coords.length, sumY / coords.length]
  }

  /**
   * 颜色变暗工具函数
   */
  private darkenColor(color: string, factor: number): string {
    const hex = color.replace('#', '')
    const r = Math.floor(parseInt(hex.substr(0, 2), 16) * factor)
    const g = Math.floor(parseInt(hex.substr(2, 2), 16) * factor)
    const b = Math.floor(parseInt(hex.substr(4, 2), 16) * factor)
    return `rgb(${r}, ${g}, ${b})`
  }
}
