const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeySingle.json");

const appB = admin.apps.find(app => app.name === "appB") || 
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "uploadsingleautoroute.firebasestorage.app", // ✅ correct format
    },
    "appB" // ✅ unique name
  );

const bucket = admin.app("appB").storage().bucket();
module.exports = bucket;
