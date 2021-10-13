include .env

native ?= 0
dev ?= 0

tag ?= monochromecms/monochrome-webui
target ?= caddy
buildkit ?= 1
test_exit ?= 0
user ?= `id -u`
dir ?= `pwd`

BUILD_ARGS = `bash -c 'IFS=$$(echo -en "\n\b");for i in $$(cat .env | grep -v ^\#); do out+="--build-arg \"$$i\" " ; done; echo $$out;out=""'`

.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker specific commands

.PHONY: build
build:	## Build image
ifneq ($(native),0)
	yarn
	@export `grep -v '^#' .env | xargs -d '\n'`
	yarn build
else
ifneq ($(dev),0)
	@DOCKER_BUILDKIT=$(buildkit) docker build $(BUILD_ARGS) --target dev -t $(tag):dev .
else
	@DOCKER_BUILDKIT=$(buildkit) docker build $(BUILD_ARGS) --target $(target) -t $(tag) .
endif
endif

.PHONY: up
.ONESHELL: up
up start:	## Run a container from the image
ifneq ($(native),0)
	yarn
	@export `grep -v '^#' .env | xargs -d '\n'`
	yarn serve
else
ifneq ($(dev),0)
	@docker run --rm --name monochrome-webui -p 80:80 --env-file .env -v "`pwd`/src:/app/src" $(tag):dev
else
	@docker run --rm --name monochrome-webui -p 80:80 -p 443:443 $(tag)
endif
endif

.PHONY: logs
logs:	## Read the container's logs
	docker logs -f --tail 500 monochrome-webui

.PHONY: sh
sh: ## Open a shell in the running container
	docker -ti exec monochrome-webui sh

# Utils

.PHONY: format
format:  ## Format project code
	@docker run --env-file .env --rm -v "`pwd`/src:/app/src" $(tag):dev yarn lint

.PHONY: secret
secret: ## Generate a secret
	@openssl rand -hex 30

# TODO: TESTING
