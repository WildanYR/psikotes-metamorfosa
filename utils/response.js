const generateResponse = (code, status, doc, message) => {
  return {
    code,
    response: {
      status,
      doc,
      message
    }
  }
}

module.exports = {
  success: (data) => {
    return generateResponse(200, 'ok', data, '')
  },

  missingData: () => {
    return generateResponse(400, 'client error', null, 'missing required data')
  },

  badRequest: (message) => {
    return generateResponse(400, 'client error', null, message)
  },
  
  forbidden: () => {
    return generateResponse(403, 'client error', null, 'access denied')
  },

  internalServerError: () => {
    return generateResponse(500, 'server error', null, 'internal server error')
  }
}