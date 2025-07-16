package db

import (
	"crypto/tls"

	clickhouse "github.com/ClickHouse/clickhouse-go/v2"
)

func NewClickhouseConn(host, user, password string) (clickhouse.Conn, error) {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{host},
		Auth: clickhouse.Auth{
			Database: "default",
			Username: user,
			Password: password,
		},
		TLS: &tls.Config{},
	})
	if err != nil {
		return nil, err
	}
	return conn, nil
}
