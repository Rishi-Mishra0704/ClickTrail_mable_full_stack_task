package db

import (
	"crypto/tls"

	clickhouse "github.com/ClickHouse/clickhouse-go/v2"
)

func NewClickhouseConn(host, port, user, password string) (clickhouse.Conn, error) {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{host + ":" + port},
		Auth: clickhouse.Auth{
			Database: "default",
			Username: user,
			Password: password,
		},
		TLS: &tls.Config{
			ServerName: host, // This is crucial for TLS handshake
		},
	})
	if err != nil {
		return nil, err
	}
	return conn, nil
}
