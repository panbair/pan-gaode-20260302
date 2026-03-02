/**
 * 6. 晴天天气特效
 */

import { BaseEffect } from './baseEffect'

export class SunnyWeatherEffect extends BaseEffect {
  apply(): void {
    console.log('[SunnyWeatherEffect] 开始应用晴天天气特效')

    this.map.setSkyColor('#87CEEB')
    this.map.setSun({
      position: [0, 0, 500000],
      color: '#fff5cc',
      intensity: 0.8
    })

    console.log('[SunnyWeatherEffect] 晴天天气特效创建完成')
  }
}
