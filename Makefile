GIT := git
YARN := yarn
HEROKU := heroku

clean:
	rm -rf ./dist
	mkdir ./dist && touch ./dist/.gitkeep

deps:
	$(YARN)

build: clean deps
	$(YARN) run build

dev-env:
	$(HEROKU) config -s > .env
	cat .env.development >> .env

serve: deps dev-env
	$(HEROKU) local -f Procfile-dev web

lint: deps
	$(YARN) run lint

prettify: deps
	$(YARN) run prettify

deploy:
	$(HEROKU) config:set DEPLOYMENT_ID=$(shell git log -n 1 --pretty=format:"%H")
	$(GIT) push heroku main

dev-send-message-in-a-month:
	curl -X POST -H "Content-Type: application/json" -H "x-heroku-deployment-id: ${DEPLOYMENT_ID}" -d '{ "type": "in-a-month" }' 'http://localhost:5000/notifications'

prod-send-message-in-a-month:
	curl -X POST -H "Content-Type: application/json" -H "x-heroku-deployment-id: ${DEPLOYMENT_ID}" -d '{ "type": "in-a-month" }' 'https://djeeta-app.herokuapp.com/notifications'
