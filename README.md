# MTMR-TradingBar

> William Kwok

MTMR-TradingBar is a locally hosted server aimed to provide special functionality to the [MTMR touchbar application](https://github.com/Toxblh/MTMR) to view live stock tickers, news, and user friendly config changing.

This is currently a work in progress, and will only be used by me and a few friends. User friendly installation is currently not on the roadmap for this project. 

# To setup

1. Clone the repository
2. You will need to install [MTMR](https://github.com/Toxblh/MTMR) and NPM, and ideally use the version specified within .nvmrc.
3. Modify `config/config.jsonc` with the correct information. You should only have to change `MTMR_CODE` at the time of typing this, if you want to set up the code button to open the repo in Visual Studio Code.
4. `cd` into `touchbarserver` and do `npm install`.
5. Go back to the repo base and do `./scripts/run_touchbar_server.sh`. Everything should work. 