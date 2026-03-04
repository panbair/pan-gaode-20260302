/**
 * 性能监控工具
 * 用于监控特效性能、FPS、内存使用等
 */

export interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  effectCount: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null
  private frames: number[] = []
  private lastFrameTime = performance.now()
  private maxFrameSamples = 60
  private renderStartTime = 0
  private effectCount = 0

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * 开始渲染计时
   */
  startRender(): void {
    this.renderStartTime = performance.now()
  }

  /**
   * 结束渲染计时
   */
  endRender(): number {
    const renderTime = performance.now() - this.renderStartTime
    return renderTime
  }

  /**
   * 记录帧
   */
  tick(): void {
    const now = performance.now()
    const delta = now - this.lastFrameTime
    this.lastFrameTime = now

    const fps = 1000 / delta
    this.frames.push(fps)

    if (this.frames.length > this.maxFrameSamples) {
      this.frames.shift()
    }
  }

  /**
   * 获取平均 FPS
   */
  getFPS(): number {
    if (this.frames.length === 0) return 0
    const sum = this.frames.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.frames.length)
  }

  /**
   * 获取内存使用情况 (MB)
   */
  getMemoryUsage(): number {
    if ((performance as any).memory) {
      return Math.round((performance as any).memory.usedJSHeapSize / 1048576)
    }
    return 0
  }

  /**
   * 增加特效计数
   */
  incrementEffectCount(): void {
    this.effectCount++
  }

  /**
   * 减少特效计数
   */
  decrementEffectCount(): void {
    this.effectCount = Math.max(0, this.effectCount - 1)
  }

  /**
   * 重置特效计数
   */
  resetEffectCount(): void {
    this.effectCount = 0
  }

  /**
   * 获取性能指标
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.getFPS(),
      memoryUsage: this.getMemoryUsage(),
      renderTime: this.endRender(),
      effectCount: this.effectCount
    }
  }

  /**
   * 重置监控
   */
  reset(): void {
    this.frames = []
    this.lastFrameTime = performance.now()
    this.renderStartTime = 0
    this.effectCount = 0
  }

  /**
   * 启动 FPS 监控
   */
  startFPSMonitoring(interval: number = 1000): () => void {
    const intervalId = setInterval(() => {
      this.tick()
    }, interval)

    return () => {
      clearInterval(intervalId)
    }
  }
}
