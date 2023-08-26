# This script runs in an infinite loop, waking up every morning at 7:00AM
# Pir8Radio

WAKEUP="07:00" # Wake up at this time tomorrow and run a command
while :
do
    SECS=$(expr `date -d "tomorrow $WAKEUP" +%s` - `date -d "now" +%s`)
    echo "`date +"%Y-%m-%d %T"`| Will sleep for $SECS seconds."
    sleep $SECS &  # We sleep in the background to make the screipt interruptible
    wait $!
    echo "`date +"%Y-%m-%d %T"`| Waking up"
    
    # Check that nodes meet requirements X.X.X (version) XX (uptime %)
    /home/signum/Signum_Apps/snr/snr-cli.js queue 3.7.0 80 -x
    wait
    # Pay everyone that passed check above
    /home/signum/Signum_Apps/snr/snr-cli.js pay -x

done
