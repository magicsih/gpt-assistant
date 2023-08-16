import fs from "fs";
import { logger } from "../logger/index.js";
import telegram from "../telegram/index.js";

const telegramPlugins = fs
  .readdirSync("src/plugins/telegram", { recursive: true })
  .map((file) => {
    return `${file}`;
  });

telegramPlugins.forEach(async (file: string) => {
  if (file.endsWith(".ts")) {
    file = file.replace(".ts", ".js");
    const module = await import(`./telegram/${file}`);
    if ("register" in module.default) {
      module.default.register(telegram.botInstance);
      logger.info(`Plugin ${file} registered.`);
    } else {
      logger.info(`Plugin ${file} not registered.`);
    }
  }
});