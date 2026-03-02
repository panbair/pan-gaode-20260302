export interface EffectParam {
  param: string
  type: string
  required: boolean
  default: string
  description: string
}

export interface MapEffect {
  id: number
  name: string
  description: string
  category: string
  difficulty: string
  icon: any
  apiVersion: string
  codeExample: string
}

export interface Category {
  label: string
  value: string
}

export const CATEGORIES: Category[] = [
  { label: '标记', value: 'marker' },
  { label: '路径', value: 'path' },
  { label: '区域', value: 'area' },
  { label: '3D', value: '3d' },
  { label: '粒子', value: 'particle' },
  { label: '天气', value: 'weather' }
]

export const DIFFICULTY_TYPES: Record<string, string> = {
  入门: 'success',
  初级: 'primary',
  中级: 'warning',
  高级: 'danger'
}

export const DEFAULT_CENTER = {
  lng: 116.397428,
  lat: 39.90923
}

export const PULSE_COLORS = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#f39c12',
  '#9b59b6'
]
