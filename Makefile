all: lint format cover build docs

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

docs:
	npm run docs
.PHONY: docs
