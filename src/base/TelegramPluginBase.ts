import { Telegraf } from "telegraf";

export interface TelegramPluginBase {
  register: (bot: Telegraf) => void;
}
