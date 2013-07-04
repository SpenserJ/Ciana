REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require blanket --recursive --reporter $(REPORTER)

test-cov-html:
	@CIANA_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

test-coveralls:
	@CIANA_COV=1 $(MAKE) test REPORTER=mocha-lcov-reporter |\
		./node_modules/coveralls/bin/coveralls.js

travis-test: test-coveralls test

.PHONY: test test-cov-html test-coveralls travis-test
