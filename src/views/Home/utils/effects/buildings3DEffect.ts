/**
 * 4. 3D建筑特效
 * 使用 AMap.Buildings 创建3D楼块效果
 */

import { BaseEffect } from './baseEffect'

export class Buildings3DEffect extends BaseEffect {
  apply(): void {
    console.log('[Buildings3DEffect] 开始应用3D建筑特效')

    // 使用北京CBD区域，这个区域建筑密集且数据完整
    // 坐标: 国贸CBD区域
    const center = [116.458, 39.923]  // 北京国贸CBD
    console.log('[Buildings3DEffect] 使用坐标:', center)

    // 开启所有图层，包括默认建筑
    this.map.setFeatures(['bg', 'road', 'building', 'point'])
    console.log('[Buildings3DEffect] 开启所有图层')

    // 设置3D视角
    this.setView({
      pitch: 60,  // 更大的倾斜角度
      rotation: 30,  // 旋转30度
      zoom: 17,   // 17级放大
      center: center
    })
    console.log('[Buildings3DEffect] 调整视角: pitch=60, rotation=30, zoom=17')

    // 使用标准地图样式
    this.map.setMapStyle('amap://styles/normal')
    console.log('[Buildings3DEffect] 设置标准地图样式')

    // 创建3D建筑图层 - 使用最简单的配置测试
    const buildings = new this.AMap.Buildings({
      zIndex: 10,
      zooms: [15, 20],
      // 使用单色而不是渐变，测试是否是渐变的问题
      wallColor: '#4b7bec',
      roofColor: '#45aaf2',
      heightFactor: 2,  // 放大高度，更明显
      visible: true,
      opacity: 1
    })

    buildings.setMap(this.map)
    console.log('[Buildings3DEffect] 3D建筑图层已创建')
    console.log('[Buildings3DEffect] buildings实例:', buildings)

    // 监听图层加载完成事件
    if (buildings.on) {
      buildings.on('complete', () => {
        console.log('[Buildings3DEffect] 建筑图层加载完成')
      })
    }

    this.setResult({
      buildings,
      cleanup: () => {
        if (buildings) {
          buildings.setMap(null)
        }
      }
    })

    console.log('[Buildings3DEffect] 3D建筑特效创建完成')
  }
}
