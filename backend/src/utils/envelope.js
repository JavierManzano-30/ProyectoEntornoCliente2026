function envelopeSuccess(data, meta) {
  const response = { success: true, data };
  if (meta) response.meta = meta;
  return response;
}

function envelopeError(code, message, details) {
  return {
    success: false,
    error: {
      code,
      message,
      details: details || []
    }
  };
}

module.exports = { envelopeSuccess, envelopeError };
