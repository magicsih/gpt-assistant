import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/types";
import { TelegramPluginBase } from "../../base/TelegramPluginBase.js";

class BotCommandStart implements TelegramPluginBase {
  register = (bot: Telegraf<Context<Update>>) => {
    bot.start((ctx) => {
      ctx.reply(`Hi! ${ctx.from.first_name}!(${ctx.from.id})\nI'm your GPT assistant!`);
    });
  };
}

export default new BotCommandStart();