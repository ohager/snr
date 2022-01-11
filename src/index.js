const dotenv = require('dotenv')
const { program } = require('commander')
const { version } = require('../package.json')
const { main: payCommand } = require('./pay')
const { main: initCommand, assertInit } = require('./init')
const { getContext } = require('./context')

async function startAction (opts, fn) {
  assertInit()
  dotenv.config(opts.config)
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
  .description(' Initializes the command. Use this before any other action')
  .action(initCommand)

program
  .command('pay')
  .argument('<amount>', 'Amount in Signa to be paid to all eligible operators', parseFloat)
  .option('-c, --config <filename>', 'A config file with all the necessary settings', '.env')
  .option('-x, --exec', 'If set than payment will be executed for real, otherwise it checks only for eligible operators.')
  .option('-p, --progress', 'Shows a progress bar')
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
