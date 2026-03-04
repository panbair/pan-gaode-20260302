/**
 * 文字图层特效 - 基于 Loca LabelsLayer
 * 参考源码实现文字标注
 */

import { BaseEffect } from './baseEffect'
import { GeoDataGenerator } from '../geoDataGenerator'

export class LabelsLayerEffect extends BaseEffect {
  apply(): void {
    console.log('[LabelsLayerEffect] 开始应用文字图层特效')

    if (!this.isMapAvailable()) {
      console.warn('[LabelsLayerEffect] map 未初始化，无法应用特效')
      return
    }

    this.setView({
      pitch: 50,
      zoom: 12
    })

    const LabelLayer = (this.AMap as any).LabelsLayer
    const LabelMarker = (this.AMap as any).LabelMarker

    // 创建文字图层
    const labelLayer = new LabelLayer({
      rejectMapMask: true,
      collision: true,
      animation: true,
    })
    this.map.add(labelLayer)

    // 生成测试数据
    const points = GeoDataGenerator.generateRandomPoints(20, {
      lng: 116.397428,
      lat: 39.90923,
    }, 0.05)

    // 添加文字标注
    points.forEach((point, index) => {
      const labelsMarker = new LabelMarker({
        name: `标注 ${index + 1}`,
        position: [point.lng, point.lat],
        zooms: [2, 22],
        opacity: 1,
        zIndex: 10 + index,
        text: {
          content: `点位 ${index + 1}`,
          direction: 'bottom',
          offset: [0, -5],
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            fillColor: '#ffffff',
            strokeColor: '#333333',
            strokeWidth: 2,
          },
        },
        icon: {
          type: 'image',
          image: 'https://a.amap.com/Loca/static/static/orange.png',
          size: [24, 24],
          anchor: 'bottom-center',
        },
      })
      labelLayer.add(labelsMarker)
    })

    this.setResult({ labelLayer, points })
    console.log('[LabelsLayerEffect] 文字图层已添加')
  }
}
