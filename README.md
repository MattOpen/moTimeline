#moTimeline
<p>moTimeline is a responsive two column timeline layout library - MIT licensed.</p>
<p>I like OpenSource, I like sharing. Do what ever you want with this little piece of code. (-:</p>

##Features
* one or two column
* auto arrange post left or right
* bootstrap 3.x compatible

<p>See in action at <a href="http://www.mattopen.com/" target="_blank">mattopen.com</a></p>
<a href="http://www.mattopen.com/" target="_blank"><img style="width:80%" alt="no picture...:o(" src="http://www.mattopen.com/Portals/7/Images/moTimeline-preview.jpg" class="img-responsive"></a>

##html markup
<p>actually supported is only an unordered list.</p>
<pre>
<code>
&#x3C;div class="row"&#x3E;
	&#x3C;div class="container"&#x3E;
		&#x3C;ul class="mySelector"&#x3E;
			&#x3C;li&#x3E;
				&#x3C;div class="panel panel-default"&#x3E;
					&#x3C;div class="panel-heading"&#x3E;
						&#x3C;h3 class="panel-title"&#x3E;a headline&#x3C;/h3&#x3E;
					&#x3C;/div&#x3E;
					&#x3C;div class="panel-body"&#x3E;
						&#x3C;p&#x3E;some text&#x3C;/p&#x3E;
					&#x3C;/div&#x3E;
				&#x3C;/div&#x3E;
			&#x3C;/li&#x3E;
			&#x3C;li id="test"&#x3E;
				&#x3C;div class="panel panel-default"&#x3E;
					&#x3C;div class="panel-heading"&#x3E;
						&#x3C;h3 class="panel-title"&#x3E;next headline&#x3C;/h3&#x3E;
					&#x3C;/div&#x3E;
					&#x3C;div class="panel-body"&#x3E;
						&#x3C;p&#x3E;some text.&#x3C;/p&#x3E;
					&#x3C;/div&#x3E;
				&#x3C;/div&#x3E;
			&#x3C;/li&#x3E;
		&#x3C;/ul&#x3E;
	&#x3C;/div&#x3E;
&#x3C;/div&#x3E;
</code>
</pre>

##Installation
<p>add the bootstrap.css and the moTimeline.css files to the head of your site</p>
<pre>
<code>
 &#x3C;link rel="stylesheet" type="text/css" media="screen" href="css/bootstrap.min.css"&#x3E;
 &#x3C;link rel="stylesheet" type="text/css" media="screen" href="css/moTimeline.css"&#x3E;
</code>
</pre>

<p>add the moTimeline.js file to the bottom of your site or make use of minified version</p>
<pre>
<code>
 &#x3C;script type="text/javascript" src="js/moTimeline.js"></script&#x3E;
</code>
</pre>

<p>
    initialize the script after page load<br />
    important change to the version before, initialize only selector without child element. 
</p>
<pre>
<code>
        //NEW CODE
 &#x3C;script type="text/javascript"&#x3E;
	$(document).ready(function () {
		$('.mySelector').moTimeline();
	});
 &#x3C;/script&#x3E;

    also possible: $('#myID ul').moTimeline();
</code>
</pre>
<pre>
<code>
    //OLD CODE
 &#x3C;script type="text/javascript"&#x3E;
	$(document).ready(function () {
		$('ul.mo-timeline > li').moTimeline();
	});
 &#x3C;/script&#x3E;
</code>
</pre>


##Options:
<p>make use of options:</p>
<pre>
<code>
	$('.mySelector').moTimeline(
			{
			
				startBreakpoint: 'md'	// possible 'xs','sm','md','lg'
				
			}
	);
</code>
</pre>

<p>The "startBreakpoint" option will result in the following Bootstrap-Gridvalues:</p>
```html
	startBreakpoint = 'xs'
		gridValues = 'col-xs-6 col-sm-6 col-md-6  col-lg-6 xs';
	startBreakpoint = 'sm'
		gridValues = 'col-xs-12 col-sm-6 col-md-6  col-lg-6 sm';
	startBreakpoint = 'md'
		gridValues = 'col-xs-12 col-sm-12 col-md-6  col-lg-6 md';
	startBreakpoint = 'lg'
		gridValues = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 lg';
```

<p>The following options are currently disabled:</p>
```html
//animationSpeed: 100,	//disabled
//shuffleSpeed: 200,	//disabled
//gutter: 0,			//disabled
```

take a look at index.html in this repo, how to use css and js.

##updates and version
###v 0.9.50
* removed a lot of garbage code
* now work with every selector, instead of only $('ul.mo-timeline > li'), but you have to provide an unordered list
* removed a bug with window resize function, not refreshing list
* add a new test site to this repo under examples\mattopen

##updates and version
###v 0.9.47
* minor bugfix in position calculation in webkit browser

###v 0.9.46
* minor bugfix in position calculation in webkit browser

###v 0.9.45
* remove modernizer.js and implement a check userAgent function to recalculate article position based on browser detection
* clean code

###v 0.9.42
* add minified version jquery.moTimeline.min.js
* change some css attributes

###v 0.9.41
* recalculate article position based on browser. Now we need to use modernizer.js

###v 0.9.40
* added class "twocol" to ul. Format a vertical ruler between articles.
* edit css for a better look on small and medium size

###v 0.9.39
* found a bug in position calculation

##Dependencies
* Bootstrap 3.x http://getbootstrap.com/
* require jQuery, 1.9 or higher
* modernizer http://modernizr.com/download/

##Example website and demo
* http://www.mattopen.com
* http://www.mattopen.com/Projekte/moTimeline

##special thanks to...
* Livestamp.js A simple, unobtrusive jQuery plugin that provides auto-updating timeago text to your timestamped HTML elements using Moment.js.http://mattbradley.github.com/livestampjs
* LoremPixel.com Placeholder Images for every case. http://lorempixel.com/

#License
This plugin and all code contained is Copyright 2016 <a href="http://www.mattopen.com">mattopen</a>, Germany. You are granted a license to use this code / software as you wish, free of charge and free of restrictions under the MIT license

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Want to hire me?  <a href="http://www.pixelquadrat.com">pixelquadrat.com</a>
