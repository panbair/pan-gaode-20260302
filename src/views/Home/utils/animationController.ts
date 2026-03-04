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
  private currentAnimations: Map<string, any> = new Map()
  private isAnimating = false
  private lastAnimationTime = 0
  private animationCooldown = 100 // 动画冷却时间 (ms)

  constructor(loca: any) {
    this.loca = loca
  }

  /**
   * 执行视角动画
   */
  async animateView(config: AnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      if (!this.loca) {
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

      const animateConfig: any = {}
      const duration = config.duration || 2000
      const map = this.loca.map

      if (config.center) {
        animateConfig.center = {
          value: config.center,
          control: [map.getCenter().toArray(), config.center],
          timing: [0.42, 0, 0.4, 1],
          duration,
        }
      }

      if (config.zoom !== undefined) {
        animateConfig.zoom = {
          value: config.zoom,
          control: [[0, map.getZoom()], [1, config.zoom]],
          timing: [0, 0, 1, 1],
          duration,
        }
      }

      if (config.pitch !== undefined) {
        animateConfig.pitch = {
          value: config.pitch,
          control: [[0, map.getPitch()], [1, config.pitch]],
          timing: [0, 0, 1, 1],
          duration,
        }
      }

      if (config.rotation !== undefined) {
        animateConfig.rotation = {
          value: config.rotation,
          control: [[0, map.getRotation()], [1, config.rotation]],
          timing: [0, 0, 1, 1],
          duration,
        }
      }

      if (Object.keys(animateConfig).length > 0) {
        const animationId = `view-${Date.now()}`
        this.currentAnimations.set(animationId, { config: animateConfig })

        this.loca.viewControl.addAnimates([animateConfig], () => {
          this.currentAnimations.delete(animationId)
          resolve()
        })
      } else {
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
