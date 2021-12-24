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

serve: dev-env
	$(HEROKU) local -f Procfile-dev web

deploy:
	$(GIT) push heroku main

dev-send-message-in-a-month:
	curl -X POST -H 'Content-Type: application/json' -d '{ "type": "in-a-month" }' 'http://localhost:5000/notifications/'

prod-send-message-in-a-month:
	curl -X POST -H 'Content-Type: application/json' -d '{ "type": "in-a-month" }' 'https://djeeta-app.herokuapp.com/notifications/'
