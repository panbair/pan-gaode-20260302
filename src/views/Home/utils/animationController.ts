/**
 * 动画控制器 - 统一管理地图动画
 * 基于 Loca 动画系统优化
 */

export interface AnimationConfig {
  center?: [number, number]
  zoom?: number
  pitch?: number
  rotation?: number
  duration?: number
}

export class AnimationController {
  private loca: any
  private map: any
  private currentAnimations: Map<string, any> = new Map()
  private isAnimating = false
  private lastAnimationTime = 0
  private animationCooldown = 100 // 动画冷却时间 (ms)

  constructor(loca: any, map?: any) {
    this.loca = loca
    // 传入 map 或从 loca 中获取
    this.map = map || (loca && loca.map)
  }

  /**
   * 执行视角动画
   */
  async animateView(config: AnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      if (!this.map) {
        console.warn('[AnimationController] map 未初始化')
        resolve()
        return
      }

      // 防抖：避免频繁动画
      const now = Date.now()
      if (now - this.lastAnimationTime < this.animationCooldown) {
        resolve()
        return
      }
      this.lastAnimationTime = now

      console.log('[AnimationController] 执行视角动画:', config)

      const duration = config.duration || 2000

      try {
        // 使用高德地图的原生动画 API
        const center = config.center || this.map.getCenter().toArray()
        const zoom = config.zoom !== undefined ? config.zoom : this.map.getZoom()

        this.map.panTo(center, zoom, false, duration)

        setTimeout(() => {
          if (config.pitch !== undefined) {
            this.map.setPitch(config.pitch)
          }
          if (config.rotation !== undefined) {
            this.map.setRotation(config.rotation)
          }
          console.log('[AnimationController] 动画完成')
          resolve()
        }, duration)
      } catch (error) {
        console.error('[AnimationController] 动画执行失败:', error)
        resolve()
      }
    })
  }

  /**
   * 执行多个动画
   */
  async animateSequence(animations: AnimationConfig[]): Promise<void> {
    for (const animation of animations) {
      await this.animateView(animation)
    }
  }

  /**
   * 取消所有动画
   */
  cancelAllAnimations(): void {
    if (this.loca && this.loca.viewControl) {
      try {
        // Loca 2.0+ 版本停止所有动画
        if (this.loca.viewControl.stop) {
          this.loca.viewControl.stop()
        }
      } catch (error) {
        // 静默处理错误
      }
    }
    this.currentAnimations.clear()
  }

  /**
   * 开始 Loca 动画
   */
  start(): void {
    if (this.loca) {
      this.loca.animate.start()
    }
  }

  /**
   * 停止 Loca 动画
   */
  stop(): void {
    if (this.loca) {
      this.loca.animate.stop()
    }
  }

  /**
   * 暂停 Loca 动画
   */
  pause(): void {
    if (this.loca) {
      this.loca.animate.pause()
    }
  }

  /**
   * 获取当前活跃动画数量
   */
  getActiveAnimationCount(): number {
    return this.currentAnimations.size
  }
}
