const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const appA = admin.apps.find(app => app.name === "appA") || 
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "uploadautoroute.firebasestorage.app", // ✅ correct format
    },
    "appA" // ✅ unique name
  );

const bucket = admin.app("appA").storage().bucket();
module.exports = bucket;
