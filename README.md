#moTimeline
moTimeline is a responsive two column timeline layout library - MIT licensed.
last build: v 0.9.35

##Features
* one or two column
* auto arrange post left or right
* bootstrap 3.x compatible


##Installation
<p>add the bootstrap.css and the moTimeline.css files to the head of your site</p>
<pre>
<code>
	&#x3;Clink rel="stylesheet" type="text/css" media="screen" href="css/bootstrap.min.css"&#x3E;
    &#x3;Clink rel="stylesheet" type="text/css" media="screen" href="css/moTimeline.css"&#x3E;
</code>
</pre>

<p>add the moTimeline.js file to the bottom of your site</p>
<pre>
<code>
	<script type="text/javascript" src="js/moTimeline.js"></script>
</code>
</pre>

<p>initialize the script after page load</p>
<pre>
<code>
	<script type="text/javascript">

		$(document).ready(function () {
			$('ul.mo-timeline > li').moTimeline();
		});

	</script>
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
