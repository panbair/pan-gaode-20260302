/**
 * 地理数据生成器
 * 基于源码学习，提供常用的地理数据生成方法
 */

export interface Point {
  lng: number
  lat: number
}

export interface GeoFeature {
  type: 'Feature'
  properties: Record<string, any>
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon'
    coordinates: number[] | number[][] | number[][][]
  }
}

export interface GeoData {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

export class GeoDataGenerator {
  private static DEFAULT_CENTER: Point = {
    lng: 116.397428,
    lat: 39.90923,
  }

  /**
   * 生成随机点位
   */
  static generateRandomPoints(
    count: number,
    center: Point = GeoDataGenerator.DEFAULT_CENTER,
    radius: number = 0.1
  ): Point[] {
    const points: Point[] = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * radius
      points.push({
        lng: center.lng + Math.cos(angle) * distance,
        lat: center.lat + Math.sin(angle) * distance,
      })
    }

    return points
  }

  /**
   * 生成 GeoJSON 点位数据
   */
  static generateGeoPoints(
    count: number,
    center: Point = GeoDataGenerator.DEFAULT_CENTER,
    radius: number = 0.1,
    properties?: (index: number) => Record<string, any>
  ): GeoData {
    const points = GeoDataGenerator.generateRandomPoints(count, center, radius)

    return {
      type: 'FeatureCollection',
      features: points.map((point, index) => ({
        type: 'Feature',
        properties: properties ? properties(index) : { index },
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat],
        },
      })),
    }
  }

  /**
   * 生成辐射线条
   */
  static generateRadialLines(
    center: Point,
    lineCount: number,
    minDistance: number = 0.02,
    maxDistance: number = 0.08
  ): GeoData {
    const features: GeoFeature[] = []

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const distance = minDistance + Math.random() * (maxDistance - minDistance)
      const endLng = center.lng + Math.cos(angle) * distance
      const endLat = center.lat + Math.sin(angle) * distance

      features.push({
        type: 'Feature',
        properties: {
          distance,
          angle,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [center.lng, center.lat],
            [endLng, endLat],
          ],
        },
      })
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  }

  /**
   * 生成连接线条
   */
  static generateConnectingLines(
    from: Point,
    to: Point,
    lineCount: number = 10
  ): GeoData {
    const features: GeoFeature[] = []

    for (let i = 0; i < lineCount; i++) {
      const t = i / (lineCount - 1)
      const midLng = from.lng + (to.lng - from.lng) * t + (Math.random() - 0.5) * 0.02
      const midLat = from.lat + (to.lat - from.lat) * t + (Math.random() - 0.5) * 0.02

      features.push({
        type: 'Feature',
        properties: {
          index: i,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [from.lng, from.lat],
            [midLng, midLat],
            [to.lng, to.lat],
          ],
        },
      })
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  }

  /**
   * 生成贝塞尔曲线
   */
  static generateBezierCurves(
    from: Point,
    to: Point,
    curveCount: number = 5,
    heightMultiplier: number = 0.1
  ): GeoData {
    const features: GeoFeature[] = []
    const midLng = (from.lng + to.lng) / 2
    const midLat = (from.lat + to.lat) / 2
    const distance = Math.sqrt(
      Math.pow(to.lng - from.lng, 2) + Math.pow(to.lat - from.lat, 2)
    )

    for (let i = 0; i < curveCount; i++) {
      const angle = (i / curveCount) * Math.PI * 2
      const height = distance * heightMultiplier
      const controlLng = midLng + Math.cos(angle) * height
      const controlLat = midLat + Math.sin(angle) * height

      features.push({
        type: 'Feature',
        properties: {
          height: distance * 100000 * (0.8 + Math.random() * 0.4),
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [from.lng, from.lat],
            [controlLng, controlLat],
            [to.lng, to.lat],
          ],
        },
      })
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  }

  /**
   * 生成多边形
   */
  static generatePolygon(
    center: Point,
    radius: number = 0.05,
    sides: number = 6,
    rotation: number = 0
  ): GeoData {
    const coordinates: number[][] = []

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + rotation
      coordinates.push([
        center.lng + Math.cos(angle) * radius,
        center.lat + Math.sin(angle) * radius,
      ])
    }

    coordinates.push(coordinates[0]) // 闭合多边形

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
        },
      ],
    }
  }

  /**
   * 生成圆形网格
   */
  static generateCircleGrid(
    center: Point,
    rings: number = 5,
    pointsPerRing: number = 12
  ): GeoData {
    const features: GeoFeature[] = []

    for (let ring = 0; ring < rings; ring++) {
      const radius = (ring + 1) * 0.02

      for (let i = 0; i < pointsPerRing; i++) {
        const angle = (i / pointsPerRing) * Math.PI * 2
        features.push({
          type: 'Feature',
          properties: {
            ring,
            angle,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              center.lng + Math.cos(angle) * radius,
              center.lat + Math.sin(angle) * radius,
            ],
          },
        })
      }
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  }

  /**
   * 生成热力数据
   */
  static generateHeatmapData(
    count: number = 100,
    center: Point = GeoDataGenerator.DEFAULT_CENTER,
    radius: number = 0.1
  ): GeoData {
    const points = GeoDataGenerator.generateRandomPoints(count, center, radius)

    return {
      type: 'FeatureCollection',
      features: points.map((point) => ({
        type: 'Feature',
        properties: {
          value: Math.random(),
        },
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat],
        },
      })),
    }
  }
}
