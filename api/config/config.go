package config

import (
	"log"
	"path/filepath"
	"runtime"

	"github.com/spf13/viper"
)

type Config struct {
	Mode               string `mapstructure:"MODE"`
	Port               string `mapstructure:"PORT"`
	ClickHouseHost     string `mapstructure:"CLICKHOUSE_HOST"`
	ClickHousePassword string `mapstructure:"CLICKHOUSE_PASSWORD"`
	ClickHouseUser     string `mapstructure:"CLICKHOUSE_USER"`
	JWTSecretKey       string `mapstructure:"JWT_SECRET_KEY"`
	TokenDuration      string `mapstructure:"TOKEN_DURATION"`
}

func LoadConfig(path string) (config Config, err error) {
	_, filename, _, _ := runtime.Caller(0)
	basePath := filepath.Dir(filename) // points to ./api/config/
	envPath := filepath.Join(basePath, "..", ".env")

	log.Print(envPath)
	viper.SetConfigFile(envPath)
	viper.AutomaticEnv()

	if err = viper.ReadInConfig(); err != nil {
		return
	}
	err = viper.Unmarshal(&config)
	return
}
