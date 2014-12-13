var phantomcss = require('phantomcss');

phantomcss.init({
	screenshotRoot: 'tests/screenshots',
	failedComparisonsRoot: 'tests/screenshot-failures',
	libraryRoot: 'node_modules/phantomcss'
});

casper.start('tests/widths.html');
casper.viewport(1024,100);

casper.then(function() {
	phantomcss.screenshot('html',500,null,'i-dunno');
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