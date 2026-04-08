import { Context, h } from 'koishi'
import { PluginConfig } from '../types'
import { BlessingAPI } from '../api'
import { SkyLogger } from '../logger'

// 🖼️ 注册「光遇抽签图」命令：仅发送图片
export function registerImageCommand(
  ctx: Context,
  config: PluginConfig,
  api: BlessingAPI,
  logger: SkyLogger
) {
  ctx.command(config.commandNames.image)
    .action(async ({ session }) => {
      logger.info(`[光遇抽签图] 🎯 命令触发, userId=${session.userId}, platform=${session.platform}`)
      logger.info(`[光遇抽签图] ⚙️ 配置: backendUrl=${config.backendUrl}`)
      logger.info(`[光遇抽签图] 📋 paramMappings: ${JSON.stringify(config.paramMappings)}`)

      try {
        // 🔄 解析参数
        const params = api.resolveParams(config.paramMappings, session)
        logger.info(`[光遇抽签图] ✅ 解析参数: ${JSON.stringify(params)}`)

        // 📡 请求图片
        const imageBuffer = await api.fetchBlessing('image', params, 'image') as Buffer
        logger.info(`[光遇抽签图] 🖼️ 图片接收成功, 大小=${imageBuffer.length} bytes`)

        // 🖼️ 构建消息（始终使用Base64）
        const message = h('image', { url: api.toBase64Image(imageBuffer) })
        logger.info(`[光遇抽签图] 🖼️ 图片已转换为Base64`)

        // 💬 发送消息（根据配置决定是否引用回复）
        logger.info(`[光遇抽签图] 📤 发送消息中...`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}${message}`)
        logger.info(`[光遇抽签图] ✅ 发送成功`)
      } catch (error: any) {
        logger.error(`[光遇抽签图] ❌ 错误: ${error?.message || error}`)
        logger.error(`[光遇抽签图] 📚 堆栈: ${error?.stack}`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}图片获取失败了呢~`)
      }
    })
}
