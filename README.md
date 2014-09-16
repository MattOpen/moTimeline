#moTimeline
moTimeline is a responsive two column timeline layout library - MIT licensed.
last build: v 0.9.35

##Features
* one or two column
* auto arrange post left or right
* bootstrap 3.x compatible

##your html markup
<pre>
<code>
 <!--<div class="row">
	<div class="timeline-wrapper container">
		<ul class="mo-timeline">
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">a headline</h3>
					</div>
					<div class="panel-body">
						<p>some text</p>
					</div>
				</div>
			</li>
			<li id="test">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">next headline</h3>
					</div>
					<div class="panel-body">
						<p>some text.</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>-->

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

<p>add the moTimeline.js file to the bottom of your site</p>
<pre>
<code>
 &#x3C;script type="text/javascript" src="js/moTimeline.js"></script&#x3E;
</code>
</pre>

<p>initialize the script after page load</p>
<pre>
<code>
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
	$('ul.mo-timeline > li').moTimeline(
			{
				animationSpeed: 100,
				shuffleSpeed : 0
			}
	);
</code>
</pre>


take a look at index.html in this repo, how to use css and js.

##Dependencies
* Bootstrap 3.x http://getbootstrap.com/
* require jQuery, 1.9 or higher

##Example website and demo
* http://www.mattopen.com
* http://www.mattopen.com/Projekte/moTimeline

#License
This plugin and all code contained is Copyright 2014 <a href="http://www.exponde.com" >exponde</a>, Germany. You are granted a license to use this code / software as you wish, free of charge and free of restrictions under the MIT license

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This project is updated and maintained by:
MattOpen http://www.mattopen.com
