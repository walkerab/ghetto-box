var gulp = require('gulp');
var stylus = require('gulp-stylus');
var gulp_postcss = require('gulp-postcss');
var postcss = require('gulp-postcss/node_modules/postcss');

var screen_sizes = [
	{
		name: 'sm',
		size: '768px'
	},
	{
		name: 'md',
		size: '992px'
	},
	{
		name: 'lg',
		size: '1200px'
	}
];

gulp.task('stylus', function() {
	gulp.src('./src/styl/ghetto-box.styl')
		.pipe(stylus({errors: true}))
		.on('error', console.log)
		.pipe(gulp_postcss([function(css) {
			// Defer appending until all the rules are created.
			// This is to prevent things like `.md-sm-pad-md`
			var to_be_appended = [];
			for (var i = 0; i < screen_sizes.length; i++) {
				screen_size = screen_sizes[i];
				var media_query = postcss.atRule({
					name: 'media',
					params: 'all and (min-width: '+screen_size.size+')'
				});
				css.eachRule(function(rule) {
					var new_rule = rule.clone();
					var selectors = new_rule.selector.split(',').map(function(str){return str.trim();});
					var new_selectors = [];
					selectors.forEach(function(selector) {
						var new_selector = selector;
						if (selector[0] === '.') {
							new_selector = '.'+screen_size.name+'-'+selector.substr(1);
						}
						new_selectors.push(new_selector);
					});

					new_rule.selector = new_selectors.join(', ');
					media_query.append(new_rule);
				});

				if (i > 0) {
					var container = postcss.rule({
						selector: '.container'
					});
					container.append({
						prop: 'margin',
						value: 'auto'
					});
					container.append({
						prop: 'max-width',
						value: screen_sizes[i-1].size
					});
					media_query.append(container);
				}

				to_be_appended.push(media_query);
			}
			to_be_appended.forEach(function(append_me) {
				css.append(append_me);
			});
		}]))
		.on('error', console.log)
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default',['stylus'],function(){
	gulp.watch('./src/styl/*', function(){
		gulp.run('stylus');
	});
});