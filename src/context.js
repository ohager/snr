require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { composeApi } = require('@signumjs/core')

const getContext = async () => {
  const ledger = await composeApi({ nodeHost: process.env.SIGNUM_NODE_HOST })
  console.info('*** Using Signum Node:', ledger.service.settings.nodeHost)
  return {
    database: new PrismaClient(),
    ledger,
    config: {
      passphrase: process.env.PAYING_ACCOUNT_PASSPHRASE
    }
  }
}

module.exports = {
  getContext
}
