function generateId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}${random}`;
}

module.exports = { generateId };
