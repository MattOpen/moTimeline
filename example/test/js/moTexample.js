/**
 * Created by MattOpen on 16.08.2014.
 */
//
//  use:
//        moTimeline({
//                animationSpeed : 3000,
//                gutter : 20
//        });

//  HELPER
    var breakpointHelper = '<div class="device-xs visible-xs hidden"></div>';
        breakpointHelper += '<div class="device-sm visible-sm hidden"></div>';
        breakpointHelper += '<div class="device-md visible-md hidden"></div>';
        breakpointHelper += '<div class="device-lg visible-lg hidden"></div>';
    $('body').prepend(breakpointHelper);
    var waitForFinalEvent=function(){var b={};return function(c,d,a){a||(a="I am a banana!");b[a]&&clearTimeout(b[a]);b[a]=setTimeout(c,d)}}();
    var fullDateString = new Date();
    function getBreakpoint( alias ) {
//console.log(alias);
        return $('.device-' + alias).is(':visible');
    }

	
		
function moTimeline(opt) {

    var mo_posts = $('ul.mo-timeline > li'),
        Offset = 0,
        lastleftid = 0,
        lastrightid = 0,
        the_post_UK_left = 0,  //  the_post_UK_left
        the_post_UK_right = 0,
        the_post_OK_left = 0,
        the_post_OK_right = 0,
        total = mo_posts.length,
        width = $('.timeline-wrapper').width(),
        gridValues = 'col-xs-12 col-sm-12 col-md-6';

    var option = {
        animationSpeed : 100,
        shuffleSpeed : 0,
        gutter : 0,          //  should be same as margin-bottom LI  $('ul.mo-timeline > li')
        badge : 'ver_b',
        startBreakpoint : 'md'
        };
    $.extend(true, option, opt);


    if(option.shuffleSpeed > 0) {
        mo_posts.animate({opacity:1},0)
    }else{
        mo_posts.animate({opacity: 0}, 1);
    }



    function fncolumnCount(){
        var col = 0,
            getBreakpointInt = 0,
            startBreakpointInt = 0,
            Breakpoint = '';

        //  get actual size width
        if( getBreakpoint('xs')){
            getBreakpointInt = 1;
            Breakpoint = 'xs';
        }else if( getBreakpoint('sm')){
            getBreakpointInt = 2;
            Breakpoint = 'sm';
        }else if( getBreakpoint('md')){
            getBreakpointInt = 3;
            Breakpoint = 'md';
        }else if( getBreakpoint('lg')){
            getBreakpointInt = 4;
            Breakpoint = 'lg';
        }

        if( option.startBreakpoint == 'xs'){
            startBreakpointInt = 1;
            gridValues = 'col-xs-6 col-sm-6 col-md-6  col-lg-6 xs';
        }else if( option.startBreakpoint == 'sm'){
            startBreakpointInt = 2;
            gridValues = ['col-xs-12 col-sm-6 col-md-6  col-lg-6 sm'];
        }else if( option.startBreakpoint == 'md'){
            startBreakpointInt = 3;
            gridValues = 'col-xs-12 col-sm-12 col-md-6  col-lg-6 md';
        }else if( option.startBreakpoint == 'lg'){
            startBreakpointInt = 4;
            gridValues = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 lg';
        }


        if( getBreakpointInt >= startBreakpointInt  ) {
        //if( getBreakpoint('xs') || getBreakpoint('sm') ) {
            col = 2;
        }else{
            col = 1;
        }

    //console.log('startBreakpointInt: '+startBreakpointInt+' getBreakpointInt: '+getBreakpointInt + ' col: '+col+' option.startBreakpoint: '+option.startBreakpoint)
        var result = {
                col:col,
                gridValues : gridValues,
                Breakpoint : Breakpoint
            };
        return result

    }






        var columnCount = fncolumnCount();
        var columns = columnCount.col;

        //  prepare bootstrap grid
        mo_posts.removeClass().addClass( columnCount.gridValues );
        $('.badge', mo_posts).addClass('visible-lg visible-md '+ option.badge);


    function adjustPost(i) {                //  BEGIN ADJUST POST

        the_post = $(mo_posts[i]);
        the_post.removeClass('mo-inverted').removeClass('offset').css("top" );    //  clear css top at window resize
        the_post_H = the_post.height();
        the_post_OK = the_post.offset().top;
        the_post_UK = the_post_H + the_post_OK;

        //  if there is enough space at the right side, push it right
        //  attention: -10px is important, otherwise the right LI flows left
        if ((the_post_UK_left -10) > the_post_UK_right && columns > 1) {
            the_post.addClass('mo-inverted');
        }else{
            the_post.removeClass('mo-inverted').removeClass('offset').css("top", 0);
        }

        //  collect the data
        if (i == 0) {

            the_post_UK_left = the_post_UK;
            the_post_OK_left = the_post_OK;

        } else if (i == 1) {

            the_post_prev = the_post.prev();
            the_post_prev_H = the_post_prev.height();
            the_post_prev_OK = the_post_prev.offset().top;
            the_post_prev_UK = the_post_prev_H + the_post_prev_OK;
            lastrightid = i;
            the_post_UK_right = the_post_UK + Offset;
            the_post_OK_right = the_post_OK + Offset;
            the_post.addClass('offset');

        } else {

            if (the_post.hasClass('mo-inverted')) {

                the_post_prev = $(mo_posts[lastrightid]);
                the_post_prev_H = the_post_prev.height();
                the_post_prev_OK = the_post_prev.offset().top;
                the_post_prev_UK = the_post_prev_H + the_post_prev_OK;
                Offset = -the_post_UK + the_post_prev_UK + the_post_H + option.gutter;
                lastrightid = i;
                the_post_UK_right = the_post_UK + Offset;
                the_post_OK_right = the_post_OK + Offset;


            } else {

                the_post_prev = $(mo_posts[lastleftid]);
                the_post_prev_H = the_post_prev.height();
                the_post_prev_OK = the_post_prev.offset().top;
                the_post_prev_UK = the_post_prev_H + the_post_prev_OK;
                Offset = -the_post_UK + the_post_prev_UK + the_post_H + option.gutter;
                lastleftid = i;
                the_post_UK_left = the_post_UK + Offset;
                the_post_OK_left = the_post_OK + Offset;
            }
        }


        //  adjust post
        if (the_post.hasClass('mo-inverted')) {

            var OG = the_post_OK_right - the_post_OK_left,
                UG = the_post_UK_left - the_post_OK_right;

            //  adjust badge
            if (  OG < 40 && OG > 0 && columns > 1 ) {

                the_post.addClass('offset');
            }

            if ( UG < 39 && UG > 0 && columns > 1 ) {

                the_post.addClass('offset');
            }

        }

        if(columns == 1) {
            Offset = 0;
            $('.mo-timeline').removeClass('twocol');
        }else{
            $('.mo-timeline').addClass('twocol');
        }


        the_post.animate({top: Offset}, option.shuffleSpeed,
            function(){the_post.animate({opacity:1}, option.animationSpeed,
                function () {
                    if (i < (total - 1)) {
                        adjustPost(i + 1);
                    } else {
					//nothing
                    }
                }
            )}
        );
    }                //  END ADJUSTPOST


    //  FIRE SCRIPT AND START POSITIONING
    adjustPost(0);


    $(window).on('resize', function() {
        waitForFinalEvent(function(){

            moTimeline(option);

        }, 500, fullDateString.getTime())
    });

}
