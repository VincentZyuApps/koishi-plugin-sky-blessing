import { Context } from 'koishi'
import { BlessingResult, PluginConfig, ParamMapping } from './types'
import { SkyLogger } from './logger'
import * as crypto from 'crypto'

// 🔮 祈福签 API 客户端类，负责与后端通信
export class BlessingAPI {
  private logger: SkyLogger
  
  constructor(
    private ctx: Context,      // 📡 Koishi 上下文
    private config: PluginConfig  // ⚙️ 插件配置
  ) {
    // Logger will be set externally via setLogger method or imported from index
    this.logger = null as any // Will be initialized by caller
  }
  
  /**
   * 设置日志器实例
   */
  setLogger(logger: SkyLogger) {
    this.logger = logger
  }

  /**
   * 🔄 根据映射配置解析参数值
   * ⚠️ 重复的 key 只有第一个启用的生效
   */
  resolveParams(mappings: ParamMapping[], session: any): Record<string, string> {
    const params: Record<string, string> = {}
    const seenKeys = new Set<string>()
    this.logger.info(`[BlessingAPI] 🔍 resolveParams: ${mappings.length} 条映射, session.platform=${session.platform}, userId=${session.userId}`)

    for (const mapping of mappings) {
      if (!mapping.enabled || seenKeys.has(mapping.key)) {
        this.logger.info(`[BlessingAPI] ⏭️ 跳过 key=${mapping.key} (enabled=${mapping.enabled}, seen=${seenKeys.has(mapping.key)})`)
        continue
      }
      seenKeys.add(mapping.key)

      switch (mapping.value) {
        case 'platform':
          params[mapping.key] = session.platform ?? ''
          this.logger.info(`[BlessingAPI] 🌐 ${mapping.key}=platform -> "${params[mapping.key]}"`)
          break
        case 'userid':
          params[mapping.key] = String(session.userId ?? '')
          this.logger.info(`[BlessingAPI] 🆔 ${mapping.key}=userid -> "${params[mapping.key]}"`)
          break
        case 'date':
          params[mapping.key] = new Date().toISOString().split('T')[0]
          this.logger.info(`[BlessingAPI] 📅 ${mapping.key}=date -> "${params[mapping.key]}"`)
          break
        case 'nickname':
          params[mapping.key] = session.username ?? ''
          this.logger.info(`[BlessingAPI] 👤 ${mapping.key}=nickname -> "${params[mapping.key]}"`)
          break
        case 'avatar_hash':
          params[mapping.key] = session.avatar
            ? crypto.createHash('md5').update(session.avatar).digest('hex')
            : ''
          this.logger.info(`[BlessingAPI] 🖼️ ${mapping.key}=avatar_hash -> "${params[mapping.key].substring(0, 8)}..."`)
          break
      }
    }

    this.logger.info(`[BlessingAPI] ✅ 最终参数: ${JSON.stringify(params)}`)
    return params
  }

  /**
   * 📡 调用 /blessing 端点
   */
  async fetchBlessing(
    type: 'image' | 'json' | 'json_without_image',
    params: Record<string, string> = {}
  ): Promise<BlessingResult | Buffer> {
    const url = `${this.config.backendUrl}/blessing`
    this.logger.info(`[BlessingAPI] 🚀 fetchBlessing type=${type} url=${url}`)

    if (type === 'image') {
      const response = await this.ctx.http.get(url, {
        responseType: 'arraybuffer',
        params: { type, ...params }
      })
      const buf = Buffer.from(response)
      this.logger.info(`[BlessingAPI] 🖼️ 图片响应: ${buf.length} bytes`)
      return buf
    }

    const data = await this.ctx.http.get<BlessingResult>(url, {
      params: { type, ...params }
    })
    this.logger.info(`[BlessingAPI] 📄 JSON响应: fortune_level=${data.fortune_level}`)
    return data
  }

  /**
   * 🔄 将 buffer 转为 base64 data URI 格式
   */
  toBase64Image(buffer: Buffer): string {
    return `data:image/png;base64,${buffer.toString('base64')}`
  }
}
