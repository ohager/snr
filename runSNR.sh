# This script runs in an infinite loop, waking up every morning at 7:00AM
# Pir8Radio 2022

WAKEUP="07:00" # Wake up at this time tomorrow and run a command
while :
do
    SECS=$(expr `date -d "tomorrow $WAKEUP" +%s` - `date -d "now" +%s`)
    echo "`date +"%Y-%m-%d %T"`| Will sleep for $SECS seconds."
    sleep $SECS &  # We sleep in the background to make the script interruptible
    wait $!
    echo "`date +"%Y-%m-%d %T"`| Waking up"
    
    # Run your command here, replace paths with your real snr paths
    /home/signum/Signum_Apps/snr/snr-cli.js queue 3.3.3 80 -x
    wait
    /home/signum/Signum_Apps/snr/snr-cli.js pay -x

done
