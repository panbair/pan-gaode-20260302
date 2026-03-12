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
  Document,
  Warning,
  Star,
  MagicStick,
  Grid,
  ArrowRight,
  MoonNight
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
    id: 13,
    name: '3D热力图',
    description: '3D立体热力图，高度映射热度',
    category: 'area',
    difficulty: '高级',
    icon: markRaw(Warning),
    apiVersion: '2.0',
    codeExample: `// 3D热力图
const heatmap = new AMap.HeatMap(map, {
  '3d': {
    heightBezier: [0.4, 0.2, 0.4, 0.8],
    gridSize: 2,
    heightScale: 1
  }
});
heatmap.setDataSet({
  data: heatmapData,
  max: 100
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
  },
  {
    id: 14,
    name: '3D柱状图',
    description: '立体柱状图可视化，展示城市GDP和人口数据',
    category: '3d',
    difficulty: '高级',
    icon: markRaw(TrendCharts),
    apiVersion: '2.0 + Loca',
    codeExample: `// 3D柱状图
const prismLayer = new Loca.PrismLayer({
  zIndex: 10,
  opacity: 1,
  hasSide: true
});
prismLayer.setSource(geoSource);
prismLayer.setStyle({
  unit: 'meter',
  sideNumber: 4,
  topColor: (index, f) => {
    return f.properties['GDP'] > 7000 ? '#E97091' : '#2852F1';
  },
  height: (index, f) => {
    return Math.sqrt(f.properties['GDP']) * 9000;
  }
});
loca.add(prismLayer);`
  },
  {
    id: 15,
    name: '全息标牌',
    description: '超酷炫全息立牌效果,立体标牌、浮动图标、呼吸光环、全息扫描线',
    category: '3d',
    difficulty: '高级',
    icon: markRaw(Star),
    apiVersion: '2.0 + Loca',
    codeExample: `// 全息标牌
const zMarkerLayer = new Loca.ZMarkerLayer({
  loca: loca,
  zIndex: 120,
  depth: false
});
zMarkerLayer.setSource(geoSource);
zMarkerLayer.setStyle({
  content: (i, feat) => createHologramLabel(feat),
  unit: 'meter',
  rotation: 0,
  alwaysFront: true,
  size: [260, 120],
  altitude: 0
});

// 浮动三角
const triangleLayer = new Loca.ZMarkerLayer({
  loca: loca,
  zIndex: 119,
  depth: false
});
triangleLayer.setSource(geoSource);
triangleLayer.setStyle({
  content: (i, feat) => createTriangleIcon(feat),
  unit: 'meter',
  alwaysFront: true,
  size: [80, 80],
  altitude: 25
});
triangleLayer.addAnimate({
  key: 'altitude',
  value: [0, 8],
  random: true,
  transform: 1500,
  yoyo: true,
  repeat: 999999
});

// 呼吸光环
const scatterLayer = new Loca.ScatterLayer({
  loca,
  zIndex: 110,
  opacity: 1,
  depth: false
});
scatterLayer.setSource(geoSource);
scatterLayer.setStyle({
  unit: 'meter',
  size: [120, 120],
  texture: createRingTexture(),
  altitude: 30,
  duration: 2000,
  animate: true
});
loca.add(scatterLayer);`
  },
  {
    id: 16,
    name: '三色灯光建筑',
    description: '三色动态点光源打造炫酷建筑效果，青色垂直运动、橙色粉色环形运动',
    category: 'building',
    difficulty: '高级',
    icon: markRaw(MagicStick),
    apiVersion: '2.0 + Loca',
    codeExample: `// 三色灯光建筑特效
// 环境光
loca.ambLight = {
  intensity: 0.5,
  color: '#fff'
};

// 平行光
loca.dirLight = {
  intensity: 0.6,
  color: '#abffc8',
  target: [0, 0, 0],
  position: [0, 3, 6]
};

// 点光源1 - 青色（垂直运动）
loca.pointLight = {
  color: 'rgb(11,255,241)',
  position: [116.455825, 39.916603, 0],
  intensity: 5,
  distance: 500
};

// 点光源2 - 橙色（环形运动）
loca.pointLight2 = {
  color: 'rgb(255,75,0)',
  position: [116.456598, 39.923482, 400],
  intensity: 10,
  distance: 1500
};

// 点光源3 - 粉色（环形运动）
loca.pointLight3 = {
  color: '#f21da7',
  position: [116.455546, 39.90867, 400],
  intensity: 10,
  distance: 1500
};

// 建筑图层
const pl = new Loca.PolygonLayer({
  zIndex: 120,
  shininess: 10,
  hasSide: true
});

pl.setSource(geo);
pl.setStyle({
  topColor: 'rgba(16,128,165,1)',
  sideTopColor: 'rgba(13,43,90,1)',
  sideBottomColor: 'rgba(24,212,255,1)',
  unit: 'meter',
  height: (index, feature) => feature.properties.h,
  altitude: 0
});
pl.setCustomCenter([116.458657, 39.914862]);
loca.add(pl);`
  },
  {
    id: 17,
    name: '立体面',
    description: '赛博朋克风格3D立体面，炫酷光影系统、漂浮粒子、呼吸动画、霓虹边框、多重动画叠加',
    category: '3d',
    difficulty: '高级',
    icon: markRaw(Grid),
    apiVersion: '2.0 + Loca',
    codeExample: `// 3D立体面健康度特效 - 赛博朋克版
// 配置赛博朋克多光源光照系统
loca.ambLight = {
  intensity: 0.4,
  color: 'rgba(100, 200, 255, 0.8)'
};
loca.dirLight = {
  intensity: 0.8,
  color: 'rgba(255, 200, 100, 0.9)',
  target: [0, 0, 0],
  position: [1, -1, 2]
};
loca.pointLight = {
  color: 'rgb(100, 255, 200)',
  position: [120.24289, 30.341335, 30000],
  intensity: 4,
  distance: 80000
};
loca.pointLight2 = {
  color: 'rgb(255, 100, 255)',
  position: [120.109233, 30.246411, 25000],
  intensity: 3,
  distance: 60000
};

// 炫酷配色 - 金色到紫色渐变
const colors = [
  '#FFD700', '#FFA500', '#FF69B4', '#00CED1',
  '#00BFFF', '#4169E1', '#8A2BE2', '#9932CC', '#4B0082'
];

// 创建玻璃质感+霓虹边框的多边形
const pl = new Loca.PolygonLayer({
  zIndex: 120,
  opacity: 0.75,
  shininess: 30,
  hasSide: true,
  acceptLight: true,
  cullface: 'none'
});

pl.setSource(geo);
pl.setStyle({
  topColor: (index, feature) => getColorByHealth(feature.properties.health),
  sideTopColor: (index, feature) => getColorByHealth(feature.properties.health),
  sideBottomColor: (index, feature) => darkenColor(getColorByHealth(feature.properties.health), 0.6),
  height: (index, feature) => getHeightByHealth(feature.properties.health),
  altitude: 0,
  unit: 'meter'
});
loca.add(pl);

// 多重炫酷动画
pl.addAnimate({
  key: 'height',
  value: [0, 1],
  duration: 1500,
  easing: 'CubicInOut',
  transform: 2000,
  random: true
});
pl.addAnimate({
  key: 'altitude',
  value: [0, 200],
  duration: 3000,
  easing: 'SineInOut',
  yoyo: true,
  repeat: Infinity,
  random: true
});
pl.addAnimate({
  key: 'opacity',
  value: [0.6, 0.9],
  duration: 4000,
  easing: 'SineInOut',
  yoyo: true,
  repeat: Infinity
});

// 在健康度高的区域添加漂浮粒子
const highHealthAreas = geo.features.filter(f => f.properties.health >= 0.8);
const particleLayer = new Loca.ScatterLayer({
  zIndex: 130,
  opacity: 0.8,
  depth: false
});
particleLayer.setSource(particleSource);
particleLayer.setStyle({
  unit: 'meter',
  size: (index, feature) => feature.properties.size,
  color: (index, feature) => feature.properties.color,
  altitude: (index, feature) => Math.random() * 5000 + 10000
});
particleLayer.addAnimate({
  key: 'altitude',
  value: [0, 2000],
  duration: 3000,
  easing: 'SineInOut',
  yoyo: true,
  repeat: Infinity,
  random: true
});
particleLayer.addAnimate({
  key: 'opacity',
  value: [0.3, 1],
  duration: 2000,
  easing: 'SineInOut',
  yoyo: true,
  repeat: Infinity,
  random: true
});
loca.add(particleLayer);`
  },
  {
    id: 18,
    name: '动态流向图',
    description: '带动画箭头的流向效果，展示数据流动方向，支持单向、双向、循环流向',
    category: 'path',
    difficulty: '中级',
    icon: markRaw(ArrowRight),
    apiVersion: '2.0 + Loca',
    codeExample: `// 动态流向图特效
// 创建节点图层（城市点）
const nodeLayer = new Loca.ScatterLayer({
  zIndex: 10,
  opacity: 1,
  visible: true,
  zooms: [2, 22]
});
nodeLayer.setSource(nodeSource);
nodeLayer.setStyle({
  size: (index, item) => {
    const value = item?.properties?.value || 50;
    return [value * 4000, value * 4000];
  },
  unit: 'meter',
  texture: createNodeTexture(),
  height: (index, item) => {
    const value = item?.properties?.value || 50;
    return value * 2000;
  },
  altitudeScale: 1,
  shape: 'cylinder'
});
loca.add(nodeLayer);

// 创建流向图层（带动画箭头）
const flowLayer = new Loca.PulseLinkLayer({
  zIndex: 20,
  opacity: 1,
  visible: true,
  zooms: [2, 22]
});
flowLayer.setSource(flowSource);
flowLayer.setStyle({
  unit: 'meter',
  dash: [20000, 10000, 20000, 10000],
  lineWidth: (index, item) => {
    const value = item?.properties?.value || 50;
    return [value * 200, value * 50];
  },
  smoothSteps: 50,
  height: 50000,
  speed: (index, prop) => {
    return (prop?.speed || 1) * 10000 + Math.random() * 5000;
  },
  flowLength: 100000,
  lineColors: (index, item) => {
    const value = item?.properties?.value || 50;
    const colors = [
      ['rgba(0, 255, 255, 0.8)', 'rgba(0, 150, 255, 0.3)'],
      ['rgba(255, 100, 100, 0.8)', 'rgba(255, 50, 50, 0.3)'],
      ['rgba(100, 255, 100, 0.8)', 'rgba(50, 200, 50, 0.3)']
    ];
    const colorIndex = Math.floor(value / 20) % colors.length;
    return colors[colorIndex];
  },
  headColor: (index, item) => {
    const colors = [
      'rgba(255, 255, 255, 1)',
      'rgba(255, 200, 200, 1)',
      'rgba(200, 255, 200, 1)'
    ];
    const value = item?.properties?.value || 50;
    const colorIndex = Math.floor(value / 20) % colors.length;
    return colors[colorIndex];
  },
  trailColor: 'rgba(0, 150, 255, 0.3)',
  maxHeightScale: 0.5,
  lineType: 'arc'
});
loca.add(flowLayer);

// 添加动态箭头动画
const arrow = new AMap.Marker({
  position: [midX, midY],
  content: arrowSvg,
  offset: new AMap.Pixel(-size / 2, -size / 2),
  zIndex: 30,
  angle: angle
});

// 箭头沿路径移动动画
const animateArrow = () => {
  const progress = (Date.now() / (10000 / speed)) % 1;
  const currentX = from[0] + (to[0] - from[0]) * progress;
  const currentY = from[1] + (to[1] - from[1]) * progress;
  const arcHeight = 2;
  const arcOffset = Math.sin(progress * Math.PI) * arcHeight;
  arrow.setPosition([currentX, currentY + arcOffset]);
  requestAnimationFrame(animateArrow);
};
animateArrow();`
  },
  {
    id: 20,
    name: '建筑室内分层',
    description: '3D多层建筑室内展示，每层楼独立高度和光照，逼真玻璃质感渲染',
    category: '3d',
    difficulty: '高级',
    icon: markRaw(Grid),
    apiVersion: '2.0 + Loca',
    codeExample: `// 建筑室内分层特效
// 配置室内光照系统
loca.ambLight = {
  intensity: 0.15,
  color: '#ffffff'
};
loca.dirLight = {
  intensity: 0.15,
  color: '#ffffff',
  target: [0, 0, 0],
  position: [0, -1, 1]
};
loca.pointLight = {
  color: '#c2beff',
  position: [116.397428, 39.90923, 2000],
  intensity: 4,
  distance: 5000
};

// 创建基础楼层面
const baseLayer = new Loca.PolygonLayer({
  zIndex: 120,
  opacity: 0.8,
  shininess: 10,
  visible: false
});
baseLayer.setSource(baseGeoSource);
baseLayer.setStyle({
  topColor: '#8889ff',
  sideColor: '#8889ff',
  height: 8,
  altitude: 0,
  unit: 'meter'
});
loca.add(baseLayer);

// 创建商铺区域
const shopLayer = new Loca.PolygonLayer({
  zIndex: 125,
  opacity: 0.7,
  shininess: 20,
  hasSide: false,
  visible: false
});
shopLayer.setSource(shopGeoSource);
shopLayer.setStyle({
  topColor: '#867ef2',
  sideColor: '#867ef2',
  height: 6,
  altitude: 10,
  unit: 'meter'
});
loca.add(shopLayer);

// 添加入场动画
shopLayer.addAnimate({
  key: 'altitude',
  value: [0, 1],
  duration: 4000,
  easing: 'CircularOut',
  transform: 500
});
shopLayer.show(500);

// 视角旋转动画
loca.viewControl.addAnimates([{
  rotation: {
    value: 0,
    control: [[0, -147], [1, 0]],
    timing: [0.3, 0, 0.8, 1],
    duration: 6000
  }
}]);`
  },
  {
    id: 19,
    name: '霓虹城市夜景',
    description: '赛博朋克风格霓虹城市，多彩建筑轮廓、霓虹招牌、霓虹道路光带、炫酷光晕效果',
    category: 'weather',
    difficulty: '高级',
    icon: markRaw(MoonNight),
    apiVersion: '2.0 + Loca',
    codeExample: `// 霓虹城市夜景特效
// 配置霓虹光照系统
loca.ambLight = {
  intensity: 0.3,
  color: 'rgba(20, 30, 60, 0.8)'
};
loca.dirLight = {
  intensity: 0.6,
  color: 'rgba(180, 100, 255, 0.5)',
  target: [0, 0, 0],
  position: [0, -1, 2]
};
loca.pointLight = {
  color: 'rgb(255, 0, 128)',
  position: [116.397428, 39.90923, 50000],
  intensity: 8,
  distance: 300000
};

// 创建霓虹建筑
const neonBuildingLayer = new Loca.PrismLayer({
  zIndex: 120,
  opacity: 0.9,
  hasSide: true,
  acceptLight: true
});
neonBuildingLayer.setSource(neonBuildingSource);
neonBuildingLayer.setStyle({
  unit: 'meter',
  topColor: (index, feat) => feat.properties.baseColor,
  sideTopColor: (index, feat) => darkenColor(feat.properties.baseColor, 0.3),
  sideBottomColor: (index, feat) => darkenColor(feat.properties.baseColor, 0.6),
  height: (index, feat) => feat.properties.height,
  altitude: 0
});
loca.add(neonBuildingLayer);

// 创建霓虹招牌
const neonSignLayer = new Loca.PointLayer({
  zIndex: 130,
  opacity: 0.9
});
neonSignLayer.setSource(neonSignSource);
neonSignLayer.setStyle({
  unit: 'meter',
  radius: (index, feat) => feat.properties.size,
  color: (index, feat) => feat.properties.color
});
neonSignLayer.addAnimate({
  key: 'radius',
  value: [0.8, 1.3],
  duration: 1500,
  easing: 'SinusoidalInOut',
  random: true,
  repeat: Infinity
});
neonSignLayer.addAnimate({
  key: 'opacity',
  value: [0.6, 1],
  duration: 1200,
  easing: 'SinusoidalInOut',
  random: true,
  repeat: Infinity
});
loca.add(neonSignLayer);`
  },
  {
    id: 21,
    name: '经济波动',
    description: '用波纹动画展示经济数据的时空传播效果，自定义着色器动画，多层波纹叠加模拟经济涟漪',
    category: 'data',
    difficulty: '高级',
    icon: markRaw(TrendCharts),
    apiVersion: '2.0 + Loca',
    codeExample: `// 经济波动特效
// 配置经济中心
const economicCenters = [
  {
    id: 'bj',
    name: '北京',
    coords: [116.397428, 39.90923],
    baseGrowth: 85,
    volatility: 70,
    influenceRadius: 500000,
    color: '#ff6b6b'
  },
  {
    id: 'sh',
    name: '上海',
    coords: [121.467428, 31.22923],
    baseGrowth: 90,
    volatility: 75,
    influenceRadius: 500000,
    color: '#ffd700'
  }
];

// 创建波纹画布
const waveCanvas = document.createElement('canvas');
waveCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100';
map.getPanes().overlayPane.appendChild(waveCanvas);
const ctx = waveCanvas.getContext('2d');

// 绘制波纹（每帧更新）
function drawWaves(time) {
  ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
  economicCenters.forEach(center => {
    const centerPos = map.lngLatToContainer(center.coords);
    const gradient = ctx.createRadialGradient(
      centerPos.x, centerPos.y, 0,
      centerPos.x, centerPos.y, center.influenceRadius / map.getResolution()
    );
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 107, 107, 0.1)');
    ctx.beginPath();
    ctx.arc(centerPos.x, centerPos.y, center.influenceRadius / map.getResolution(), 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });
  requestAnimationFrame(() => drawWaves(time + 0.016));
}

// 创建粒子层（经济指标粒子）
const particleLayer = new Loca.ScatterLayer({
  zIndex: 110,
  opacity: 0.7
});
particleLayer.setSource(particleSource);
particleLayer.setStyle({
  unit: 'meter',
  size: [2000, 4000],
  texture: createParticleTexture(),
  altitude: (index, item) => Math.random() * 5000 + 2000
});
particleLayer.addAnimate({
  key: 'altitude',
  value: [0, 3000],
  duration: 4000,
  easing: 'SineInOut',
  yoyo: true,
  repeat: Infinity
});
loca.add(particleLayer);`
  }
]
