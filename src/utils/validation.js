function validateFilename(filename) {
  if (filename === "CLAUDE.md") {
    console.error("Error: Cannot use 'CLAUDE.md' as output filename");
    process.exit(1);
  }
  return filename;
}

module.exports = {
  validateFilename,
};
