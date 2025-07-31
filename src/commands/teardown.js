/**
 * @fileoverview Teardown command implementation for AI tool integration cleanup.
 * Removes filename from target AI tool settings array.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { getTargetConfig } = require("../utils/targets");
const { getNestedProperty, setNestedProperty, hasNestedProperty } = require("../utils/nestedProperties");

/**
 * Removes filename from target AI tool settings array to stop auto-loading.
 * Handles both string and array context settings formats with proper cleanup.
 * 
 * @param {Object} options - Command options from Commander.js
 * @param {string} options.filename - Filename to remove from target settings
 * @param {string} options.target - Target AI tool name
 */
function teardownCommand(options) {
  try {
    const targetConfig = getTargetConfig(options.target);
    const { settingsPath, contextKey, name } = targetConfig;

    if (!fs.existsSync(settingsPath)) {
      console.log(`No ${name} settings file found at ${settingsPath}`);
      return;
    }

    let settings = {};
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch (error) {
      console.error(`Error reading ${name} settings file:`, error.message);
      process.exit(1);
    }

    let contextArray = getNestedProperty(settings, contextKey);
    if (!contextArray) {
      console.log(`No ${contextKey} found in ${name} settings`);
      return;
    }

    // Ensure context key is always an array
    if (typeof contextArray === "string") {
      contextArray = [contextArray];
    }

    if (!Array.isArray(contextArray)) {
      console.log(`Invalid ${contextKey} format in ${name} settings`);
      return;
    }

    const index = contextArray.indexOf(options.filename);
    if (index !== -1) {
      contextArray.splice(index, 1);
      setNestedProperty(settings, contextKey, contextArray);

      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
      console.log(
        `Removed ${options.filename} from ${name} ${contextKey} array at ${settingsPath}`,
      );
    } else {
      console.log(
        `${options.filename} not found in ${name} ${contextKey} array at ${settingsPath}`,
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = teardownCommand;
