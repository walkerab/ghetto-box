var gulp = require('gulp');
var stylus = require('gulp-stylus');
var gulp_postcss = require('gulp-postcss');
var postcss = require('gulp-postcss/node_modules/postcss');

var screen_sizes = {
	sm: '768px',
	md: '992px',
	lg: '1200px'
};

gulp.task('stylus', function() {
	gulp.src('./src/styl/ghetto-box.styl')
		.pipe(stylus({errors: true}))
		.on('error', console.log)
		.pipe(gulp_postcss([function(css) {
			for (var screen_size_name in screen_sizes) {
				screen_size = screen_sizes[screen_size_name];
				var media_query = postcss.atRule({
					name: 'media',
					params: 'all and (min-width: '+screen_size+')'
				});
				css.eachRule(function(rule) {
					var new_rule = rule.clone();
					var selectors = new_rule.selector.split(',').map(function(str){return str.trim();});
					var new_selectors = [];
					selectors.forEach(function(selector) {
						var new_selector = selector;
						if (selector[0] === '.') {
							new_selector = '.'+screen_size_name+'-'+selector.substr(1);
						}
						new_selectors.push(new_selector);
					});

					new_rule.selector = new_selectors.join(', ');
					media_query.append(new_rule);
				});
				css.append(media_query);
			}
		}]))
		.on('error', console.log)
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default',['stylus'],function(){
	gulp.watch('./src/styl/*', function(){
		gulp.run('stylus');
	});
});