# Monochrome
Monochrome's WebUI, implemented with Vue 3.

Most users will prefer the [Monochrome full stack](https://github.com/MonochromeCMS/Monochrome), which contains the API, the frontend and the backend.

## Usage
### Makefile
A Makefile is provided with this repository, to simplify the development and usage:
```
help                 Show this help message
up start             Run a container from the image, or start it natively
build                Build image, or ./dist natively
# Docker utils
logs                 Read the container's logs
sh                   Open a shell in the running container
# Dev utils
format               Format project code
test                 Test the application
```
So the basic usage would be:
```shell
make build
make start
```
### .env
While using the Makefile, the image settings can be set with a .env file, see [.env.example](.env.example).
### Native
Even though Docker is the recommended method, some Makefile rules are native compatible, so
a virtual environment can also be used after cloning this repository:
```shell
#You need to be able to run these commands on your terminal:
node, yarn
```
```shell
yarn
make native=1 build
```
### Development
A dev setting is available to use hot reloading and format the code:
```shell
make dev=1 format
make dev=1 build start
```
### Environment variables
```javascript
// Domain this UI will be served on
DOMAIN_NAME = "localhost"
// Protocol this UI will be served with
PROTOCOL = "http"
// Prefix for all the server files, if needed (ex. server on https://.../monochrome => /monochrome
BASE_URL = "/"
// Base URL to access the images
VITE_MEDIA_PATH = "http://localhost/media"
// Base URL to access the API
VITE_API_PATH = "http://localhost/api"

// Title of the application
TITLE = "Monochrome"
// Short description of the application
DESCRIPTION
```

## Media
Those production images can be used to serve the media handled by an API that stores it in the local FS,
to do that simply mount the media folder on `/srv/media`.

## Progress
* Migration to Vue 3 🟢100%
* Adding new features in progress! 
* Testing 🔴0% (It's a pain so no promises)

Credits:
* Logo font: Lemon Milk by [Marsnev](https://marsnev.com/)
