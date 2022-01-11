# Signum Node Reward (SNR)

Payment Application for the Signum Node Rewards (SNR)

> NodeJS 14+ installed

This program is considered to run as a system wide installed command line tool, so install it
globally using 

`npm i @signum/snr-cli -g`

# Initialize aka Configuration

Before using it you need to _configure_ the tool. On installation it tells you where
to find the configuration file. Just set the environment variables accordingly and you should be fin.

> Hint: You can always override the ENV vars on startup, i.e. `PAYING_ACCOUNT_PASSPHRASE=secret snr pay 100 -x`   

# Usage

Just hit `snr-cli --help` for detailed usage

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
