import { Schema } from 'koishi'

// 📋 插件使用说明（HTML格式，用于Koishi控制台显示）
export const USAGE = `
<h1>Koishi 插件：sky-blessing 光遇祈福签</h1>
<h2>🎯 功能简介</h2>
<p>随机生成光遇祈福签图片的 Koishi 插件，支持三种输出模式：</p>
<ul>
  <li>🖼️ <b>光遇抽签图</b> - 仅发送祈福签图片</li>
  <li>📜 <b>光遇抽签</b> - 发送图片 + 文字内容（运势等级、结缘物、缘彩、祝福语等）</li>
  <li>📝 <b>光遇抽签md</b> - 发送图片 + Markdown格式（💡 仅限 QQ 平台可用）</li>
</ul>

<h2>💬 交流群组</h2>
<p><del>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍ 插件开发交流，欢迎加入QQ群：<b>259248174</b> 🎉（这个群G了）</del></p>
<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入新QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

<hr>

<h3 style="color: #e74c3c;">⚙️ 前置依赖</h3>
<p>本插件需要以下依赖才能正常工作：</p>
<ul>
  <li><b style="color: #e74c3c;">http</b> - Koishi 内置服务，用于HTTP请求后端API <span style="color: #e74c3c;">【必须】</span></li>
</ul>

<h3 style="color: #3498db;">🔗 后端服务</h3>
<p>本插件需要配合后端服务使用，请先部署后端：</p>
<ul>
  <li><a href="https://github.com/VincentZyuApps/skyblessings-fastapi-pillow">GitHub 后端仓库</a></li>
  <li><a href="https://gitee.com/vincent-zyu/skyblessings-fastapi-pillow">Gitee 后端仓库</a></li>
</ul>
<p>部署完成后，在插件配置中填写 <code>backendUrl</code> 为后端服务地址。</p>

<h3 style="color: #2ecc71;">🎮 命令列表</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>命令</th>
    <th>描述</th>
    <th>平台限制</th>
  </tr>
  <tr>
    <td><code>光遇抽签图</code></td>
    <td>获取祈福签图片</td>
    <td>无</td>
  </tr>
  <tr>
    <td><code>光遇抽签</code></td>
    <td>获取祈福签图片 + 文字详情</td>
    <td>无</td>
  </tr>
  <tr>
    <td><code>光遇抽签md</code></td>
    <td>获取祈福签图片 + Markdown格式</td>
    <td>仅QQ平台</td>
  </tr>
</table>

<h3 style="color: #f39c12;">⚙️ 参数映射说明</h3>
<p>可通过配置将 a~e 五个参数键映射到不同的会话信息，用于构建后端请求的种子：</p>
<ul>
  <li>🌐 <b>platform</b> - 平台名称（如 onebot、discord）</li>
  <li>🆔 <b>userid</b> - 用户ID</li>
  <li>📅 <b>date</b> - 当前日期（YYYY-MM-DD）</li>
  <li>👤 <b>nickname</b> - 用户昵称</li>
  <li>🖼️ <b>avatar_hash</b> - 头像MD5哈希值</li>
</ul>
<p>默认配置：abc 启用，de 禁用。重复的 key 只有第一个启用的会生效。</p>

<h3 style="color: #9b59b6;">📊 返回字段说明</h3>
<ul>
  <li><b>fortune_level</b> - 运势等级（如：大吉、中吉、小吉）</li>
  <li><b>dordas</b> - 结缘物（如：结缘物：遥鲲）</li>
  <li><b>dordas_color</b> - 缘彩（如：缘彩：梧枝绿）</li>
  <li><b>color_hex</b> - 颜色十六进制值（如：#4fd69e）</li>
  <li><b>blessing</b> - 祝福语</li>
  <li><b>entry</b> - 宜忌提示（如：忌：一意孤行）</li>
</ul>
`

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
  sendBase64: boolean          // 🖼️ 是否发送Base64编码的图片
  enableQuote: boolean         // 💬 是否引用回复触发指令的消息
  qqMarkdownSendImage: boolean  // 🖼️ QQ Markdown命令是否发送图片
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug'  // 🔊 日志级别
  paramMappings: ParamMapping[] // 📋 参数映射表
}
