process.env.DB_PATH = ":memory:";
process.env.AUTOCOMPLETE_API_URL =
  "https://oapaiqtgkr6wfbum252tswprwa0ausnb.lambda-url.eu-central-1.on.aws/";

const { closeDb } = require("../db/index.js");

afterAll(() => closeDb());