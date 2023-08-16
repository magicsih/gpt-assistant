import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import Env from "../env/index.js";
import LocalDB, { ChatData } from "../localdb/index.js";
import { logger } from "../logger/index.js";

class GPT {
  private openai: OpenAIApi;
  constructor() {
    const config = new Configuration({
      apiKey: Env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(config);
  }

  async completeChat(session: string, message: string) {
    const { gptModel, systemRole } = await LocalDB.getSessionConfig(session);

    await LocalDB.postMessage(session, { role: "user", content: message });

    const messages = await LocalDB.fetchLastMessages(session, 3);
    logger.debug(`Model: ${gptModel} Messages: ${JSON.stringify(messages)}`);

    const completion = await this.openai.createChatCompletion({
      model: gptModel,
      messages: [
        { role: "system", content: systemRole },
        ...messages.map(
          (message: ChatData) =>
            ({
              role: message.role,
              content: message.content,
            } as ChatCompletionRequestMessage)
        ),
      ],
    });
    const response = completion.data.choices[0].message;
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
    const completion = await this.openai.createChatCompletion({
      model: gptModel,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    const response = completion.data.choices[0].message;
    const responseMessage: string = response?.content ? response.content : "";
    logger.debug(`Response: ${responseMessage}`);
    return responseMessage;
  }
}

export default new GPT();
