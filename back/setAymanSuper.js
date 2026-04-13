// One-time script to set isSuper=true on the "ayman" user
// Run with: node setAymanSuper.js
// Then delete this file

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const DBconnect = require('./DBconnect');

(async () => {
  try {
    await DBconnect();
    
    const result = await User.findOneAndUpdate(
      { name: "ayman" },
      { $set: { isSuper: true, isAdmin: true } },
      { new: true }
    );
    
    if (result) {
      console.log("✅ Ayman updated successfully:");
      console.log(`   Name: ${result.name} ${result.lastName}`);
      console.log(`   isAdmin: ${result.isAdmin}`);
      console.log(`   isSuper: ${result.isSuper}`);
    } else {
      console.log("❌ User 'ayman' not found in database.");
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
