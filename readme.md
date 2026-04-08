![koishi-plugin-sky-blessing](https://socialify.git.ci/VincentZyuApps/koishi-plugin-sky-blessing/image?description=1&font=KoHo&forks=1&issues=1&language=1&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff3%2FKoishi.js_Logo.png%3F_%3D20230331182243&name=1&owner=1&pulls=1&stargazers=1&theme=Auto)

# koishi-plugin-sky-blessing

[![npm](https://img.shields.io/npm/v/koishi-plugin-sky-blessing?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-sky-blessing)
[![npm-download](https://img.shields.io/npm/dm/koishi-plugin-sky-blessing?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-sky-blessing)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VincentZyuApps/sky-blessing)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/vincent-zyu/sky-blessing)

<p><del>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>259248174</b>   🎉（这个群G了）</del></p> 
<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入新QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

##  后端服务

本插件需要配合后端服务使用：

- [![GitHub Backend](https://img.shields.io/badge/GitHub_Backend-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VincentZyuApps/skyblessings-fastapi-pillow)
- [![Gitee Backend](https://img.shields.io/badge/Gitee_Backend-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/vincent-zyu/skyblessings-fastapi-pillow)

> 💡 请先部署后端服务，然后在插件配置中填写 `backendUrl`

## 🎯 功能特性

- 🖼️ **光遇抽签图** - 仅发送祈福签图片
- 📜 **光遇抽签** - 发送图片 + 文字内容（运势等级、结缘物、缘彩、祝福语等）
- 📝 **光遇抽签md** - 发送图片 + Markdown格式（💡 仅限 QQ 平台可用）

## ⚙️ 配置说明

### 命令名称设置
- `光遇抽签图` - 仅发送图片的命令名
- `光遇抽签` - 发送图片+文字的命令名  
- `光遇抽签md` - 发送图片+Markdown的命令名（仅QQ）

### 后端设置
- `backendUrl` - 后端服务地址（默认: `http://127.0.0.1:51205`）
- `sendBase64` - 是否将图片 Base64 编码后发送
- `enableQuote` - 开启后，所有消息都会引用回复触发指令的消息

### 参数映射设置
可配置 a~e 五个参数键的值来源：
- 🌐 平台 (platform)
- 🆔 用户ID (userid)
- 📅 日期 (date)
- 👤 昵称 (nickname)
- 🖼️ 头像哈希 (avatar_hash)

默认配置：abc 启用，de 禁用

## 📸 效果预览

### 光遇抽签图
![image-only](doc/image-only.png)

### 光遇抽签
![image-with-text](doc/image-with-text.png)

### 光遇抽签md（QQ原生Markdown）
![qq-markdown](doc/qq-markdown.png)

## 🔧 安装方式

### 通过 Koishi 市场安装
在 Koishi 控制台搜索 `sky-blessing` 并安装

### 手动安装
```bash
cd /path/to/your/koishi/project
npm install koishi-plugin-sky-blessing
yarn add koishi-plugin-sky-blessing
```

## 🚀 快速开始

1. 部署后端服务（参考后端仓库 README）
2. 在 Koishi 控制台安装本插件
3. 配置 `backendUrl` 为后端服务地址
4. 根据需要调整参数映射配置
5. 使用命令测试：
   - `光遇抽签图` - 获取图片
   - `光遇抽签` - 获取图片+文字
   - `光遇抽签md` - 获取图片+Markdown（QQ专用）

## 📋 API 说明

后端提供 `/blessing` 接口：
- `type=image` - 返回 PNG 图片
- `type=json` - 返回 JSON（含 base64 图片）
- `type=json_without_image` - 返回 JSON（不含图片）
- `a/b/c/d/e` - 可选种子参数，相同组合返回相同结果
