#moTimeline
<p>moTimeline is a responsive two column timeline layout library - MIT licensed.</p>

##Features
* one or two column layout
* re-arrange items with ul-li or with any parent-child system like div in div
* add or remove badge to every item
* grid system bootstrap 3.x compatible
* grid system materializecss compatible
* fully customizable

<p>See in action at <a href="http://www.mattopen.com/" target="_blank">mattopen.com</a></p>
<a href="http://www.mattopen.com/" target="_blank"><img style="width:80%" alt="no picture...:o(" src="http://www.mattopen.com/Portals/7/Images/moTimeline-preview.jpg" class="img-responsive"></a>

##html markup
<p>initialize as unordered list</p>
<pre>
	<code>
		&lt;ul class=&quot;moTimeline&quot;&gt;
			&lt;li&gt;
				
			&lt;/li&gt;
			&lt;li&gt;
				
			&lt;/li&gt;
		&lt;/ul&gt;
	</code>
</pre>

<p> or initialize with div</p>
<pre>
	<code>
		&lt;div class=&quot;moTimeline&quot;&gt;
			&lt;div&gt;
				
			&lt;/div&gt;
			&lt;div&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
	</code>
</pre>

every child element from element with class "moTimeline" will be used as item and therefor re-arranged.

##Installation
<p>add your preferred grid system "bootstrap.css" or "materializecss.css" to your website.</p>
<p>add the moTimeline.css files to the head of your site</p>
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
    initialize the script after page load
</p>
<pre>
	<code>
	 &#x3C;script type="text/javascript"&#x3E;
		$(document).ready(function () {
			$('.moTimeline').moTimeline();
		});
	 &#x3C;/script&#x3E;
	</code>
</pre>


##Options:
<p>make use of options:</p>
<p>for detailed information about the desired grid system, please refer to the vendor pages.</p>
<p><a href="https://materializecss.com/grid.html" target="_blank">materializecss.com</a> </p>
<p><a href="https://getbootstrap.com/docs/3.3/css/#grid" target="_blank">getbootstrap.com</a> </p>
<pre>
<code>
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
</code>
</pre>

<p>if you do not provide any options, the array will initialised with the following settings</p>
<pre>
<code>
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
</code>
</pre>

<p>at least you should provide the grid system with "bootstrap3" or "materializecss", the array will then initialised automatically</p>
<pre>
<code>
	$('.moTimeline').moTimeline({
		framework: 'materializecss'
	});
</code>
</pre>

take a look at the example folder.

##updates and version
###v 0.9.61
* completely rewritten
* minified version only 5 kb
* now support for bootstrap3 and materializecss grid system
* add examples
* initialize now with ul-li or with any parent-child system like div in div

###v 0.9.50
* removed a lot of garbage code
* now work with every selector, instead of only $('ul.mo-timeline > li'), but you have to provide an unordered list
* removed a bug with window resize function, not refreshing list
* add a new test site to this repo under examples\mattopen
* add a minified js file moTimeline.min.js

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


##Example website and demo
* http://www.mattopen.com
* http://www.mattopen.com/Projekte/moTimeline

##special thanks to...
* Livestamp.js A simple, unobtrusive jQuery plugin that provides auto-updating timeago text to your timestamped HTML elements using Moment.js.http://mattbradley.github.com/livestampjs

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
