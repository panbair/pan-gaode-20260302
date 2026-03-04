import { markRaw } from 'vue'
import type { MapEffect } from './effectsConfig'
import {
  Share,
  WindPower,
  TrendCharts,
  Odometer,
  DataLine,
  Sunny,
  Moon,
  Operation,
  Location,
  LocationFilled,
  Document
} from '@element-plus/icons-vue'

export const EFFECTS_LIST: MapEffect[] = [
  {
    id: 1,
    name: '脉冲标记',
    description: '周期性脉冲动画，支持自定义颜色和速度',
    category: 'marker',
    difficulty: '入门',
    icon: markRaw(Share),
    apiVersion: '2.0',
    codeExample: `// 脉冲标记
const marker = new AMap.Marker({
  position: [116.397428, 39.90923],
  map: map,
  content: '<div class="pulse-marker"></div>',
  offset: new AMap.Pixel(-10, -10)
});`
  },
  {
    id: 2,
    name: '运行轨迹',
    description: '小车沿着路径行驶，双色渐变轨迹显示',
    category: 'path',
    difficulty: '初级',
    icon: markRaw(Operation),
    apiVersion: '2.0',
    codeExample: `// 运行轨迹
const marker = new AMap.Marker({
  map: map,
  position: path[0],
  icon: '/car.png',
  autoRotation: true
});
marker.moveAlong(path, {
  duration: 2000,
  autoRotation: true
});`
  },
  {
    id: 3,
    name: '热力区域',
    description: '数据密度分布，平滑热力渐变效果',
    category: 'area',
    difficulty: '中级',
    icon: markRaw(TrendCharts),
    apiVersion: '2.0 + Loca',
    codeExample: `// 热力图层
const heatLayer = new Loca.HeatMapLayer({
  map: map,
  zIndex: 10,
  opacity: 0.6
});`
  },
  {
    id: 4,
    name: '3D建筑',
    description: '立体建筑展示，真实3D模型',
    category: '3d',
    difficulty: '高级',
    icon: markRaw(Odometer),
    apiVersion: '2.0',
    codeExample: `// 3D建筑
const map = new AMap.Map('container', {
  viewMode: '3D',
  pitch: 50,
  showBuildingBlock: true
});`
  },
  {
    id: 5,
    name: '粒子流',
    description: '海量粒子渲染，流动数据可视化',
    category: 'particle',
    difficulty: '高级',
    icon: markRaw(DataLine),
    apiVersion: '2.0 + Loca',
    codeExample: `// 粒子流层
const scatterLayer = new Loca.ScatterLayer({
  map: map,
  zIndex: 10,
  opacity: 0.8
});`
  },
  {
    id: 6,
    name: '晴天天气',
    description: '真实光照和阴影效果',
    category: 'weather',
    difficulty: '中级',
    icon: markRaw(Sunny),
    apiVersion: '2.0',
    codeExample: `// 晴天天气
map.setSun({
  position: [0, 0, 500000],
  color: '#fff5cc',
  intensity: 0.8
});`
  },
  {
    id: 7,
    name: '夜晚模式',
    description: '城市夜景灯光效果',
    category: 'weather',
    difficulty: '中级',
    icon: markRaw(Moon),
    apiVersion: '2.0',
    codeExample: `// 夜晚模式
map.setStyle('amap://styles/dark');
map.setAmbientLight({
  color: '#ffffff',
  intensity: 0.3
});`
  },
  {
    id: 8,
    name: '标记聚合',
    description: '智能标记聚合，避免重叠',
    category: 'marker',
    difficulty: '中级',
    icon: markRaw(Location),
    apiVersion: '2.0',
    codeExample: `// 标记聚合
const cluster = new AMap.MarkerClusterer(
  map,
  markers,
  { gridSize: 80 }
);`
  },
  {
    id: 9,
    name: '飞行轨迹',
    description: '3D弧线路径动画，从北京出发到各地的脉冲移动效果',
    category: 'path',
    difficulty: '初级',
    icon: markRaw(WindPower),
    apiVersion: '2.0 + Loca',
    codeExample: `// 飞行轨迹
const layer = new Loca.PulseLinkLayer({
  map: map,
  zIndex: 10,
  opacity: 1,
  visible: true
});
layer.setSource(geoSource);
layer.setStyle({
  unit: 'meter',
  dash: [40000, 0, 40000, 0],
  lineWidth: [2000, 500],
  height: (index, feat) => feat.distance / 2,
  lineColors: ['#FF6B6B', '#FFA07A'],
  maxHeightScale: 0.3
});`
  },
  {
    id: 10,
    name: '区域覆盖',
    description: '自定义多边形，丰富样式',
    category: 'area',
    difficulty: '入门',
    icon: markRaw(LocationFilled),
    apiVersion: '2.0',
    codeExample: `// 区域覆盖
const polygon = new AMap.Polygon({
  path: pathArray,
  strokeColor: '#FF33FF',
  fillColor: '#1791fc',
  fillOpacity: 0.4
});
polygon.setMap(map);`
  },
  {
    id: 11,
    name: '海量点云',
    description: '百万级数据点，WebGL加速',
    category: 'particle',
    difficulty: '高级',
    icon: markRaw(DataLine),
    apiVersion: '2.0 + Loca',
    codeExample: `// 海量点云
const scatter = new Loca.ScatterLayer({
  map: map,
  zIndex: 120
});
scatter.setData(data);`
  },
  {
    id: 12,
    name: '雨雪天气',
    description: '真实雨雪效果，可调强度',
    category: 'weather',
    difficulty: '中级',
    icon: markRaw(Moon),
    apiVersion: '2.0',
    codeExample: `// 雨雪天气
map.setWeather({
  type: 'rain',
  intensity: 0.5
});`
  },
  {
    id: 13,
    name: '文字标注',
    description: '高性能文字图层，支持碰撞检测',
    category: 'marker',
    difficulty: '初级',
    icon: markRaw(Document),
    apiVersion: '2.0 + Loca',
    codeExample: `// 文字标注
const labelLayer = new AMap.LabelsLayer({
  rejectMapMask: true,
  collision: true,
  animation: true
});
const label = new AMap.LabelMarker({
  name: '标注',
  position: [116.397428, 39.90923],
  text: {
    content: '标注内容',
    style: {
      fontSize: 14,
      fillColor: '#fff'
    }
  }
});
labelLayer.add(label);
map.add(labelLayer);`
  }
]
