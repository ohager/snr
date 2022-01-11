const { composeApi } = require('@signumjs/core')

const getContext = async () => {
  const dbUrl = process.env.DATABASE_URL
  const ledger = await composeApi({ nodeHost: process.env.SIGNUM_NODE_HOST })
  console.info('*** Using Signum Node:', ledger.service.settings.nodeHost)
  console.info('*** Database:', dbUrl.slice(dbUrl.indexOf('@') + 1))
  // Prisma causes side effects on load env vars.....so we load it after dotenv has set the vars
  const { PrismaClient } = require('@prisma/client')
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
