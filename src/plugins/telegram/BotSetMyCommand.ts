import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/types";
import { TelegramPluginBase } from "../../base/TelegramPluginBase.js";

class BotSetMyCommand implements TelegramPluginBase {
  register = (bot: Telegraf<Context<Update>>) => {
    bot.telegram.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Show help" },
      { command: "gpt_model", description: "Show current gpt model" },
      { command: "gpt_system_role", description: "Manage gpt system role" },
      { command: "rss_feed", description: "Show rss feed"},
      // { command: "config", description: "Manage session config" },
    ]);
  };
}

export default new BotSetMyCommand();
