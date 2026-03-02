/**
 * 特效处理类 - 重构版本
 * 使用特效工厂模式管理所有特效
 */

import type { EffectContext } from './effects/types'
import { EffectFactory } from './effects/effectFactory'

export class MapEffectHandler {
  private map: any = null
  private loca: any = null
  private currentEffect: any = null
  private AMap: any = null

  constructor(map: any, loca: any, AMap: any) {
    this.map = map
    this.loca = loca
    this.AMap = AMap
  }

  /**
   * 清除当前特效
   */
  clear(): void {
    if (this.currentEffect) {
      this.currentEffect.cleanup()
      this.currentEffect = null
    }

    if (this.loca) {
      this.loca.animate.stop()
      if (typeof this.loca.clear === 'function') {
        this.loca.clear()
      }
    }

    // 重置地图状态
    if (this.map) {
      this.map.clearMap()
      this.map.setMapStyle('amap://styles/normal')
      if (typeof this.map.setWeather === 'function') {
        this.map.setWeather({ type: 'none' })
      }
      // 不再切换viewMode，保持3D模式
      // setPitch(0) 在3D模式下就是俯视2D效果
      this.map.setPitch(0)
      if (typeof this.map.setRotation === 'function') {
        this.map.setRotation(0)
      }
      this.map.setZoom(13)
    }
  }

  /**
   * 应用指定特效
   */
  applyEffect(effectId: number): void {
    // 先清除当前特效
    this.clear()

    // 创建上下文
    const context: EffectContext = {
      map: this.map,
      loca: this.loca,
      AMap: this.AMap
    }

    // 使用工厂创建特效
    this.currentEffect = EffectFactory.create(effectId, context)

    if (this.currentEffect) {
      this.currentEffect.apply()
    } else {
      console.warn(`[MapEffectHandler] 无法创建特效 ID: ${effectId}`)
    }
  }

  /**
   * 获取当前特效
   */
  getCurrentEffect(): any {
    return this.currentEffect
  }

  /**
   * 获取所有可用的特效 ID
   */
  getAvailableEffectIds(): number[] {
    return EffectFactory.getAvailableEffectIds()
  }
}
