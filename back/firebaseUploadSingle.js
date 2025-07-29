const admin = require("firebase-admin");
require("dotenv").config();

const appB =
  admin.apps.find(app => app.name === "appB") ||
  admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: process.env.APP_B_PROJECT_ID,
        clientEmail: process.env.APP_B_CLIENT_EMAIL,
        privateKey: process.env.APP_B_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.APP_B_BUCKET,
    },
    "appB"
  );

const bucket = admin.app("appB").storage().bucket("uploadsingleautoroute.appspot.com");
module.exports = bucket;
