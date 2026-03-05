/**
 * 3D柱状图特效（棱柱特效）
 * 使用 Loca.PrismLayer 实现3D柱状图可视化
 */

import { BaseEffect } from './baseEffect'

export class Prism3DEffect extends BaseEffect {
  private prismLayer: any = null
  private markers: any[] = []
  private infoMarker: any = null

  apply(): void {
    console.log('[Prism3DEffect] 开始应用3D柱状图特效')

    if (!this.map || !this.loca) {
      console.error('[Prism3DEffect] 地图或 Loca 未初始化')
      return
    }

    // 设置3D视角 - 中国视野
    this.map.setPitch(55)
    this.map.setRotation(0)
    this.map.setCenter([103.594884, 36.964587])
    this.map.setZoom(5)
    this.map.setMapStyle('amap://styles/darkblue')

    // 配置 Loca 光照系统 - 全息效果
    this.loca.ambLight = {
      intensity: 1.2,
      color: '#00ffff'
    }
    this.loca.dirLight = {
      intensity: 0.6,
      color: '#8a2be2',
      target: [0, 0, 0],
      position: [1, 1, 2]
    }
    this.loca.pointLight = {
      color: 'rgb(0, 255, 255)',
      position: [112.028276, 31.58538, 2000000],
      intensity: 5,
      distance: 10000000
    }

    // 创建棱柱图层 - 半透明全息效果
    this.prismLayer = new (window as any).Loca.PrismLayer({
      zIndex: 10,
      opacity: 0.75,
      visible: true,
      hasSide: true,
      cullface: 'back'
    })

    // 生成模拟数据
    const geoData = this.generateCityData()

    console.log('[Prism3DEffect] 生成的城市数据:', geoData)
    console.log('[Prism3DEffect] 数据特征数量:', geoData.features.length)

    // 创建 GeoJSON 数据源 - 使用 data 属性
    const geoSource = new (window as any).Loca.GeoJSONSource({
      data: geoData
    })

    console.log('[Prism3DEffect] GeoJSON 数据源创建完成')

    this.prismLayer.setSource(geoSource)

    console.log('[Prism3DEffect] 数据源已设置到棱柱图层')

    // Top3 城市的排名徽章配置
    const topConf: Record<string, string> = {
      '上海': '🥇',
      '北京': '🥈',
      '广州': '🥉'
    }

    // 五颜六色的城市颜色映射
    const cityColors: Record<string, { top: string; sideTop: string; sideBottom: string }> = {
      '上海': { top: '#FF6B9D', sideTop: '#FF8FB1', sideBottom: '#f30d4e' },
      '北京': { top: '#4ECDC4', sideTop: '#7EDCD6', sideBottom: '#07ead5' },
      '广州': { top: '#FFE66D', sideTop: '#FFF59D', sideBottom: '#f5c60a' },
      '深圳': { top: '#95E1D3', sideTop: '#B8E8DE', sideBottom: '#0af6d9' },
      '重庆': { top: '#F38181', sideTop: '#F8A5A5', sideBottom: '#f32222' },
      '苏州': { top: '#AA96DA', sideTop: '#C4B5E8', sideBottom: '#9177C9' },
      '成都': { top: '#FCBAD3', sideTop: '#FDCFE6', sideBottom: '#F9A8C4' },
      '杭州': { top: '#A8D8EA', sideTop: '#C5E5F2', sideBottom: '#7CB9D8' },
      '武汉': { top: '#F9E79F', sideTop: '#FAF0C0', sideBottom: '#F5D76E' },
      '南京': { top: '#BB8FCE', sideTop: '#D2B6DE', sideBottom: '#b70bfc' },
      '天津': { top: '#85C1E9', sideTop: '#AED6F1', sideBottom: '#5DADE2' },
      '郑州': { top: '#F8B500', sideTop: '#FFC93C', sideBottom: '#f5b60e' },
      '长沙': { top: '#00CED1', sideTop: '#40E0D0', sideBottom: '#00B5B5' },
      '青岛': { top: '#FF7F50', sideTop: '#FFA07A', sideBottom: '#E6603C' },
      '宁波': { top: '#9370DB', sideTop: '#B396DB', sideBottom: '#7B68EE' },
      '无锡': { top: '#20B2AA', sideTop: '#48D1CC', sideBottom: '#1A918A' },
      '佛山': { top: '#FF6347', sideTop: '#FF7F7F', sideBottom: '#ee1e0c' },
      '西安': { top: '#DA70D6', sideTop: '#E8A2E4', sideBottom: '#C45FC0' },
      '济南': { top: '#87CEEB', sideTop: '#AFEEEE', sideBottom: '#0abdef' },
      '合肥': { top: '#FFA07A', sideTop: '#FFB89A', sideBottom: '#ec500d' }
    }

    // 设置样式 - 全息效果
    this.prismLayer.setStyle({
      unit: 'meter',
      sideNumber: 4, // 四面柱体
      topColor: (index: number, f: any) => {
        const cityName = f.properties['名称']
        const colors = cityColors[cityName]
        return colors ? colors.top : '#2852F1'
      },
      sideTopColor: (index: number, f: any) => {
        const cityName = f.properties['名称']
        const colors = cityColors[cityName]
        return colors ? colors.sideTop : '#5A7AF5'
      },
      sideBottomColor: (index: number, f: any) => {
        const cityName = f.properties['名称']
        const colors = cityColors[cityName]
        return colors ? colors.sideBottom : '#002bb9'
      },
      radius: 15000,
      height: (index: number, f: any) => {
        const props = f.properties
        // 根据GDP计算高度
        const height = Math.max(100, Math.sqrt(props['GDP']) * 9000 - 50000)
        console.log(`[Prism3DEffect] 城市高度: ${props['名称']} = ${height}`)
        return height
      },
      rotation: 360,
      altitude: 0,
      smoothSteps: 50,
      enableShine: true,
      shineMix: 0.6
    })

    console.log('[Prism3DEffect] 样式已设置')

    // 添加到 Loca 容器
    this.loca.add(this.prismLayer)

    console.log('[Prism3DEffect] 棱柱图层已添加到 Loca 容器')
    console.log('[Prism3DEffect] 棱柱图层可见性:', this.prismLayer.visible)

    // 创建信息提示 Marker
    this.infoMarker = new this.AMap.Marker({
      anchor: 'bottom-center',
      position: [116.396923, 39.918203, 0],
      map: this.map
    })
    this.infoMarker.hide()

    // 鼠标交互事件
    this.map.on('mousemove', (e: any) => {
      if (!this.prismLayer) {
        return
      }
      const feat = this.prismLayer.queryFeature(e.pixel.toArray())
      if (feat) {
        this.infoMarker.show()
        const props = feat.properties
        const height = Math.max(100, Math.sqrt(props['GDP']) * 9000 - 50000)
        this.infoMarker.setPosition([feat.coordinates[0], feat.coordinates[1], height])
        this.infoMarker.setContent(
          `<div style="
            text-align: center;
            padding: 12px 18px;
            color: #fff;
            font-size: 14px;
            min-width: 150px;
            background: rgba(0, 20, 40, 0.85);
            border-radius: 12px;
            border: 2px solid rgba(0, 255, 255, 0.6);
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.4),
              0 0 40px rgba(138, 43, 226, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            animation: hologram-pulse 2s ease-in-out infinite;
          ">
            <style>
              @keyframes hologram-pulse {
                0%, 100% {
                  border-color: rgba(0, 255, 255, 0.6);
                  box-shadow: 
                    0 0 20px rgba(0, 255, 255, 0.4),
                    0 0 40px rgba(138, 43, 226, 0.3),
                    0 8px 32px rgba(0, 0, 0, 0.6);
                }
                50% {
                  border-color: rgba(138, 43, 226, 0.8);
                  box-shadow: 
                    0 0 30px rgba(138, 43, 226, 0.6),
                    0 0 60px rgba(0, 255, 255, 0.5),
                    0 12px 40px rgba(0, 0, 0, 0.8);
                }
              }
            </style>
            <div style="font-weight: bold; margin-bottom: 8px; color: #00ffff; text-shadow: 0 0 10px #00ffff;">${props['名称']}</div>
            <div style="color: #E97091; text-shadow: 0 0 8px #E97091;">GDP: ${props['GDP']} 亿元</div>
            <div style="font-size: 12px; color: #8E939D; margin-top: 6px; color: #a020f0;">人口: ${props['人口']} 万</div>
          </div>`
        )
      } else {
        this.infoMarker.hide()
      }
    })

    // 延迟添加动画
    setTimeout(() => {
      if (this.prismLayer) {
        console.log('[Prism3DEffect] 开始添加动画')

        // 高度生长动画
        this.prismLayer.addAnimate({
          key: 'height',
          value: [0, 1],
          duration: 500,
          easing: 'Linear',
          transform: 2000,
          random: true,
          delay: 8000
        })

        // 旋转动画
        this.prismLayer.addAnimate({
          key: 'rotation',
          value: [0, 1],
          duration: 500,
          easing: 'Linear',
          transform: 2000,
          random: true,
          delay: 8000
        })

        console.log('[Prism3DEffect] 动画添加完成')
      }
    }, 800)

    // 启动动画循环
    this.loca.animate.start()

    // 延迟创建Top3标记
    setTimeout(() => {
      const geoData = this.generateCityData()
      geoData.features.forEach((feature: any) => {
        const cityName = feature.properties['名称']
        if (topConf[cityName]) {
          const props = feature.properties
          const height = Math.max(100, Math.sqrt(props['GDP']) * 9000 - 50000)
          const coordinates = feature.geometry.coordinates
          this.createTopMarker(cityName, props, height, coordinates)
        }
      })
      console.log('[Prism3DEffect] Top3标记创建完成')
    }, 1500)

    console.log('[Prism3DEffect] 3D柱状图应用完成')

    // 存储清理函数
    this.setResult({
      layer: this.prismLayer,
      cleanup: () => {
        // 停止动画（必须在清除图层之前）
        if (this.loca) {
          try {
            this.loca.animate.stop()
          } catch (e) {
            console.warn('[Prism3DEffect] 停止动画失败:', e)
          }
        }

        // 清除所有标记
        this.markers.forEach(marker => {
          try {
            marker.setMap(null)
          } catch (e) {
            console.warn('[Prism3DEffect] 清除标记失败:', e)
          }
        })
        this.markers = []

        // 清除信息标记
        if (this.infoMarker) {
          try {
            this.infoMarker.setMap(null)
          } catch (e) {
            console.warn('[Prism3DEffect] 清除信息标记失败:', e)
          }
          this.infoMarker = null
        }

        // 清除棱柱图层（先从 Loca 容器移除，再置空）
        if (this.prismLayer && this.loca) {
          try {
            this.loca.remove(this.prismLayer)
          } catch (e) {
            console.warn('[Prism3DEffect] 从 Loca 容器移除图层失败:', e)
          }
          this.prismLayer = null
        }

        // 重置地图视角
        try {
          this.map.setPitch(0)
          this.map.setRotation(0)
          this.map.setMapStyle('amap://styles/normal')
        } catch (e) {
          console.warn('[Prism3DEffect] 重置地图视角失败:', e)
        }
      }
    })
  }

  /**
   * 为Top3城市创建特殊标记 - 全息风格
   */
  private createTopMarker(cityName: string, props: any, height: number, coordinates: [number, number]): void {
    const rank = cityName === '上海' ? 1 : cityName === '北京' ? 2 : 3
    const rankColors = ['#00ffff', '#ff00ff', '#ffff00'] // 青色、品红、黄色
    const rankGradients = [
      'linear-gradient(135deg, rgba(0, 255, 255, 0.3) 0%, rgba(0, 255, 255, 0.1) 100%)',
      'linear-gradient(135deg, rgba(255, 0, 255, 0.3) 0%, rgba(255, 0, 255, 0.1) 100%)',
      'linear-gradient(135deg, rgba(255, 255, 0, 0.3) 0%, rgba(255, 255, 0, 0.1) 100%)'
    ]
    const rankIcons = ['🥇', '🥈', '🥉']

    const marker = new this.AMap.Marker({
      anchor: 'bottom-center',
      position: [coordinates[0], coordinates[1], height],
      map: this.map,
      content: `
        <div style="
          position: relative;
          padding: 16px 20px;
          min-width: 240px;
          border-radius: 16px;
          background: rgba(0, 20, 40, 0.75);
          border: 2px solid ${rankColors[rank - 1]};
          box-shadow: 
            0 0 20px ${rankColors[rank - 1]}66,
            0 0 40px ${rankColors[rank - 1]}33,
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 0 20px rgba(0, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          animation: hologram-float 3s ease-in-out infinite, hologram-glow 2s ease-in-out infinite;
        ">
          <style>
            @keyframes hologram-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
            }
            @keyframes hologram-glow {
              0%, 100% {
                border-color: ${rankColors[rank - 1]};
                box-shadow: 
                  0 0 20px ${rankColors[rank - 1]}66,
                  0 0 40px ${rankColors[rank - 1]}33,
                  0 8px 32px rgba(0, 0, 0, 0.4),
                  inset 0 0 20px rgba(0, 255, 255, 0.1);
              }
              50% {
                border-color: rgba(0, 255, 255, 0.9);
                box-shadow: 
                  0 0 30px rgba(0, 255, 255, 0.8),
                  0 0 60px ${rankColors[rank - 1]}66,
                  0 12px 40px rgba(0, 0, 0, 0.6),
                  inset 0 0 30px rgba(0, 255, 255, 0.2);
              }
            }
            @keyframes scan-line {
              0% { top: -10%; opacity: 0; }
              50% { opacity: 1; }
              100% { top: 110%; opacity: 0; }
            }
          </style>
          <!-- 全息扫描线效果 -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${rankColors[rank - 1]}, transparent);
            animation: scan-line 3s linear infinite;
            opacity: 0.6;
          "></div>

          <!-- 全息光晕背景 -->
          <div style="
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, ${rankColors[rank - 1]}33 0%, transparent 70%);
            border-radius: 50%;
            animation: hologram-pulse 2s ease-in-out infinite;
          "></div>

          <style>
            @keyframes hologram-pulse {
              0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
              50% { opacity: 0.6; transform: translateX(-50%) scale(1.1); }
            }
          </style>

          <!-- 徽章 -->
          <div style="
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: ${rankGradients[rank - 1]};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 
              0 0 20px ${rankColors[rank - 1]},
              0 0 40px ${rankColors[rank - 1]}66,
              inset 0 0 20px rgba(0, 255, 255, 0.3);
            border: 3px solid ${rankColors[rank - 1]};
            backdrop-filter: blur(8px);
          ">
            ${rankIcons[rank - 1]}
          </div>

          <!-- 城市名称 -->
          <div style="
            font-size: 22px;
            font-weight: 800;
            color: ${rankColors[rank - 1]};
            margin-bottom: 12px;
            margin-top: 10px;
            text-align: center;
            text-shadow: 
              0 0 10px ${rankColors[rank - 1]},
              0 0 20px ${rankColors[rank - 1]}66;
            letter-spacing: 2px;
          ">
            ${cityName}
          </div>

          <!-- 分割线 -->
          <div style="
            height: 2px;
            background: linear-gradient(90deg, transparent, ${rankColors[rank - 1]}, transparent);
            margin: 8px 0;
            border-radius: 1px;
            opacity: 0.8;
          "></div>

          <!-- 数据信息 -->
          <div style="
            display: flex;
            justify-content: space-around;
            gap: 8px;
          ">
            <div style="
              flex: 1;
              text-align: center;
              padding: 10px 8px;
              background: rgba(0, 255, 255, 0.08);
              border-radius: 8px;
              border: 1px solid rgba(0, 255, 255, 0.3);
              backdrop-filter: blur(4px);
            ">
              <div style="
                font-size: 11px;
                color: ${rankColors[rank - 1]};
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-shadow: 0 0 8px ${rankColors[rank - 1]};
              ">👥 人口</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: #fff;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
              ">${props['人口']}万</div>
            </div>
            <div style="
              flex: 1;
              text-align: center;
              padding: 10px 8px;
              background: ${rankGradients[rank - 1]};
              border-radius: 8px;
              border: 1px solid ${rankColors[rank - 1]};
              backdrop-filter: blur(4px);
            ">
              <div style="
                font-size: 11px;
                color: ${rankColors[rank - 1]};
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-shadow: 0 0 8px ${rankColors[rank - 1]};
              ">💰 GDP</div>
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: ${rankColors[rank - 1]};
                text-shadow: 0 0 10px ${rankColors[rank - 1]};
              ">${props['GDP']}亿</div>
            </div>
          </div>

          <!-- 全息边角装饰 -->
          <div style="
            position: absolute;
            top: 4px;
            left: 4px;
            width: 8px;
            height: 8px;
            border-top: 2px solid ${rankColors[rank - 1]};
            border-left: 2px solid ${rankColors[rank - 1]};
          "></div>
          <div style="
            position: absolute;
            top: 4px;
            right: 4px;
            width: 8px;
            height: 8px;
            border-top: 2px solid ${rankColors[rank - 1]};
            border-right: 2px solid ${rankColors[rank - 1]};
          "></div>
          <div style="
            position: absolute;
            bottom: 4px;
            left: 4px;
            width: 8px;
            height: 8px;
            border-bottom: 2px solid ${rankColors[rank - 1]};
            border-left: 2px solid ${rankColors[rank - 1]};
          "></div>
          <div style="
            position: absolute;
            bottom: 4px;
            right: 4px;
            width: 8px;
            height: 8px;
            border-bottom: 2px solid ${rankColors[rank - 1]};
            border-right: 2px solid ${rankColors[rank - 1]};
          "></div>

          <!-- 全息粒子效果 -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.03) 2px,
              rgba(0, 255, 255, 0.03) 4px
            );
            border-radius: 16px;
          "></div>

          <!-- 装饰性光点 -->
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${rankColors[rank - 1]};
            box-shadow: 
              0 0 12px ${rankColors[rank - 1]},
              0 0 24px ${rankColors[rank - 1]}66;
            animation: hologram-pulse 2s ease-in-out infinite;
          "></div>
        </div>
      `
    })

    this.markers.push(marker)
  }

  /**
   * 生成中国主要城市的模拟数据
   */
  private generateCityData(): any {
    const cities = [
      {
        名称: '上海',
        coordinates: [121.473701, 31.230416],
        properties: {
          GDP: 38700,
          人口: 2489
        }
      },
      {
        名称: '北京',
        coordinates: [116.407526, 39.90403],
        properties: {
          GDP: 36100,
          人口: 2189
        }
      },
      {
        名称: '广州',
        coordinates: [113.264434, 23.129162],
        properties: {
          GDP: 27600,
          人口: 1867
        }
      },
      {
        名称: '深圳',
        coordinates: [114.085947, 22.547],
        properties: {
          GDP: 30100,
          人口: 1756
        }
      },
      {
        名称: '重庆',
        coordinates: [106.551556, 29.563009],
        properties: {
          GDP: 27800,
          人口: 3212
        }
      },
      {
        名称: '苏州',
        coordinates: [120.585316, 31.298886],
        properties: {
          GDP: 22700,
          人口: 1274
        }
      },
      {
        名称: '成都',
        coordinates: [104.066541, 30.572269],
        properties: {
          GDP: 19200,
          人口: 2119
        }
      },
      {
        名称: '杭州',
        coordinates: [120.155072, 30.274067],
        properties: {
          GDP: 18100,
          人口: 1193
        }
      },
      {
        名称: '武汉',
        coordinates: [114.298572, 30.584355],
        properties: {
          GDP: 17700,
          人口: 1232
        }
      },
      {
        名称: '南京',
        coordinates: [118.796877, 32.060255],
        properties: {
          GDP: 16300,
          人口: 942
        }
      },
      {
        名称: '天津',
        coordinates: [117.190182, 39.125596],
        properties: {
          GDP: 15800,
          人口: 1372
        }
      },
      {
        名称: '郑州',
        coordinates: [113.665412, 34.757975],
        properties: {
          GDP: 12400,
          人口: 1260
        }
      },
      {
        名称: '长沙',
        coordinates: [112.938814, 28.228209],
        properties: {
          GDP: 12900,
          人口: 1042
        }
      },
      {
        名称: '青岛',
        coordinates: [120.355173, 36.082982],
        properties: {
          GDP: 13700,
          人口: 1025
        }
      },
      {
        名称: '宁波',
        coordinates: [121.550357, 29.874813],
        properties: {
          GDP: 12700,
          人口: 954
        }
      },
      {
        名称: '无锡',
        coordinates: [120.311931, 31.49117],
        properties: {
          GDP: 14000,
          人口: 747
        }
      },
      {
        名称: '佛山',
        coordinates: [113.121416, 23.021548],
        properties: {
          GDP: 11800,
          人口: 961
        }
      },
      {
        名称: '西安',
        coordinates: [108.948024, 34.263161],
        properties: {
          GDP: 10900,
          人口: 1295
        }
      },
      {
        名称: '济南',
        coordinates: [117.120519, 36.651062],
        properties: {
          GDP: 11200,
          人口: 941
        }
      },
      {
        名称: '合肥',
        coordinates: [117.227239, 31.820586],
        properties: {
          GDP: 10200,
          人口: 936
        }
      }
    ]

    // 构建 GeoJSON FeatureCollection
    const features = cities.map((city) => ({
      type: 'Feature',
      properties: {
        名称: city.名称,
        GDP: city.properties.GDP,
        人口: city.properties.人口
      },
      geometry: {
        type: 'Point',
        coordinates: city.coordinates
      }
    }))

    return {
      type: 'FeatureCollection',
      features
    }
  }
}
