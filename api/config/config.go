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
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(path)
	viper.AddConfigPath(".") // fallback to current dir

	// Always read from system environment variables
	viper.AutomaticEnv()
	if err = viper.ReadInConfig(); err != nil {
		log.Println(".env not found, falling back to system environment variables only")
	}

	err = viper.Unmarshal(&config)
	return
}
