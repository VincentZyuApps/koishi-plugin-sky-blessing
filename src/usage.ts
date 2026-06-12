import { readFileSync } from 'fs'
import { resolve } from 'path'

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

export const usage = `
<h1>🎋 Sky Blessing 光遇祈福签</h1>
<h2>📦版本号:  v${pkg.version}</h2>

<hr>

<h2>📖 简介</h2>
<p>${pkg.description}</p>

<hr>

<h2>🔗 相关链接</h2>
<p>
  <a href="https://www.npmjs.com/package/koishi-plugin-sky-blessing" target="_blank">
    <img src="https://img.shields.io/npm/v/koishi-plugin-sky-blessing?style=flat-square" alt="npm version">
  </a>
  <a href="https://github.com/VincentZyuApps/skyblessings-fastapi-pillow" target="_blank">
    <img src="https://img.shields.io/badge/Backend-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Backend">
  </a>
  <a href="https://gitee.com/vincent-zyu/skyblessings-fastapi-pillow" target="_blank">
    <img src="https://img.shields.io/badge/Backend-Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white" alt="Gitee Backend">
  </a>
  <a href="https://qm.qq.com/q/ZN7fxZ3qCq" target="_blank">
    <img src="https://img.shields.io/badge/QQ群-1085190201-1AAD19?style=flat-square" alt="QQ群">
  </a>
  <a href="https://forum.koishi.xyz/t/topic/12467" target="_blank">
    <img src="https://img.shields.io/badge/Koishi%20Forum-12558-5546A3?style=for-the-badge&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff3%2FKoishi.js_Logo.png&logoColor=white" alt="Forum">
  </a>
</p>

<hr>

<h2>💬 交流反馈</h2>
<p>🐛 Bug 反馈 / 💡 建议 / 👨‍💻 插件开发交流，欢迎加群：</p>
<p><del>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>259248174</b>   🎉（这个群G了</del></p>
<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>259248174🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

<hr>

<h2>⚠️ 前置条件</h2>
<ul>
  <li>需要 Koishi 的 <code>http</code> 服务</li>
  <li>需要先部署后端服务，并在配置中填写 <code>backendUrl</code></li>
  <li><code>光遇抽签md</code> 仅支持 QQ 平台</li>
</ul>

<hr>

<h2>⌨️ 指令说明</h2>

<h3>1️⃣ 光遇抽签图</h3>
<p>仅发送祈福签图片。</p>
<pre><code>光遇抽签图</code></pre>

<h3>2️⃣ 光遇抽签</h3>
<p>发送图片和文字详情，包括运势、结缘物、缘彩、祝福语、宜忌。</p>
<pre><code>光遇抽签</code></pre>

<h3>3️⃣ 光遇抽签md</h3>
<p>发送 QQ 原生 Markdown 版本，可选是否同时发送图片。</p>
<pre><code>光遇抽签md</code></pre>

<hr>

<h2>⚙️ 配置项</h2>
<table>
  <tr><th>配置项</th><th>类型</th><th>默认值</th><th>说明</th></tr>
  <tr><td><code>commandNames.image</code></td><td>string</td><td><code>光遇抽签图</code></td><td>仅图片命令名</td></tr>
  <tr><td><code>commandNames.text</code></td><td>string</td><td><code>光遇抽签</code></td><td>图片 + 文字命令名</td></tr>
  <tr><td><code>commandNames.qqMarkdown</code></td><td>string</td><td><code>光遇抽签md</code></td><td>QQ Markdown 命令名</td></tr>
  <tr><td><code>backendUrl</code></td><td>string</td><td><code>http://127.0.0.1:51205</code></td><td>后端服务地址</td></tr>
  <tr><td><code>enableQuote</code></td><td>boolean</td><td><code>true</code></td><td>发送时引用原消息</td></tr>
  <tr><td><code>qqMarkdownSendImage</code></td><td>boolean</td><td><code>true</code></td><td>Markdown 命令是否额外发送图片</td></tr>
  <tr><td><code>alignWithTab</code></td><td>boolean</td><td><code>true</code></td><td>文字模式中使用制表符对齐</td></tr>
  <tr><td><code>logLevel</code></td><td>string</td><td><code>info</code></td><td>日志级别</td></tr>
  <tr><td><code>paramMappings</code></td><td>table</td><td><code>abc 启用</code></td><td>请求参数 a~e 的映射表</td></tr>
</table>

<hr>

<h2>🧩 参数映射</h2>
<p>可将后端请求参数 <code>a ~ e</code> 映射到以下来源：</p>
<ul>
  <li><code>platform</code>：平台名</li>
  <li><code>userid</code>：用户 ID</li>
  <li><code>date</code>：当前日期</li>
  <li><code>nickname</code>：昵称</li>
  <li><code>avatar_hash</code>：头像哈希</li>
</ul>
<p>默认启用 <code>a=platform</code>、<code>b=userid</code>、<code>c=date</code>。</p>

<hr>

<h2>🌐 后端项目</h2>
<p>后端参考：</p>
<p><a href="https://github.com/VincentZyuApps/skyblessings-fastapi-pillow" target="_blank">GitHub: skyblessings-fastapi-pillow</a></p>
<p><a href="https://gitee.com/vincent-zyu/skyblessings-fastapi-pillow" target="_blank">Gitee: skyblessings-fastapi-pillow</a></p>
`
