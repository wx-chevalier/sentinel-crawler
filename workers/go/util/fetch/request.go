// Package fetch 定义请求数据的格式与实际的抓取脚手架
package fetch

import (
	"io/ioutil"
	"net/http"
	"os"

	"github.com/bitly/go-simplejson"

	"github.com/wxyyxc1992/xe-crawler/worker/go/util/xlog"
)
