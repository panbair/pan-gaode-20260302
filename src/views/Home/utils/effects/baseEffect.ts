/**
 * 基础特效类
 * 所有特效类的父类
 */

import type { EffectContext, EffectResult } from './types'

export abstract class BaseEffect {
  protected map: any
  protected loca: any
  protected AMap: any
  protected result: EffectResult = {}

  constructor(context: EffectContext) {
    this.map = context.map
    this.loca = context.loca
    this.AMap = context.AMap
  }

  /**
   * 应用特效 - 子类必须实现
   */
  abstract apply(): void

  /**
   * 清除特效
   */
  cleanup(): void {
    // 清理 markers
    if (this.result.markers) {
      this.result.markers.forEach((marker: any) => {
        if (marker.stopMove) marker.stopMove()
        if (marker.setMap) marker.setMap(null)
      })
    }

    // 清理 polylines
    if (this.result.polylines) {
      this.result.polylines.forEach((polyline: any) => {
        if (polyline.setMap) polyline.setMap(null)
      })
    }

    // 清理 passedPolylines
    if (this.result.passedPolylines) {
      this.result.passedPolylines.forEach((polyline: any) => {
        if (polyline.setMap) polyline.setMap(null)
      })
    }

    // 清理 layer
    if (this.result.layer) {
      if (this.result.layer.destroy) this.result.layer.destroy()
      if (this.result.layer.setMap) this.result.layer.setMap(null)
    }

    // 清理 sunRays
    if (this.result.sunRays) {
      if (this.result.sunRays.destroy) this.result.sunRays.destroy()
    }

    // 清理 sunParticles
    if (this.result.sunParticles) {
      if (this.result.sunParticles.destroy) this.result.sunParticles.destroy()
    }

    // 清理 floatingParticles
    if (this.result.floatingParticles) {
      if (this.result.floatingParticles.destroy) this.result.floatingParticles.destroy()
    }

    // 清理 warmCircles
    if (this.result.warmCircles) {
      if (this.result.warmCircles.destroy) this.result.warmCircles.destroy()
    }

    // 清理 moon
    if (this.result.moon) {
      if (this.result.moon.destroy) this.result.moon.destroy()
    }

    // 清理 moonGlow
    if (this.result.moonGlow) {
      if (this.result.moonGlow.destroy) this.result.moonGlow.destroy()
    }

    // 清理 stars
    if (this.result.stars) {
      if (this.result.stars.destroy) this.result.stars.destroy()
    }

    // 清理 cluster (MarkerCluster)
    if (this.result.cluster) {
      if (this.result.cluster.setData) {
        this.result.cluster.setData([])
        this.result.cluster.setMap(null)
      }
    }

    // 清理 fireflies
    if (this.result.fireflies) {
      if (this.result.fireflies.destroy) this.result.fireflies.destroy()
    }

    // 清理 layers 数组
    if (this.result.layers) {
      this.result.layers.forEach((layer: any) => {
        if (layer.destroy) layer.destroy()
      })
    }

    // 自定义清理函数
    if (this.result.cleanup) {
      this.result.cleanup()
    }

    this.result = {}
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
    if (options.zoom) this.map.setZoom(options.zoom)
    if (options.pitch !== undefined) this.map.setPitch(options.pitch)
    if (options.rotation !== undefined) this.map.setRotation(options.rotation)
    if (options.center) this.map.setCenter(options.center)
  }
}
