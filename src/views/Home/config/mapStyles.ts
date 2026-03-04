/**
 * 地图样式配置
 * 基于高德地图样式规范
 */

export interface MapStyleConfig {
  name: string
  style: string
  description: string
  isDark?: boolean
}

export const MAP_STYLES: MapStyleConfig[] = [
  {
    name: '标准',
    style: 'amap://styles/normal',
    description: '标准地图样式',
  },
  {
    name: '暗色',
    style: 'amap://styles/dark',
    description: '暗色地图样式',
    isDark: true,
  },
  {
    name: '深蓝',
    style: 'amap://styles/darkblue',
    description: '深蓝色调',
    isDark: true,
  },
  {
    name: '月光银',
    style: 'amap://styles/light',
    description: '银色月光风格',
  },
  {
    name: '远山黛',
    style: 'amap://styles/whitesmoke',
    description: '淡雅山水风格',
  },
  {
    name: '草色青',
    style: 'amap://styles/fresh',
    description: '清新草绿色调',
  },
  {
    name: '极简',
    style: 'amap://styles/grey',
    description: '极简灰白色调',
  },
  {
    name: '卫星',
    style: 'amap://styles/satellite',
    description: '卫星影像图',
  },
]

export const PRESET_VIEWS = {
  BEIJING: {
    name: '北京',
    center: [116.397428, 39.90923],
    zoom: 13,
    pitch: 50,
  },
  SHANGHAI: {
    name: '上海',
    center: [121.473701, 31.230416],
    zoom: 13,
    pitch: 50,
  },
  GUANGZHOU: {
    name: '广州',
    center: [113.264385, 23.129112],
    zoom: 13,
    pitch: 50,
  },
  SHENZHEN: {
    name: '深圳',
    center: [114.057868, 22.543099],
    zoom: 13,
    pitch: 50,
  },
  CHINA: {
    name: '全国',
    center: [104.195397, 35.86166],
    zoom: 5,
    pitch: 30,
  },
}

export const ANIMATION_PRESETS = {
  CIRCLE_VIEW: {
    name: '环绕视角',
    animate: (controller: any) => {
      return [
        { pitch: 60, zoom: 16, rotation: 0, duration: 2000 },
        { pitch: 60, zoom: 16, rotation: 90, duration: 2000 },
        { pitch: 60, zoom: 16, rotation: 180, duration: 2000 },
        { pitch: 60, zoom: 16, rotation: 270, duration: 2000 },
        { pitch: 60, zoom: 16, rotation: 360, duration: 2000 },
      ]
    },
  },
  ZOOM_IN: {
    name: '缩放进入',
    animate: (controller: any) => {
      return [
        { zoom: 5, pitch: 0, duration: 2000 },
        { zoom: 13, pitch: 50, duration: 2000 },
      ]
    },
  },
  DRONE_FLIGHT: {
    name: '无人机飞行',
    animate: (controller: any) => {
      return [
        { pitch: 0, zoom: 5, rotation: 0, duration: 1500 },
        { pitch: 30, zoom: 10, rotation: 90, duration: 1500 },
        { pitch: 60, zoom: 15, rotation: 180, duration: 1500 },
        { pitch: 50, zoom: 13, rotation: 0, duration: 1500 },
      ]
    },
  },
}
