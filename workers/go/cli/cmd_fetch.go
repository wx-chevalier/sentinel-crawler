package main

import (
	"errors"
	"fmt"
	"net/url"

	"github.com/urfave/cli"
)

var cmdFetch = cli.Command{
	Name:    "fetch",
	Aliases: []string{"f"},
	Usage:   "fetch the specific target",
	Flags:   fetchFlags,
	Action:  runFetch,
}

var fetchFlags = []cli.Flag{
	cli.StringFlag{
		Name:  "type, t",
		Value: "html",
		Usage: "fetch Type, html/json/video",
	},
}

func runFetch(c *cli.Context) error {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
		}
	}()

	if c.NArg() == 0 {
		return errors.New("请指定抓取目标 URL")
	}

	rawURL := c.Args().Get(0)

	// 判断是否为有效 URL
	parsedURL, err := url.Parse(rawURL)

	if err != nil {
		panic(err)
	}

	fmt.Printf("target - %s\nmode - %s", parsedURL, c.String("t"))

	return nil
}
