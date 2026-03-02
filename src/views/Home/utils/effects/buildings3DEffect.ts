/**
 * 4. 3D建筑特效
 * 使用 Three.js 创建独立的3D建筑展示（与地图分离）
 */

import { BaseEffect } from './baseEffect'

export class Buildings3DEffect extends BaseEffect {
  private scene: any = null
  private camera: any = null
  private renderer: any = null
  private animationId: any = null
  private buildings: any[] = []

  apply(): void {
    console.log('[Buildings3DEffect] 开始应用3D建筑特效')

    // 检查 Three.js 是否加载
    if (!(window as any).THREE) {
      console.log('[Buildings3DEffect] Three.js 未加载，开始加载...')
      // 动态加载 Three.js
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/three@0.132.2/build/three.min.js'
      script.onload = () => {
        console.log('[Buildings3DEffect] Three.js 加载成功')
        this.init3DScene()
      }
      script.onerror = () => {
        console.error('[Buildings3DEffect] Three.js 加载失败')
      }
      document.head.appendChild(script)
    } else {
      console.log('[Buildings3DEffect] Three.js 已加载，直接初始化')
      this.init3DScene()
    }
  }

  private init3DScene(): void {
    const THREE = (window as any).THREE
    if (!THREE) {
      console.error('[Buildings3DEffect] THREE 不可用')
      return
    }

    console.log('[Buildings3DEffect] 初始化Three.js场景')

    // 获取地图容器
    const container = document.getElementById('amap-container')
    if (!container) {
      console.error('[Buildings3DEffect] 找不到地图容器')
      return
    }

    // 检查是否已经存在容器，先清理
    const existingContainer = document.getElementById('three-container')
    if (existingContainer) {
      console.log('[Buildings3DEffect] 清理现有容器')
      this.cleanup()
    }

    // 创建场景 - 设置为透明背景
    this.scene = new THREE.Scene()
    // 不设置 background，让背景保持透明

    // 创建相机
    const width = container.clientWidth
    const height = container.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    this.camera.position.set(20, 20, 20)
    this.camera.lookAt(0, 0, 0)

    // 创建渲染器 - 启用 alpha: true 实现透明背景
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,  // 允许透明背景
      premultipliedAlpha: true
    })
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // 禁用自动清除，保留透明度
    this.renderer.autoClear = false

    // 创建画布容器 - 设置 pointerEvents: none 让鼠标穿透到地图
    const canvasContainer = document.createElement('div')
    canvasContainer.id = 'three-container'
    canvasContainer.style.position = 'absolute'
    canvasContainer.style.top = '0'
    canvasContainer.style.left = '0'
    canvasContainer.style.width = '100%'
    canvasContainer.style.height = '100%'
    canvasContainer.style.zIndex = '100'
    canvasContainer.style.pointerEvents = 'none'  // 让鼠标事件穿透到地图
    container.appendChild(canvasContainer)

    canvasContainer.appendChild(this.renderer.domElement)

    // 添加光源 - 增强亮度以适应叠加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    // 不创建地面和网格，让地图显示出来
    // 地面和网格会遮挡地图，移除它们

    // 创建3D建筑
    this.create3DBuildings(THREE)

    // 添加鼠标交互控制
    this.addMouseControls(canvasContainer, THREE)

    // 开始动画循环
    this.animate()

    console.log('[Buildings3DEffect] Three.js场景创建完成')

    // 存储清理函数
    this.setResult({
      layer: { container: canvasContainer },
      cleanup: () => {
        this.cleanup()
      }
    })
  }

  private create3DBuildings(THREE: any): void {
    console.log('[Buildings3DEffect] 创建3D建筑')

    // 建筑颜色渐变 - 从底部到顶部
    const colors = [
      0x667eea, // 紫色
      0x764ba2,
      0x6B8DD6,
      0x8E37D7,
      0x9C27B0,
      0x673AB7,
      0x3F51B5,
      0x2196F3,
      0x03A9F4,
      0x00BCD4
    ]

    // 创建多个建筑
    const buildingCount = 30
    for (let i = 0; i < buildingCount; i++) {
      // 随机建筑参数
      const width = 1 + Math.random() * 2
      const depth = 1 + Math.random() * 2
      const height = 2 + Math.random() * 8

      // 随机位置
      const x = (Math.random() - 0.5) * 30
      const z = (Math.random() - 0.5) * 30

      // 根据高度选择颜色（越高颜色越亮）
      const colorIndex = Math.floor((height - 2) / 8 * (colors.length - 1))
      const color = colors[Math.min(colorIndex, colors.length - 1)]

      // 创建建筑几何体
      const geometry = new THREE.BoxGeometry(width, height, depth)

      // 使用渐变材质 - 提高透明度以实现半透明叠加
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7  // 降低透明度，让地图透过建筑显示
      })

      const building = new THREE.Mesh(geometry, material)
      building.position.set(x, height / 2, z)
      building.castShadow = true
      building.receiveShadow = true

      this.scene.add(building)
      this.buildings.push(building)

      // 添加建筑边缘线
      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      })
      const line = new THREE.LineSegments(edges, lineMaterial)
      building.add(line)

      // 添加窗户效果
      this.addWindows(THREE, building, width, height, depth)
    }

    // 添加城市灯光
    this.addCityLights(THREE)

    console.log(`[Buildings3DEffect] 创建了 ${buildingCount} 个3D建筑`)
  }

  private addWindows(THREE: any, building: any, width: number, height: number, depth: number): void {
    const windowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffaa,
      transparent: true,
      opacity: 1.0
    })

    const windowGeometry = new THREE.PlaneGeometry(0.2, 0.25)
    const windowsPerFloor = Math.max(2, Math.floor(width * 2.5))
    const floors = Math.max(2, Math.floor(height))

    for (let floor = 0; floor < floors; floor++) {
      for (let w = 0; w < windowsPerFloor; w++) {
        if (Math.random() > 0.4) {
          const window = new THREE.Mesh(windowGeometry, windowMaterial)
          window.position.set(
            -width/2 + 0.15 + w * (width / windowsPerFloor),
            -height/2 + 0.3 + floor * (height / floors) + 0.2,
            depth/2 + 0.01
          )
          building.add(window)
        }
      }
    }
  }

  private addCityLights(THREE: any): void {
    const lightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff6600]
    
    for (let i = 0; i < 15; i++) {
      const light = new THREE.PointLight(
        lightColors[Math.floor(Math.random() * lightColors.length)],
        0.8,
        8
      )
      light.position.set(
        (Math.random() - 0.5) * 25,
        0.5 + Math.random() * 8,
        (Math.random() - 0.5) * 25
      )
      this.scene.add(light)
      this.buildings.push(light)
    }
  }

  private addMouseControls(container: any, THREE: any): void {
    // 禁用鼠标控制，让用户可以操作底下的高德地图
    // 因为 pointerEvents: none，这些事件不会触发
    // Three.js 建筑将作为静态展示层叠加在地图上

    console.log('[Buildings3DEffect] 已禁用 Three.js 鼠标控制，允许操作高德地图')
  }

  private animate(): void {
    if (!this.renderer || !this.scene || !this.camera) return

    this.animationId = requestAnimationFrame(() => {
      this.animate()
    })

    // 渲染
    this.renderer.render(this.scene, this.camera)
  }

  private cleanup(): void {
    console.log('[Buildings3DEffect] 清理Three.js场景')

    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    this.buildings.forEach((building) => {
      this.scene.remove(building)
    })
    this.buildings = []

    if (this.renderer) {
      this.renderer.dispose()
    }

    const canvasContainer = document.getElementById('three-container')
    if (canvasContainer) {
      canvasContainer.remove()
    }

    if (this.scene) {
      this.scene.clear()
    }

    this.scene = null
    this.camera = null
    this.renderer = null
  }
}
