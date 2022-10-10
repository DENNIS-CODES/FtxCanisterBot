import { Telegraf } from 'telegraf';
import { CONFIG } from '../config/config'

let bot: Telegraf;
bot = new Telegraf(CONFIG.BOT_TOKEN);

bot.use(async (ctx: any, next: any) => {
    try {
        if (CONFIG.WHITELISTED_USERS?.includes('')) {
            await next();
            return;
        } else {
            await next();
        }
    } catch (error) {
        console.log(error);
    }
})

const sendMessage = async(
    message: string,
    delete_message: boolean = false
) => {
    try {
        for (const id of CONFIG.WHITELISTED_USERS) {
            await bot.telegram
            .sendMessage(
                id, 
                message
                .replaceAll('_', '\\_')
                .replaceAll('|', '\\|')
                .replaceAll('.', '\\.')
                .replaceAll('{', '\\{')
                .replaceAll('}', '\\}')
                .replaceAll('=', '\\=')
                .replaceAll('+', '\\+')
                .replaceAll('>', '\\>')
                .replaceAll('<', '\\<')
                .replaceAll('-', '\\-')
                .replaceAll('!', '\\!'),
                {
                    parse_mode: 'MarkdownV2',
                    disable_web_page_preview: true,
                }
                )
                .then(({ message_id }) => {
                    if (delete_message) {
                        setTimeout(
                            () => bot.telegram.deleteMessage(id, message_id),
                            CONFIG.TELEGRAM_DELETE_MESSAGE_INTERVAL
                            )
                    }
                })
                .catch((error: any) => {
                    // console.error('error', error)
                })
        }
    } catch (error) {
        
    }
};

export { bot, sendMessage };