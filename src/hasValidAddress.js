const { Address } = require('@signumjs/core')

function hasValidAddress (operator) {
  try {
    Address.fromReedSolomonAddress(operator.platform)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  hasValidAddress
}
