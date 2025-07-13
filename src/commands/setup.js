const fs = require("fs");
const path = require("path");
const os = require("os");

function setupCommand(options) {
  try {


    const settingsPath = path.join(
      os.homedir(),
      ".gemini",
      "settings.json",
    );

    let settings = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }

    // Ensure contextFileName is always an array
    if (!settings.contextFileName) {
      settings.contextFileName = [];
    } else if (typeof settings.contextFileName === 'string') {
      settings.contextFileName = [settings.contextFileName];
    }

    // Always add the specified filename to settings
    if (!settings.contextFileName.includes(options.filename)) {
      settings.contextFileName.push(options.filename);

      const settingsDir = path.dirname(settingsPath);
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }

      fs.writeFileSync(
        settingsPath,
        JSON.stringify(settings, null, 2),
        "utf8",
      );
      console.log(
        `Added ${options.filename} to ~/.gemini/settings.json contextFileName array`,
      );
    } else {
      console.log(
        `${options.filename} already exists in ~/.gemini/settings.json contextFileName array`,
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = setupCommand;