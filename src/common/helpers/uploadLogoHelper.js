const { Storage } = require("@google-cloud/storage");

const gcloudFileStream = function () {
  const fileName = `${Date.now()}.jpg`;

  const config = {
    account: process.env.GC_ACCOUNT,
    client_id: process.env.GC_CLIENT_ID,
    client_secret: process.env.GC_CLIENT_SECRET,
    quota_project_id: process.env.GC_QUOTA_PROJECT_ID,
    refresh_token: process.env.GC_REFRESH_TOKEN,
    type: process.env.GC_TYPE,
    universe_domain: process.env.GC_UNIVERSE_DOMAIN,
  };

  const storage = new Storage(config);

  const bucketName = process.env.GC_BUCKET_NAME;

  const filePath = `logos/${fileName}`;

  const options = {
    metadata: {
      contentType: "image/jpeg",
    },
  };

  const file = storage.bucket(bucketName).file(filePath);

  const gcStream = file.createWriteStream(options);

  return { fileName, gcStream };
};

module.exports = gcloudFileStream;
