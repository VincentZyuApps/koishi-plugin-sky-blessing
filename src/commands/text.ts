import { Context, h } from 'koishi'
import { PluginConfig, BlessingResult } from '../types'
import { BlessingAPI } from '../api'
import { SkyLogger } from '../logger'

// 📜 注册「光遇抽签」命令：发送图片 + 文字内容
export function registerTextCommand(
  ctx: Context,
  config: PluginConfig,
  api: BlessingAPI,
  logger: SkyLogger
) {
  ctx.command(config.commandNames.text)
    .action(async ({ session }) => {
      logger.info(`[光遇抽签] 🎯 命令触发, userId=${session.userId}, platform=${session.platform}`)
      logger.info(`[光遇抽签] ⚙️ 配置: backendUrl=${config.backendUrl}, sendBase64=${config.sendBase64}`)

      try {
        // 🔄 解析参数
        const params = api.resolveParams(config.paramMappings, session)
        logger.info(`[光遇抽签] ✅ 解析参数: ${JSON.stringify(params)}`)

        // 📡 请求 JSON 数据
        const result = await api.fetchBlessing('json', params) as BlessingResult
        logger.info(`[光遇抽签] 📄 JSON结果: fortune_level=${result.fortune_level}, dordas=${result.dordas}`)

        // 📝 构建文本内容
        const textParts = [
          `🎋 ${result.fortune_level}`,
          result.dordas,
          `${result.dordas_color}`,
          `「${result.blessing}」`,
          `${result.entry}`,
        ]

        // 🖼️ 构建图片部分
        let imageSegment
        if (config.sendBase64 && result.image_base64) {
          logger.info(`[光遇抽签] 🖼️ 使用 JSON 中的 base64 图片`)
          imageSegment = h('image', {
            url: `data:image/png;base64,${result.image_base64}`
          })
        } else {
          logger.info(`[光遇抽签] 📡 单独请求图片`)
          const imageBuffer = await api.fetchBlessing('image', params) as Buffer
          imageSegment = h('image', { url: api.toBase64Image(imageBuffer) })
        }

        // 💬 发送消息（根据配置决定是否引用回复）
        logger.info(`[光遇抽签] 📤 发送消息中...`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}${imageSegment}\n${textParts.join('\n')}`)
        logger.info(`[光遇抽签] ✅ 发送成功`)
      } catch (error: any) {
        logger.error(`[光遇抽签] ❌ 错误: ${error?.message || error}`)
        logger.error(`[光遇抽签] 📚 堆栈: ${error?.stack}`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}抽签失败了呢~`)
      }
    })
}
