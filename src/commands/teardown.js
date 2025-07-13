/**
 * @fileoverview Teardown command implementation for Gemini integration cleanup.
 * Removes filename from ~/.gemini/settings.json contextFileName array.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Removes filename from Gemini contextFileName array to stop auto-loading.
 * Handles both string and array contextFileName formats with proper cleanup.
 * 
 * @param {Object} options - Command options from Commander.js
 * @param {string} options.filename - Filename to remove from Gemini settings
 */
function teardownCommand(options) {
  try {
    const settingsPath = path.join(os.homedir(), ".gemini", "settings.json");

    if (!fs.existsSync(settingsPath)) {
      console.log("No Gemini settings file found");
      return;
    }

    let settings = {};
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch (error) {
      console.error("Error reading Gemini settings file:", error.message);
      process.exit(1);
    }

    if (!settings.contextFileName) {
      console.log("No contextFileName found in Gemini settings");
      return;
    }

    // Ensure contextFileName is always an array
    if (typeof settings.contextFileName === "string") {
      settings.contextFileName = [settings.contextFileName];
    }

    if (!Array.isArray(settings.contextFileName)) {
      console.log("Invalid contextFileName format in Gemini settings");
      return;
    }

    const index = settings.contextFileName.indexOf(options.filename);
    if (index !== -1) {
      settings.contextFileName.splice(index, 1);

      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
      console.log(
        `Removed ${options.filename} from ~/.gemini/settings.json contextFileName array`,
      );
    } else {
      console.log(
        `${options.filename} not found in ~/.gemini/settings.json contextFileName array`,
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = teardownCommand;
