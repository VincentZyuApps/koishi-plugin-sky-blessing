import { Context, h, Schema } from 'koishi'

export const name = 'sky-blessing'

export interface Config {
  backendUrl: string
}

export const Config: Schema<Config> = Schema.intersect([

  Schema.object({
    backendUrl: Schema.string()
      .default('http://192.168.31.84:51205')
      .description('后端地址')
  })

])

export function apply(ctx: Context, cfg: Config) {

  ctx.command('光遇抽签')
    .alias('awa_sky_blessing')
    .alias('asb')
    .action( async ( {session, options} ) => {

      await session.send(`${h.quote(session.messageId)}${h.image(`${cfg.backendUrl}/blessing`)}`)

    } )

}
