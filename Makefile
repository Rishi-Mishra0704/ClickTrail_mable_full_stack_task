clean:
	@rm -rf bin
	@rm -rf bin/ClickTrail
	@rm -rf bin/ClickTrail.exe

clean-win:
	@if exist bin (rmdir /s /q bin)
	@if exist bin\\ClickTrail.exe (del /q bin\\ClickTrail.exe)
	@if exist bin\\ClickTrail (del /q bin\\ClickTrail)

test:
	@cd api && go test -v ./...

build: clean
	@mkdir -p bin
	@go build -o ./bin/ClickTrail ./api/main.go
	@chmod +x ./bin/ClickTrail

build-mac: clean
	@mkdir -p bin
	@GOOS=darwin GOARCH=amd64 go build -o ./bin/ClickTrail ./api/main.go
	@chmod +x ./bin/ClickTrail

build-linux: clean
	@mkdir -p bin
	@GOOS=linux GOARCH=amd64 go build -o ./bin/ClickTrail ./api/main.go
	@chmod +x ./bin/ClickTrail

build-windows: clean-win
	@mkdir bin
	@set GOOS=windows&& set GOARCH=amd64&& go build -o ./bin/ClickTrail.exe ./api/main.go

build-windows-386: clean-win
	@mkdir bin
	@set GOOS=windows&& set GOARCH=386&& go build -o ./bin/ClickTrail.exe ./api/main.go

build-mac-arm64: clean
	@mkdir -p bin
	@GOOS=darwin GOARCH=arm64 go build -o ./bin/ClickTrail ./api/main.go
	@chmod +x ./bin/ClickTrail

run: build
	@./bin/ClickTrail

.PHONY: clean clean-win build test build-mac build-linux build-windows build-windows-386 build-mac-arm64 run
