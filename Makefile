all: lint format cover build

setup:
	npm install

format:
	npm run format

lint:
	npm run lint

test:
	npm test

cover:
	npm run test:cover

build:
	npm run build

