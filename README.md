# Signum Node Reward (SNR)

Payment Application for the Signum Node Rewards (SNR)

# Install

> NodeJS 14+ installed

Clone this repo and install the dependencies: 

```bash
git clone https://github.com/ohager/snr.git
cd snr
npm i
```

# Initialize aka Configuration

Before using it you need to _configure_ the tool. 
On installation the `.env.example` will be copied to `.env` automatically.
Just edit the `.env` file according your needs.

> Hint: You can always override the ENV vars on startup, i.e. `PAYING_ACCOUNT_PASSPHRASE=secret snr pay 100 -x`   
> Another Hint: Once the `.env` file exists, it won't be overwritten by the `init` command anymore

# Usage

Just hit `./snr-cli.js --help` for detailed usage

```
Usage: snr-cli [options] [command]


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
  Version: 1.1.0
  

Options:
  -V, --version                                           output the version number
  -h, --help                                              display help for command

Commands:
  init                                                    Initializes the command. Use this before any other action
  pay [options] <amount>                                  Pays the rewards to eligible node operators
  queue [options] <minVersion> [availability] [lastSeen]  Checks the node operators for payment eligibility, and queues
                                                          them for sending (need to use pay to execute payments)
  help [command]                                          display help for command
```
## Examples

### Queue

Queuing is the process to verify if an operator is eligible. It just sets the elgibile operator to 'Queued', such that the payment can be done afterwards.

This will simulate a queue simulation for all version above '3.2' and 95% of availability and last seen today

```bash
./snr-cli.js queue "3.2" 95 
```

This will queue for all eligible operators with version above or equal '3.2' and 99% of availability and last seen at given date

```bash
./snr-cli.js queue "3.2.2" 99 "2020-12-30" -x
```


### Payment

Pays out to all 'Queued' operators.

This will simulate a payment execution of 10 Signa.

```bash
./snr-cli.js pay 10
```

This will run a real payment execution of 3.14159 Signa and alters state in the database also

```bash
./snr-cli.js pay 3.14159 -x
```

