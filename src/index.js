const dotenv = require('dotenv')
const { join } = require('path')
const { program, InvalidArgumentError } = require('commander')
const { version } = require('../package.json')
const { main: queueCommand } = require('./queue')
const { main: payCommand } = require('./pay')
const { main: initCommand, assertInit } = require('./init')
const { getContext } = require('./context')
const { asDate } = require('./asDate')

const DefaultEnv = join(__dirname, '../.env')

function parseDate (dateString) {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new InvalidArgumentError('Not a date. Use YYYY-MM-DD')
  }
  return date
}

async function startAction (opts, fn) {
  assertInit()
  dotenv.config({ path: opts.config })
  const context = await getContext()

  console.info('Execution Parameters')
  console.info(opts)

  await fn(context, opts)
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
  .description('Pays the rewards to eligible node operators')
  .argument('<amount>', 'Amount in Signa to be paid to all eligible operators', parseFloat)
  .option('-c, --config <filename>', 'A config file with all the necessary settings', DefaultEnv)
  .option('-x, --exec', 'If set than payment will be executed for real, otherwise it checks only for potential payments.')
  .action((amount, options) => {
    startAction({ amount, ...options }, payCommand)
  })

program
  .command('queue')
  .description('Checks the node operators for payment eligibility, and queues them for sending (need to use pay to execute payments)')
  .argument('<minVersion>', 'The minimum version for being eligible [following semantic versioning]')
  .argument('[availability]', 'The minimum availability in percent (0 - 100) for being eligible', parseFloat, 99)
  .argument('[lastSeen]', 'The last date when node was seen', parseDate, asDate(new Date()))
  .option('-c, --config <filename>', 'A config file with all the necessary settings', DefaultEnv)
  .option('-x, --exec', 'If set than queuing will be executed for real, otherwise it checks only for eligible operators.')
  .action((minVersion, availability, lastSeen, options) => {
    startAction({ minVersion, availability, lastSeen: asDate(lastSeen), ...options }, queueCommand)
  });

(async () => {
  try {
    await app.parseAsync(process.argv)
  } catch (e) {
    console.error('❌ Damn, something Failed:', e)
  }
})()
