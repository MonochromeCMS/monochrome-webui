include .env

buildkit ?= 1 # If buildkit should be used
test_exit ?= 0 # If a failed test should stop everything
dir ?= `pwd`

DOCKER_DEV = docker-compose run --rm -v "`pwd`:/mnt" -w "/mnt" webui


.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker specific commands

.PHONY: build
build:	## Build image
	DOCKER_BUILDKIT=$(buildkit) docker-compose build

.PHONY: up
.ONESHELL: up
up start:	## Run a container from the image
	docker-compose up -d

.PHONY: up
.ONESHELL: up
down stop:	## Stops the container running
	docker-compose down

.PHONY: logs
logs:	## Read the container's logs
	docker-compose logs -f --tail 500

.PHONY: sh
sh: ## Open a shell in the running container
	docker-compose exec api bash

# Utils

.PHONY: format
format:  ## Format project code
	@$DOCKER_DEV yarn lint

.PHONY: secret
secret: ## Generate a secret
	@openssl rand -hex 30

# TODO: TESTING
