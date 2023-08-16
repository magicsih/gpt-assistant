import dotenv from "dotenv";
import { logger } from "../logger/index.js";

class Env {
  public TELEGRAM_BOT_TOKEN: string;
  public TELEGRAM_CHAT_ID: string;
  public OPENAI_API_KEY: string;

  constructor() {
    dotenv.config();
    this.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
      ? process.env.TELEGRAM_BOT_TOKEN
      : "";
    this.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
      ? process.env.TELEGRAM_CHAT_ID
      : "";
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY
      ? process.env.OPENAI_API_KEY
      : "";

    logger.info("Environment variables loaded." + JSON.stringify(this));
  }
}

export default new Env();
