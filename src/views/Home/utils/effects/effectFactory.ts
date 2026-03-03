/**
 * 特效工厂类
 * 负责创建和管理所有特效实例
 */

import type { EffectContext } from './types'
import { BaseEffect } from './baseEffect'
import { PulseMarkerEffect } from './pulseMarkerEffect'
import { RunningPathEffect } from './runningPathEffect'
import { HeatAreaEffect } from './heatAreaEffect'
import { HeatMapEffect } from './heatMapEffect'
import { Buildings3DEffect } from './buildings3DEffect'
import { ParticleFlowEffect } from './particleFlowEffect'
import { SunnyWeatherEffect } from './sunnyWeatherEffect'
import { NightModeEffect } from './nightModeEffect'
import { MarkerClusterEffect } from './markerClusterEffect'
import { FlightPathEffect } from './flightPathEffect'
import { AreaCoverageEffect } from './areaCoverageEffect'
import { MassivePointsEffect } from './massivePointsEffect'
import { RainSnowWeatherEffect } from './rainSnowWeatherEffect'

export class EffectFactory {
  private static effectClasses: Record<number, new (context: EffectContext) => BaseEffect> = {
    1: PulseMarkerEffect,
    2: RunningPathEffect,
    3: HeatAreaEffect,
    4: Buildings3DEffect,
    5: ParticleFlowEffect,
    6: SunnyWeatherEffect,
    7: NightModeEffect,
    8: MarkerClusterEffect,
    9: FlightPathEffect,
    10: AreaCoverageEffect,
    11: MassivePointsEffect,
    12: RainSnowWeatherEffect
  }

  /**
   * 创建特效实例
   */
  static create(effectId: number, context: EffectContext): BaseEffect | null {
    const EffectClass = this.effectClasses[effectId]
    if (!EffectClass) {
      console.warn(`[EffectFactory] 未找到特效 ID: ${effectId}`)
      return null
    }
    return new EffectClass(context)
  }

  /**
   * 获取所有可用的特效 ID
   */
  static getAvailableEffectIds(): number[] {
    return Object.keys(this.effectClasses).map(Number)
  }
}
