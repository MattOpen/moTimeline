


//  HELPER
    var breakpointHelper = '<div class="device-xs visible-xs hidden"></div>';
        breakpointHelper += '<div class="device-sm visible-sm hidden"></div>';
        breakpointHelper += '<div class="device-md visible-md hidden"></div>';
        breakpointHelper += '<div class="device-lg visible-lg hidden"></div>';
    $('body').prepend(breakpointHelper);
    var waitForFinalEvent=function(){var b={};return function(c,d,a){a||(a="some string!");b[a]&&clearTimeout(b[a]);b[a]=setTimeout(c,d)}}();
    var fullDateString = new Date();
    function getBreakpoint( alias ) {
        return $('.device-' + alias).is(':visible');
    }


    var moTcolumnCount = (function(){
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
                    gridValues = ['col-xs-12 col-sm-6 col-md-6  col-lg-6 sm'];
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
            }),

    moTpostPosition = (function(elem){
                var o,h,u;

                if (elem == 0 || !elem || elem.length == 0 )return{o:0,h:0,u:0};

                var the_post = $(elem),
                    the_post_OK = the_post.offset().top,
                    //the_post_H = the_post.outerHeight( true ),
                    the_post_H = the_post.outerHeight( ),
                    the_post_UK = the_post_H + the_post_OK;

                return {
                    o : Math.round(the_post_OK),
                    h : Math.round(the_post_H),
                    u : Math.round(the_post_UK)
                }
            }),

    moTleftORright = (function (elem){

        //var lr, moToffset;

        if (elem == 0 || !elem || elem.length == 0 ) return console.log('no element');
            var e, l, r,OG,UG,AA,BB,eid,pRid,pLid,lr, moToffset,
                the_post = $(elem);

                eid = the_post.attr('id');
                pRid = the_post.prevAll('.mo-inverted').attr('id'); // $pRid = $prevRid
                pLid = the_post.prevAll('li').not('.mo-inverted').attr('id');    // $pLid = $prevLid
                //console.log('NEUES ELEMENT:   eID: '+eid+ '   pLid: '+pLid+ '     pRid: '+pRid);

                e = moTpostPosition($('#'+eid));
                l = moTpostPosition($('#'+pLid));
                r = moTpostPosition($('#'+pRid));
                OG = e.o - l.o;
                UG = l.u - e.o;
                AA = l.u - r.u;
                BB = r.u - l.u;
/*
                console.log(the_post);
                console.log(OG+'  '+UG+'   '+AA+'   '+BB)
                console.log('E: '+e.o, e.h, e.u);
                console.log('L: '+l.o, l.h, l.u);
                console.log('R: '+r.o, r.h, r.u);
*/
        //var columns =  moTcolumnCount().col;

        if(moTcolumns > 1){
            if (l.u > e.o ) {
                lr = 1;
                //console.log('Regel 1 RECHTS: if (l.u > e.o && columns > 1)')
            }
            if (l.u == e.o ) {
               // lr = 2;
                //console.log('Regel 2 RECHTS: if (l.u == e.o && columns > 1)')
            }
            if (r.u >= l.u ) {
                lr = 0;
                //console.log('Regel 3 LINKS: if (r.u > l.u && columns > 1)')
            }


            //  adjust badge
            //if (the_post.hasClass('mo-inverted')) {
            if( lr > 0 ){
                //console.log('TTT: '+ lr + ' OG: '+OG);
                if (  OG < 40 && OG >= 0 ) {
                    moToffset = 1;
                    //console.log('Regel 1: if (  OG < 40 && OG > 0 )')
                }
               /* if ( UG < 39 && UG > 0 ) {
                    ////the_post.addClass('offset');
                    moToffset = 'addOffset';
                    console.log('Regel 2:  if ( UG < 39 && UG > 0 )')
                }*/
                if ( AA < 40 && BB < 40 )  {
                    moToffset = 1;
                    //console.log('Regel 3: if ( AA < 40 && BB < 40 )')
                }
            }
        }


        return {
            lr : lr,
            moToffset : moToffset,
            e:e,
            l:l,
            r:r
        }

    }),

    initmoT = function(elem,i) {
            var the_post, moTlor;



            the_post = $(elem[i]);
            moTlor = moTleftORright(the_post);

            if (moTlor.lr > 0){
                the_post.addClass('mo-inverted');
            }else{
                the_post.removeClass('mo-inverted');
            }
            if (moTlor.moToffset > 0){
                the_post.addClass('offset');
            }else{
                the_post.removeClass('offset');
            }

            //  recalculate position in error
            var position = the_post.position(),
                pl = Math.round(position.left);
           // console.log(pl + '    I:'+i+'   ID: '+the_post.attr('id')+'  moTlor: '+moTlor.lr);
            if(( pl < 50 && moTlor.lr > 0) || ( pl > 0 && moTlor.lr == 0)){
                console.log('recalc ID: '+i);
                initmoT(elem,i);
                return false;
            }else{
                the_post.animate({opacity:1}, moTdefaults.calcSpeed,function (){
                    if (i < (moTdefaults.total - 1)) {
                        initmoT(elem,i + 1);
                    } else {
                        $(window).data('ajaxready', true);
                    }

                })
            }


        };



(function ( $ ) {
    jQuery.fn.moTimeline = function (opt) {

        //  do not load more data till all posts arranged
        //$(window).data('ajaxready', false);

        //var mo_posts = $('li',this);
        var  mo_posts = $(this);
        if(!mo_posts) return console.log('sorry, no data...');

        // moToption global definiert, so stehen die Werte immer zur Verfügung
            moToption = $.extend({
                animationSpeed: 100,
                shuffleSpeed: 200,
                gutter: 0,          //  should be same as margin-bottom LI  $('ul.mo-timeline > li')
                badge: 'ver_b',
                startBreakpoint: 'md',
                startID: 0,
                refresh: 'false'
            }, opt);

            moTcolumns =  moTcolumnCount().col;


            moTdefaults = {
                calcSpeed: 100,
                total : mo_posts.length,
                gridValues : 'col-xs-12 col-sm-12 col-md-6',
                QueueInUse : 0
            };


        //  initialize

        //moTcolumnCount();
        $(mo_posts).addClass( moTcolumnCount().gridValues );
        $('.badge', mo_posts).addClass('visible-lg visible-md '+ moToption.badge);

        if( moTcolumnCount().col == 1 ) {
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
            $(mo_posts).addClass( moTcolumnCount().gridValues );
        }
/*
        //only debug info
        $('.libox').hover(function() {
            var offset = $(this).offset();
            //$(this).offset().left;
            console.log( 'Left: ' + offset.left + '\nTop: ' + offset.top );
        });
*/

        //START
/*
        for(var i = idx; i < (moTdefaults.total); i++) {
            var the_post = $(mo_posts[i]),moTlor;
            $(the_post).animate({opacity:1}, moToption.animationSpeed,function (e){
                moTlor = moTleftORright(the_post);
                //console.log('LOR: '+moTlor.lr + '    OFFSET: '+moTlor.addOffset);
                //console.log(moTlor);
                if(moTlor.lr > 0)  the_post.addClass('mo-inverted');
                if(moTlor.moToffset > 0)the_post.addClass('offset');
            }(i));
        }
*/


        //  set id to every li -
        //  to do: check id exist before change id
        mo_posts.attr('id', function (index) {
            return 'moT' + index;
        });



        initmoT(mo_posts,idx);






        //return this;

//  INNERHALB DER FUNKTION
    };
}( jQuery ));