import { Context } from 'koishi'
import { PluginConfig } from './types'

// 🔊 日志级别枚举（数值越小越严重）
const LOG_LEVELS = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
} as const

type LogLevel = keyof typeof LOG_LEVELS

/**
 * 📝 自定义 Logger 类，支持按级别过滤日志
 */
export class SkyLogger {
  private level: number

  constructor(private ctx: Context, config: PluginConfig) {
    this.level = LOG_LEVELS[config.logLevel] ?? LOG_LEVELS.info
  }

  /**
   * 更新日志级别
   */
  setLevel(level: LogLevel) {
    this.level = LOG_LEVELS[level] ?? LOG_LEVELS.info
  }

  /**
   * 🔇 静默级别 - 不输出任何日志
   */
  silent(_message?: any, ..._args: any[]) {
    //  intentionally empty
  }

  /**
   * ❌ 错误级别
   */
  error(message: any, ...args: any[]) {
    if (this.level >= LOG_LEVELS.error) {
      this.ctx.logger.error(message, ...args)
    }
  }

  /**
   * ⚠️ 警告级别
   */
  warn(message: any, ...args: any[]) {
    if (this.level >= LOG_LEVELS.warn) {
      this.ctx.logger.warn(message, ...args)
    }
  }

  /**
   * ℹ️ 信息级别
   */
  info(message: any, ...args: any[]) {
    if (this.level >= LOG_LEVELS.info) {
      this.ctx.logger.info(message, ...args)
    }
  }

  /**
   * 🐛 调试级别
   */
  debug(message: any, ...args: any[]) {
    if (this.level >= LOG_LEVELS.debug) {
      this.ctx.logger.info(`[DEBUG] ${message}`, ...args)
    }
  }
}

/**
 * 🏭 Logger 工厂函数
 */
export function createLogger(ctx: Context, config: PluginConfig): SkyLogger {
  return new SkyLogger(ctx, config)
}
