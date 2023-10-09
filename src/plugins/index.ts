import fs from "fs";
import { logger } from "../logger/index.js";
import telegram from "../telegram/index.js";

const telegramPlugins = fs
  .readdirSync("src/plugins/telegram", { recursive: true })
  .map((file) => {
    return `${file}`;
  });

for (const fileName of telegramPlugins) {
  if (fileName !== "BotOnTextDefault.ts" && fileName.endsWith(".ts")) {
    let file = fileName.replace(".ts", ".js");
    const module = await import(`./telegram/${file}`);
    if ("register" in module.default) {
      module.default.register(telegram.botInstance);
      logger.info(`Plugin ${file} registered.`);
    } else {
      logger.info(`Plugin ${file} not registered.`);
    }
  }
}

const module = await import(`./telegram/BotOnTextDefault.js`);
module.default.register(telegram.botInstance);
logger.info(`Plugin BotOnTextDefault registered.`);
