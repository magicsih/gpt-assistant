import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/types";
import { TelegramPluginBase } from "../../base/TelegramPluginBase.js";
import LocalDB from "../../localdb/index.js";

class BotCommandGptModel implements TelegramPluginBase {
  register = (bot: Telegraf<Context<Update>>) => {
    bot.command("gpt_model", async (ctx) => {
      const sessionId = ctx.chat.id.toString();
      return ctx.reply(
        `Current GPT model: ${
          (await LocalDB.getSessionConfig(sessionId)).gptModel
        }`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "GPT-3.5", callback_data: "gpt_model_gpt-3.5-turbo" },
                {
                  text: "GPT-3.5-16K",
                  callback_data: "gpt_model_gpt-3.5-turbo-16k",
                },
                { text: "GPT-4", callback_data: "gpt_model_gpt-4" },
              ],
            ],
          },
        }
      );
    });

    bot.action("gpt_model_gpt-3.5-turbo", async (ctx) => {
      if (ctx.chat) {
        const sessionId = ctx.chat?.id.toString();
        const sessionConfig = await LocalDB.getSessionConfig(sessionId);
        sessionConfig.gptModel = "gpt-3.5-turbo";
        LocalDB.setSessionConfig(sessionId, sessionConfig);
        return ctx.answerCbQuery("GPT model set to GPT-3.5");
      }
    });

    bot.action("gpt_model_gpt-3.5-turbo-16k", async (ctx) => {
      if (ctx.chat) {
        const sessionId = ctx.chat?.id.toString();
        const sessionConfig = await LocalDB.getSessionConfig(sessionId);
        sessionConfig.gptModel = "gpt-3.5-turbo-16k";
        LocalDB.setSessionConfig(sessionId, sessionConfig);
        return ctx.answerCbQuery("GPT model set to GPT-3.5-16K");
      }
    });

    bot.action("gpt_model_gpt-4", async (ctx) => {
      if (ctx.chat) {
        const sessionId = ctx.chat?.id.toString();
        const sessionConfig = await LocalDB.getSessionConfig(sessionId);
        sessionConfig.gptModel = "gpt-4";
        LocalDB.setSessionConfig(sessionId, sessionConfig);
        return ctx.answerCbQuery("GPT model set to GPT-4");
      }
    });
  };
}

export default new BotCommandGptModel();
