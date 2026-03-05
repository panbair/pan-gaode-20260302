/**
 * 6. 3D建筑特效（AMap.Buildings 方案）
 * 使用高德地图原生 Buildings 图层的 areas 配置高亮指定区域的建筑
 */

import { BaseEffect } from './baseEffect'

export class Buildings3DEffect extends BaseEffect {
  private buildings: any = null
  private infoWindow: any = null
  private polygons: any[] = []

  apply(): void {
    console.log('[Buildings3DEffect] 开始应用3D建筑特效')

    if (!this.map || !this.AMap) {
      console.error('[Buildings3DEffect] 地图或 AMap 未初始化')
      return
    }

    // 设置3D视角
    this.map.setPitch(50)
    this.map.setRotation(0)
    this.map.setCenter([121.5025, 31.2397])
    this.map.setZoom(17)

    // 创建 Buildings 图层
    this.buildings = new this.AMap.Buildings({
      zIndex: 130,
      zooms: [16, 20],
      hideWithoutStyle: false
    })
    this.buildings.setMap(this.map)

    // 定义预设的高亮区域（上海陆家嘴附近） - 设计为精美的多边形
    const areas = [
      {
        // 区域1：陆家嘴核心区 - 六边形设计（半透明）
        color1: '4000bfff', // 楼顶颜色 - 深天蓝（25%透明度）
        color2: '401e90ff', // 楼面颜色 - 道奇蓝（25%透明度）
        path: [
          [121.5035, 31.2420],
          [121.5050, 31.2405],
          [121.5055, 31.2385],
          [121.5045, 31.2365],
          [121.5025, 31.2360],
          [121.5010, 31.2375],
          [121.5005, 31.2395],
          [121.5015, 31.2415]
        ]
      },
      {
        // 区域2：外滩附近 - 星形设计（半透明）
        color1: '40ff1493', // 楼顶颜色 - 深粉红（25%透明度）
        color2: '40dc143c', // 楼面颜色 - 猩红（25%透明度）
        path: [
          [121.4950, 31.2418],
          [121.4965, 31.2412],
          [121.4978, 31.2415],
          [121.4990, 31.2405],
          [121.4995, 31.2390],
          [121.4992, 31.2375],
          [121.4982, 31.2365],
          [121.4968, 31.2362],
          [121.4955, 31.2370],
          [121.4945, 31.2385],
          [121.4948, 31.2400]
        ]
      },
      {
        // 区域3：浦东商业区 - 菱形设计（放大版，半透明）
        color1: '409932cc', // 楼顶颜色 - 暗兰花（25%透明度）
        color2: '408a2be2', // 楼面颜色 - 蓝紫（25%透明度）
        path: [
          [121.5080, 31.2400],
          [121.5110, 31.2375],
          [121.5080, 31.2350],
          [121.5050, 31.2375]
        ]
      }
    ]

    // 设置 Buildings 图层样式
    this.buildings.setStyle({
      hideWithoutStyle: false,
      areas: areas
    })

    // 创建边界多边形显示区域范围
    const colors = ['#00bfff', '#ff1493', '#9932cc']
    const fillColors = ['#87ceeb', '#ffb6c1', '#dda0dd']
    areas.forEach((area: any, index: number) => {
      const polygon = new this.AMap.Polygon({
        bubble: true,
        fillColor: fillColors[index],
        fillOpacity: 0.25,
        strokeColor: colors[index],
        strokeWeight: 2,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        path: area.path,
        map: this.map
      })
      this.polygons.push(polygon)

      // 为每个区域添加点击事件
      polygon.on('click', (event: any) => {
        console.log(`[Buildings3DEffect] 点击区域 ${index + 1}`)
        this.showAreaInfo(area.path, index + 1, area.color1, area.color2)
      })
    })

    // 创建信息窗口
    this.infoWindow = new this.AMap.InfoWindow({
      offset: new this.AMap.Pixel(0, -30),
      closeWhenClickMap: true
    })

    console.log('[Buildings3DEffect] 3D建筑特效应用完成')
    console.log('[Buildings3DEffect] 已设置3个高亮区域（陆家嘴、外滩、浦东商业区），点击多边形可查看区域信息')

    // 存储清理函数
    this.setResult({
      layer: this.buildings,
      cleanup: () => {
        if (this.buildings) {
          this.buildings.setMap(null)
          this.buildings = null
        }
        if (this.infoWindow) {
          this.infoWindow.close()
          this.infoWindow = null
        }
        this.polygons.forEach((polygon) => {
          polygon.setMap(null)
        })
        this.polygons = []
        this.map.setPitch(0)
        this.map.setRotation(0)
      }
    })
  }

  /**
   * 显示区域信息
   */
  private showAreaInfo(path: [number, number][], areaIndex: number, roofColor: string, wallColor: string): void {
    // 计算中心点
    const center = this.calculateCenter(path)

    const areaNames = ['陆家嘴核心区', '外滩区域', '浦东商业区']
    const areaName = areaNames[areaIndex - 1] || `区域 ${areaIndex}`

    this.infoWindow.setContent(`
      <div style="padding: 12px; min-width: 220px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 15px; font-weight: 600;">${areaName}</h4>
        <div style="background: linear-gradient(90deg, #${roofColor.slice(0, 6)} 0%, #${wallColor.slice(0, 6)} 100%); height: 4px; border-radius: 2px; margin-bottom: 10px;"></div>
        <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.6;">
          <strong>经度:</strong> ${center.lng.toFixed(6)}<br>
          <strong>纬度:</strong> ${center.lat.toFixed(6)}<br>
          <strong>楼顶颜色:</strong> #${roofColor.slice(0, 6)}<br>
          <strong>楼面颜色:</strong> #${wallColor.slice(0, 6)}
        </p>
        <p style="margin: 10px 0 0 0; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 8px;">
          该区域内的建筑已高亮显示
        </p>
      </div>
    `)
    this.infoWindow.setPosition([center.lng, center.lat])
    this.infoWindow.open(this.map)
  }

  /**
   * 计算多边形的中心点
   */
  private calculateCenter(path: [number, number][]): { lng: number; lat: number } {
    let lng = 0
    let lat = 0
    let validCount = 0

    path.forEach((point) => {
      if (Array.isArray(point) && point.length === 2 && !isNaN(point[0]) && !isNaN(point[1])) {
        lng += point[0]
        lat += point[1]
        validCount++
      }
    })

    if (validCount === 0) {
      console.error('[Buildings3DEffect] 没有有效的坐标点')
      return { lng: 0, lat: 0 }
    }

    return {
      lng: lng / validCount,
      lat: lat / validCount
    }
  }
}
