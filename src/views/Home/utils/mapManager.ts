/**
 * 地图管理器 - 统一管理地图实例
 * 基于源码学习优化，支持单例模式
 */

import type { EffectContext } from './effects/types'

export class MapManager {
  private static instance: MapManager | null = null
  private map: any = null
  private loca: any = null
  private AMap: any = null
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): MapManager {
    if (!MapManager.instance) {
      MapManager.instance = new MapManager()
    }
    return MapManager.instance
  }

  /**
   * 初始化地图和 Loca
   */
  async initialize(containerId: string, options: {
    zoom?: number
    center?: [number, number]
    viewMode?: '2D' | '3D'
    pitch?: number
    mapStyle?: string
  } = {}): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve()
    }

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const AMapLoader = await import('@amap/amap-jsapi-loader')
        const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '67ffe728401f177ab6267db726d099c5'

        window._AMapSecurityConfig = {
          securityJsCode: AMAP_KEY,
        }

        this.AMap = await AMapLoader.load({
          key: AMAP_KEY,
          version: '2.0',
          plugins: ['AMap.Buildings', 'AMap.MarkerCluster', 'AMap.MoveAnimation', 'AMap.LabelsLayer'],
          Loca: {
            version: '2.0.0',
          },
        })

        window.AMap = this.AMap

        const DEFAULT_CENTER = [116.397428, 39.90923]

        this.map = new this.AMap.Map(containerId, {
          zoom: options.zoom || 13,
          center: options.center || DEFAULT_CENTER,
          viewMode: options.viewMode || '3D',
          pitch: options.pitch || 0,
          mapStyle: options.mapStyle || 'amap://styles/normal',
          showBuildingBlock: true,
          showLabel: true,
          features: ['bg', 'road', 'building'],
          pitchEnable: true,
          rotateEnable: true,
          doubleClickZoom: false,
          showIndoorMap: false,
        })

        await new Promise<void>((resolveMap, rejectMap) => {
          const timeout = setTimeout(() => {
            rejectMap(new Error('地图加载超时'))
          }, 15000)

          this.map.on('complete', () => {
            clearTimeout(timeout)
            console.log('[MapManager] 地图加载完成')
            resolveMap()
          })

          this.map.on('error', (err: any) => {
            clearTimeout(timeout)
            rejectMap(new Error(`地图加载错误: ${err.message}`))
          })
        })

        this.loca = new (window as any).Loca.Container({
          map: this.map,
          viewMode: '3D',
          animateEnable: true,
        })

        console.log('[MapManager] Loca 初始化成功')
        this.isInitialized = true
        resolve()
      } catch (error) {
        console.error('[MapManager] 初始化失败:', error)
        this.initializationPromise = null
        reject(error)
      }
    })

    return this.initializationPromise
  }

  /**
   * 获取地图上下文
   */
  getContext(): EffectContext {
    return {
      map: this.map,
      loca: this.loca,
      AMap: this.AMap,
    }
  }

  /**
   * 检查地图是否已初始化
   */
  isMapReady(): boolean {
    return this.isInitialized && !!this.map
  }

  /**
   * 检查 Loca 是否可用
   */
  isLocaReady(): boolean {
    return this.isInitialized && !!this.loca
  }

  /**
   * 获取地图实例
   */
  getMap(): any {
    return this.map
  }

  /**
   * 获取 Loca 实例
   */
  getLoca(): any {
    return this.loca
  }

  /**
   * 获取 AMap 对象
   */
  getAMap(): any {
    return this.AMap
  }

  /**
   * 设置地图视角
   */
  setView(options: {
    zoom?: number
    pitch?: number
    rotation?: number
    center?: [number, number]
  }): void {
    if (!this.map) return

    try {
      if (options.zoom !== undefined) this.map.setZoom(options.zoom)
      if (options.pitch !== undefined) this.map.setPitch(options.pitch)
      if (options.rotation !== undefined) this.map.setRotation(options.rotation)
      if (options.center) this.map.setCenter(options.center)
    } catch (error) {
      console.error('[MapManager] 设置视角失败:', error)
    }
  }

  /**
   * 添加视角动画
   */
  animateView(options: {
    center?: [number, number]
    zoom?: number
    pitch?: number
    rotation?: number
    duration?: number
  }): Promise<void> {
    return new Promise((resolve) => {
      if (!this.map || !this.loca) {
        resolve()
        return
      }

      const animateConfig: any = {}
      const duration = options.duration || 2000

      if (options.center) {
        animateConfig.center = {
          value: options.center,
          control: [this.map.getCenter().toArray(), options.center],
          timing: [0.42, 0, 0.4, 1],
          duration,
        }
      }

      if (options.zoom !== undefined) {
        animateConfig.zoom = {
          value: options.zoom,
          control: [[0, this.map.getZoom()], [1, options.zoom]],
          timing: [0, 0, 1, 1],
          duration,
        }
      }

      if (options.pitch !== undefined) {
        animateConfig.pitch = {
          value: options.pitch,
          control: [[0, this.map.getPitch()], [1, options.pitch]],
          timing: [0, 0, 1, 1],
          duration,
        }
      }

      if (options.rotation !== undefined) {
        animateConfig.rotation = {
          value: options.rotation,
          control: [[0, this.map.getRotation()], [1, options.rotation]],
          timing: [0, 0, 1, 1],
          duration,
        }
      }

      if (Object.keys(animateConfig).length > 0) {
        this.loca.viewControl.addAnimates([animateConfig], () => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * 清除地图
   */
  clear(): void {
    if (this.map) {
      this.map.clearMap()
      this.map.setMapStyle('amap://styles/normal')
      this.setView({
        zoom: 13,
        pitch: 0,
        rotation: 0,
      })
    }

    if (this.loca) {
      try {
        this.loca.animate.stop()
        // 不调用 clear() 方法，避免内部错误
      } catch (error) {
        // 静默处理
      }
    }
  }

  /**
   * 销毁地图和 Loca
   */
  destroy(): void {
    if (this.loca) {
      try {
        this.loca.destroy()
      } catch (error) {
        console.error('[MapManager] 销毁 Loca 失败:', error)
      }
      this.loca = null
    }

    if (this.map) {
      try {
        this.map.destroy()
      } catch (error) {
        console.error('[MapManager] 销毁地图失败:', error)
      }
      this.map = null
    }

    this.AMap = null
    this.isInitialized = false
    this.initializationPromise = null
  }

  /**
   * 重置实例（用于测试）
   */
  static resetInstance(): void {
    if (MapManager.instance) {
      MapManager.instance.destroy()
      MapManager.instance = null
    }
  }
}
