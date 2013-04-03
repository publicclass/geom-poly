
test:
	node_modules/.bin/mocha -r should -R tap test.js

test.html: test.js index.js support/head.html support/foot.html
	node_modules/.bin/mocha -r should $< -R doc | cat support/head.html - support/foot.html > $@

.PHONY: test