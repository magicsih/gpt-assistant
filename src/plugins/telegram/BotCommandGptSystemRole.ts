import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/types";
import { TelegramPluginBase } from "../../base/TelegramPluginBase.js";
import LocalDB from "../../localdb/index.js";

class BotCommandGptSystemRole implements TelegramPluginBase {
  register = (bot: Telegraf<Context<Update>>) => {
    bot.command("gpt_system_role", async (ctx) => {
      const sessionId = ctx.chat.id.toString();
      return ctx.reply(
        `Current GPT System Role: ${
          (await LocalDB.getSessionConfig(sessionId)).systemRole
        }`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Assistant",
                  callback_data: "gpt_system_role:assistant",
                },
                {
                  text: "Translator",
                  callback_data: "gpt_system_role:translator",
                },
                {
                  text: "Summarizer",
                  callback_data: "gpt_system_role:summarizer",
                },
              ],
              [
                {
                  text: "English Learning Coach",
                  callback_data: "gpt_system_role:english_learning_coach",
                },
                {
                  text: "Development Assistant",
                  callback_data: "gpt_system_role:development_assistant",
                },
                {
                  text: "Cooking Assistant",
                  callback_data: "gpt_system_role:cooking_assistant",
                },
              ],
            ],
          },
        }
      );
    });

    const setRole = async (
      ctx: Context<Update>,
      role: string,
      roleName: string
    ) => {
      if (ctx.chat) {
        const sessionId = ctx.chat?.id.toString();
        const sessionConfig = await LocalDB.getSessionConfig(sessionId);
        sessionConfig.systemRole = role;
        LocalDB.setSessionConfig(sessionId, sessionConfig);
        return ctx.answerCbQuery(`GPT system role set to ${roleName}`);
      }
    };
    bot.action("gpt_system_role:assistant", async (ctx) => {
      return setRole(ctx, "You're a helpful assistant", "Assistant");
    });

    bot.action("gpt_system_role:summarizer", async (ctx) => {
      return setRole(
        ctx,
        "You are a summarizer that itemizes the given text.",
        "Summarizer"
      );
    });

    bot.action("gpt_system_role:translator", async (ctx) => {
      return setRole(
        ctx,
        "You are a translator that translates a given text from English to Korean and vice versa.",
        "Translator"
      );
    });

    bot.action("gpt_system_role:english_learning_coach", async (ctx) => {
      return setRole(
        ctx,
        "You are a English language learning coach who helps users learn and practice new languages. Offer grammar explanations, vocabulary building exercises, and pronunciation tips. Engage users in conversations to help them improve their listening and speaking skills and gain confidence in using the language.",
        "English Learning Coach"
      );
    });

    bot.action("gpt_system_role:development_assistant", async (ctx) => {
      return setRole(
        ctx,
        "You are an all-around helper in software development, helping with architecture, coding, algorithms, data structures, computational structures, and passing on theoretical knowledge when needed.",
        "Development Assistant"
      );
    });

    bot.action("gpt_system_role:cooking_assistant", async (ctx) => {
      return setRole(
        ctx,
        "You're a cooking teacher, helping them with recipes, food preparation, cooking, and more, from gathering ingredients to finishing dishes and table manners.",
        "Cooking Assistant"
      );
    });
  };
}
export default new BotCommandGptSystemRole();
