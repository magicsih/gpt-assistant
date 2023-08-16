import { join } from "node:path";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export class SessionConfig {
  readonly defaultData: SessionConfigData = { gptModel: "gpt-3.5-turbo", systemRole: "You're a helpful assistant." };

  private _getDb(localDbHome: string, session: string) {
    const file = join(localDbHome, session, "config.json");
    const adapter = new JSONFile<SessionConfigData>(file);
    const db: Low<SessionConfigData> = new Low(adapter, this.defaultData);
    return db;
  }

  async get(localDbHome: string, session: string): Promise<SessionConfigData> {
    const db: Low<SessionConfigData> = this._getDb(localDbHome, session);
    await db.read();
    return db.data;
  }

  async set(localDbHome: string, session: string, config: SessionConfigData) {
    const db: Low<SessionConfigData> = this._getDb(localDbHome, session);
    await db.read();
    db.data = config;
    await db.write();
  }
}

type SessionConfigData = {
  systemRole: string;
  gptModel: string;
};

export type { SessionConfigData };

export default new SessionConfig();
