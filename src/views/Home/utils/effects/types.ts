/**
 * 特效类型定义
 */

export interface EffectContext {
  map: any
  loca: any
  AMap: any
}

export interface EffectResult {
  cleanup?: () => void
  layer?: any
  markers?: any[]
  polylines?: any[]
  [key: string]: any
}
