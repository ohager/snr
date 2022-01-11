const { join } = require('path')
const { pathExistsSync } = require('fs-extra')

const assertInit = () => {
  const envPath = join(__dirname, '../../')
  const destination = join(envPath, '.env')
  if (!pathExistsSync(destination)) {
    console.info('Command not initialized yet')
    console.info('Please use the "init" command before using any other command')
    process.exit(1)
  }
}
module.exports = {
  assertInit
}
