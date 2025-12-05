import { Context, h, Schema } from 'koishi'

export const name = 'sky-blessing'

export const inject = {
    required: ["http"]
}

export const reusable = true // 声明此插件可重用

export interface Config {
  commandName: string
  backendUrl: string
  sendBase64: boolean
}

export const Config: Schema<Config> = Schema.intersect([

  Schema.object({
    commandName: Schema.string()
      .default('光遇抽签')
      .description('命令名称')
  }).description('指令设置'),

  Schema.object({
    backendUrl: Schema.string()
      .default('http://192.168.31.84:51205')
      .description('后端地址'),
    sendBase64: Schema.boolean()
      .default(false)
      .description('是否发送Base64编码的图片')
  }).description('后端设置')

])

export function apply(ctx: Context, cfg: Config) {

  ctx.command(`${cfg.commandName}`)
    .alias('光遇抽签')
    .alias('awa_sky_blessing')
    .alias('asb')
    .action( async ( {session, options} ) => {

      let imageStr: string
      
      if (cfg.sendBase64) {
        const response = await ctx.http.get(`${cfg.backendUrl}/blessing`, {
          responseType: 'arraybuffer'
        })
        const base64Data = Buffer.from(response).toString('base64')
        imageStr = `base64:png:${base64Data}`
      } else {
        imageStr = `${cfg.backendUrl}/blessing`
      }

      await session.send(`${h.quote(session.messageId)}${h.image(imageStr)}`)

    } )

}
