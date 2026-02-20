.PHONY: deps run-dev clean 


deps:
	npm install


run-dev:
	npm run dev


# Run vanilla JS example
run-dev-v:
	cd basic-usage-vanilla-js && npm install && npm run dev


clean:
	rm -rf lib
	rm -rf dist
	rm -rf node_modules