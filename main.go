package main

import (
	"os"

	"github.com/kwokwilliam/MTMR-TradingBar/constants"
)

func main() {
	commandArgument := ""
	if len(os.Args) > 1 {
		commandArgument = os.Args[1]
	}

	host := os.Getenv(constants.HOST)
	addr := os.Getenv(constants.ADDR)

	switch commandArgument {
	case constants.ResetView:
		ResetView(addr, host)
	}
}
