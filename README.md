# moTimeline
moTimeline is a responsive two column timeline layout library, written in JavaScript and jQuery - MIT licensed.
It depends on materializecss and bootstraps grid systems.

#bootstrap #materializecss #jQuery #JavaScript

## Features
* one or two column layout
* re-arrange items with ul-li or with any parent-child system like div in div
* add or remove badge to every item
* grid system bootstrap 3.x compatible
* grid system materializecss compatible
* fully customizable
* override the grid system parameter by passing in your own parameter
* append new items to the list and initialize them

See in action at 
[www.mattopen.com](http://www.mattopen.com/)
<a href="http://www.mattopen.com/" target="_blank"><img style="width:80%" alt="no picture...:o(" src="https://github.com/MattOpen/moTimeline/blob/master/images/preview1.PNG" class="img-responsive"></a>
<a href="http://www.mattopen.com/" target="_blank"><img style="width:80%" alt="no picture...:o(" src="http://www.mattopen.com/Portals/7/Images/moTimeline-preview.jpg" class="img-responsive"></a>

## html markup
every child element from element with class "moTimeline" will be used as item and then re-arranged.
initialize as unordered list
```sh
<ul class="moTimeline">
	<li>
		
	</li>
	<li>
		
	</li>
</ul>
```

or initialize with div
```sh
<div class="moTimeline">
	<div>
		
	</div>
	<div>
		
	</div>
</div>
```

## Installation
add your preferred grid system "bootstrap.css" or "materializecss.css" to your website.
add the moTimeline.css files to the head of your site
```sh
<link rel="stylesheet" type="text/css" media="screen" href="css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="css/moTimeline.css">
```

add the moTimeline.js file to the bottom of your site or make use of minified version
```sh
<script type="text/javascript" src="js/moTimeline.js"></script>
```
initialize the script after page load
```sh
<script type="text/javascript"
	$(document).ready(function () {
		$('.moTimeline').moTimeline();
	});
</script>
```

## Options:
make use of options:
for detailed information about the desired grid system, please refer to the vendor pages.
[materializecss.com](https://materializecss.com/grid.html)
[getbootstrap.com](https://getbootstrap.com/docs/3.3/css/#grid)

```sh
$('.moTimeline').moTimeline({
	framework: 'bootstrap3',		// your preferred grid system
	columnCount: {					// override col count
		xs: 1,
		sm: 1,
		md: 2,
		lg: 2
	},
	badge: 'visible-md visible-lg'	// hide and show badge 
});
```

if you do not provide any options, the array will initialised with the following settings
```sh
$('.moTimeline').moTimeline({
	framework: 'materializecss',
	columnCount: {
		xs: 1,
		sm: 2,
		md: 2,
		lg: 2
	},
	badge: 'hide-on-med-and-down'
});
```

at least you should provide the grid system with "bootstrap3" or "materializecss", the array will then initialised automatically
```sh
$('.moTimeline').moTimeline({
	framework: 'materializecss'
});
```

add new items to the list
after you had appended new items, the items has to be initialized first.
```sh
moTimeline.initNewItems();
```

take a look at the example folder.

## updates and version
### v 0.9.63
* add new function "initNewItems"
* Now you can append new items to your list and then you can init them by executing moTimeLine.initNewItems(). Automatically all instances will be initialized.

### v 0.9.61
* completely rewritten
* minified version only 5 kb
* now support for bootstrap3 and materializecss grid system
* add examples
* initialize now with ul-li or with any parent-child system like div in div

### v 0.9.50
* removed a lot of garbage code
* now work with every selector, instead of only $('ul.mo-timeline > li'), but you have to provide an unordered list
* removed a bug with window resize function, not refreshing list
* add a new test site to this repo under examples\mattopen
* add a minified js file moTimeline.min.js

### v 0.9.47
* minor bugfix in position calculation in webkit browser

### v 0.9.46
* minor bugfix in position calculation in webkit browser

### v 0.9.45
* remove modernizer.js and implement a check userAgent function to recalculate article position based on browser detection
* clean code

### v 0.9.42
* add minified version jquery.moTimeline.min.js
* change some css attributes

### v 0.9.41
* recalculate article position based on browser. Now we need to use modernizer.js

### v 0.9.40
* added class "twocol" to ul. Format a vertical ruler between articles.
* edit css for a better look on small and medium size

### v 0.9.39
* found a bug in position calculation


## Example website and demo
* http://www.mattopen.com
* http://www.mattopen.com/Projekte/moTimeline

## special thanks to...
* Livestamp.js A simple, unobtrusive jQuery plugin that provides auto-updating timeago text to your timestamped HTML elements using Moment.js.http://mattbradley.github.com/livestampjs

### Todos

 - add more grid systems

License
----

MIT
This plugin and all code contained is Copyright 2016 <a href="http://www.mattopen.com">mattopen</a>, Germany. You are granted a license to use this code / software as you wish, free of charge and free of restrictions under the MIT license

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Want to hire me?  <a href="http://www.pixelquadrat.com">pixelquadrat.com</a>
