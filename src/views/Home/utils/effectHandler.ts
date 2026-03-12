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
  private locaLayers: any[] = []
  private activeEffects: Map<number, any> = new Map() // 存储多个激活的特效实例

  constructor(map: any, loca: any, AMap: any) {
    this.map = map
    this.loca = loca
    this.AMap = AMap
  }

  /**
   * 清除当前特效（清除所有特效）
   */
  clear(): void {
    console.log('[MapEffectHandler] 开始清除所有特效')

    // 清理所有激活的特效
    for (const [effectId, effect] of this.activeEffects.entries()) {
      try {
        effect.cleanup()
      } catch (error) {
        console.error(`[MapEffectHandler] 清理特效 ID ${effectId} 时出错:`, error)
      }
    }

    this.activeEffects.clear()
    this.currentEffect = null

    // 停止 Loca 动画
    if (this.loca) {
      try {
        this.loca.animate.stop()
      } catch (error) {
        // 静默处理
      }

      // 手动清理 Loca 图层，避免调用 clear() 导致内部错误
      try {
        // 移除所有已添加的图层
        while (this.locaLayers.length > 0) {
          const layer = this.locaLayers.pop()
          if (layer) {
            try {
              layer.setData([])
              this.loca.remove(layer)
            } catch (e) {
              // 静默处理单个图层清理错误
            }
          }
        }
      } catch (error) {
        console.error('[MapEffectHandler] 清理 Loca 图层时出错:', error)
      }
    }

    // 清理 Three.js 容器
    const threeContainer = document.getElementById('three-container')
    if (threeContainer) {
      threeContainer.remove()
    }

    // 重置地图状态
    if (this.map) {
      try {
        this.map.clearMap()
        this.map.setMapStyle('amap://styles/normal')
        // 恢复默认视角
        this.map.setPitch(0)
        if (typeof this.map.setRotation === 'function') {
          this.map.setRotation(0)
        }
        this.map.setZoom(13)
      } catch (error) {
        console.error('[MapEffectHandler] 重置地图时出错:', error)
      }
    }

    console.log('[MapEffectHandler] 所有特效清除完成')
  }

  /**
   * 应用指定特效（支持多选）
   */
  applyEffect(effectId: number): void {
    // 检查特效是否已存在
    if (this.activeEffects.has(effectId)) {
      console.warn(`[MapEffectHandler] 特效 ID ${effectId} 已存在，跳过应用`)
      return
    }

    // 创建上下文
    const context: EffectContext = {
      map: this.map,
      loca: this.loca,
      AMap: this.AMap
    }

    // 使用工厂创建特效
    const effect = EffectFactory.create(effectId, context)

    if (effect) {
      try {
        effect.apply()
        this.activeEffects.set(effectId, effect)
        this.currentEffect = effect // 更新当前特效为最新应用的
        console.log(`[MapEffectHandler] 特效 ID ${effectId} 应用成功`)
      } catch (error) {
        console.error(`[MapEffectHandler] 应用特效 ID ${effectId} 失败:`, error)
        throw error
      }
    } else {
      console.warn(`[MapEffectHandler] 无法创建特效 ID: ${effectId}`)
    }
  }

  /**
   * 清除指定特效
   */
  clearEffect(effectId: number): void {
    console.log(`[MapEffectHandler] 开始清除特效 ID: ${effectId}`)

    const effect = this.activeEffects.get(effectId)
    if (!effect) {
      console.warn(`[MapEffectHandler] 特效 ID ${effectId} 不存在`)
      return
    }

    try {
      effect.cleanup()
      this.activeEffects.delete(effectId)

      // 如果清除的是当前特效，更新引用
      if (this.currentEffect === effect) {
        this.currentEffect = null
      }

      console.log(`[MapEffectHandler] 特效 ID ${effectId} 清除成功`)
    } catch (error) {
      console.error(`[MapEffectHandler] 清除特效 ID ${effectId} 失败:`, error)
      throw error
    }
  }

  /**
   * 检查特效是否激活
   */
  isEffectActive(effectId: number): boolean {
    return this.activeEffects.has(effectId)
  }

  /**
   * 获取所有激活的特效ID
   */
  getActiveEffectIds(): number[] {
    return Array.from(this.activeEffects.keys())
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
