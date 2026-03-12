/**
 * 20. 建筑室内分层特效
 * 展示多层建筑的室内3D效果，每层楼都有独立的高度和光照
 * 特性：
 * - 3D多边形层展示楼层结构
 * - 多层建筑分层显示
 * - 逼真的室内光照效果
 * - 高度和海拔动画
 * - 自动旋转视角
 * - 玻璃质感渲染
 * - 赛博朋克配色方案
 * - 点击商铺显示详细信息
 */

import { BaseEffect } from './baseEffect'

export class BuildingFloorEffect extends BaseEffect {
  private baseLayers: any[] = []
  private shopLayers: any[] = []
  private infoWindow: any = null

  // 商铺信息数据
  private shopInfo: any[] = [
    { id: 0, name: '星巴克咖啡', type: '餐饮', area: '45㎡', rating: 4.8, desc: '全球知名咖啡连锁品牌', hours: '08:00-22:00' },
    { id: 1, name: 'ZARA 服装', type: '服装', area: '120㎡', rating: 4.6, desc: '国际时尚女装品牌', hours: '10:00-21:30' },
    { id: 2, name: 'Apple Store', type: '数码', area: '80㎡', rating: 4.9, desc: '苹果官方授权零售店', hours: '10:00-22:00' },
    { id: 3, name: '海底捞火锅', type: '餐饮', area: '200㎡', rating: 4.7, desc: '知名火锅连锁品牌', hours: '11:00-02:00' },
    { id: 4, name: 'Nike 旗舰店', type: '运动', area: '150㎡', rating: 4.5, desc: '耐克官方旗舰店', hours: '10:00-21:00' },
    { id: 5, name: '优衣库', type: '服装', area: '180㎡', rating: 4.4, desc: '休闲服饰品牌', hours: '10:00-21:30' },
    { id: 6, name: '屈臣氏', type: '美妆', area: '60㎡', rating: 4.3, desc: '个人护理用品连锁', hours: '10:00-22:00' },
    { id: 7, name: '华为授权店', type: '数码', area: '70㎡', rating: 4.7, desc: '华为官方授权体验店', hours: '10:00-21:30' },
    { id: 8, name: '外婆家', type: '餐饮', area: '160㎡', rating: 4.5, desc: '杭帮菜连锁品牌', hours: '11:00-21:30' },
    { id: 9, name: '丝芙兰', type: '美妆', area: '55㎡', rating: 4.6, desc: '国际美妆集合店', hours: '10:00-22:00' },
    { id: 10, name: 'Adidas 旗舰店', type: '运动', area: '140㎡', rating: 4.4, desc: '阿迪达斯官方旗舰店', hours: '10:00-21:00' },
    { id: 11, name: '麦当劳', type: '餐饮', area: '90㎡', rating: 4.2, desc: '全球快餐连锁品牌', hours: '07:00-23:00' }
  ]

  protected cleanup(): void {
    // 关闭信息窗口
    if (this.infoWindow) {
      this.infoWindow.close()
      this.infoWindow = null
    }

    // 移除地图点击事件监听
    if (this.map) {
      this.map.off('click')
    }

    this.cleanupBuilding()
    super.cleanup()
  }

  apply(): void {
    console.log('[BuildingFloorEffect] 开始应用建筑室内分层特效')

    if (!this.loca) {
      console.warn('[BuildingFloorEffect] loca 未初始化，无法应用特效')
      return
    }

    // 设置地图为3D视角
    this.setView({
      pitch: 60,
      zoom: 15,
      rotation: -147,
      center: [116.397428, 39.90923],
      mapStyle: 'amap://styles/dark'
    })
    console.log('[BuildingFloorEffect] 调整地图视角为 3D 建筑模式')

    // 配置室内光照系统
    this.configureIndoorLighting()

    // 创建多层建筑
    this.createBuildingFloors()

    // 延迟显示动画
    setTimeout(() => {
      this.animateBuildingEntry()
      // 动画开始后再设置地图点击事件，确保图层已显示
      setTimeout(() => {
        this.setupMapClickEvent()
      }, 3500)
    }, 2000)

    // 启动渲染循环
    try {
      this.loca.animate.start()
      console.log('[BuildingFloorEffect] 启动Loca渲染循环')
    } catch (e) {
      console.warn('[BuildingFloorEffect] 启动渲染循环失败:', e)
    }

    // 设置结果
    this.setResult({
      baseLayers: this.baseLayers,
      shopLayers: this.shopLayers,
      cleanup: () => this.cleanupBuilding()
    })

    console.log('[BuildingFloorEffect] 建筑室内分层特效应用完成')
  }

  /**
   * 配置室内光照系统
   */
  private configureIndoorLighting(): void {
    if (!this.loca) return

    // 环境光 - 赛博朋克风格紫色环境光
    this.loca.ambLight = {
      intensity: 0.25,
      color: 'rgba(50, 20, 100, 0.8)'
    }

    // 平行光 - 青色侧向照明
    this.loca.dirLight = {
      intensity: 0.4,
      color: 'rgba(0, 255, 255, 0.6)',
      target: [0, 0, 0],
      position: [1, -1, 2]
    }

    // 点光源1 - 紫色主光源
    this.loca.pointLight = {
      color: '#ff00ff',
      position: [116.397428, 39.90923, 2000],
      intensity: 6,
      distance: 5000
    }

    // 点光源2 - 青色补光
    this.loca.pointLight2 = {
      color: '#00ffff',
      position: [116.400428, 39.91223, 1500],
      intensity: 5,
      distance: 4000
    }

    // 点光源3 - 金色点缀
    this.loca.pointLight3 = {
      color: '#ffd700',
      position: [116.394428, 39.90623, 1800],
      intensity: 4,
      distance: 4500
    }

    console.log('[BuildingFloorEffect] 室内光照系统配置完成')
  }

  /**
   * 创建多层建筑
   */
  private createBuildingFloors(): void {
    const Loca = (window as any).Loca

    // 生成3层楼的建筑数据 - 赛博朋克配色
    const floors = [
      {
        level: 1,
        altitude: 0,
        color: '#00ffff',
        sideColor: '#0088aa',
        name: '一楼商铺'
      },
      {
        level: 2,
        altitude: 150,
        color: '#ff00ff',
        sideColor: '#880088',
        name: '二楼商铺'
      },
      {
        level: 3,
        altitude: 300,
        color: '#ffd700',
        sideColor: '#886600',
        name: '三楼商铺'
      }
    ]

    // 为每层楼创建基础面和商铺区域
    floors.forEach((floor) => {
      // 创建基础面（楼层地板）
      const baseLayer = this.createBaseLayer(floor.altitude, floor.color, floor.sideColor)
      this.baseLayers.push(baseLayer)
      this.loca.add(baseLayer)

      // 创建商铺区域
      const shopLayer = this.createShopLayer(floor.altitude + 10, floor.color)
      this.shopLayers.push(shopLayer)
      this.loca.add(shopLayer)

      this.locaLayers.push(baseLayer)
      this.locaLayers.push(shopLayer)
    })

    console.log('[BuildingFloorEffect] 多层建筑创建完成, 共', floors.length, '层')
  }

  /**
   * 创建基础楼层面
   */
  private createBaseLayer(altitude: number, color: string, sideColor: string) {
    const Loca = (window as any).Loca

    // 生成建筑地板的多边形数据
    const geoData = this.createBuildingFloorPolygon(altitude)

    const layer = new Loca.PolygonLayer({
      zIndex: 120,
      opacity: 0.85,
      shininess: 30,
      hasSide: true,
      acceptLight: true,
      cullface: 'none',
      visible: false
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      topColor: color,
      sideTopColor: color,
      sideBottomColor: sideColor,
      height: 12,
      altitude: altitude,
      unit: 'meter'
    })

    return layer
  }

  /**
   * 创建商铺区域层
   */
  private createShopLayer(altitude: number, color: string) {
    const Loca = (window as any).Loca

    // 生成商铺的多边形数据
    const geoData = this.createShopPolygons(altitude)

    const layer = new Loca.PolygonLayer({
      zIndex: 125,
      opacity: 0.9,
      shininess: 40,
      hasSide: true,
      acceptLight: true,
      visible: true
    })

    layer.setSource(new Loca.GeoJSONSource({ data: geoData }))

    layer.setStyle({
      topColor: color,
      sideTopColor: color,
      sideBottomColor: this.darkenColor(color, 0.4),
      height: 8,
      altitude: altitude,
      unit: 'meter'
    })

    return layer
  }

  /**
   * 颜色变暗
   */
  private darkenColor(hex: string, factor: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.floor((num >> 16) * factor)
    const g = Math.floor(((num >> 8) & 0x00ff) * factor)
    const b = Math.floor((num & 0x0000ff) * factor)
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
  }

  /**
   * 生成建筑地板的多边形数据
   */
  private createBuildingFloorPolygon(altitude: number) {
    const centerX = 116.397428
    const centerY = 39.90923
    const size = 0.003

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { altitude },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [centerX - size, centerY - size],
              [centerX + size, centerY - size],
              [centerX + size, centerY + size],
              [centerX - size, centerY + size],
              [centerX - size, centerY - size]
            ]]
          }
        }
      ]
    }
  }

  /**
   * 生成商铺的多边形数据
   */
  private createShopPolygons(altitude: number) {
    const centerX = 116.397428
    const centerY = 39.90923
    const shopCount = 12

    const features = []
    for (let i = 0; i < shopCount; i++) {
      const angle = (i / shopCount) * Math.PI * 2
      const distance = 0.0018
      const shopSize = 0.0004

      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      features.push({
        type: 'Feature',
        properties: { altitude, shopId: i },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [x - shopSize, y - shopSize],
            [x + shopSize, y - shopSize],
            [x + shopSize, y + shopSize],
            [x - shopSize, y + shopSize],
            [x - shopSize, y - shopSize]
          ]]
        }
      })
    }

    return {
      type: 'FeatureCollection',
      features
    }
  }



  /**
   * 建筑入场动画
   */
  private animateBuildingEntry(): void {
    console.log('[BuildingFloorEffect] 开始建筑入场动画')

    // 先隐藏所有图层
    this.baseLayers.concat(this.shopLayers).forEach((layer) => {
      layer.hide()
    })

    // 延迟后显示并添加动画
    setTimeout(() => {
      // 基础楼层动画 - 先显示
      this.baseLayers.forEach((layer, index) => {
        setTimeout(() => {
          layer.addAnimate({
            key: 'altitude',
            value: [0, 1],
            duration: 3000,
            easing: 'CubicInOut',
            transform: 300
          })
          layer.addAnimate({
            key: 'height',
            value: [0, 1],
            duration: 3000,
            easing: 'CubicInOut',
            transform: 300
          })
          layer.show(300)
        }, index * 200)
      })

      // 商铺图层动画 - 稍后显示
      setTimeout(() => {
        this.shopLayers.forEach((layer, index) => {
          setTimeout(() => {
            layer.addAnimate({
              key: 'altitude',
              value: [0, 1],
              duration: 2500,
              easing: 'CubicInOut',
              transform: 300
            })
            layer.addAnimate({
              key: 'height',
              value: [0, 1],
              duration: 2500,
              easing: 'CubicInOut',
              transform: 300
            })
            layer.show(300)
          }, index * 150)
        })
      }, 800)

      // 视角旋转动画
      setTimeout(() => {
        if (this.loca.viewControl) {
          this.loca.viewControl.addAnimates([{
            rotation: {
              value: 0,
              control: [[0, -147], [1, 0]],
              timing: [0.3, 0, 0.8, 1],
              duration: 8000
            }
          }])
        }
      }, 2000)

      console.log('[BuildingFloorEffect] 建筑入场动画设置完成')
    }, 1000)
  }

  /**
   * 设置地图点击事件
   */
  private setupMapClickEvent(): void {
    if (!this.map || !this.shopLayers.length) return

    console.log('[BuildingFloorEffect] 开始设置地图点击事件...')

    this.map.on('click', (e: any) => {
      console.log('[BuildingFloorEffect] 地图点击事件触发')

      // 获取点击的经纬度
      const lng = e.lnglat?.lng
      const lat = e.lnglat?.lat

      if (!lng || !lat) {
        console.warn('[BuildingFloorEffect] 无法获取点击位置')
        return
      }

      console.log('[BuildingFloorEffect] 点击位置:', lng, lat)

      // 计算点击位置到每个商铺中心的距离，选择最近的
      const centerX = 116.397428
      const centerY = 39.90923

      // 计算点击点到中心的距离
      const distance = Math.sqrt(Math.pow(lng - centerX, 2) + Math.pow(lat - centerY, 2))
      console.log('[BuildingFloorEffect] 距离建筑中心:', distance)

      // 判断是否点击在建筑范围内（半径0.003度内）
      if (distance < 0.003) {
        // 根据点击的角度计算对应的商铺索引
        const angle = Math.atan2(lat - centerY, lng - centerX)
        const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle
        const totalShops = 12
        const shopIndex = Math.floor((normalizedAngle / (Math.PI * 2)) * totalShops) % totalShops

        console.log('[BuildingFloorEffect] 计算出的商铺索引:', shopIndex)

        // 获取商铺信息
        const shop = this.shopInfo[shopIndex]
        if (shop) {
          console.log('[BuildingFloorEffect] 显示商铺信息:', shop.name)
          this.showShopInfoWindow(shop, [lng, lat])
        }
      } else {
        console.log('[BuildingFloorEffect] 点击位置在建筑范围外')
      }
    })

    console.log('[BuildingFloorEffect] 地图点击事件设置完成')
  }

  /**
   * 显示商铺信息窗口
   */
  private showShopInfoWindow(shop: any, position: [number, number]): void {
    // 关闭已打开的信息窗口
    if (this.infoWindow) {
      this.infoWindow.close()
    }

    const InfoWindow = (this.AMap as any).InfoWindow

    // 创建信息窗口内容
    const content = `
      <div class="shop-info-window" style="
        padding: 16px;
        min-width: 280px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <div style="
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          ">🏪</div>
          <div style="flex: 1;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${shop.name}</div>
            <div style="font-size: 12px; opacity: 0.9;">${shop.type}</div>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; opacity: 0.8;">⭐ 评分</span>
            <span style="font-size: 14px; font-weight: bold; color: #ffd700;">${shop.rating}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; opacity: 0.8;">📐 面积</span>
            <span style="font-size: 14px;">${shop.area}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 13px; opacity: 0.8;">⏰ 营业时间</span>
            <span style="font-size: 14px;">${shop.hours}</span>
          </div>
        </div>

        <div style="font-size: 13px; opacity: 0.9; line-height: 1.6;">
          ${shop.desc}
        </div>

        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2);">
          <button onclick="console.log('导航到商铺');" style="
            width: 100%;
            padding: 8px 16px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            🚀 导航到店铺
          </button>
        </div>
      </div>
    `

    // 创建信息窗口
    this.infoWindow = new InfoWindow({
      content,
      offset: new this.AMap.Pixel(0, -30),
      zIndex: 200
    })

    // 打开信息窗口
    this.infoWindow.open(this.map, position)

    console.log('[BuildingFloorEffect] 显示商铺信息:', shop.name)
  }

  /**
   * 清理资源
   */
  private cleanupBuilding() {
    console.log('[BuildingFloorEffect] 开始清理建筑室内分层资源')

    // 恢复默认光照
    if (this.loca) {
      this.loca.ambLight = {
        intensity: 0.5,
        color: '#fff'
      }
      this.loca.dirLight = {
        intensity: 0.6,
        color: '#abffc8',
        target: [0, 0, 0],
        position: [0, 3, 6]
      }
      delete this.loca.pointLight
      delete this.loca.pointLight2
      delete this.loca.pointLight3
    }

    console.log('[BuildingFloorEffect] 建筑室内分层资源清理完成')
  }
}
