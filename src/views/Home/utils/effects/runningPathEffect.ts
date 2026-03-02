/**
 * 2. 运行轨迹特效
 * 小车沿着路径行驶
 */

import { BaseEffect } from './baseEffect'

export class RunningPathEffect extends BaseEffect {
  apply(): void {
    console.log('[RunningPathEffect] 开始应用运行轨迹特效')

    if (!this.AMap) {
      console.warn('[RunningPathEffect] AMap 未初始化，无法应用特效')
      return
    }

    // 设置地图视角
    this.setView({
      pitch: 0,
      zoom: 15,
      center: [116.397428, 39.90923]
    })
    console.log('[RunningPathEffect] 调整地图视角')

    // 创建多条轨迹数据
    const paths = [
      [[116.397428, 39.90923], [116.407428, 39.91923], [116.417428, 39.90923], [116.427428, 39.91923], [116.437428, 39.90923], [116.447428, 39.91923], [116.457428, 39.90923]],
      [[116.397428, 39.90923], [116.387428, 39.89923], [116.377428, 39.90923], [116.367428, 39.89923], [116.357428, 39.90923], [116.347428, 39.89923], [116.337428, 39.90923]],
      [[116.397428, 39.90923], [116.397428, 39.91923], [116.397428, 39.92923], [116.407428, 39.93923], [116.417428, 39.93923], [116.427428, 39.93923], [116.437428, 39.93923]],
      [[116.397428, 39.90923], [116.447428, 39.88923], [116.497428, 39.86923], [116.527428, 39.84923], [116.557428, 39.82923], [116.587428, 39.80923], [116.617428, 39.78923]],
      [[116.397428, 39.90923], [116.347428, 39.92923], [116.327428, 39.94923], [116.307428, 39.96923], [116.287428, 39.98923], [116.267428, 40.00923], [116.247428, 40.02923]]
    ]

    // 为每条轨迹定义渐变色方案
    const gradientColors = [
      ['#FF6B6B', '#FFA07A', '#FFB347'],
      ['#4ECDC4', '#7FDBFF', '#A8E6CF'],
      ['#45B7D1', '#6DD5ED', '#89CFF0'],
      ['#F39C12', '#F5B041', '#F7DC6F'],
      ['#9B59B6', '#BB8FCE', '#D2B4DE']
    ]

    const markers: any[] = []
    const polylines: any[] = []
    const passedPolylines: any[] = []
    console.log('[RunningPathEffect] 创建轨迹数据:', paths)

    paths.forEach((path, index) => {
      // 创建标记
      const marker = new this.AMap.Marker({
        map: this.map,
        position: path[0],
        icon: '/car.png',
        offset: new this.AMap.Pixel(-13, -26),
        autoRotation: true,
        zIndex: 100 + index
      })
      markers.push(marker)
      console.log(`[RunningPathEffect] 创建标记 ${index + 1}, 起始位置:`, path[0])

      // 绘制完整轨迹 - 使用渐变色
      const polyline = new this.AMap.Polyline({
        map: this.map,
        path: path,
        showDir: true,
        strokeColor: gradientColors[index][0],
        strokeWeight: 6,
        strokeOpacity: 0.4,
        zIndex: 50 + index
      })
      polylines.push(polyline)

      // 已走过的轨迹 - 使用渐变色
      const passedPolyline = new this.AMap.Polyline({
        map: this.map,
        strokeColor: gradientColors[index][2],
        strokeWeight: 6,
        strokeOpacity: 0.9,
        zIndex: 60 + index
      })
      passedPolylines.push(passedPolyline)

      // 标记移动时更新已走过的轨迹
      marker.on('moving', (e: any) => {
        const passedPath = e.passedPath
        const progress = passedPath.length / path.length

        const colorIndex = Math.floor(progress * 2)
        const currentColor = gradientColors[index][Math.min(colorIndex, 2)]

        passedPolyline.setPath(passedPath)
        passedPolyline.setOptions({ strokeColor: currentColor })

        console.log(`[RunningPathEffect] 标记 ${index + 1} 移动中, 进度: ${(progress * 100).toFixed(1)}%, 颜色: ${currentColor}`)
      })

      // 开始动画
      marker.moveAlong(path, {
        duration: 2000 + index * 500,
        autoRotation: true
      })
      console.log(`[RunningPathEffect] 轨迹 ${index + 1} 动画已启动, 时长: ${2000 + index * 500}ms, 渐变色: ${gradientColors[index].join(' -> ')}`)
    })

    // 保存所有对象以便清除
    this.setResult({
      markers,
      polylines,
      passedPolylines,
      cleanup: () => {
        markers.forEach(marker => marker.stopMove())
      }
    })

    console.log('[RunningPathEffect] 运行轨迹创建完成')
  }
}
