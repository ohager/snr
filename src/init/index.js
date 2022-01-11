const { join } = require('path')
const { copySync, pathExistsSync } = require('fs-extra')
const { assertInit } = require('./assertInit')

const main = () => {
  const envPath = join(__dirname, '../../')
  const source = join(envPath, '.env.example')
  const destination = join(envPath, '.env')

  if (pathExistsSync(destination)) {
    console.info('There is an env file already at:')
    console.info(destination)
    console.info('\nInitialization skipped to avoid override')
    process.exit(0)
  }

  console.info('Initializing...')
  copySync(source, destination)
  console.info('========================================')
  console.info('Configuration file created at:')
  console.info(destination)
  console.info('\nPlease, edit according your needs, before using any other command')
  console.info('\n✅ SUCCESS\n')

}
module.exports = {
  main,
  assertInit
}
