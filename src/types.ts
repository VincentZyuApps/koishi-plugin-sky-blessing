// 🎋 祈福签后端返回的数据结构
export interface BlessingResult {
  fortune_level: string
  background_id: string
  dordas: string
  blessing: string
  entry: string
  dordas_color: string
  color_hex: string
  image_base64?: string
}

// 📊 参数映射配置项：每一行定义一个 a-e 参数的值来源
export interface ParamMapping {
  enabled: boolean   // ✅ 是否启用此行
  key: 'a' | 'b' | 'c' | 'd' | 'e'  // 🔑 参数键名 (a/b/c/d/e)
  value: 'platform' | 'userid' | 'date' | 'nickname' | 'avatar_hash'  // 📦 参数值来源字段
}

// ⚙️ 插件完整配置
export interface PluginConfig {
  commandNames: {
    image: string       // 🖼️ 仅发送图片的命令名
    text: string        // 📜 发送图片+文字的命令名
    qqMarkdown: string  // 📝 发送图片+Markdown的命令名（仅QQ）
  }
  backendUrl: string           // 🔗 后端服务地址
  enableQuote: boolean         // 💬 是否引用回复触发指令的消息
  qqMarkdownSendImage: boolean  // 🖼️ QQ Markdown命令是否发送图片
  alignWithTab: boolean        // 📏 文字对齐：冒号前后添加制表符
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug'  // 🔊 日志级别
  paramMappings: ParamMapping[] // 📋 参数映射表
}

// 📊 抽签统计数据记录
export interface BlessingStats {
  timestamp: number           // 时间戳
  userId: string              // 用户ID
  platform: string            // 平台
  username?: string           // 用户名（可选）
  fortune_level: string       // 吉祥程度
  dordas: string              // 结缘物
  dordas_color: string        // 缘彩
  entry: string               // 宜忌词条
  responseTime: number        // API响应时间（毫秒）
  commandType: 'image' | 'text' | 'qq-markdown'  // 命令类型
}
