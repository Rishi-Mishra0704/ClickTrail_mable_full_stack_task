package config

import (
	"log"

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
	viper.AddConfigPath(path)
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()

	if err = viper.ReadInConfig(); err != nil {
		log.Printf("No .env file found in %s: %v", path, err)
		return
	}

	err = viper.Unmarshal(&config)
	return
}
