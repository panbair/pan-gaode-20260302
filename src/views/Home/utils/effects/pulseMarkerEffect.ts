/**
 * 1. 脉冲标记特效
 */

import { BaseEffect } from './baseEffect'

export class PulseMarkerEffect extends BaseEffect {
  apply(): void {
    console.log('[PulseMarkerEffect] 开始应用脉冲标记特效')

    const positions = [
      [116.397428, 39.90923],
      [116.407428, 39.91923],
      [116.387428, 39.89923],
      [116.417428, 39.92923],
      [116.377428, 39.88923]
    ]

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', '#9b59b6']

    const markers: any[] = []

    positions.forEach((pos, index) => {
      const content = `
        <div class="pulse-marker" style="
          width: 20px;
          height: 20px;
          background: ${colors[index]};
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
            70% { box-shadow: 0 0 0 20px rgba(255, 107, 107, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
          }
        </style>
      `

      const marker = new this.AMap.Marker({
        position: pos,
        map: this.map,
        content: content,
        offset: new this.AMap.Pixel(-10, -10)
      })

      markers.push(marker)
    })

    this.setResult({ markers })
    console.log('[PulseMarkerEffect] 脉冲标记创建完成')
  }
}
