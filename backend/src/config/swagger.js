import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.resolve(__dirname, "../../../docs/openapi.yaml");
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));

export default swaggerDocument;