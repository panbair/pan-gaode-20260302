/**
 * 3D热力图特效
 * 使用 AMap.HeatMap 实现3D热力图效果
 */

import { BaseEffect } from './baseEffect'

export class Heatmap3DEffect extends BaseEffect {
  private heatmap: any = null

  apply(): void {
    console.log('[Heatmap3DEffect] 开始应用3D热力图特效')

    if (!this.map || !this.AMap) {
      console.error('[Heatmap3DEffect] 地图或 AMap 未初始化')
      return
    }

    // 设置3D视角
    this.map.setPitch(70)
    this.map.setRotation(0)
    this.map.setCenter([121.5025, 31.2397])
    this.map.setZoom(16)

    // 3D热力图配置
    const heatmapOpts = {
      // 3D 相关的参数
      '3d': {
        // 热度转高度的曲线控制参数
        heightBezier: [0.4, 0.2, 0.4, 0.8],
        // 取样精度，值越小，曲面效果越精细
        gridSize: 2,
        // 高度缩放比例
        heightScale: 1
      },
      // 热力图的半径
      radius: 25,
      // 热力图透明度
      opacity: [0, 0.8]
    }

    // 初始化heatmap对象
    this.heatmap = new this.AMap.HeatMap(this.map, heatmapOpts)

    // 生成模拟热力图数据（上海陆家嘴区域）
    const heatmapData = this.generateHeatmapData()

    // 设置数据集
    this.heatmap.setDataSet({
      data: heatmapData,
      max: 100
    })

    console.log('[Heatmap3DEffect] 3D热力图应用完成')
    console.log('[Heatmap3DEffect] 热力图数据点数:', heatmapData.length)

    // 存储清理函数
    this.setResult({
      layer: this.heatmap,
      cleanup: () => {
        if (this.heatmap) {
          this.heatmap.setMap(null)
          this.heatmap = null
        }
        this.map.setPitch(0)
        this.map.setRotation(0)
      }
    })
  }

  /**
   * 生成模拟热力图数据
   * 在上海陆家嘴区域生成随机的热力点
   */
  private generateHeatmapData(): any[] {
    const data: any[] = []

    // 陆家嘴中心点
    const centerLng = 121.5025
    const centerLat = 31.2397

    // 生成多个热点区域
    const hotspots = [
      { lng: 121.5035, lat: 31.2405, intensity: 90, count: 50 },  // 东方明珠附近
      { lng: 121.5050, lat: 31.2390, intensity: 85, count: 45 },  // 金茂大厦附近
      { lng: 121.5065, lat: 31.2375, intensity: 80, count: 40 },  // 上海中心附近
      { lng: 121.5000, lat: 31.2380, intensity: 75, count: 35 },  // 陆家嘴地铁站
      { lng: 121.4980, lat: 31.2400, intensity: 70, count: 30 },  // 外滩附近
      { lng: 121.5080, lat: 31.2410, intensity: 65, count: 25 },  // 世纪大道
      { lng: 121.5040, lat: 31.2360, intensity: 60, count: 20 },  // 陆家嘴环路
    ]

    // 为每个热点区域生成数据点
    hotspots.forEach((hotspot) => {
      for (let i = 0; i < hotspot.count; i++) {
        // 在热点周围生成随机偏移
        const lngOffset = (Math.random() - 0.5) * 0.006
        const latOffset = (Math.random() - 0.5) * 0.006

        // 热度值随距离衰减
        const distance = Math.sqrt(lngOffset * lngOffset + latOffset * latOffset)
        const heatValue = Math.max(10, hotspot.intensity - distance * 10000)

        data.push({
          lng: hotspot.lng + lngOffset,
          lat: hotspot.lat + latOffset,
          count: Math.floor(heatValue)
        })
      }
    })

    // 添加一些随机分布的背景数据点
    for (let i = 0; i < 100; i++) {
      const lngOffset = (Math.random() - 0.5) * 0.02
      const latOffset = (Math.random() - 0.5) * 0.02

      data.push({
        lng: centerLng + lngOffset,
        lat: centerLat + latOffset,
        count: Math.floor(Math.random() * 40 + 10)
      })
    }

    return data
  }
}
