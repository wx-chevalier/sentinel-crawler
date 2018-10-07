package xlog

import (
	"github.com/wxyyxc1992/xe-crawler/worker/go/external/glog"
)

// Info - Log Msg in Info Level
func Info(msg string) string {
	glog.Info(msg)

	return msg
}
