package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/urfave/cli"
)

var cmdServer = cli.Command{
	Name:    "server",
	Aliases: []string{"s"},
	Usage:   "start the supervisor server",
	Flags:   serverFlags,
	Action:  runServer,
}

var (
	ip           string
	port         int
	password     string
	secret       string
	enableWorker bool
)

var serverFlags = []cli.Flag{
	cli.StringFlag{
		Name:        "ip",
		Value:       "0.0.0.0",
		Usage:       "server ip address to bind to",
		Destination: &ip,
	},
	cli.IntFlag{
		Name:  "port",
		Value: 9393,
		Usage: "server http listen port",
	},
	cli.StringFlag{
		Name:  "password",
		Value: "xe-crawler",
		Usage: "password for admin user",
	},
	cli.StringFlag{
		Name:  "secret",
		Value: "#$G&%&*",
		Usage: "secret to encrypt Json Web Token(JWT)",
	},
	cli.BoolFlag{
		Name:        "worker",
		Destination: &enableWorker,
	},
}

func runServer(c *cli.Context) error {

	fmt.Print(c.String("ip"))

	fmt.Print(c.Bool("worker"))

	func() {
		r := gin.Default()
		r.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
		r.Run() // listen and serve on 0.0.0.0:8080

	}()

	return nil
}
