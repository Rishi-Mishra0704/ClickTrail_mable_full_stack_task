clean:
	@rm -rf api/bin
	@rm -rf api/bin/ClickTrail
	@rm -rf api/bin/ClickTrail.exe


clean-win:
	@if exist api\\bin (rmdir /s /q api\\bin)
	@if exist api\\ClickTrail.exe (del /q api\\ClickTrail.exe)
	@if exist api\\ClickTrail (del /q api\\ClickTrail)

test:
	@cd api && go test -v ./...

build: clean
	@mkdir -p bin
	@cd api && go build -o ./bin/ClickTrail.exe ./main.go
	@chmod +x ./bin/ClickTrail


build-mac: clean
	@cd api && GOOS=darwin GOARCH=amd64 go build -o ./bin/ClickTrail ./main.go
	@chmod +x ./bin/ClickTrail

build-linux: clean
	@cd api && GOOS=linux GOARCH=amd64 go build -o ./bin/ClickTrail ./main.go
	@chmod +x ./bin/ClickTrail

build-windows: clean-win
	@cd api && set GOOS=windows&& set GOARCH=amd64&& go build -o ./bin/ClickTrail.exe main.go

build-windows-386: clean-win
	@cd api && set GOOS=windows&& set GOARCH=386&& go build -o ./bin/ClickTrail.exe main.go

build-mac-arm64: clean
	@GOOS=darwin GOARCH=arm64 go build -o ./bin/ClickTrail ./main.go
	@chmod +x ./bin/ClickTrail

run: build
	@cd api && ./bin/ClickTrail

.PHONY: clean clean-win build test build-mac build-linux build-windows build-all build-windows-386 build-mac-arm64 run run-win
