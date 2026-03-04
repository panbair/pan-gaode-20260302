/**
 * 9. 飞行轨迹特效
 * 使用 Loca PulseLinkLayer 创建3D弧线路径动画
 */

import { BaseEffect } from './baseEffect'

export class FlightPathEffect extends BaseEffect {
  apply(): void {
    console.log('[FlightPathEffect] 开始应用飞行轨迹特效')

    if (!this.loca) {
      console.warn('[FlightPathEffect] loca 未初始化，无法应用特效')
      return
    }

    // 设置3D视角
    this.setView({
      pitch: 50,
      zoom: 13
    })
    console.log('[FlightPathEffect] 调整地图视角为 3D 模式')

    const Loca = (window as any).Loca

    // 创建多条飞行轨迹
    const geoData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [117.207428, 39.91923],
              [118.507428, 39.90923]
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [115.887428, 40.80923],
              [115.487428, 41.60923]
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [117.247428, 39.08923],
              [117.847428, 38.16923]
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [118.787428, 39.75923],
              [119.607428, 39.93923]
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [114.507428, 38.03923],
              [114.467428, 36.60923]
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [116.397428, 35.00923],
              [117.197428, 34.20923]
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [116.397428, 39.90923],
              [121.467428, 31.22923],
              [120.167428, 30.27923]
            ]
          }
        }
      ]
    }
    console.log('[FlightPathEffect] 飞行轨迹数据:', geoData)

    const layer = new Loca.PulseLinkLayer({
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22]
    })
    console.log('[FlightPathEffect] 创建 PulseLinkLayer:', layer)

    const geoSource = new Loca.GeoJSONSource({
      data: geoData
    })
    console.log('[FlightPathEffect] 创建 GeoJSONSource:', geoSource)

    layer.setSource(geoSource)
    console.log('[FlightPathEffect] 设置数据源完成')

    // 创建小车标记
    const markers: any[] = []
    const paths = geoData.features.map(f => f.geometry.coordinates)
    console.log('[FlightPathEffect] 提取路径:', paths)

    paths.forEach((path, index) => {
      const marker = new this.AMap.Marker({
        map: this.map,
        position: path[0],
        icon: '/car.png',
        offset: new this.AMap.Pixel(-13, -26),
        autoRotation: true,
        zIndex: 200 + index
      })
      markers.push(marker)
      console.log(`[FlightPathEffect] 创建小车 ${index + 1}, 起始位置:`, path[0])

      marker.moveAlong(path, {
        duration: 8000 + index * 1000,
        autoRotation: true
      })
      console.log(`[FlightPathEffect] 小车 ${index + 1} 动画已启动, 时长: ${8000 + index * 1000}ms`)
    })

    layer.setStyle({
      unit: 'meter',
      dash: [40000, 0, 40000, 0],
      lineWidth: [2000, 500],
      smoothSteps: 100,
      height: (index: number, feat: any) => {
        if (!feat || !feat.geometry || !feat.geometry.coordinates) {
          return 100000
        }
        const coords = feat.geometry.coordinates
        const distance = Math.sqrt(
          Math.pow(coords[coords.length - 1][0] - coords[0][0], 2) +
            Math.pow(coords[coords.length - 1][1] - coords[0][1], 2)
        )
        return distance * 500000 + 50000
      },
      speed: (index: number, prop: any) => 10000 + Math.random() * 50000,
      flowLength: 150000,
      lineColors: (index: number, feat: any) => {
        const colors = [
          ['rgb(255,221,0)', 'rgb(255,141,27)'],
          ['rgb(0,255,255)', 'rgb(0,255,0)'],
          ['rgb(255,0,128)', 'rgb(255,105,180)'],
          ['rgb(138,43,226)', 'rgb(75,0,130)'],
          ['rgb(255,69,0)', 'rgb(255,140,0)'],
          ['rgb(100,149,237)', 'rgb(70,130,180)'],
          ['rgb(255,99,71)', 'rgb(255,69,0)']
        ]
        return colors[index % colors.length]
      },
      headColor: 'rgba(255, 255, 0, 1)',
      trailColor: 'rgb(255,84,84)',
      maxHeightScale: 0.3
    })
    console.log('[FlightPathEffect] 设置样式完成')

    this.addLocaLayer(layer)
    console.log('[FlightPathEffect] 图层已添加到 loca')

    this.setResult({
      layer,
      markers,
      cleanup: () => {
        markers.forEach(marker => marker.stopMove())
      }
    })

    this.loca.animate.start()
    console.log('[FlightPathEffect] 动画已启动')
  }
}
