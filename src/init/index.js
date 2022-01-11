const { join } = require('path')
const { copySync, pathExistsSync } = require('fs-extra')
const { assertInit } = require('./assertInit')

const main = () => {
  const envPath = join(__dirname, '../../')
  const source = join(envPath, '.env.example')
  const destination = join(envPath, '.env')

  if (pathExistsSync(destination)) {
    console.info('There is an env file already at', destination)
    console.info('Initialization skipped to avoid override')
    process.exit(1)
  }

  copySync(source, destination)
  console.info('Configuration file created at', destination)
  console.info('Please, edit according your needs, before using any other command')

}
module.exports = {
  main,
  assertInit
}
