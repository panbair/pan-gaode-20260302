/**
 * 9. 飞行轨迹特效 V2.0 - 升级版
 * 特性：
 * - 时间轴控制多个时期的航班数据切换
 * - 多类型连接线（国内/国际航线）
 * - 三层散点系统（中心点、出发地、目的地）
 * - 动态标签图层显示城市名称
 * - 3D弧线平滑路径动画
 * - 流光效果与渐变色彩
 */

import { BaseEffect } from './baseEffect'

interface FlightData {
  year: string
  label: string
  routes: Array<{
    from: string
    to: string
    type: number // 0: 国内, 1: 国际
  }>
}

export class FlightPathEffect extends BaseEffect {
  private linkLayer: any = null
  private scatterLayer1: any = null
  private scatterLayer2: any = null
  private centerPointLayer: any = null
  private labelLayer: any = null
  private lineGeoMap: Record<string, any> = {}
  private scatterGeoMap: Record<string, any> = {}
  private currentTimePeriod: string = '2020'

  // 中国主要城市坐标
  private cityCoords: Record<string, [number, number]> = {
    北京: [116.397428, 39.90923],
    上海: [121.467428, 31.22923],
    广州: [113.264385, 23.129112],
    深圳: [114.057868, 22.543099],
    成都: [104.066541, 30.572269],
    杭州: [120.15507, 30.274077],
    西安: [108.940174, 34.341574],
    武汉: [114.305393, 30.593099],
    重庆: [106.551557, 29.563009],
    南京: [118.796877, 32.060255],
    天津: [117.200983, 39.084158],
    沈阳: [123.431475, 41.805698],
    香港: [114.169361, 22.319303],
    长沙: [112.938814, 28.228209],
    厦门: [118.089425, 24.479833],
    青岛: [120.355173, 36.082982],
    大连: [121.614682, 38.914003],
    昆明: [102.832891, 24.880095],
    郑州: [113.625368, 34.7466],
    济南: [117.120519, 36.651039],
    福州: [119.306239, 26.075302],
    哈尔滨: [126.642464, 45.756967]
  }

  // 不同时期的航线数据（全部为国内航线）
  private flightPeriods: FlightData[] = [
    {
      year: '1990',
      label: '90年代',
      routes: [
        { from: '北京', to: '上海', type: 0 },
        { from: '北京', to: '广州', type: 0 },
        { from: '北京', to: '成都', type: 0 },
        { from: '北京', to: '西安', type: 0 },
        { from: '上海', to: '广州', type: 0 }
      ]
    },
    {
      year: '2000',
      label: '2000年代',
      routes: [
        { from: '北京', to: '上海', type: 0 },
        { from: '北京', to: '广州', type: 0 },
        { from: '北京', to: '成都', type: 0 },
        { from: '北京', to: '西安', type: 0 },
        { from: '上海', to: '广州', type: 0 },
        { from: '北京', to: '深圳', type: 0 },
        { from: '上海', to: '杭州', type: 0 },
        { from: '广州', to: '深圳', type: 0 }
      ]
    },
    {
      year: '2010',
      label: '2010年代',
      routes: [
        { from: '北京', to: '上海', type: 0 },
        { from: '北京', to: '广州', type: 0 },
        { from: '北京', to: '成都', type: 0 },
        { from: '北京', to: '西安', type: 0 },
        { from: '上海', to: '广州', type: 0 },
        { from: '北京', to: '深圳', type: 0 },
        { from: '上海', to: '杭州', type: 0 },
        { from: '广州', to: '深圳', type: 0 },
        { from: '成都', to: '重庆', type: 0 },
        { from: '北京', to: '武汉', type: 0 },
        { from: '上海', to: '南京', type: 0 },
        { from: '广州', to: '香港', type: 0 }
      ]
    },
    {
      year: '2020',
      label: '2020年代',
      routes: [
        { from: '北京', to: '上海', type: 0 },
        { from: '北京', to: '广州', type: 0 },
        { from: '北京', to: '成都', type: 0 },
        { from: '北京', to: '西安', type: 0 },
        { from: '上海', to: '广州', type: 0 },
        { from: '北京', to: '深圳', type: 0 },
        { from: '上海', to: '杭州', type: 0 },
        { from: '广州', to: '深圳', type: 0 },
        { from: '成都', to: '重庆', type: 0 },
        { from: '北京', to: '武汉', type: 0 },
        { from: '上海', to: '南京', type: 0 },
        { from: '广州', to: '香港', type: 0 },
        { from: '北京', to: '天津', type: 0 },
        { from: '北京', to: '沈阳', type: 0 },
        { from: '上海', to: '青岛', type: 0 },
        { from: '广州', to: '长沙', type: 0 },
        { from: '成都', to: '昆明', type: 0 }
      ]
    }
  ]

  apply(): void {
    console.log('[FlightPathEffect V2] 开始应用飞行轨迹特效')

    if (!this.loca) {
      console.warn('[FlightPathEffect V2] loca 未初始化，无法应用特效')
      return
    }

    const Loca = (window as any).Loca

    // 设置3D视角
    this.setView({
      pitch: 45,
      zoom: 6,
      center: [105, 35]
    })
    console.log('[FlightPathEffect V2] 调整地图视角为 3D 模式')

    // 创建标签图层
    this.labelLayer = new this.AMap.LabelsLayer({
      rejectMapMask: true,
      collision: true,
      animation: true
    })
    this.map.add(this.labelLayer)
    console.log('[FlightPathEffect V2] 创建标签图层')

    // 创建连接线图层 - 使用 PulseLinkLayer 实现流光动画
    this.linkLayer = new Loca.PulseLinkLayer({
      zIndex: 20,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })
    console.log('[FlightPathEffect V2] 创建 PulseLinkLayer')

    // 创建散点图层 - 国内航线起点/终点
    this.scatterLayer1 = new Loca.ScatterLayer({
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })
    console.log('[FlightPathEffect V2] 创建 ScatterLayer')

    // 创建中心点图层（北京）
    this.centerPointLayer = new Loca.ScatterLayer({
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })

    const centerPoint = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: this.cityCoords['北京']
            }
          }
        ]
      }
    })
    this.centerPointLayer.setSource(centerPoint)
    this.centerPointLayer.setStyle({
      size: [500000, 500000],
      unit: 'meter',
      texture: this.createCenterPointIcon(),
      height: 500000,
      altitudeScale: 1,
      shape: 'cylinder'
    })
    this.loca.add(this.centerPointLayer)
    console.log('[FlightPathEffect V2] 添加中心点图层')

    // 生成所有时期的数据
    this.generateAllPeriodsData()

    // 设置默认显示2020年数据
    this.switchPeriod('2020')

    // 添加所有图层到loca
    this.loca.add(this.linkLayer)
    this.loca.add(this.scatterLayer1)

    // 启动动画
    this.loca.animate.start()
    console.log('[FlightPathEffect V2] 动画已启动')

    // 设置结果
    this.setResult({
      linkLayer: this.linkLayer,
      scatterLayer: this.scatterLayer1,
      labelLayer: this.labelLayer,
      centerPointLayer: this.centerPointLayer,
      switchPeriod: (period: string) => this.switchPeriod(period)
    })

    console.log('[FlightPathEffect V2] 特效应用完成')
  }

  // 生成所有时期的数据
  private generateAllPeriodsData() {
    console.log('[FlightPathEffect V2] 开始生成所有时期数据')

    this.flightPeriods.forEach(period => {
      const lineFeatures = period.routes.map((route, idx) => {
        const fromCoords = this.cityCoords[route.from]
        const toCoords = this.cityCoords[route.to]

        if (!fromCoords || !toCoords) {
          console.warn(`[FlightPathEffect V2] 无法找到城市坐标: ${route.from} 或 ${route.to}`)
          return null
        }

        // 计算距离用于设置弧线高度
        const distance = this.calculateDistance(fromCoords, toCoords)

        return {
          type: 'Feature',
          properties: {
            type: route.type,
            distance: distance,
            fromCity: route.from,
            toCity: route.to
          },
          geometry: {
            type: 'LineString',
            coordinates: [fromCoords, toCoords]
          }
        }
      }).filter(Boolean)

      // 连接线数据
      this.lineGeoMap[period.year] = new Loca.GeoJSONSource({
        data: {
          type: 'FeatureCollection',
          features: lineFeatures
        }
      })

      // 散点数据
      const scatterFeatures = period.routes.map(route => {
        const coords = this.cityCoords[route.to]
        return {
          type: 'Feature',
          properties: {
            city: route.to,
            cityName: route.to
          },
          geometry: {
            type: 'Point',
            coordinates: coords
          }
        }
      })

      this.scatterGeoMap[period.year] = {
        type: 'FeatureCollection',
        features: scatterFeatures
      }
    })

    console.log('[FlightPathEffect V2] 所有时期数据生成完成')
  }

  // 切换时期
  private switchPeriod(year: string) {
    console.log(`[FlightPathEffect V2] 切换到 ${year} 年代`)

    this.currentTimePeriod = year

    // 更新连接线数据源
    const lineSource = this.lineGeoMap[year]
    if (lineSource) {
      this.linkLayer.setSource(lineSource)
      console.log(`[FlightPathEffect V2] 更新连接线数据源: ${year}`)
    }

    // 设置连接线样式
    this.linkLayer.setStyle({
      unit: 'meter',
      dash: [40000, 0, 40000, 0],
      lineWidth: [4000, 1000],
      smoothSteps: 100,
      height: (index: number, item: any) => {
        const distance = item?.link?.properties?.distance ?? 100
        return distance * 125000 + 12500
      },
      speed: (index: number, prop: any) => 10000 + Math.random() * 50000,
      flowLength: 150000,
      lineColors: (index: number, item: any) => {
        const colors = [
          ['rgb(255,221,0)', 'rgb(255,141,27)'],
          ['rgb(0,255,255)', 'rgb(0,255,0)'],
          ['rgb(255,0,128)', 'rgb(255,105,180)'],
          ['rgb(138,43,226)', 'rgb(75,0,130)'],
          ['rgb(255,69,0)', 'rgb(255,140,0)'],
          ['rgb(100,149,237)', 'rgb(70,130,180)'],
          ['rgb(255,99,71)', 'rgb(255,69,0)'],
          ['rgb(0,255,127)', 'rgb(60,179,113)'],
          ['rgb(255,215,0)', 'rgb(218,165,32)'],
          ['rgb(50,205,50)', 'rgb(34,139,34)'],
          ['rgb(255,20,147)', 'rgb(255,105,180)'],
          ['rgb(0,191,255)', 'rgb(30,144,255)'],
          ['rgb(255,69,0)', 'rgb(255,140,0)'],
          ['rgb(138,43,226)', 'rgb(75,0,130)'],
          ['rgb(255,0,255)', 'rgb(238,130,238)'],
          ['rgb(0,250,154)', 'rgb(46,139,87)'],
          ['rgb(255,215,0)', 'rgb(255,140,0)']
        ]
        return colors[index % colors.length]
      },
      headColor: 'rgba(255, 255, 0, 1)',
      trailColor: 'rgb(255,84,84)',
      maxHeightScale: 0.3,
      lineType: 'arc'
    })

    // 更新散点数据源
    const scatterData = this.scatterGeoMap[year]
    if (scatterData) {
      this.scatterLayer1.setSource(
        new Loca.GeoJSONSource({
          data: scatterData
        })
      )

      // 设置散点样式
      this.scatterLayer1.setStyle({
        size: [300000, 300000],
        unit: 'meter',
        texture: this.createDomesticIcon(),
        height: (index: number) => 200000 + index * 50000,
        altitudeScale: 1,
        shape: 'cylinder'
      })

      // 更新标签
      this.updateLabels(scatterData)
    }
  }

  // 更新标签图层
  private updateLabels(scatterData: any) {
    if (!this.labelLayer) return

    this.labelLayer.clear()

    // 添加城市标签
    scatterData.features.forEach((item: any) => {
      const marker = new this.AMap.LabelMarker({
        name: item.properties.cityName,
        position: item.geometry.coordinates,
        zooms: [2, 22],
        opacity: 1,
        zIndex: 10,
        text: {
          content: item.properties.city,
          direction: 'bottom',
          offset: [0, -5],
          style: {
            fontSize: 12,
            fontWeight: 'normal',
            fillColor: '#fff'
          }
        }
      })
      this.labelLayer.add(marker)
    })

    // 添加北京标签
    const beijingMarker = new this.AMap.LabelMarker({
      name: 'china',
      position: this.cityCoords['北京'],
      zooms: [2, 22],
      opacity: 1,
      zIndex: 10,
      rank: 100,
      text: {
        content: '北京',
        direction: 'bottom',
        offset: [0, -5],
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          fillColor: '#FFD700'
        }
      }
    })
    this.labelLayer.add(beijingMarker)

    console.log(`[FlightPathEffect V2] 更新标签完成`)
  }

  // 计算两点间距离（度）
  private calculateDistance(
    from: [number, number],
    to: [number, number]
  ): number {
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    return Math.sqrt(dx * dx + dy * dy)
  }

  // 创建中心点图标（SVG）
  private createCenterPointIcon(): string {
    const svg = `
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255,215,0,1)" />
            <stop offset="100%" stop-color="rgba(255,215,0,0)" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="32" fill="url(#centerGrad)" />
        <circle cx="32" cy="32" r="8" fill="#FFD700" />
      </svg>
    `
    return 'data:image/svg+xml;base64,' + btoa(svg)
  }

  // 创建国内航线图标（青色）
  private createDomesticIcon(): string {
    const svg = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="domesticGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(37,205,234,1)" />
            <stop offset="100%" stop-color="rgba(37,205,234,0)" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill="url(#domesticGrad)" />
        <circle cx="16" cy="16" r="4" fill="#25CDEA" />
      </svg>
    `
    return 'data:image/svg+xml;base64,' + btoa(svg)
  }



  // 清理资源
  protected cleanup(): void {
    console.log('[FlightPathEffect V2] 开始清理资源')

    if (this.labelLayer) {
      this.labelLayer.clear()
      this.map.remove(this.labelLayer)
    }

    if (this.linkLayer) {
      this.loca.remove(this.linkLayer)
    }

    if (this.scatterLayer1) {
      this.loca.remove(this.scatterLayer1)
    }

    if (this.centerPointLayer) {
      this.loca.remove(this.centerPointLayer)
    }

    super.cleanup()
    console.log('[FlightPathEffect V2] 资源清理完成')
  }
}
