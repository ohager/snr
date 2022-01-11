# Signum Node Reward (SNR)

Payment Application for the Signum Node Rewards (SNR)

# Install

> NodeJS 14+ installed

Clone this repo and install the dependencies: 

```bash
git clone https://github.com/ohager/snr.git
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
Usage: index [options] [command]


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
  Version: 1.0.0
  

Options:
  -V, --version           output the version number
  -h, --help              display help for command

Commands:
  init                    Initializes the command. Use this before any other
                          action
  pay [options] <amount>  Checks the node operators for payment eligibility,
                          and sends the rewards iff so
  help [command]          display help for command
```
