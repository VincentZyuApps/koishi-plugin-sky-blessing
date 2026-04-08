import { Schema } from 'koishi'
import { PluginConfig, ParamMapping } from './types'

// 🎯 参数键选项 (a-e)，用于构建后端请求的种子
const PARAM_KEY_OPTIONS = ['a', 'b', 'c', 'd', 'e'] as const

// 📋 参数值来源标签，可将平台、用户ID等信息映射为种子参数
const PARAM_VALUE_LABELS = [
  { label: '🌐 平台 (platform)', value: 'platform' },
  { label: '🆔 用户ID (userid)', value: 'userid' },
  { label: '📅 日期 (date)', value: 'date' },
  { label: '👤 昵称 (nickname)', value: 'nickname' },
  { label: '🖼️ 头像哈希 (avatar_hash)', value: 'avatar_hash' },
] as const

// ✨ 默认参数映射：abc 启用，de 禁用
const DEFAULT_MAPPINGS: ParamMapping[] = [
  { enabled: true, key: 'a', value: 'platform' },
  { enabled: true, key: 'b', value: 'userid' },
  { enabled: true, key: 'c', value: 'date' },
  { enabled: false, key: 'd', value: 'nickname' },
  { enabled: false, key: 'e', value: 'avatar_hash' },
]

// 🔊 日志级别选项
const LOG_LEVEL_OPTIONS = ['silent', 'error', 'warn', 'info', 'debug'] as const

export const ConfigSchema: Schema<PluginConfig> = Schema.intersect([
  // 🔧 命令名称设置
  Schema.object({
    commandNames: Schema.object({
      image: Schema.string()
        .default('光遇抽签图')
        .description('🖼️ 仅发送图片的命令名称'),
      text: Schema.string()
        .default('光遇抽签')
        .description('📜 发送图片 + 文字内容的命令名称'),
      qqMarkdown: Schema.string()
        .default('光遇抽签md')
        .description('📝 发送图片 + Markdown 格式的命令名称（💡 仅限 QQ 平台可用）'),
    }).description('⚙️ 命令名称设置'),
  }).description('⚙️ 命令设置'),

  // 🌐 后端连接设置
  Schema.object({
    backendUrl: Schema.string()
      .default('http://127.0.0.1:51205')
      .description('🔗 后端服务地址\n\n💡 可以去这里部署后端: `https://gitee.com/vincent-zyu/skyblessings-fastapi-pillow`'),
    enableQuote: Schema.boolean()
      .default(true)
      .description('💬 开启后，本插件发送的所有消息都会引用（回复）触发指令的消息'),
    qqMarkdownSendImage: Schema.boolean()
      .default(true)
      .description('🖼️ 「光遇抽签md」命令是否同时发送图片（关闭则仅发送 Markdown 文本）'),
    alignWithTab: Schema.boolean()
      .default(true)
      .description('📏 文字对齐：在冒号前后添加制表符使文本对齐（⚠️ 仅对「光遇抽签」和「光遇抽签md」的文字部分生效，不影响图片）'),
  }).description('🌐 后端设置'),

  // 📊 参数映射表设置
  Schema.object({
    paramMappings: Schema.array(Schema.object({
      enabled: Schema.boolean()
        .default(true)
        .description('✅ 是否启用此行'),
      key: Schema.union(PARAM_KEY_OPTIONS)
        .role('radio')
        .description('🔑 参数键名（a ~ e 五选一）'),
      value: Schema.union(PARAM_VALUE_LABELS.map(o => o.value))
        .role('radio')
        .description('📦 参数值来源字段'),
    })).role('table').default(DEFAULT_MAPPINGS)
      .description('📋 参数映射表：将 a~e 映射到平台/用户ID/日期等。\n\n⚠️ 重复的 key 只有第一个启用的会生效哦，未启用的行会被自动忽略~'),
  }).description('📊 参数映射设置'),

  // 🔧 调试设置
  Schema.object({
    logLevel: Schema.union(LOG_LEVEL_OPTIONS)
      .role('radio')
      .default('info')
      .description('🔊 插件日志级别：silent（静默）/ error（仅错误）/ warn（警告+错误）/ info（常规信息）/ debug（详细调试）'),
  }).description('🔧 调试设置'),
])
