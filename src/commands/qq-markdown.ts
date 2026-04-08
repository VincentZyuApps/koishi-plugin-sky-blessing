import { Context, h } from 'koishi'
import { PluginConfig, BlessingResult } from '../types'
import { BlessingAPI } from '../api'
import { SkyLogger } from '../logger'

// 📝 注册「光遇抽签md」命令：发送图片 + Markdown（仅QQ平台）
export function registerQQMarkdownCommand(
  ctx: Context,
  config: PluginConfig,
  api: BlessingAPI,
  logger: SkyLogger
) {
  ctx.command(config.commandNames.qqMarkdown)
    .action(async ({ session }) => {
      logger.info(`[光遇抽签md] 🎯 命令触发, platform=${session.platform}`)

      // 🚫 非QQ平台直接拒绝
      if (session.platform !== 'qq') {
        logger.warn(`[光遇抽签md] ⛔ 平台拒绝: platform=${session.platform} (非QQ)`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}此命令仅在QQ官方bot平台可用哦~`)
        return
      }

      try {
        // 🔄 解析参数
        const params = api.resolveParams(config.paramMappings, session)
        logger.info(`[光遇抽签md] ✅ 解析参数: ${JSON.stringify(params)}`)

        // 📡 请求 JSON 数据
        const result = await api.fetchBlessing('json', params) as BlessingResult
        logger.info(`[光遇抽签md] 📄 JSON结果: fortune_level=${result.fortune_level}`)

        // 📝 构建 Markdown 内容（从后端值中提取标签）
        // 后端返回格式如："结缘物：遥鲲"、"缘彩：梧枝绿"，提取冒号前后分别加粗和显示
        const extractLabelAndValue = (text: string): [string, string] => {
          const idx = text.indexOf('：')
          if (idx === -1) return ['', text]
          return [text.substring(0, idx), text.substring(idx + 1)]
        }
        const [dordasLabel, dordasValue] = extractLabelAndValue(result.dordas)
        const [colorLabel, colorValue] = extractLabelAndValue(result.dordas_color)
        
        const [entryLabel, entryValue] = extractLabelAndValue(result.entry)
        
        const markdownContent = `# \u{1F38B} ${result.fortune_level}\n\n` +
          `**${dordasLabel}**：${dordasValue}\n` +
          `**${colorLabel}**：${colorValue}\n` +
          `**🎨 色值**：\`${result.color_hex}\`\n\n` +
          `> ${result.blessing}\n\n` +
          `**${entryLabel}**：${entryValue}`

        logger.info(`[光遇抽签md] 📄 Markdown内容: ${markdownContent}`)

        // 🖼️ 先发送图片
        let imageSegment
        if (config.sendBase64 && result.image_base64) {
          imageSegment = h('image', {
            url: `data:image/png;base64,${result.image_base64}`
          })
        } else {
          const imageBuffer = await api.fetchBlessing('image', params) as Buffer
          imageSegment = h('image', { url: api.toBase64Image(imageBuffer) })
        }

        // 💬 发送图片（根据配置决定是否引用回复）
        logger.info(`[光遇抽签md] 📤 发送图片中...`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}${imageSegment}`)
        logger.info(`[光遇抽签md] 📤 发送Markdown中...`)

        // 📱 使用 QQ 平台原生 Markdown API 发送
        await session.bot.internal.sendMessage(session.channelId, {
          msg_id: session.messageId,
          msg_type: 2,
          markdown: {
            content: markdownContent,
          },
        })

        logger.info(`[光遇抽签md] ✅ 发送成功`)
      } catch (error: any) {
        logger.error(`[光遇抽签md] ❌ 错误: ${error?.message || error}`)
        logger.error(`[光遇抽签md] 📚 堆栈: ${error?.stack}`)
        const quotePart = config.enableQuote ? h.quote(session.messageId) : ''
        await session.send(`${quotePart}抽签失败了呢~`)
      }
    })
}
