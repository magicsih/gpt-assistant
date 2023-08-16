import Env from "./env/index.js";

import { logger } from "./logger/index.js";
import telegram from "./telegram/index.js";
import GPT from "./gpt/index.js";
import "./plugins/index.js";

(async () => {
  logger.info("GPT Assistant is starting...");
  // await telegram.sendMessage("Hi");
  // await GPT.completeChat("test", "Something with cheese");

})();
