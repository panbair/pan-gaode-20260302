/**
 * 12. 雨雪天气特效
 */

import { BaseEffect } from './baseEffect'

export class RainSnowWeatherEffect extends BaseEffect {
  apply(): void {
    console.log('[RainSnowWeatherEffect] 开始应用雨雪天气特效')

    if (typeof this.map.setWeather === 'function') {
      this.map.setWeather({
        type: 'rain',
        intensity: 0.5
      })
    } else {
      console.warn('setWeather method not available, using fallback')
    }

    if (typeof this.map.setSkyColor === 'function') {
      this.map.setSkyColor('#808080')
    }

    console.log('[RainSnowWeatherEffect] 雨雪天气特效创建完成')
  }
}
