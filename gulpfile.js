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

var font_sizes = [
	{
		name: 'xs',
		font_size: '9px',
		line_height: '13px'
	},
	{
		name: 'sm',
		font_size: '12px',
		line_height: '18px'
	},
	{
		name: 'md',
		font_size: '18px',
		line_height: '26px'
	},
	{
		name: 'lg',
		font_size: '26px',
		line_height: '32px'
	},
	{
		name: 'xl',
		font_size: '32px',
		line_height: '36px'
	},
	{
		name: 'xxl',
		font_size: '48px',
		line_height: '54px'
	}
];
var base_font_size = '18px';
var base_font_family = 'sans-serif';

gulp.task('stylus', function() {
	gulp.src('./src/styl/ghetto-box.styl')
		.pipe(stylus({errors: true}))
		.on('error', console.log)
		.pipe(gulp_postcss([function(css) {
			// Font Sizes
			font_sizes.forEach(function(font_size) {
				var rule = postcss.rule({selector: '.fs-'+font_size.name});
				rule.append({prop: 'font-size', value: font_size.font_size});
				rule.append({prop: 'line-height', value: font_size.line_height});
				css.append(rule);
			});

			// Defer appending until all the @media rules are created.
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

				var container = postcss.rule({
					selector: '.container'
				});
				container.append({
					prop: 'margin',
					value: 'auto'
				});
				container.append({
					prop: 'max-width',
					value: screen_size.size
				});
				media_query.append(container);

				to_be_appended.push(media_query);
			}

			screen_sizes.forEach(function(screen_size) {
				var tile_reset_rule = postcss.rule({
					selector: '.tiles > .'+screen_size.name+'-tile'
				});
				tile_reset_rule.append({
					prop: 'font-size',
					value: base_font_size
				});
				tile_reset_rule.append({
					prop: 'font-family',
					value: base_font_family
				});

				css.append(tile_reset_rule);
			});

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