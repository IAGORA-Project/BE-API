const basicResponse = ({ status, message = 'Internal server error!', result = null }) => {
  return {
    status, message, result
  }
}

module.exports = {
  basicResponse
}