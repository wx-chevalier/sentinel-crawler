package main

import (
	"log"
	"os"
	"sort"

	"github.com/urfave/cli"
)

var flags = []cli.Flag{
	cli.StringFlag{
		Name:  "timeout",
		Value: "10",
		Usage: "Timeout for single target",
	},
}

var commands = []cli.Command{
	cmdFetch,
	cmdServer,
}

func main() {
	app := cli.NewApp()

	app.Version = "0.0.1"

	app.Flags = flags

	app.Commands = commands

	sort.Sort(cli.FlagsByName(app.Flags))
	sort.Sort(cli.CommandsByName(app.Commands))

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
