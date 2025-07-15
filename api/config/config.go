package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	//Enter app.env details
	Mode            string `mapstructure:"MODE"`
	Port            string `mapstructure:"PORT"`
	ClickHouseDBURL string `mapstructure:"CLICKHOUSE_DB_URL"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.SetConfigFile(path + "/.env")

	viper.AutomaticEnv()

	if err = viper.ReadInConfig(); err != nil {
		return
	}
	err = viper.Unmarshal(&config)
	return
}
