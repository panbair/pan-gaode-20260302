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
import { Heatmap3DEffect } from './heatmap3DEffect'
import { ParticleFlowEffect } from './particleFlowEffect'
import { SunnyWeatherEffect } from './sunnyWeatherEffect'
import { NightWeatherEffect } from './nightWeatherEffect'
import { MarkerClusterEffect } from './markerClusterEffect'
import { FlightPathEffect } from './flightPathEffect'
import { AreaCoverageEffect } from './areaCoverageEffect'
import { MassivePointsEffect } from './massivePointsEffect'
import { LabelsLayerEffect } from './labelsLayerEffect'
import { Prism3DEffect } from './prism3DEffect'
import { HolographicLabelEffect } from './holographicLabelEffect'
import { TriColorLightBuildingEffect } from './triColorLightBuildingEffect'
import { Polygon3DHealthEffect } from './polygon3DHealthEffect'
import { FlowMapEffect } from './flowMapEffect'
import { NeonCityEffect } from './neonCityEffect'
import { BuildingFloorEffect } from './buildingFloorEffect'
import { EconomyWaveEffect } from './economyWaveEffect'
import { TrafficEvolutionEffect } from './trafficEvolutionEffect'

console.log('[EffectFactory] BuildingFloorEffect imported:', BuildingFloorEffect)

export class EffectFactory {
  private static effectClasses: Record<number, new (context: EffectContext) => BaseEffect> = {
    1: PulseMarkerEffect,
    2: RunningPathEffect,
    3: HeatAreaEffect,
    4: Buildings3DEffect,
    5: ParticleFlowEffect,
    6: SunnyWeatherEffect,
    7: NightWeatherEffect,
    8: MarkerClusterEffect,
    9: FlightPathEffect,
    10: AreaCoverageEffect,
    11: MassivePointsEffect,
    12: LabelsLayerEffect,
    13: Heatmap3DEffect,
    14: Prism3DEffect,
    15: HolographicLabelEffect,
    16: TriColorLightBuildingEffect,
    17: Polygon3DHealthEffect,
    18: FlowMapEffect,
    19: NeonCityEffect,
    20: BuildingFloorEffect,
    21: EconomyWaveEffect,
    22: TrafficEvolutionEffect
  }

  static {
    console.log('[EffectFactory] effectClasses initialized:', Object.keys(this.effectClasses))
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

  /**
   * 注册新特效
   */
  static register(effectId: number, effectClass: new (context: EffectContext) => BaseEffect): void {
    this.effectClasses[effectId] = effectClass
  }

  /**
   * 批量注册特效
   */
  static registerBatch(effects: Record<number, new (context: EffectContext) => BaseEffect>): void {
    Object.assign(this.effectClasses, effects)
  }
}
