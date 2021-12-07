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
