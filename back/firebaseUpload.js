const admin = require("firebase-admin");
require("dotenv").config();

const appA =
  admin.apps.find(app => app.name === "appA") ||
  admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: process.env.APP_A_PROJECT_ID,
        clientEmail: process.env.APP_A_CLIENT_EMAIL,
        privateKey: process.env.APP_A_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.APP_A_BUCKET,
    },
    "appA"
  );

const bucket = admin.app("appA").storage().bucket();
module.exports = bucket;
