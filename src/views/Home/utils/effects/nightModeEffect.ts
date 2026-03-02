/**
 * 7. 夜晚模式特效
 */

import { BaseEffect } from './baseEffect'

export class NightModeEffect extends BaseEffect {
  apply(): void {
    console.log('[NightModeEffect] 开始应用夜晚模式特效')

    this.map.setMapStyle('amap://styles/dark')
    this.map.setSkyColor('#000033')
    this.setView({
      pitch: 50,
      zoom: 17
    })

    this.map.setAmbientLight({
      color: '#ffffff',
      intensity: 0.3
    })

    console.log('[NightModeEffect] 夜晚模式特效创建完成')
  }
}
