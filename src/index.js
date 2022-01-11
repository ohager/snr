const dotenv = require('dotenv')
const { join } = require('path')
const { program } = require('commander')
const { version } = require('../package.json')
const { main: payCommand } = require('./pay')
const { main: initCommand, assertInit } = require('./init')
const { getContext } = require('./context')

const DefaultEnv = join(__dirname, '../.env')

async function startAction (opts, fn) {
  assertInit()
  dotenv.config({ path: opts.config })
  const context = await getContext()
  fn(context, opts)
}

const app = program
  .version(version)
  .description(`
            @@@@@@@@  @@@@@@@           
         @@@@@    @@@@@    @@@@@        
           @@@  @@@  @@@ @@@@@          
    @@@      @@@@@     @@@@       @@@   
  @@@@@@@@ &@@@  @@@@@@@@ @@@@  @@@@@@@ 
 @@@    @@@@       @@@      @@@@@    @@@
 @@@  @@@ *@@@@           @@@  @@@  @@@@
   @@@@@     @@@         @@@     @@@@@  
 @@@@  @@@  @@@           @@@@  @@@  @@@
 @@@    @@@@@      @@@       @@@@    @@@
  @@@@@@@  @@@  @@@@@@@@  @@@  @@@@@@@@ 
    @@@       @@@@     @@@@@      @@@   
           @@@@  @@@  @@@  @@@          
         @@@@@    @@@@@    @@@@@        
            @@@@@@@  @@@@@@@@    
 
           Signum Node Rewards          
      
  Author: ohager
  Version: ${version}
  `)

program
  .command('init')
  .description('Initializes the command. Use this before any other action')
  .action(initCommand)

program
  .command('pay')
  .description('Checks the node operators for payment eligibility, and sends the rewards iff so')
  .argument('<amount>', 'Amount in Signa to be paid to all eligible operators', parseFloat)
  .option('-c, --config <filename>', 'A config file with all the necessary settings', DefaultEnv)
  .option('-x, --exec', 'If set than payment will be executed for real, otherwise it checks only for eligible operators.')
  .action((amount, options) => {
    startAction({ amount, ...options }, payCommand)
  });

(async () => {
  try {
    await app.parseAsync(process.argv)
  } catch (e) {
    console.error('❌ Damn, something Failed:', e)
  }
})()
