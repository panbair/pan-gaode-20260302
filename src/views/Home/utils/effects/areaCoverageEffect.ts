/**
 * 10. 区域覆盖特效
 */

import { BaseEffect } from './baseEffect'

export class AreaCoverageEffect extends BaseEffect {
  apply(): void {
    console.log('[AreaCoverageEffect] 开始应用区域线条覆盖特效')

    const paths = [
      [
        [116.397428, 39.90923],
        [116.407428, 39.91923],
        [116.417428, 39.90923],
        [116.407428, 39.89923]
      ],
      [
        [116.387428, 39.89923],
        [116.397428, 39.90923],
        [116.387428, 39.91923],
        [116.377428, 39.90923]
      ]
    ]

    const colors = ['#FF33FF', '#1791fc']
    const layers: any[] = []
    console.log('[AreaCoverageEffect] 创建区域线条')

    paths.forEach((path, index) => {
      const polygon = new this.AMap.Polygon({
        path: path,
        strokeColor: colors[index],
        strokeWeight: 3,
        strokeOpacity: 1,
        fillOpacity: 0,
        fillColor: colors[index],
        zIndex: 50
      })
      polygon.setMap(this.map)
      layers.push(polygon)
    })

    // 添加网格线条
    const gridLines: any[] = []
    paths.forEach((path, index) => {
      const bounds = this.calculateBounds(path)

      // 横向网格线
      for (let i = 0; i < 5; i++) {
        const lat = bounds.minLat + ((bounds.maxLat - bounds.minLat) * (i + 0.5)) / 5
        const line = new this.AMap.Polyline({
          path: [
            [bounds.minLng, lat],
            [bounds.maxLng, lat]
          ],
          strokeColor: colors[index],
          strokeWeight: 1,
          strokeOpacity: 0.5
        })
        line.setMap(this.map)
        gridLines.push(line)
      }

      // 纵向网格线
      for (let i = 0; i < 5; i++) {
        const lng = bounds.minLng + ((bounds.maxLng - bounds.minLng) * (i + 0.5)) / 5
        const line = new this.AMap.Polyline({
          path: [
            [lng, bounds.minLat],
            [lng, bounds.maxLat]
          ],
          strokeColor: colors[index],
          strokeWeight: 1,
          strokeOpacity: 0.5
        })
        line.setMap(this.map)
        gridLines.push(line)
      }
    })

    this.setResult({ layers: [...layers, ...gridLines] })
    console.log('[AreaCoverageEffect] 区域线条已创建')
  }

  private calculateBounds(path: [number, number][]): {
    minLng: number
    maxLng: number
    minLat: number
    maxLat: number
  } {
    const lngs = path.map(p => p[0])
    const lats = path.map(p => p[1])
    return {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats)
    }
  }
}
