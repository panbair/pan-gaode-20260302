/**
 * 8. 标记聚合特效
 */

import { BaseEffect } from './baseEffect'

export class MarkerClusterEffect extends BaseEffect {
  apply(): void {
    console.log('[MarkerClusterEffect] 开始应用标记聚合特效')

    const markers: any[] = []
    const positions = Array.from({ length: 50 }, (_, i) => [
      116.397428 + (Math.random() - 0.5) * 0.1,
      39.90923 + (Math.random() - 0.5) * 0.1
    ])

    positions.forEach((pos, index) => {
      const marker = new this.AMap.Marker({
        position: pos,
        title: `标记 ${index + 1}`
      })
      markers.push(marker)
    })

    let layer: any
    if (this.AMap.MarkerClusterer) {
      layer = new this.AMap.MarkerClusterer(this.map, markers, {
        gridSize: 80,
        minClusterSize: 2,
        maxZoom: 15,
        averageCenter: true
      })
      this.setResult({ layer })
    } else {
      markers.forEach(m => m.setMap(this.map))
      this.setResult({ markers })
    }

    console.log('[MarkerClusterEffect] 标记聚合特效创建完成')
  }
}
