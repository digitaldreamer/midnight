.PHONY: build css js

build: css js

css: dir
	lessc css/styles.less > build/styles.css
	java -jar utils/yuicompressor-2.4.8.jar build/styles.css -o build/styles.min.css
	rm build/styles.css

js: dir
	node js/libs/r.js -o js/build.js
	java -jar utils/yuicompressor-2.4.8.jar build/main-build.js -o build/main.min.js
	rm build/main-build.js

debug: dir
	lessc css/styles.less > build/styles.min.css
	node js/libs/r.js -o js/build.js optimize=none
	cp build/main-build.js > build/main.min.js
	rm build/main-build.js

dir:
	mkdir -p build
	mkdir -p build/css
	mkdir -p build/js

test:
	rm -rf ~/www/lab/midnight
	cp -R ~/projects/midnight ~/www/lab/midnight

clean:
	rm -rf build
