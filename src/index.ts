import { Context } from 'koishi'
import { ConfigSchema } from './config'
import { PluginConfig, USAGE } from './types'
import { createLogger, SkyLogger } from './logger'
import { BlessingAPI } from './api'
import { registerImageCommand } from './commands/image'
import { registerTextCommand } from './commands/text'
import { registerQQMarkdownCommand } from './commands/qq-markdown'

export const name = 'sky-blessing'

export const usage = USAGE

export const inject = {
  required: ['http']
}

export const reusable = true

export const Config = ConfigSchema

let globalLogger: SkyLogger | null = null

export function apply(ctx: Context, config: PluginConfig) {
  // 初始化自定义 logger
  globalLogger = createLogger(ctx, config)
  globalLogger.info('[sky-blessing] 🚀 插件加载中...')
  globalLogger.debug(`[sky-blessing] ⚙️ 完整配置: ${JSON.stringify(config, null, 2)}`)
  
  const api = new BlessingAPI(ctx, config)
  api.setLogger(globalLogger)
  
  registerImageCommand(ctx, config, api, globalLogger)
  registerTextCommand(ctx, config, api, globalLogger)
  registerQQMarkdownCommand(ctx, config, api, globalLogger)
  
  globalLogger.info('[sky-blessing] ✅ 光遇抽签插件已加载')
}

/**
 * 获取全局 logger 实例
 */
export function getLogger(): SkyLogger | null {
  return globalLogger
}
