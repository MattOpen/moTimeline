/*!
 * moTimeline v 0.9.64
 * last update 13.05.2019
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
                        gridValues: 'col-xs-' + 12 / 1 + ' col-sm-' + 12 / 2 + ' col-md-6  col-lg-6',
                        columnCount: {
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        },
                        badgeClass: 'visible-md visible-lg'
                    },
                    bootstrap4: {
                        gridValues: 'col-xs-12 col-md-6',
                        columnCount: {
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        },
                        badgeClass: 'visible-md visible-lg'
                    },
                    materializecss: {
                        gridValues: 'col s12 m6 l6 xl6',
                        columnCount: {
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        },
                        badgeClass: 'hide-on-med-and-down' //hide-on-med-and-down      hide-on-small-only
                    }
                }
            },
            _init = {
                framework: 'materializecss',
                columnCount: null,
                col: null,
                gridValues: null,
                windowWidth: $(window).width(),
                badgeClass: null,
                badgeShow: false,
                arrowShow: false
            },
            _settings = $.extend(true, {}, _init, options),
            helper = {
                getColumnCount: function (d) {
                    return 12 / d;
                },
                initInstanceValues: function () {
                    var framework = _settings.framework,
                        defaults = _defaults.framework[framework];

                    _settings.columnCount = _settings.columnCount === null ? defaults.columnCount : _settings.columnCount;
                    _settings.badgeClass = _settings.badgeClass === null ? defaults.badgeClass : _settings.badgeClass;
                    _settings.col = _settings.columnCount[helper.getBreakpoint()];
                    _settings.lastItemIdx = 0;
                    _settings.gridValues = defaults.gridValues;

                    if (framework === 'bootstrap3' && _settings.gridValues === null) {
                        _settings.gridValues = 'col-xs-' + helper.getColumnCount(_settings.columnCount.xs) + ' col-sm-' + helper.getColumnCount(_settings.columnCount.sm) + ' col-md-' + helper.getColumnCount(_settings.columnCount.md) + '  col-lg-' + helper.getColumnCount(_settings.columnCount.lg);
                    }
                    else if (framework === 'materializecss' && _settings.gridValues === null) {
                        _settings.gridValues = 'col s' + helper.getColumnCount(_settings.columnCount.xs) + ' m' + helper.getColumnCount(_settings.columnCount.sm) + ' l' + helper.getColumnCount(_settings.columnCount.md) + '  xl' + helper.getColumnCount(_settings.columnCount.lg);
                    }

                },
                getBreakpoint: function () {
                    var ww = $(window).outerWidth();
                    if (_settings.framework === 'bootstrap3' || _settings.framework === 'bootstrap4') {
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
                    }
                    else if (_settings.framework === 'materializecss') {
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
                        col = helper.getInstanceData(itemArr).col;

                    if (col === 1) {
                        $itemArr.removeClass('twocol');
                    } else {
                        $itemArr.addClass('twocol');
                    }
                    return col;
                },
                getPosition: (function (elem) {
                    var o = 0, h = 0, gppu = 0;

                    if (elem === 0 || !elem || elem.length === 0) {
                        //  nothing to do here
                    }
                    else {
                        elem = elem[0];
                        o = elem.offsetTop;
                        h = elem.offsetHeight;
                        gppu = (h + o);
                    }
                    return { o: o, h: h, gppu: gppu }

                }),
                uuidv4: function () {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                },
                setIdToEveryNode: function (arr, lastidx) {
                    $(arr).attr('id', function (index) {
                        var id = this.id;
                        return val = id.length > 0 ? id : 'moT' + helper.uuidv4() + '_' + (index + lastidx);
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
                getParentInstance: function (elem) {
                    var parent = $(elem).closest('.mo-timeline');
                    //console.log('parent instance');
                    //console.log(parent);
                    return parent;
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
                    var col = helper.getInstanceData(helper.getParentInstance(elem)).col;

                    if (col > 1) {

                        if (l.gppu > e.o + moT_c) {
                            pos = 1;
                        }
                        if (r.gppu > l.gppu) {
                            pos = 0;
                        }
                        //if (l.gppu === r.gppu) {
                        //    //pos = 1;
                        //}

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
                        r: r
                    }
                },
                debounce: function (func) {
                    var timer;
                    return function (event) {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(func, 100, event);
                    };
                },
                resizeListener: function () {
                    window.addEventListener("resize", helper.debounce(function (e) {
                        if ($(window).width() !== _settings.windowWidth) {
                            _settings.windowWidth = $(window).width();
                            moTimeline.refresh();
                        }
                    }));
                },
                initImagesLoaded: function (elem) {
                    var instance = elem;
                    var items = instance.children();
                    if (typeof imagesLoaded !== 'undefined' && $.isFunction(imagesLoaded)) {
                        $(items).imagesLoaded()
                            .done(function () {
                                console.log('all images successfully loaded');
                                refreshTree(instance);
                            });
                    }
                    else {
                        setTimeout(function () {
                            refreshTree(instance);
                        }, 1000);
                    }
                },
                getInstanceData: function (elem) {
                    return $(elem).data().moTimelineData;
                },
                createBadge: function (elem, idx) {
                    var badgeClass = helper.getInstanceData(helper.getParentInstance(elem)).badgeClass;
                    var html = '<span class="js-badge-mo badge-mo ' + badgeClass + '">' + idx + '</span>';
                    $(elem).prepend(html);
                    //return html;
                },
                createBadgeArrow: function (elem) {
                    var badgeClass = helper.getInstanceData(helper.getParentInstance(elem)).badgeClass;
                    var html = '<span class="js-badge-arrow badge-arrow ' + badgeClass + '">&nbsp;</span>';
                    $(elem).prepend(html);
                    return html;
                }
            },
            refreshTree = function (itemArr) {
                var instances = $(moTimeline.instances);
                $.each(instances, function (index, value) {
                    var elems = value.children;
                    $(value).data().moTimelineData.col = $(value).data().moTimelineData.columnCount[helper.getBreakpoint()];
                    helper.setDivider(value);

                    $.each(elems, function (index, value) {
                        helper.setPostPosition(value);
                    });
                });
            },
            init = function (elem) {
                var instances = elem;
                $.each(instances, function (index, value) {

                    if (typeof window.moTimeline.instances === 'undefined') {
                        window.moTimeline.instances = new Array;
                    }

                    var instance = $(value),
                        itemArr = instance[0]
                        ;

                    //  if instance already initialised - only refresh the list
                    if ($(itemArr).data().moTimelineData) {
                        console.log('instance already there');
                        refreshTree();
                        return;
                    } else {
                        helper.initInstanceValues();
                        moTimeline.instances.push.apply(moTimeline.instances, instance);
                    }

                    $(instance).data('moTimeline' + 'Data', _settings);
                    var elems = itemArr.children;

                    if (itemArr.className !== 'mo-timeline') {
                        itemArr.classList.add("mo-timeline");
                    }

                    if (!elems || elems.length === 0) {
                        console.log('sorry, no data...');
                        return;
                    }

                    //  initialize
                    initItems(instance);
                });
            },
            initItems = function (instance) {
                var
                    $instance = $(instance),
                    lastItemIdx = $instance.data().moTimelineData.lastItemIdx,
                    retValIdx = 0,
                    elems = $.grep($instance.children(), function (n, i) {
                        return (i >= lastItemIdx);
                    });

                if (elems.length === 0) return;

                helper.setIdToEveryNode(elems, lastItemIdx);
                helper.resizeListener();
                helper.initImagesLoaded($instance);

                $(elems).removeClass().addClass(helper.getInstanceData(instance).gridValues + ' moitem');
                helper.setDivider(instance);

                $.each(elems, function (index, value) {
                    var instance = $instance.data().moTimelineData
                    index = index + 1;
                    if (instance.badgeShow) {
                        helper.createBadge(value, (index + lastItemIdx));
                    }
                    if (instance.arrowShow) {
                        helper.createBadgeArrow(value);
                    }
                    retValIdx = index;
                });

                $(instance).data().moTimelineData['lastItemIdx'] = retValIdx + lastItemIdx;

                refreshTree(instance);
            },
            initNewItems = function (itemArr) {
                var instances = $(moTimeline.instances);
                $.each(instances, function (index, value) {
                    //  initialize items
                    initItems(value);
                });
            };

        return {
            //  publish functions
            init: init,
            refresh: refreshTree,
            initNewItems: initNewItems
        };
    };


    $.fn.moTimeline = function (options) {
        var _self = this;
        if ($.type(options) !== 'object') {
            options = {};
        }

        // expose the library
        $.extend(true, window.moTimeline, _moTimeline());

        //  init the library
        _moTimeline(options).init(_self);

    };
}(jQuery));