/*!
 * moTimeline v 0.9.60
 * last update 09.01.2019
 * responsive two column timeline layout library
 * http://www.mattopen.com
 * MIT License
 * by MattOpen
 */

(function ($) {
    window.moTimeline || (window.moTimeline = {});
    var _moTimeline = function (options) {
        var
            _defaults = {
                framework: {
                    bootstrap3: {
                        gridValues: 'col-xs-12 col-sm-6 col-md-6  col-lg-6',
                        columnCount: {
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        },
                        badge: 'visible-md visible-lg'
                    },
                    materializecss: {
                        gridValues: 'col s12 m6 l6 xl6',
                        columnCount: {
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        },
                        badge: 'hide-on-med-and-down' //hide-on-med-and-down      hide-on-small-only
                    }
                },
                init: {
                    framework: 'materializecss',
                    columnCount: null,
                    gridValues: null,
                    breakpoint: null,
                    windowWidth: $(window).width(),
                }
            },
            _settings = $.extend(true, {}, _defaults, options),
            helper = {
                getBreakpoint: function () {
                    var ww = $(window).outerWidth();
                    if (_settings.init.framework === 'bootstrap3') {
                        //bootstrap3
                        if (ww < 768) {
                            return 'xs';
                        }
                        else if (ww >= 768 && ww <= 992) {
                            return 'sm';
                        }
                        else if (ww > 992 && ww <= 1200) {
                            return 'md';
                        }
                        else {
                            return 'lg';
                        }
                    } else {
                        if (ww <= 600) {
                            return 'xs';
                        }
                        else if (ww >= 601 && ww <= 992) {
                            return 'sm';
                        }
                        else if (ww > 992 && ww <= 1200) {
                            return 'md';
                        }
                        else {
                            return 'lg';
                        }
                    }
                },
                setDivider: function (itemArr) {
                    var $itemArr = $(itemArr),
                        col = helper.getState().columnCount;

                    if (col === 1) {
                        $itemArr.removeClass('twocol');
                    } else {
                        $itemArr.addClass('twocol');
                    }
                    return col;
                },
                getPosition: (function (elem) {
                    var o = 0, h = 0, gppu = 0;

                    if (elem == 0 || !elem || elem.length == 0) { o = o, h = h, gppu = gppu }
                    else {
                        elem = elem[0];
                        o = elem.offsetTop;
                        h = elem.offsetHeight;
                        gppu = (h + o);
                    }
                    return { o, h, gppu }

                }),
                uuidv4: function () {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                },
                setIdToEveryNode: function (arr) {
                    $(arr).attr('id', function (index) {
                        var id = this.id;
                        return val = (id.length > 0) ? id : 'moT' + helper.uuidv4() + '_' + index;
                    });
                },
                setPostPosition: function (elem) {
                    var pPos = helper.getLeftOrRight(elem),
                        $elem = $(elem);

                    if (pPos.lr > 0) {
                        $elem.addClass('mo-inverted');
                    } else {
                        $elem.removeClass('mo-inverted');
                    }
                    if (pPos.badge_offset > 0) {
                        $elem.addClass('offset');
                    } else {
                        $elem.removeClass('offset');
                    }
                },
                getLeftOrRight: function (elem) {

                    if (elem === 0 || !elem || elem.length === 0) return console.log('no element');

                    var e, l, r, OG, UG, AA, BB, prevRE, prevLE, pos, bo,
                        $elem = $(elem), moT_c = 0;

                    prevRE = $elem.prevAll('.mo-inverted').first();
                    prevLE = $elem.prevAll('li').not('.mo-inverted').first();

                    l = helper.getPosition(prevLE);
                    r = helper.getPosition(prevRE);
                    e = helper.getPosition($elem);
                    OG = e.o - l.o;
                    UG = l.gppu - e.o;
                    AA = l.gppu - r.gppu;
                    BB = r.gppu - l.gppu;
                    var col = helper.getState().columnCount;

                    if (col > 1) {

                        if (l.gppu > e.o + moT_c) {
                            pos = 1;
                        }
                        if (r.gppu > l.gppu) {
                            pos = 0;
                        }
                        if (l.gppu = r.gppu) {
                            //pos = 1;
                        }

                        //  adjust badge
                        if (pos > 0) {
                            if (OG < 40 && OG >= 0) {
                                bo = 1;
                            }
                            if (AA < 40 && BB < 40) {
                                bo = 1;
                            }
                        }
                    }

                    return {
                        lr: pos,
                        badge_offset: bo,
                        e: e,
                        l: l,
                        r: r,
                    }
                },
                debounce: function (func) {
                    var timer;
                    return function (event) {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(func, 300, event);
                    };
                },
                resizeListener: function () {
                    window.addEventListener("resize", helper.debounce(function (e) {
                        if ($(window).width() != _settings.init.windowWidth) {
                            _settings.init.windowWidth = $(window).width();
                            window.moTimeline.refresh()
                        }
                    }));
                },
                initImagesLoaded: function (elem) {
                    var instance = elem;
                    var itemArr = instance[0].children;
                    if (typeof imagesLoaded !== 'undefined' && $.isFunction(imagesLoaded)) {
                        $(itemArr).imagesLoaded()
                            .done(function () {
                                console.log('all images successfully loaded');
                                refreshTree(instance);
                            })
                    }
                    else {
                        setTimeout(function () {
                            refreshTree(instance);
                        }, 1000);
                    }
                },
                getState: function () {
                    var framework = _settings.init.framework,
                        breakpoint = helper.getBreakpoint(),
                        columnCount = _settings.framework[framework].columnCount[breakpoint],
                        gridValues = _settings.framework[framework].gridValues,
                        badge = _settings.framework[framework].badge;

                    return {
                        columnCount: columnCount,
                        gridValue: gridValues,
                        breakpoint: breakpoint,
                        badge: badge
                    }
                },
                createBadge: function (elem, idx) {
                    var badge = helper.getState().badge;
                    var html = '<span class="js-badge-mo badge-mo '+badge+'">'+idx+'</span>';
                    $(elem).prepend(html);
                    return html;
                },
                createBadgeArrow: function (elem, idx) {
                    var badge = helper.getState().badge;
                    var html = '<span class="js-badge-arrow badge-arrow '+badge+'">&nbsp;</span>';
                    $(elem).prepend(html);
                    return html;
                }
            },
            refreshTree = (function (itemArr) {
                var arr;
                if (itemArr) {
                    arr = itemArr;
                } else {
                    arr = this.instances;
                }
                $.each(arr, function (index, value) {
                    var mo_posts = value.children;

                    helper.setDivider(value);

                    $.each(mo_posts, function (index, value) {
                        helper.setPostPosition(value);
                    })
                })
            }),
            init = function (elem) {
                $.each(elem, function (index, value) {

                    if (typeof window.moTimeline.instances === 'undefined') {
                        window.moTimeline.instances = new Array;
                    }

                    var instance = $(value),
                        itemArr = instance[0];

                    //  if elem already initialised - only refresh the list
                    if ($(itemArr).data().moTimelineData) {
                        console.log('instance already there');
                        refreshTree(instance);
                        return;
                    } else {
                        moTimeline.instances.push.apply(moTimeline.instances, instance);
                    }

                    $(instance).data('moTimeline' + 'Data', _settings.init);

                    var mo_posts = itemArr.children;

                    if (itemArr.className !== 'mo-timeline') {
                        itemArr.classList.add("mo-timeline");
                    }

                    if (!mo_posts || mo_posts.length === 0) {
                        console.log('sorry, no data...');
                        return;
                    }

                    //  initialize
                    helper.setIdToEveryNode(mo_posts);
                    helper.resizeListener();
                    helper.initImagesLoaded(instance);


                    $.each(instance, function (index, value) {
                        var mo_posts = value.children,
                            $mo_posts = $(mo_posts);
                        $mo_posts.removeClass().addClass(helper.getState().gridValue);
                        helper.setDivider(value);
                        $.each($mo_posts, function (index, value) {
                            var index = index+1;
                            helper.createBadge(value, index);
                            helper.createBadgeArrow(value, index);
                        });
                    });

                    refreshTree(instance);
                })
            };

        return {
            //  publish functions
            init: init,
            refresh: refreshTree
        }
    };


    $.fn.moTimeline = function (options) {
        var _self = this;
        if ($.type(options) !== 'object'){
            var options = {};
        }

        // expose the library
        $.extend(true, window.moTimeline, _moTimeline());

        //  init the library
        _moTimeline(options).init(_self);

    };
}(jQuery));