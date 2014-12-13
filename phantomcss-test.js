var phantomcss = require('phantomcss');

var test_files = [
	'tests/holy-grail-example.html',
	'tests/horizontal-alignment.html',
	'tests/marketing-stuff.html',
	'tests/shifting.html',
	'tests/text.html',
	'tests/tile-vs-tiles-justify.html',
	'tests/vertical-alignment-example.html',
	'tests/widths.html'
];

var page_delay = 100; // TODO: Fine tune this number. Can we get away with using 0 instead?

var screen_sizes = [
	320,
	768,
	992,
	1200,
	1400
];

phantomcss.init({
	screenshotRoot: 'tests/screenshots',
	failedComparisonsRoot: 'tests/screenshot-failures',
	libraryRoot: 'node_modules/phantomcss'
});

casper.start();

screen_sizes.forEach(function(screen_size) {
	casper.then(function(){
		casper.viewport(screen_size,100); // TODO: Not sure what to put as the y value here. Does it matter?
	});
	test_files.forEach(function(test_file) {
		casper.thenOpen(test_file);
		casper.then(function() {
			var screenshot_name = test_file.replace(/\s|\/|\\/,'-');
			screenshot_name = screenshot_name+'-'+screen_size;
			phantomcss.screenshot('html', page_delay, null, screenshot_name);
		});
	});
});

casper.then(function() {
	phantomcss.compareAll();
});

casper.then(function() {
	casper.test.done();
});

casper.run(function(){
	console.log('\nTHE END.');
	phantom.exit(phantomcss.getExitStatus());
});