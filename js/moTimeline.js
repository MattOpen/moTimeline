/*
 * moTimeline v 0.9.38
 * One or two column timeline layout library
 * http://www.mattopen.com
 * MIT License
 * by MattOpen
 */


//  HELPER credits goes to http://stackoverflow.com/questions/18575582/how-to-detect-responsive-breakpoints-of-twitter-bootstrap-3-using-javascript
    var breakpointHelper  = '<div class="device-xs visible-xs hidden"></div>';
        breakpointHelper += '<div class="device-sm visible-sm hidden"></div>';
        breakpointHelper += '<div class="device-md visible-md hidden"></div>';
        breakpointHelper += '<div class="device-lg visible-lg hidden"></div>';

    $('body').prepend(breakpointHelper);

if(typeof waitForFinalEvent !== 'undefined' && $.isFunction( waitForFinalEvent )) {
    //nothing to do
}else{
    var waitForFinalEvent=function(){var b={};return function(c,d,a){a||(a="some string!");b[a]&&clearTimeout(b[a]);b[a]=setTimeout(c,d)}}();
    var fullDateString = new Date();
}


    function getBreakpoint( alias ) {
        return $('.device-' + alias).is(':visible');
    }
//  HELPER end

        //  private functions
    var moT_GetColumnCount = (function(){
            var col = 0,
                gridValues,
                Breakpoint,
                getBreakpointInt = 0,
                startBreakpointInt = 0;

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

            if( moToption.startBreakpoint == 'xs'){
                startBreakpointInt = 1;
                gridValues = 'col-xs-6 col-sm-6 col-md-6  col-lg-6 xs';
            }else if( moToption.startBreakpoint == 'sm'){
                startBreakpointInt = 2;
                gridValues = 'col-xs-12 col-sm-6 col-md-6  col-lg-6 sm';
            }else if( moToption.startBreakpoint == 'md'){
                startBreakpointInt = 3;
                gridValues = 'col-xs-12 col-sm-12 col-md-6  col-lg-6 md';
            }else if( moToption.startBreakpoint == 'lg'){
                startBreakpointInt = 4;
                gridValues = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 lg';
            }

            if( getBreakpointInt >= startBreakpointInt  ) {
                col = 2;
            }else{
                col = 1;
            }

            return {
                col:col,
                gridValues : gridValues,
                Breakpoint : Breakpoint
            }
        });

    var moT_GetPostPosition = (function(elem){
        var o,h, u, the_post, the_post_OK, the_post_H, the_post_UK;

        if (elem == 0 || !elem || elem.length == 0 )return{o:0,h:0,u:0};

        the_post = $(elem);
        the_post_OK = the_post.offset().top;
        //the_post_H = the_post.outerHeight();
        the_post_H = the_post.height();
        the_post_UK = the_post_H + the_post_OK;


        return {
            o : Math.round(the_post_OK),
            h : Math.round(the_post_H),
            u : Math.round(the_post_UK)
        }
    });

    var moT_GetLeftOrRight = (function (elem){

            if (elem == 0 || !elem || elem.length == 0 ) {
                return console.log('no element');
            }else{
                var e, l, r,OG,UG,AA,BB,eid,pRid,pLid,lr, bo,
                    the_post = $(elem);

                eid = the_post.attr('id');
                pRid = the_post.prevAll('.mo-inverted').attr('id'); // $pRid = $prevRid
                pLid = the_post.prevAll('li').not('.mo-inverted').attr('id');    // $pLid = $prevLid

                e = moT_GetPostPosition($('#'+eid));
                l = moT_GetPostPosition($('#'+pLid));
                r = moT_GetPostPosition($('#'+pRid));
                OG = e.o - l.o;
                UG = l.u - e.o;
                AA = l.u - r.u;
                BB = r.u - l.u;

                if(moTcolumns.col > 1){

                    if (l.u >= e.o ) {
                        lr = 1;
                    }
                    if (r.u >= l.u ) {
                        lr = 0;
                    }
                    if (l.u = r.u ) {
                      //  lr = 1;
                    }

                    //  adjust badge
                    if( lr > 0 ){
                        if (  OG < 40 && OG >= 0 ) {
                            bo = 1;
                        }
                        if ( AA < 40 && BB < 40 )  {
                            bo = 1;
                        }
                    }
                }


                return {
                    lr : lr,
                    badge_offset : bo,
                    e:e,
                    l:l,
                    r:r
                }
            }
        });

    var moT_setPostPosition = (function(elem) {

       // if(elem == 'undefined') return;
            var pPos = moT_GetLeftOrRight(elem);

            if (pPos.lr > 0) {
                elem.addClass('mo-inverted');
            } else {
                elem.removeClass('mo-inverted');
            }
            if (pPos.badge_offset > 0) {
                elem.addClass('offset');
            } else {
                elem.removeClass('offset');
            }

        });

    moT_init = (function(initarr,idx) {

            var elem;

            elem = $(initarr[idx]);
            moT_setPostPosition(elem);

            if (idx < (moTdefaults.total - 1)) {
                moT_init(initarr,idx + 1);
            } else {
                if(window.location.href.indexOf("www.mattopen.com") > -1 && typeof injectPlacements2 !== 'undefined' && $.isFunction( injectPlacements2 )) {
                    injectPlacements2(initarr); //placements only on mattopen.com. YOU CAN SAFELY DELETE THIS LINE
                }
                if(typeof moT_initEmbed !== 'undefined' && $.isFunction( moT_initEmbed )) {
                    moT_initEmbed(initarr); //embed only on mattopen.com. YOU CAN SAFELY DELETE THIS LINE
                }
                moT_RefreshPostsAll();
                $(window).data('ajaxready', true);	//	need only on mattopen.com. YOU CAN SAFELY DELETE THIS LINE
            }

        });

    moT_RefreshPostsAll = (function() {

            moTcolumns =  moT_GetColumnCount();
            arr = $('ul.mo-timeline');

            $('li',arr).each(function(idx){
                moT_setPostPosition($(this));
            });

            $('li',arr).css({"opacity":"1"});

        });


(function ( $ ) {
    jQuery.fn.moTimeline = function (option) {

        //  do not load more data until all posts arranged
        //$(window).data('ajaxready', false);
        //if ($(window).data('ajaxready') == false) return;

        //mo_posts = $('li',this);

        //var checkSelector = $(this).first().attr('id');
        //var checkSelector = $('ul.mo-timeline > li').length;
        mo_posts = this;
        var checkSelector = mo_posts.length;


        //if (!mo_posts || typeof checkSelector === "undefined") {
        if (!mo_posts || checkSelector == 0) {
            //console.log('sorry, no data...');
            return;
        }else{
            motrcount = 1;

            moToption = $.extend({
                animationSpeed: 100,
                shuffleSpeed: 200,
                gutter: 0,          //  should be same as margin-bottom LI  $('ul.mo-timeline > li')
                badge: 'ver_b',
                startBreakpoint: 'md',
                startID: 0
            },option);

            moTdefaults = {
                calcSpeed: 100,
                total : mo_posts.length,
                gridValues : 'col-xs-12 col-sm-12 col-md-6  col-lg-6'
            };



            //  initialize
            moTcolumns =  moT_GetColumnCount();
            $(mo_posts).addClass( moTcolumns.gridValues );
            $('.badge', mo_posts).addClass('visible-lg visible-md '+ moToption.badge);

            if( moTcolumns.col == 1 ) {
                $('.mo-timeline').removeClass('twocol');
            }else{
                if ($('.timeline-wrapper').find('.twocol').length > 0){
                    //    nothing
                } else{
                    $('.mo-timeline').addClass('twocol');
                }
            }

            var idx = 0;
            if (moToption.startID > 0){
                $(mo_posts).addClass( moTcolumns.gridValues );
            }


            //  set id to every li -
            //  check id exist before change id
            mo_posts.attr('id', function (index) {

                var theid = this.id;
                if(theid.length  > 0) {
                    return theid;
                }else{
                    return 'moT' + index;
                }

            });



            moT_init(mo_posts,idx);


            if (typeof imagesLoaded !== 'undefined' && $.isFunction( imagesLoaded )) {

                $('.mo-timeline').imagesLoaded( function() {

                    moT_RefreshPostsAll();

                });
            }


            $(window).on('resize', function() {
                waitForFinalEvent(function(){
                    moT_RefreshPostsAll();
                }, 500, fullDateString.getTime())
            });
        }



    };
}( jQuery ));