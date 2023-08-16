import { join } from "node:path";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export class ChatLTM {
  readonly #ltmSize: number = 10;
  readonly defaultData: ChatLTMData = { messages: [] };

  private _getDb(localDbHome: string, session: string) {
    const file = join(localDbHome, session, "ltm.json");
    const adapter = new JSONFile<ChatLTMData>(file);
    const db: Low<ChatLTMData> = new Low(adapter, this.defaultData);
    return db;
  }

  /**
   * Fetches last {n} messages from the database.
   * @param n The number of messages to fetch.
   */
  async fetchLastMessages(localDbHome: string, session: string, n: number) {
    const db: Low<ChatLTMData> = this._getDb(localDbHome, session);
    await db.read();
    const messages = db.data.messages;
    if (messages.length <= n) return messages;
    return messages.slice(messages.length - n);
  }

  /**
   * The length of #db.data.messages should be always less than #ltmSize.
   * @param message
   */
  async appendMessage(localDbHome: string, session: string, message: ChatData) {
    const db: Low<ChatLTMData> = this._getDb(localDbHome, session);
    await db.read();
    db.data.messages.push(message);
    if (db.data.messages.length > this.#ltmSize) {
      db.data.messages.shift();
    }
    await db.write();
  }
}

type ChatLTMData = {
  messages: ChatData[];
};

export type ChatData = {
  role: string;
  content: string;
};

export default new ChatLTM();