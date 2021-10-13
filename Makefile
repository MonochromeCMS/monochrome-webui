include .env

native ?= 0
dev ?= 0

tag ?= monochromecms/monochrome-webui
target ?= caddy
buildkit ?= 1
test_exit ?= 0
user ?= `id -u`
dir ?= `pwd`

BUILD_ARGS := `bash -c 'IFS=$$(echo -en "\n\b");for i in $$(cat .env | grep -v ^\#); do out+="--build-arg \"$$i\" " ; done; echo $$out;out=""'`

.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker specific commands

.PHONY: build
.ONESHELL: build
build:	## Build image
ifneq ($(native),0)
	yarn
	@export `grep -v '^#' .env | xargs -d '\n'`
	yarn build
else
	export DOCKER_BUILDKIT=$(buildkit)
	@args=$(BUILD_ARGS)
ifneq ($(dev),0)
	# This crap is needed because sh sucks
	bash -c "docker build $$args --target dev -t $(tag):dev ."
else
	bash -c "docker build $$args --target $(target) -t $(tag) ."
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
	-@docker run -ti --rm --name monochrome-webui -p 80:80 --env-file .env -v "`pwd`/src:/app/src" $(tag):dev
else
	@docker run --rm --name monochrome-webui -p 80:80 --env-file .env -p 443:443 $(tag)
endif
endif

.PHONY: logs
logs:	## Read the container's logs
	docker logs -f --tail 500 monochrome-webui

.PHONY: sh
sh: ## Open a shell in the running container
	docker exec -ti monochrome-webui sh

# Utils

.PHONY: format
format:  ## Format project code
ifneq ($(native),0)
	yarn lint
else
	@docker run --env-file .env --rm -v "`pwd`/src:/app/src" $(tag):dev yarn lint
endif

.PHONY: secret
secret: ## Generate a secret
	@openssl rand -hex 30

# TODO: TESTING
