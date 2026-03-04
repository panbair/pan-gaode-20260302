/**
 * 基础特效类
 * 所有特效类的父类
 */

import type { EffectContext, EffectResult } from './types'
import { logger } from '../logger'
import { PerformanceMonitor } from '../performanceMonitor'

export abstract class BaseEffect {
  protected map: any
  protected loca: any
  protected AMap: any
  protected result: EffectResult = {}
  protected locaLayers: any[] = []
  protected performanceMonitor: PerformanceMonitor
  protected log: ReturnType<typeof logger.child>

  constructor(context: EffectContext) {
    this.map = context.map
    this.loca = context.loca
    this.AMap = context.AMap
    this.performanceMonitor = PerformanceMonitor.getInstance()
    this.log = logger.child(this.constructor.name)
  }

  /**
   * 应用特效 - 子类必须实现
   */
  abstract apply(): void

  /**
   * 清除特效
   */
  cleanup(): void {
    try {
      this.log.debug('开始清理特效')

      // 先停止 Loca 动画，防止渲染循环访问已释放的资源
      if (this.loca && this.loca.animate) {
        try {
          this.loca.animate.stop()
        } catch (e) {
          // 静默处理
        }
      }

      // 清理所有注册的 Loca 图层
      for (const layer of this.locaLayers) {
        if (layer) {
          try {
            if (layer.setData) {
              layer.setData([])
            }
            if (this.loca && this.loca.remove) {
              this.loca.remove(layer)
            }
          } catch (e) {
            // 静默处理
          }
        }
      }
      this.locaLayers = []

      const resultKeys = Object.keys(this.result)

      for (const key of resultKeys) {
        const value = this.result[key]

        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            this.safeCleanup(item)
          })
        } else {
          this.safeCleanup(value)
        }
      }

      if (this.result.cleanup && typeof this.result.cleanup === 'function') {
        this.result.cleanup()
      }

      this.result = {}
      this.performanceMonitor.decrementEffectCount()

      this.log.debug('特效清理完成')
    } catch (error) {
      this.log.error('清理特效时出错:', error)
    }
  }

  private safeCleanup(item: any): void {
    if (!item) return

    try {
      // 先停止移动动画
      if (item.stopMove && typeof item.stopMove === 'function') {
        item.stopMove()
      }
      // 对于 Loca 层，先清空数据再移除地图
      if (item.setData && typeof item.setData === 'function') {
        item.setData([])
      }
      // 从地图移除（在 setData 之后）
      if (item.setMap && typeof item.setMap === 'function') {
        item.setMap(null)
      }
      // 销毁对象
      if (item.destroy && typeof item.destroy === 'function') {
        item.destroy()
      }
      // 最后尝试移除（避免重复调用 setMap）
      if (item.remove && typeof item.remove === 'function' && !item.setMap) {
        item.remove()
      }
    } catch (error) {
      // 静默处理清理错误，避免干扰用户体验
    }
  }

  /**
   * 获取特效结果
   */
  getResult(): EffectResult {
    return this.result
  }

  /**
   * 保存结果
   */
  protected setResult(result: EffectResult): void {
    this.result = { ...this.result, ...result }
  }

  /**
   * 设置地图视角
   */
  protected setView(options: {
    zoom?: number
    pitch?: number
    rotation?: number
    center?: [number, number]
  }): void {
    try {
      if (options.zoom) this.map.setZoom(options.zoom)
      if (options.pitch !== undefined) this.map.setPitch(options.pitch)
      if (options.rotation !== undefined) this.map.setRotation(options.rotation)
      if (options.center) this.map.setCenter(options.center)
    } catch (error) {
      console.error('[BaseEffect] 设置视角失败:', error)
    }
  }

  /**
   * 检查 Loca 是否可用
   */
  protected isLocaAvailable(): boolean {
    return !!this.loca && typeof this.loca.add === 'function'
  }

  /**
   * 检查地图是否可用
   */
  protected isMapAvailable(): boolean {
    return !!this.map && typeof this.map.setZoom === 'function'
  }

  /**
   * 添加 Loca 图层并注册到清理列表
   */
  protected addLocaLayer(layer: any): void {
    if (this.loca && layer) {
      try {
        this.loca.add(layer)
        this.locaLayers.push(layer)
        this.performanceMonitor.incrementEffectCount()
      } catch (error) {
        this.log.error('添加 Loca 图层失败:', error)
      }
    }
  }
}
