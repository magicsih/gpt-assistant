import dotenv from "dotenv";
import { logger } from "../logger/index.js";

class Env {
  public TELEGRAM_BOT_TOKEN: string;
  public OPENAI_API_KEY: string;

  constructor() {
    dotenv.config();
    this.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
      ? process.env.TELEGRAM_BOT_TOKEN
      : "";
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY
      ? process.env.OPENAI_API_KEY
      : "";

    logger.info("Environment variables loaded." + JSON.stringify(this));
  }
}

export default new Env();
