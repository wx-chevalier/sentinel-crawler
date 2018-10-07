package xlog

import "testing"

func TestInfo(t *testing.T) {
	type args struct {
		msg string
	}

	tests := []struct {
		name string
		args args
	}{
		{
			"simple",
			args{
				"info",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Log("11")
			Info(tt.args.msg)
		})
	}
}
