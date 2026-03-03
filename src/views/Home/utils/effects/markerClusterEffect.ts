/**
 * 8. 标记聚合特效
 */

import { BaseEffect } from './baseEffect'

// 注入动画样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse-glow {
      0% {
        transform: scale(1);
        box-shadow: 
          0 4px 12px rgba(0,0,0,0.2),
          0 0 0 0 rgba(255,255,255,0.3),
          inset 0 2px 4px rgba(255,255,255,0.4),
          inset 0 -2px 4px rgba(0,0,0,0.1);
      }
      50% {
        transform: scale(1.08);
        box-shadow:
          0 8px 24px rgba(0,0,0,0.3),
          0 0 20px 5px rgba(255,255,255,0.2),
          inset 0 2px 4px rgba(255,255,255,0.5),
          inset 0 -2px 4px rgba(0,0,0,0.1);
      }
      100% {
        transform: scale(1);
        box-shadow:
          0 4px 12px rgba(0,0,0,0.2),
          0 0 0 0 rgba(255,255,255,0.3),
          inset 0 2px 4px rgba(255,255,255,0.4),
          inset 0 -2px 4px rgba(0,0,0,0.1);
      }
    }
    @keyframes float-bounce {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-5px) rotate(3deg);
      }
    }
    @keyframes gradient-shift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes ripple {
      0% {
        box-shadow: 0 0 0 0 rgba(255,255,255,0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255,255,255,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255,255,255,0);
      }
    }
    @keyframes expand {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    @keyframes popup-in {
      0% {
        transform: scale(0) translateY(10px);
        opacity: 0;
      }
      100% {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }
    @keyframes spider-leg {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes marker-appear {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
      }
      100% {
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }
    }
    @keyframes info-card-in {
      0% {
        transform: translateY(-20px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)
}

export class MarkerClusterEffect extends BaseEffect {
  apply(): void {
    console.log('[MarkerClusterEffect] 开始应用标记聚合特效')

    // 设置地图视角
    this.setView({
      zoom: 11,
      center: [116.397428, 39.90923]
    })
    console.log('[MarkerClusterEffect] 设置地图视角完成')

    // 创建坐标点数据（不需要创建Marker对象）
    const points: any[] = Array.from({ length: 200 }, (_, i) => ({
      lnglat: [
        116.397428 + (Math.random() - 0.5) * 0.15,
        39.90923 + (Math.random() - 0.5) * 0.15
      ],
      name: `标记 ${i + 1}`
    }))

    console.log('[MarkerClusterEffect] 创建了', points.length, '个坐标点')

    // 使用异步方式加载MarkerCluster插件
    this.map.plugin(['AMap.MarkerCluster'], () => {
      console.log('[MarkerClusterEffect] MarkerCluster 插件已加载')

      try {
        const count = points.length

        // 自定义聚合点样式 - 现代化设计 + 点击展开交互
        const _renderClusterMarker = (context: any) => {
          const clusterCount = context.count
          const div = document.createElement('div')

          // Material Design 3.0 高级渐变色系
          const gradientConfigs = [
            // 青绿色 - 少量点
            {
              bg: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 50%, #115E59 100%)',
              size: 30
            },
            // 天蓝色 - 中小量
            {
              bg: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #0369A1 100%)',
              size: 40
            },
            // 靛蓝色 - 中量
            {
              bg: 'linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #4338CA 100%)',
              size: 50
            },
            // 紫罗兰 - 中大量
            {
              bg: 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #7C3AED 100%)',
              size: 60
            },
            // 玫红色 - 大量
            {
              bg: 'linear-gradient(135deg, #FB7185 0%, #F43F5E 50%, #BE123C 100%)',
              size: 70
            }
          ]

          let config = gradientConfigs[0]
          if (clusterCount >= 0 && clusterCount < 10) config = gradientConfigs[0]
          else if (clusterCount >= 10 && clusterCount < 100) config = gradientConfigs[1]
          else if (clusterCount >= 100 && clusterCount < 1000) config = gradientConfigs[2]
          else if (clusterCount >= 1000 && clusterCount < 10000) config = gradientConfigs[3]
          else if (clusterCount >= 10000) config = gradientConfigs[4]

          // 动态计算尺寸
          const baseSize = config.size
          const size = Math.round(baseSize + Math.pow(clusterCount / count, 1 / 6) * 30)

          div.style.background = config.bg
          div.style.backgroundSize = '200% 200%'
          div.style.width = size + 'px'
          div.style.height = size + 'px'

          // 磨砂玻璃边框效果
          div.style.border = '3px solid rgba(255,255,255,0.6)'
          div.style.borderRadius = size / 2 + 'px'

          // 多层阴影组合 - 3D立体感
          div.style.boxShadow =
            '0 8px 24px rgba(0,0,0,0.25), ' +
            '0 0 0 4px rgba(255,255,255,0.1), ' +
            'inset 0 3px 6px rgba(255,255,255,0.5), ' +
            'inset 0 -3px 6px rgba(0,0,0,0.1)'

          // 文字样式
          div.innerHTML = clusterCount
          div.style.lineHeight = size + 'px'
          div.style.color = '#ffffff'
          div.style.fontSize = Math.max(14, size / 4) + 'px'
          div.style.fontWeight = '900'
          div.style.textAlign = 'center'
          div.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)'
          div.style.letterSpacing = '-0.5px'

          // 组合动画 - 呼吸光晕 + 流体渐变
          div.style.animation = 'pulse-glow 2s ease-in-out infinite, gradient-shift 3s ease infinite'

          // 鼠标悬停提示
          div.style.cursor = 'pointer'
          div.title = `点击查看详情`

          // 内部高光效果
          const innerGlow = document.createElement('div')
          innerGlow.style.cssText = `
            position: absolute;
            top: 15%;
            left: 20%;
            width: 40%;
            height: 30%;
            background: radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
          `
          div.style.position = 'relative'
          div.appendChild(innerGlow)

          // 点击事件 - 弹出信息卡片
          div.addEventListener('click', (e: Event) => {
            e.stopPropagation()
            handleClusterClick(context, clusterCount, config.bg)
          })

          // 右键点击事件 - Spiderfy 展开
          div.addEventListener('contextmenu', (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            handleClusterRightClick(context, clusterCount, config.bg)
          })

          context.marker.setOffset(new this.AMap.Pixel(-size / 2, -size / 2))
          context.marker.setContent(div)
        }

        // 处理聚合点点击 - 弹出信息卡片
        const handleClusterClick = (context: any, count: number, color: string) => {
          console.log('[MarkerClusterEffect] 点击聚合点，数量:', count)

          const position = context.marker.getPosition()
          if (!position) return

          // 提取主色调
          const mainColor = color.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#2DD4BF'

          // 创建信息卡片
          const infoWindow = new this.AMap.InfoWindow({
            content: createInfoCard(count, mainColor),
            offset: new this.AMap.Pixel(0, -10),
            closeWhenClickMap: true
          })

          infoWindow.open(this.map, position)

          console.log('[MarkerClusterEffect] 信息卡片已打开')
        }

        // 创建精美的信息卡片
        const createInfoCard = (count: number, color: string) => {
          const card = document.createElement('div')
          card.style.cssText = `
            padding: 20px;
            min-width: 280px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            animation: info-card-in 0.3s ease-out;
          `

          // 标题
          const title = document.createElement('div')
          title.style.cssText = `
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          `
          title.innerHTML = `
            <div style="
              width: 8px;
              height: 8px;
              background: ${color};
              border-radius: 50%;
              animation: pulse-glow 2s ease-in-out infinite;
            "></div>
            标记聚合详情
          `
          card.appendChild(title)

          // 统计信息
          const stats = document.createElement('div')
          stats.style.cssText = `
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
          `

          const statItem = (label: string, value: string, bgColor: string) => {
            const item = document.createElement('div')
            item.style.cssText = `
              flex: 1;
              padding: 12px;
              background: ${bgColor};
              border-radius: 12px;
              text-align: center;
            `
            item.innerHTML = `
              <div style="font-size: 24px; font-weight: 700; color: ${color}; margin-bottom: 4px;">${value}</div>
              <div style="font-size: 12px; color: #666;">${label}</div>
            `
            return item
          }

          stats.appendChild(statItem('标记数量', count.toString(), 'rgba(45, 212, 191, 0.1)'))
          stats.appendChild(statItem('覆盖范围', '1.2km²', 'rgba(56, 189, 248, 0.1)'))
          card.appendChild(stats)

          // 进度条
          const progressContainer = document.createElement('div')
          progressContainer.style.cssText = `
            margin-bottom: 16px;
          `
          progressContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; color: #666;">
              <span>密集度</span>
              <span>${Math.min(100, Math.round(count * 3))}%</span>
            </div>
            <div style="
              height: 6px;
              background: #f0f0f0;
              border-radius: 3px;
              overflow: hidden;
            ">
              <div style="
                width: ${Math.min(100, count * 3)}%;
                height: 100%;
                background: ${color};
                border-radius: 3px;
                animation: pulse-glow 2s ease-in-out infinite;
              "></div>
            </div>
          `
          card.appendChild(progressContainer)

          // 操作按钮
          const actions = document.createElement('div')
          actions.style.cssText = `
            display: flex;
            gap: 8px;
          `

          const button = (text: string, bgColor: string, textColor: string, onClick: () => void) => {
            const btn = document.createElement('button')
            btn.style.cssText = `
              flex: 1;
              padding: 10px;
              background: ${bgColor};
              color: ${textColor};
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
            `
            btn.textContent = text
            btn.addEventListener('click', onClick)
            btn.addEventListener('mouseenter', () => {
              btn.style.transform = 'translateY(-2px)'
              btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            })
            btn.addEventListener('mouseleave', () => {
              btn.style.transform = 'translateY(0)'
              btn.style.boxShadow = 'none'
            })
            return btn
          }

          actions.appendChild(button('查看详情', color, '#ffffff', () => {
            console.log('[MarkerClusterEffect] 点击查看详情')
          }))
          actions.appendChild(button('筛选', '#f0f0f0', '#333333', () => {
            console.log('[MarkerClusterEffect] 点击筛选')
          }))
          card.appendChild(actions)

          return card
        }

        // 创建展开后的标记样式
        const createExpandedMarker = (color: string) => {
          const div = document.createElement('div')
          div.style.cssText = `
            width: 28px;
            height: 28px;
            background: ${color};
            border: 3px solid rgba(255,255,255,0.8);
            border-radius: 50%;
            box-shadow:
              0 4px 12px rgba(0,0,0,0.3),
              0 0 0 3px rgba(255,255,255,0.1),
              inset 0 2px 4px rgba(255,255,255,0.4);
            cursor: pointer;
            transition: transform 0.2s ease;
          `

          // 高光效果
          const glow = document.createElement('div')
          glow.style.cssText = `
            position: absolute;
            top: 20%;
            left: 30%;
            width: 40%;
            height: 30%;
            background: radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
          `
          div.style.position = 'relative'
          div.appendChild(glow)

          // 悬停效果
          div.addEventListener('mouseenter', () => {
            div.style.transform = 'scale(1.2)'
          })
          div.addEventListener('mouseleave', () => {
            div.style.transform = 'scale(1)'
          })

          return div
        }

        // 保存临时标记的引用
        const tempMarkers: any[] = []

        // 清理临时标记
        const cleanupTempMarkers = () => {
          tempMarkers.forEach((marker) => {
            if (marker) {
              marker.setMap(null)
            }
          })
          tempMarkers.length = 0
        }

        // 右键点击聚合点 - Spiderfy 展开
        const handleClusterRightClick = (context: any, count: number, color: string) => {
          console.log('[MarkerClusterEffect] 右键点击聚合点，准备 Spiderfy 展开，数量:', count)

          cleanupTempMarkers()

          const center = context.marker.getPosition()
          if (!center) return

          const mainColor = color.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#2DD4BF'
          const radius = 0.005 * Math.sqrt(count)
          const showCount = Math.min(count, 30)

          // 计算圆形分布位置
          const positions: any[] = []
          for (let i = 0; i < showCount; i++) {
            const angle = (i / showCount) * Math.PI * 2
            const lng = center.lng + Math.cos(angle) * radius
            const lat = center.lat + Math.sin(angle) * radius
            positions.push(new this.AMap.LngLat(lng, lat))
          }

          // 创建SVG绘制蜘蛛网线条
          const svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svgOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 900;
          `
          document.body.appendChild(svgOverlay)

          // 转换地理坐标到像素坐标
          const centerPixel = this.map.lngLatToContainer(center)

          positions.forEach((pos, index) => {
            const pixel = this.map.lngLatToContainer(pos)

            // 创建线条
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line.setAttribute('x1', centerPixel.x.toString())
            line.setAttribute('y1', centerPixel.y.toString())
            line.setAttribute('x2', pixel.x.toString())
            line.setAttribute('y2', pixel.y.toString())
            line.setAttribute('stroke', mainColor)
            line.setAttribute('stroke-width', '2')
            line.setAttribute('stroke-opacity', '0.5')
            line.setAttribute('stroke-dasharray', '100')
            line.style.animation = 'spider-leg 0.5s ease-out forwards'
            line.style.animationDelay = `${index * 30}ms`
            svgOverlay.appendChild(line)

            // 创建标记
            const marker = new this.AMap.Marker({
              position: pos,
              content: createExpandedMarker(color),
              offset: new this.AMap.Pixel(-14, -14),
              map: this.map,
              zIndex: 1000 + index
            })

            const el = marker.getContent()
            if (el) {
              el.style.opacity = '0'
              el.style.animation = 'marker-appear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
              el.style.animationDelay = `${index * 30}ms`
            }

            tempMarkers.push(marker)
          })

          // 存储SVG引用用于清理
          tempMarkers.push({
            setMap: () => svgOverlay.remove()
          })

          console.log('[MarkerClusterEffect] Spiderfy 展开完成')

          // 5秒后自动收起
          setTimeout(cleanupTempMarkers, 5000)
        }

        // 自定义非聚合点样式 - 精致单点设计
        const _renderMarker = (context: any) => {
          const markerSize = 28
          const content = `
            <div style="
              position: relative;
              width: ${markerSize}px;
              height: ${markerSize}px;
            ">
              <div style="
                background: linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%);
                width: 100%;
                height: 100%;
                border: 3px solid rgba(255,255,255,0.7);
                border-radius: 50%;
                box-shadow:
                  0 4px 12px rgba(0,0,0,0.2),
                  0 0 0 3px rgba(255,255,255,0.1),
                  inset 0 2px 4px rgba(255,255,255,0.4);
                animation: float-bounce 3s ease-in-out infinite;
              "></div>
              <div style="
                position: absolute;
                top: 20%;
                left: 30%;
                width: 40%;
                height: 30%;
                background: radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
              "></div>
            </div>
          `
          const offset = new this.AMap.Pixel(-markerSize / 2, -markerSize / 2)
          context.marker.setContent(content)
          context.marker.setOffset(offset)
        }

        const cluster = new this.AMap.MarkerCluster(this.map, points, {
          gridSize: 60,
          renderClusterMarker: _renderClusterMarker,
          renderMarker: _renderMarker
        })

        console.log('[MarkerClusterEffect] MarkerCluster 实例:', cluster)
        this.setResult({ cluster, points })
        console.log('[MarkerClusterEffect] 结果已保存到 result')
      } catch (error) {
        console.error('[MarkerClusterEffect] MarkerCluster 创建失败:', error)
        console.error('[MarkerClusterEffect] 错误堆栈:', error)
        // 降级方案：直接添加标记
        points.forEach((point) => {
          const marker = new this.AMap.Marker({
            position: point.lnglat,
            title: point.name
          })
          marker.setMap(this.map)
        })
        this.setResult({ points })
        console.log('[MarkerClusterEffect] 使用降级方案，直接添加标记到地图')
      }
      console.log('[MarkerClusterEffect] 标记聚合特效创建完成')
    })
  }
}
