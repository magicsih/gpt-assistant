import ChatLTM from "./ChatLTM.js";
import SessionConfig from "./SessionConfig.js";
import type { ChatData } from "./ChatLTM.js";
import type { SessionConfigData } from "./SessionConfig.js";
import os from "node:os";
import fs from "node:fs";
import { join } from "node:path";

export class LocalDB {
  readonly localDbHome: string;

  constructor() {
    this.localDbHome = join(os.userInfo().homedir, ".gpt-assistant");
    fs.mkdirSync(this.localDbHome, { recursive: true });
  }

  async fetchLastMessages(session: string, n: number) {
    fs.mkdirSync(join(this.localDbHome, session), { recursive: true });
    return await ChatLTM.fetchLastMessages(this.localDbHome, session, n);
  }

  async postMessage(session: string, message: ChatData) {
    fs.mkdirSync(join(this.localDbHome, session), { recursive: true });
    return await ChatLTM.appendMessage(this.localDbHome, session, message);
  }

  async getSessionConfig(session: string) {
    fs.mkdirSync(join(this.localDbHome, session), { recursive: true });
    return await SessionConfig.get(this.localDbHome, session);
  }

  async setSessionConfig(session: string, config: SessionConfigData) {
    fs.mkdirSync(join(this.localDbHome, session), { recursive: true });
    return await SessionConfig.set(this.localDbHome, session, config);
  }
}
export type { ChatData, SessionConfigData };
export default new LocalDB();
