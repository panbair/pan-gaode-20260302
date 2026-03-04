/**
 * 日志管理工具
 * 提供统一的日志接口，支持日志级别控制
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export class Logger {
  private static instance: Logger | null = null
  private level = LogLevel.INFO
  private prefix = '[MapEffect]'

  private constructor() {
    // 从环境变量读取日志级别
    const envLevel = import.meta.env.VITE_LOG_LEVEL
    if (envLevel) {
      this.level = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.level = level
  }

  /**
   * 设置日志前缀
   */
  setPrefix(prefix: string): void {
    this.prefix = prefix
  }

  /**
   * 调试日志
   */
  debug(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`${this.prefix} ${message}`, ...args)
    }
  }

  /**
   * 信息日志
   */
  info(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`${this.prefix} ${message}`, ...args)
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`${this.prefix} ${message}`, ...args)
    }
  }

  /**
   * 错误日志
   */
  error(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`${this.prefix} ${message}`, ...args)
    }
  }

  /**
   * 分组开始
   */
  group(message: string): void {
    if (this.level <= LogLevel.DEBUG) {
      console.group(`${this.prefix} ${message}`)
    }
  }

  /**
   * 分组结束
   */
  groupEnd(): void {
    if (this.level <= LogLevel.DEBUG) {
      console.groupEnd()
    }
  }

  /**
   * 计时开始
   */
  time(label: string): void {
    if (this.level <= LogLevel.DEBUG) {
      console.time(`${this.prefix} ${label}`)
    }
  }

  /**
   * 计时结束
   */
  timeEnd(label: string): void {
    if (this.level <= LogLevel.DEBUG) {
      console.timeEnd(`${this.prefix} ${label}`)
    }
  }

  /**
   * 表格输出
   */
  table(data: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.table(data)
    }
  }

  /**
   * 创建子 Logger
   */
  child(prefix: string): Logger {
    const childLogger = new Logger()
    childLogger.setLevel(this.level)
    childLogger.setPrefix(`${this.prefix}:${prefix}`)
    return childLogger
  }
}

// 导出默认实例
export const logger = Logger.getInstance()
