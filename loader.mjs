import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Register the ts-node loader
register("ts-node/esm", pathToFileURL("./"));
