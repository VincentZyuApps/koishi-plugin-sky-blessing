import { Context } from 'koishi'
import { BlessingResult, PluginConfig, ParamMapping, BlessingStats } from './types'
import { SkyLogger } from './logger'
import * as crypto from 'crypto'

// 🔮 祈福签 API 客户端类，负责与后端通信
export class BlessingAPI {
  private logger: SkyLogger
  private stats: BlessingStats[] = []  // 📊 统计数据存储
  
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
    // ✅ 设置logger后立即验证配置
    this.validateConfig()
  }

  /**
   * ✅ 验证配置合法性
   */
  private validateConfig(): void {
    // 1️⃣ 验证 backendUrl 格式
    try {
      const url = new URL(this.config.backendUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        this.logger.error(`❌ backendUrl 协议无效: ${this.config.backendUrl} (必须是 http:// 或 https://)`)
      } else {
        this.logger.info(`✅ backendUrl 格式验证通过: ${this.config.backendUrl}`)
      }
    } catch (error) {
      this.logger.error(`❌ backendUrl 格式无效: ${this.config.backendUrl} (${error instanceof Error ? error.message : '未知错误'})`)
    }

    // 2️⃣ 检查 paramMappings 是否有重复的 key
    const enabledMappings = this.config.paramMappings.filter(m => m.enabled)
    const keyMap = new Map<string, number>()
    
    for (let i = 0; i < enabledMappings.length; i++) {
      const mapping = enabledMappings[i]
      if (keyMap.has(mapping.key)) {
        const firstIndex = keyMap.get(mapping.key)!
        this.logger.warn(
          `⚠️ 参数映射存在重复的 key "${mapping.key}"：第 ${firstIndex + 1} 行和第 ${i + 1} 行冲突，只有第 ${firstIndex + 1} 行会生效`
        )
      } else {
        keyMap.set(mapping.key, i)
      }
    }
    
    this.logger.info(`✅ 配置验证完成`)
  }

  /**
   * 📊 记录抽签统计数据
   */
  private recordStats(stats: BlessingStats): void {
    this.stats.push(stats)
    this.logger.debug(`📊 统计数据已记录 (总计: ${this.stats.length} 次抽签)`)
    
    // 保留最近1000条记录，防止内存溢出
    if (this.stats.length > 1000) {
      this.stats = this.stats.slice(-1000)
    }
  }

  /**
   * 📈 获取统计摘要
   */
  getStatsSummary(): { total: number; recent: BlessingStats[] } {
    return {
      total: this.stats.length,
      recent: this.stats.slice(-10) // 返回最近10条
    }
  }

  /**
   * 🔄 根据映射配置解析参数值
   * ⚠️ 重复的 key 只有第一个启用的生效
   */
  resolveParams(mappings: ParamMapping[], session: any): Record<string, string> {
    const params: Record<string, string> = {}
    const seenKeys = new Set<string>()
    this.logger.debug(`[BlessingAPI] 🔍 resolveParams: ${mappings.length} 条映射, session.platform=${session.platform}, userId=${session.userId}`)

    for (const mapping of mappings) {
      if (!mapping.enabled || seenKeys.has(mapping.key)) {
        this.logger.debug(`[BlessingAPI] ⏭️ 跳过 key=${mapping.key} (enabled=${mapping.enabled}, seen=${seenKeys.has(mapping.key)})`)
        continue
      }
      seenKeys.add(mapping.key)

      switch (mapping.value) {
        case 'platform':
          params[mapping.key] = session.platform ?? ''
          this.logger.debug(`[BlessingAPI] 🌐 ${mapping.key}=platform -> "${params[mapping.key]}"`)
          break
        case 'userid':
          params[mapping.key] = String(session.userId ?? '')
          this.logger.debug(`[BlessingAPI] 🆔 ${mapping.key}=userid -> "${params[mapping.key]}"`)
          break
        case 'date':
          params[mapping.key] = new Date().toISOString().split('T')[0]
          this.logger.debug(`[BlessingAPI] 📅 ${mapping.key}=date -> "${params[mapping.key]}"`)
          break
        case 'nickname':
          params[mapping.key] = session.username ?? ''
          this.logger.debug(`[BlessingAPI] 👤 ${mapping.key}=nickname -> "${params[mapping.key]}"`)
          break
        case 'avatar_hash':
          params[mapping.key] = session.avatar
            ? crypto.createHash('md5').update(session.avatar).digest('hex')
            : ''
          this.logger.debug(`[BlessingAPI] 🖼️ ${mapping.key}=avatar_hash -> "${params[mapping.key].substring(0, 8)}..."`)
          break
      }
    }

    this.logger.debug(`[BlessingAPI] ✅ 最终参数: ${JSON.stringify(params)}`)
    return params
  }

  /**
   * 📡 调用 /blessing 端点（带计时和统计）
   */
  async fetchBlessing(
    type: 'image' | 'json' | 'json_without_image',
    params: Record<string, string> = {},
    commandType: 'image' | 'text' | 'qq-markdown' = 'image'
  ): Promise<BlessingResult | Buffer> {
    const url = `${this.config.backendUrl}/blessing`
    const startTime = Date.now()
    
    this.logger.debug(`[BlessingAPI] 🚀 fetchBlessing type=${type} url=${url}`)

    try {
      let result: BlessingResult | Buffer
      
      if (type === 'image') {
        const response = await this.ctx.http.get(url, {
          responseType: 'arraybuffer',
          params: { type, ...params }
        })
        result = Buffer.from(response)
        this.logger.debug(`[BlessingAPI] 🖼️ 图片响应: ${(result as Buffer).length} bytes`)
      } else {
        // JSON 类型请求
        const data = await this.ctx.http.get<BlessingResult>(url, {
          params: { type, ...params }
        })
        result = data
        
        // 📊 记录统计数据（仅JSON请求）
        const responseTime = Date.now() - startTime
        if ('fortune_level' in data) {
          const stats: BlessingStats = {
            timestamp: Date.now(),
            userId: params.b || '',
            platform: params.a || '',
            username: params.d || undefined,
            fortune_level: data.fortune_level,
            dordas: data.dordas,
            dordas_color: data.dordas_color,
            entry: data.entry,
            responseTime,
            commandType
          }
          this.recordStats(stats)
          this.logger.info(`✨ 抽签结果: ${data.fortune_level} | 结缘物: ${data.dordas} | 耗时: ${responseTime}ms`)
        }
        
        this.logger.debug(`[BlessingAPI] 📄 JSON响应: fortune_level=${data.fortune_level}`)
      }
      
      const totalTime = Date.now() - startTime
      this.logger.debug(`[BlessingAPI] ✅ API 请求成功，总耗时: ${totalTime}ms`)
      return result
      
    } catch (error) {
      const totalTime = Date.now() - startTime
      this.logger.error(`[BlessingAPI] ❌ API 请求失败 (耗时: ${totalTime}ms): ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  /**
   * 🔄 将 buffer 转为 base64 data URI 格式
   */
  toBase64Image(buffer: Buffer): string {
    return `data:image/png;base64,${buffer.toString('base64')}`
  }
}
