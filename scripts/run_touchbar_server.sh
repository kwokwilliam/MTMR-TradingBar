# Get the directory of this script
BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )/.."
ASSETS="$BASE/assets"

# Build server code
tsc -p $BASE/touchbarserver

# Constants
export PORT="9999"
export HOST="http://localhost"
export CONFIG_LOCATION="$BASE/config/config.jsonc"
export MTMR_CONFIG_LOCATION="$HOME/Library/Application Support/MTMR/items.json"
export MTMR_CODE="$HOME/Desktop/Projects/MTMR-TradingBar"
export ROBINHOOD_LOGO="$ASSETS/images/robinhoodLogo.png"
export BARCHART_LOGO="$ASSETS/images/barchartLogo.png"
export SPY_IMAGE="$ASSETS/images/spy.png"
export CONFIG_HTML="$ASSETS/html/config.html"
# Run server
node $BASE/touchbarserver/build/index.js