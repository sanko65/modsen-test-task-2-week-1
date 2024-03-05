const fs = require("fs");
require("dotenv").config();

const config = {
  account: process.env.GC_ACCOUNT,
  client_id: process.env.GC_CLIENT_ID,
  client_secret: process.env.GC_CLIENT_SECRET,
  quota_project_id: process.env.GC_QUOTA_PROJECT_ID,
  refresh_token: process.env.GC_REFRESH_TOKEN,
  type: process.env.GC_TYPE,
  universe_domain: process.env.GC_UNIVERSE_DOMAIN,
};
console.log(config);

try {
  fs.writeFileSync("creds.json", JSON.stringify(config));
  console.log("creds.json created successfully.");
} catch (err) {
  console.error("Error creating creds.json:", err);
}
