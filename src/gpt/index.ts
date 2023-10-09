// import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import OpenAI from 'openai';
import Env from "../env/index.js";
import LocalDB, { ChatData } from "../localdb/index.js";
import { logger } from "../logger/index.js";
import { ChatCompletionMessageParam } from 'openai/resources/chat/index.mjs';

class GPT {
  private openai: OpenAI;
  constructor() {    
    this.openai = new OpenAI({
      apiKey: Env.OPENAI_API_KEY
    });
  }

  async completeChat(session: string, message: string) {
    const { gptModel, systemRole } = await LocalDB.getSessionConfig(session);

    await LocalDB.postMessage(session, { role: "user", content: message });

    const messages = await LocalDB.fetchLastMessages(session, 3);
    logger.debug(`Model: ${gptModel} Messages: ${JSON.stringify(messages)}`);

    const completion = await this.openai.chat.completions.create({
      model: gptModel,
      messages: [
        { role: "system", content: systemRole },
        ...messages.map((message: ChatData) => ({
          role: message.role,
          content: message.content,
        })),
      ] as Array<ChatCompletionMessageParam>,
    });
    const response = completion.choices[0].message;
    const responseMessage: string = response?.content ? response.content : "";

    await LocalDB.postMessage(session, {
      role: "assistant",
      content: responseMessage,
    });

    logger.debug(`Response: ${responseMessage}`);

    return responseMessage;
  }

  async completeChatWithoutLTM(
    session: string,
    systemMessage: string,
    userMessage: string
  ) {
    const { gptModel } = await LocalDB.getSessionConfig(session);
    const completion = await this.openai.chat.completions.create({
      model: gptModel,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    const response = completion.choices[0].message;
    const responseMessage: string = response?.content ? response.content : "";
    logger.debug(`Response: ${responseMessage}`);
    return responseMessage;
  }
}

export default new GPT();
