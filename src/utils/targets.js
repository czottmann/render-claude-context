/**
 * @fileoverview Target configuration system for different AI tools.
 * Provides centralized configuration for settings paths and keys for different AI platforms.
 */

const path = require("path");
const os = require("os");

/**
 * Target configurations for different AI tools.
 * Each target defines the settings file path and the key used for context filenames.
 */
const TARGET_CONFIGS = {
  gemini: {
    name: "Gemini",
    settingsPath: path.join(os.homedir(), ".gemini", "settings.json"),
    contextKey: "contextFileName",
    description: "Google Gemini CLI",
    globalFolder: "~/.gemini/",
  },
  opencode: {
    name: "opencode",
    settingsPath: path.join(
      os.homedir(),
      ".config",
      "opencode",
      "opencode.json",
    ),
    contextKey: "instructions",
    description: "opencode AI",
    globalFolder: "~/.config/opencode/",
  },
  crush: {
    name: "Crush",
    settingsPath: path.join(os.homedir(), ".config", "crush", "crush.json"),
    contextKey: "options.context_paths",
    description: "Crush AI",
    globalFolder: "~/.config/crush/",
  },
};

/**
 * Gets the configuration for a specific target.
 *
 * @param {string} targetName - Name of the target (e.g., "crush", "gemini", "opencode")
 * @returns {Object} Target configuration object
 * @throws {Error} If target is not supported
 */
function getTargetConfig(targetName) {
  const config = TARGET_CONFIGS[targetName];
  if (!config) {
    const availableTargets = Object.keys(TARGET_CONFIGS).join(", ");
    throw new Error(
      `Unknown target: ${targetName}. Available targets: ${availableTargets}`,
    );
  }
  return config;
}

/**
 * Gets a list of all available target names.
 *
 * @returns {string[]} Array of available target names
 */
function getAvailableTargets() {
  return Object.keys(TARGET_CONFIGS);
}

/**
 * Validates if a target name is supported.
 *
 * @param {string} targetName - Name of the target to validate
 * @returns {boolean} True if target is supported
 */
function isValidTarget(targetName) {
  return TARGET_CONFIGS.hasOwnProperty(targetName);
}

/**
 * Gets the default target name.
 *
 * @returns {string} Default target name
 */
function getDefaultTarget() {
  return "gemini";
}

/**
 * Gets the global folder path for a specific target.
 * 
 * @param {string} targetName - Name of the target
 * @returns {string} Global folder path for the target
 * @throws {Error} If target is not supported
 */
function getTargetGlobalFolder(targetName) {
  const config = getTargetConfig(targetName);
  return config.globalFolder;
}

module.exports = {
  getTargetConfig,
  getAvailableTargets,
  isValidTarget,
  getDefaultTarget,
  getTargetGlobalFolder,
};
