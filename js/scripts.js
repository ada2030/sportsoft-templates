import {lock, unlock} from "../plugins/tua-bsl/tua-bsl.esm.browser.js";

$(document).ready(function() {
    sam.init();
});

var sam = new function() {
    var self = this;

    self.body = $('body');
    self.html = $('html');

    self.init = function() {
        self.menu.init();
        self.tabs.init();
        self.tabsMobile.init();
        self.printTable.init();
        self.tinySlider.init();
    };

    this.menu = new function() {
        var that = this;

        this.init = function() {
            var hamburger = $('.js-hamburger'),
                hamburgerOpen = $('.js-hamburger-open'),
                hasSubmenu = $('.js-has-submenu'),
                scrollElement = $('.js-menu-scroll');

            $(hamburger).click(function() {
                $(hamburgerOpen).toggleClass('open');
                $(this).toggleClass('open');
                if ($(this).hasClass('open')) {
                    lock();
                } else {
                    unlock();
                }
            });

            $(hasSubmenu).click(function () {
                event.preventDefault();
                var submenu = $(this).find('.js-submenu');
                $(submenu).toggleClass('open');
            });
        };
    };
    this.tabs = new function() {
        let that = this;

        this.init = function() {
            $('.js-tabs:not(.js-already-init)').each(function() {
                that.build(this);
            });
        };

        this.customize = {
            li: function(li) {
                if ($(li).hasClass('js-active')) {
                    $(li).addClass('tabs__item--active');
                } else {
                    $(li).removeClass('tabs__item--active');
                }
            },
            tab: function(tab) {
                if ($(tab).hasClass('js-show')) {
                    $(tab).addClass('tabs__pane--active');
                } else {
                    $(tab).removeClass('tabs__pane--active');
                }
            }
        };

        this.build = function(ul) {
            if (!$(ul).data('cont-id') && !$($(ul).data('cont-selector'))) {
                return false;
            }

            let tabsCont;
            if ($(ul).data('cont-id')) {
                tabsCont = $('#' + $(ul).data('cont-id'));
            } else {
                tabsCont = $($(ul).data('cont-selector'));
            }

            $(ul).find('li a').click(function() {
                let li = $(this).parents('li');
                $(ul).find('li.js-active').removeClass('js-active');
                $(li).addClass('js-active');
                $(ul).find('li').each(function() {
                    that.customize.li(this);
                });

                let tabContSelector;

                if ($(li).data('tab-id')) {
                    tabContSelector = '>.js-tab-cont#' + $(li).data('tab-id');
                } else if ($(ul).data('tab-selector')) {
                    tabContSelector = '>.js-tab-cont' + $(li).data('tab-selector');
                }

                let tab = $(tabsCont).find(tabContSelector);
                $(tabsCont).find('>.js-tab-cont.js-show').removeClass('js-show').hide();
                $(tab).addClass('js-show').show();
                $.each($(tabsCont).find('>.js-tab-cont'), function() {
                    that.customize.tab(this);
                });

                let tabsCallback = $(ul).data('callback');
                if (tabsCallback && that.callbacks[tabsCallback]) {
                    that.callbacks[tabsCallback](ul);
                }

            });

            $(ul).addClass('js-already-init');
        };

        this.destroy = function(ul) {
            $(ul).find('li a').off('click');
        };

        this.callbacks = {};
    };
    this.tabsMobile = new function() {
        this.init = function() {
            var tabs = $('.tabs');
            $(tabs).each(function() {
                var itemTab = $(this).find($('.tabs__item'));
                $(itemTab).click(function() {
                    if ($(this).hasClass('tabs__item--active')) {
                        $(this).parent().toggleClass('open');
                        $(this).toggleClass('open');
                        return false;
                    }
                    $(this).parent().toggleClass('open');
                    $(this).toggleClass('open');
                });
            });
        }
    };
    this.printTable = new function() {
        this.init = function() {
            jQuery(function ($) {
                const tableToPrint = document.getElementById('printMe');

                function printData(tableToPrint) {
                    Popup($(tableToPrint).html());
                }

                function Popup(data) {
                    const mywindow = window.open('', 'printMe', 'height=600, width=1000');
                    // стили таблицы
                    mywindow.document.write('<link rel="stylesheet" href="styles.css" type="text/css" />');
                    mywindow.document.write(tableToPrint.outerHTML);
                    mywindow.document.close(); // для IE >= 10
                    mywindow.focus();          // для IE >= 10
                    mywindow.print();
                    mywindow.close();
                    return true;
                }

                $(document).on('click', '#printTable', function () {
                    printData();
                    return false;
                });
            });
        }
    };
    this.tinySlider = new function () {
        let that = this;

        this.sliders = {};

        this.timers = {};

        this.init = function () {
            $('.js-tiny-slider').each(function (k) {
                let slider = this, data = $(this).data,
                    initialWidth = data['initialWidth'], bodyWidth = self.body.outerWidth(),
                    sliderName = data['sliderName'] ? data['sliderName'] : k;
                if (initialWidth) {
                    if (initialWidth >= bodyWidth) {
                        that.build(this, k);
                    }

                    $(window).resize(function () {
                        if (that.timers[sliderName]) {
                            clearTimeout(that.timers[sliderName]);
                            delete that.timers[sliderName];
                        }
                        that.timers[sliderName] = setTimeout(function () {
                            let bodyWidth = self.body.outerWidth();
                            if (initialWidth >= bodyWidth) {
                                that.build(slider, sliderName);
                            } else if (that.sliders[sliderName]) {
                                that.destroy(slider, sliderName);
                            }
                        }, 100);
                    });
                } else {
                    that.build(this, sliderName);
                }
            });
        };

        this.build = function (slider, k) {
            if (!$(slider).hasClass('js-already-init')) {
                let sliderClass = 'js-tiny-slider-' + k,
                    sliderSelector = '.' + sliderClass;
                $(slider).addClass(sliderClass).data('sliderIndex', k);
                let data = $(slider).data();
                let params = {
                    //Контейнеры
                    container: data['container'] ? data['container'] : sliderSelector, //селектор контейнера для слайдера
                    controlsContainer: data['controlsContainer'] ? data['controlsContainer'] : false, //селектор контейнера для стрелок
                    navContainer: data['navContainer'] ? data['navContainer'] : false, //селектор контейнера для точек
                    //Стрелки и точки
                    controls: data['controls'] ? data['controls'] : false, //кнопки
                    prevButton: data['prevButton'] ? $(data['prevButton']).get(0) : false, //селектор кнопки пред. слайда
                    nextButton: data['nextButton'] ? $(data['nextButton']).get(0) : false, //селектор кнопки след. слайда
                    nav: data['nav'] ? data['nav'] : false, //точки [dots]
                    navAsThumbnails: data['navAsThumbnails'] ? data['navAsThumbnails'] : false, //навигация в виде мини-картинок

                    //Основные параметры
                    mode: data['mode'] ? data['mode'] : 'carousel',
                    items: data['items'] ? data['items'] : 1,            //количество видимых элементов слайдов
                    slideBy: data['slideBy'] ? data['slideBy'] : 1,            //на сколько слайдов сдвигать
                    startIndex: data['startIndex'] ? data['startIndex'] : false,        //начальный слайд
                    autoWidth: data['autoWidth'] ? data['autoWidth'] : false,        //автоматическое определение ширины слайда
                    autoHeight: data['autoHeight'] ? data['autoHeight'] : false,        //автоматическое определение высоты слайда,
                    fixedWidth: data['fixedWidth'] ? data['fixedWidth'] : false,        //фиксированная ширина слайда
                    loop: data['loop'] ? data['loop'] : false,        //бесконечность прокрутки
                    speed: data['speed'] ? data['speed'] : 300,          //скорость прокрутки
                    lazyload: data['lazyload'] ? data['lazyload'] : false,        //ленивая загрузка
                    axis: data['axis'] ? data['axis'] : 'horizontal', //['horizontal', 'vertical'] горизонтальная/вертикальная прокрутка
                    gutter: data['gutter'] ? data['gutter'] : 0,            //расстояние между слайдами, в px
                    center: data['center'] ? data['center'] : false,        //центрирование активного слайда
                    mouseDrag: data['mouseDrag'] ? data['center'] : false,        //изменение слайдов путем их перетаскивания
                    touch: data['mouseDrag'] ? data['center'] : false,        //активирует обнаружение ввода для сенсорных устройств.

                    //Автопрокрутка
                    autoplay: data['autoplay'] ? data['autoplay'] : false,     //автопрокрутка
                    autoplayButtonOutput: data['autoplayButtonOutput'] ? data['autoplayButtonOutput'] : false,     //кнопки для автопрокрутки
                    autoplayTimeout: data['autoplayTimeout'] ? data['autoplayTimeout'] : 5000,      //задержка прокрутки
                    autoplayDirection: data['autoplayDirection'] ? data['autoplayDirection'] : 'forward', //['forward', 'backward'] направленность прокрутки
                    autoplayText: data['autoplayText'] ? data['autoplayText'] : false,     //['start', 'stop'] //текст кнопок прокрутки
                    autoplayHoverPause: data['autoplayHoverPause'] ? data['autoplayHoverPause'] : false,     //остановка при наведении мыши

                    //Респонсив
                    responsive: data['responsive'] ? data['responsive'] : false, //{breakpoint: {key: value, [...]}}}

                    //Отключение hideNav (расширение by @bpystep)
                    hideNav: data['hide-nav'] !== 'undefined' ? data['hide-nav'] : true //скрывает Nav, если все слайды отображены
                };

                let tnsSlider = tns(params);
                this.sliders[data['sliderName'] ? data['sliderName'] : k] = tnsSlider;
                $(slider).removeClass(sliderClass);

                if ($(slider).data('transitionStart') && that.callbacks[$(slider).data('transitionStart')]) {
                    tnsSlider.events.on('transitionStart', that.callbacks[$(slider).data('transitionStart')]);
                }

                if ($(slider).data('transitionEnd') && that.callbacks[$(slider).data('transitionEnd')]) {
                    tnsSlider.events.on('transitionEnd', that.callbacks[$(slider).data('transitionEnd')]);
                }
                $(slider).removeClass(sliderClass);
                $(slider).addClass('js-already-init');
            }
        };

        this.destroy = function (slider, k) {
            $(slider).removeClass('js-already-init');
            that.sliders[k].destroy();
            delete that.sliders[k];
        };

        this.callbacks = {};
    };
};
