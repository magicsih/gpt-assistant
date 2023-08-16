import Env from "../env/index.js";
import { Context, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { logger } from "../logger/index.js";
import { Update } from "telegraf/types";

class Telegram {
  private bot: Telegraf;

  constructor() {
    if (Env.TELEGRAM_BOT_TOKEN === "") {
      throw new Error("Telegram bot token not found.");
    }
    this.bot = new Telegraf(Env.TELEGRAM_BOT_TOKEN);
    this.bot.use(session());

    this.bot.launch();

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    logger.info("Telegram bot started.");
  }

  public get botInstance() {
    return this.bot;
  }
}

const splitMessage = (message: string) => {
  const messages = [];
  let currentMessage = "";
  for (const line of message.split("\n")) {
    if (currentMessage.length + line.length > 4000) {
      messages.push(currentMessage);
      currentMessage = "";
    }
    currentMessage += line + "\n";
  }
  messages.push(currentMessage);
  return messages;
};

const telegramCtxHandle = async (
  ctx: Context<Update>,
  chatId: string,
  text: string,
  action: any,
  process: (ctx: Context<Update>) => Promise<void>
) => {
  console.log(`User(${chatId}): ${text}`);

  // if (!isAuthorized(ctx, chatId)) {
  //   ctx.reply("Please contact the bot owner to get access.");
  //   return;
  // }
  await ctx.sendChatAction(action);
  const sendTypingAction = async () => {
    await ctx.sendChatAction(action);
  };
  const intervalId = setInterval(sendTypingAction, 3000);

  try {
    await process(ctx);
  } catch (e: any) {
    console.error(e);
    await ctx.reply(`오류가 발생했습니다.\n${e.name}: ${e.message}`);
  } finally {
    clearInterval(intervalId);
  }
};

const telegram = new Telegram();
export { splitMessage, telegramCtxHandle };
export default telegram;
