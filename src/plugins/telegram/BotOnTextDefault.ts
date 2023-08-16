import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/types";
import { TelegramPluginBase } from "../../base/TelegramPluginBase.js";
import { message } from "telegraf/filters";
import GPT from "../../gpt/index.js";
import { splitMessage, telegramCtxHandle } from "../../telegram/index.js";

class BotOnTextDefault implements TelegramPluginBase {
  register = (bot: Telegraf<Context<Update>>) => {
    bot.on(message("text"), async (ctx) => {
      if (ctx.chat) {
        const sessionId = ctx.chat.id.toString();
        const msg = ctx.message.text;
        await telegramCtxHandle(ctx, sessionId, msg, "typing", async (ctx) => {
          const content = await GPT.completeChat(sessionId, msg);
          if (content.length > 4000) {
            const messages = splitMessage(content);
            for (const message of messages) {
              await ctx.reply(message);
            }
            return;
          } else {
            await ctx.reply(content);
          }
        });
      }
    });
  };
}
export default new BotOnTextDefault();