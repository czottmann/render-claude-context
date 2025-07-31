/**
 * @fileoverview Utilities for safe nested property access in JavaScript objects.
 * Supports both direct property access and dot-notation key paths.
 */

/**
 * Safely gets a nested property from an object using a key path.
 * Supports both direct keys ("contextFileName") and nested paths ("options.context_paths").
 * 
 * @param {Object} obj - The object to get the property from
 * @param {string} keyPath - Property key or dot-separated path (e.g., "options.context_paths")
 * @returns {*} The property value, or undefined if not found
 */
function getNestedProperty(obj, keyPath) {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  // Handle direct property access (backward compatibility)
  if (!keyPath.includes('.')) {
    return obj[keyPath];
  }

  // Handle nested property access
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Safely sets a nested property in an object using a key path.
 * Creates intermediate objects as needed.
 * 
 * @param {Object} obj - The object to set the property in
 * @param {string} keyPath - Property key or dot-separated path (e.g., "options.context_paths")
 * @param {*} value - The value to set
 */
function setNestedProperty(obj, keyPath, value) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Target must be an object');
  }

  // Handle direct property access (backward compatibility)
  if (!keyPath.includes('.')) {
    obj[keyPath] = value;
    return;
  }

  // Handle nested property access
  const keys = keyPath.split('.');
  let current = obj;

  // Navigate to the parent of the target property, creating objects as needed
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    if (current[key] === null || current[key] === undefined) {
      current[key] = {};
    } else if (typeof current[key] !== 'object') {
      throw new Error(`Cannot set property '${keyPath}': '${keys.slice(0, i + 1).join('.')}' is not an object`);
    }
    
    current = current[key];
  }

  // Set the final property
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
}

/**
 * Checks if a nested property exists in an object using a key path.
 * 
 * @param {Object} obj - The object to check
 * @param {string} keyPath - Property key or dot-separated path (e.g., "options.context_paths")
 * @returns {boolean} True if the property exists, false otherwise
 */
function hasNestedProperty(obj, keyPath) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  // Handle direct property access (backward compatibility)
  if (!keyPath.includes('.')) {
    return obj.hasOwnProperty(keyPath);
  }

  // Handle nested property access
  const keys = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return false;
    }
    if (!current.hasOwnProperty(keys[i])) {
      return false;
    }
    current = current[keys[i]];
  }

  return true;
}

module.exports = {
  getNestedProperty,
  setNestedProperty,
  hasNestedProperty,
};