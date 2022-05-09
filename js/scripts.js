$(document).ready(function() {
    sam.init();
});

var sam = new function() {
    var self = this;

    self.body = $('body');
    self.html = $('html');
    self.isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 &&  navigator.userAgent.indexOf('Android') == -1;

    self.init = function() {
        self.menu.init();
        self.tabs.init();
        self.tabsMobile.init();
        self.printTable.init();
        self.tinySlider.init();
        self.select.init();
        self.dropdown.init();
        self.filterBurger.init();
        self.modal.init();
        self.showPassword.init();
        self.addMask.init();
    };

    this.menu = new function() {
        var that = this;

        this.init = function() {
            var hamburger = $('.js-hamburger'),
                hamburgerOpen = $('.js-hamburger-open'),
                hasSubmenu = $('.js-has-submenu'),
                scrollPosition = 0;

            $(hamburger).click(function() {
                $(hamburgerOpen).toggleClass('open');
                $(this).toggleClass('open');
                if ($(this).hasClass('open')) {
                    if (sam.isSafari) {
                        scrollPosition = window.pageYOffset;
                        $('html').addClass('fixed-safari');
                        $('body').css('top', -scrollPosition);
                        $('body').addClass('fixed-safari');
                    }
                    else {
                        $('body').addClass('fixed');
                    }
                } else {
                    if (sam.isSafari) {
                        $('body').removeClass('fixed-safari');
                        $('html').removeClass('fixed-safari');
                        window.scrollTo(0, scrollPosition);
                    }
                    else {
                        $('body').removeClass('fixed');
                    }
                }
            });

            $(hasSubmenu).click(function () {
                event.preventDefault();
                var submenu = $(this).siblings('.js-submenu');
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
    this.select = new function() {
        this.init = function() {
            $('select.js-select').each(function() {
                $(this).samselect($(this).data());
            });

        };
    };
    this.dropdown = new function() {
        let that = this;

        this.init = function() {
            $('.js-dropdown').each(function() {
                that.build(this);
            });
        };

        this.toggleUl = function(title, ul) {
            if ($(title).parent().hasClass('js-open')) {
                $(title).parent().removeClass('js-open');
                $(ul).removeClass('select-item__options--active').hide();

                self.body.off('click');
            } else {
                $(title).parent().addClass('js-open');
                $(ul).addClass('select-item__options--active').show();

                let dropdownId = $(title).parent().attr('id');
                self.body.click(function(event) {
                    event = event || window.event;
                    that.closeDropdowns(event, dropdownId);
                });
            }
        };

        this.closeDropdowns = function(event, dropdownId) {
            let hide = true;
            if ($(event.target).parents('.js-div-dropdown').length) {
                let div = $(event.target).parents('.js-div-dropdown');
                if ($(div).attr('id') == dropdownId) {
                    hide = false;
                }
            }
            if (hide) {
                $('.js-div-dropdown.js-open').each(function() {
                    let title = $(this).find('.js-div-dropdown-title'),
                        ul = $(this).find('.js-div-dropdown-ul');

                    that.toggleUl(title, ul);
                });
            }
        };

        this.change = function(li) {
            let div = $(li).parents('.js-div-dropdown'),
                title = $(div).find('.js-div-dropdown-title'),
                ul = $(div).find('.js-div-dropdown-ul');

            $(ul).find('li.js-active').removeClass('js-active');
            $(li).addClass('js-active');

            if ($(ul).data('customize')) {
                customizeStyle = $(ul).data('customize');
            }

            title = that.customize.title(title, ul);
            that.toggleUl(title, ul);
        };

        this.getId = function(step) {
            if (!step) {
                step = 0;
            }
            let rand = Date.now();
            if ($('#js-div-dropdown-' + rand).length) {
                return that.getId(++step);
            }

            return rand;
        };

        this.getDefaultScroll = function() {
            return {
                'autohidemode'      : false,
                'cursorwidth'       : '4px',
                'cursorborder'      : 'none',
                'cursorborderradius': '3px',
                'zindex'            : '998',
                'scrollspeed'       : '0',
                'mousescrollstep'   : 40,
                'touchbehavior'     : sam.isTablet,
                'railpadding'       : {top: 4, right: 2, left: 0, bottom: 4}
            };
        };

        this.customize = {
            div: function(div, ul) {
                $(div).addClass('dropdown');
                if ($(ul).data('width')) {
                    $(div).css('width', $(ul).data('width'));
                }
                if ($(ul).data('dark')) {
                    div.addClass('dropdown--dark');
                }
                if ($(ul).data('white')) {
                    div.addClass('dropdown--white');
                }
                if ($(ul).data('transparent')) {
                    div.addClass('dropdown--transparent');
                }
                if ($(ul).data('disabled')) {
                    div.addClass('dropdown--disabled');
                }
                return div;
            },
            title: function(title, dropdown) {
                let html = '';
                if ($(dropdown).find('li.js-active').length) {
                    html = $(dropdown).find('li.js-active').html();
                } else {
                    html = $(dropdown).find('li:first-child').html();
                }
                $(title).addClass('dropdown__title');
                $(title).html(html);
                return $(title);
            },
            ul: function(ul) {
                $(ul).addClass('dropdown__options');
                return ul;
            },
            li: function(li) {
                $(li).addClass('dropdown__option');
                return li;
            },
            a: function(a) {
                $(a).addClass('dropdown__link dropdown__link--dropdown');
            },
            scroll: function() {
                var params = that.getDefaultScroll();
                params.cursorcolor = '#0044af';
                params.cursoropacitymax = 0.75;
                params.cursoropacitymin = 0.75;

                return params;
            }
        };

        this.build = function(dropdown) {
            let id = that.getId(),
                div = $('<div>', {'id': 'js-div-dropdown-' + id, 'class': 'js-div-dropdown'}),
                title = $('<div>', {'class': 'js-div-dropdown-title'}),
                ul = $(dropdown).clone();

            $(ul).addClass('js-div-dropdown-ul');

            that.customize.title(title, ul);
            that.customize.ul(ul);
            $(ul).find('li').each(function() {
                that.customize.li(this);
                that.customize.a($(this).find('a'));
                $(this).click(function() {
                    that.change(this);
                });
            });

            that.customize.title(title, ul);
            that.customize.div(div, dropdown);

            $(div).append(title, ul);
            $(dropdown).replaceWith(div);

            if (!ul.data('disabled')) {
                $(title).click(function() {
                    that.toggleUl(this, ul);
                });
            }

            if ($(ul).find('li').length > 8) {
                var liHeight = that.getLiHeight($(ul).find('li')[0], true); $(ul).hide();
                $(ul).css({
                    'maxHeight'   : liHeight * 8 + 16,
                    'paddingRight': '12px'
                });
                $(ul).niceScroll(that.customize.scroll());
            }

            $(ul).parents('.js-dropdown-cont').addClass('js-already-init')
        };

        this.getLiHeight = function(el, isLi) {
            let height;
            if (isLi) {
                height = $(el).outerHeight();
                if (height === 0) {
                    $(el).addClass('js-calc-height');
                    return that.getLiHeight($(el).parent(), false);
                }
            } else {
                height = $(el).show().find('.js-calc-height').outerHeight();
                if (height === 0) {
                    return getLiHeight($(el).parent(), false);
                } else {
                    $(el).show().find('.js-calc-height').removeClass('js-calc-height');
                    $(el).hide();
                }
            }

            return height;
        };
    };
    this.filterBurger = new function() {
        var that = this;

        this.init = function() {
            var burger = $('.js-burger');

            $(burger).click(function() {
                var burgerBody = $(this).siblings('.js-burger-body');
                $(this).toggleClass('open');
                $(burgerBody).toggleClass('open');
            });
        };
    };
    this.modal = new function() {
        var that = this;

        this.state = {
            'isActive': false,
            'popup'   : null,
            'btn'     : null
        };

        this.init = function() {
            self.body.on('click', 'a[data-toggle="modal"], button.js-popup-button', function() {
                $(this).toggleClass('active');

                var $popup = $(this).hasClass('js-popup-button') ? $($(this).data('target')) : $($(this).attr('href'));
                if ($popup.length) {
                    if (that.state.isActive) {
                        that.close(that.state.popup, that.state.btn);
                    }
                    that.open($popup, $(this));
                }
            });
        };

        this.open = function($popup, $btn) {
            let popupId = $popup.attr('id');

            that.overlay.open();
            $popup.addClass('active').addClass('open');
            $btn.addClass('active');

            that.overlay.$overlay.click(function(event) {
                event = event || window.event;
                let $parent = $(event.target).parents('#' + popupId);
                if ($parent.length) {
                    return;
                }

                that.close($popup, $btn);
            });

            $popup.find('.js-close').click(function() {
                that.close($popup, $btn);
            });

            that.state.isActive = true;
            that.state.popup = $popup;
            that.state.btn = $btn;
        };

        this.close = function($popup, $btn) {
            that.overlay.close();
            $popup.removeClass('active').removeClass('open');
            $btn.removeClass('active');

            that.overlay.$overlay.off('click');
            $popup.find('.js-close').off('click');

            that.state.isActive = false;
            that.state.popup = null;
            that.state.btn = null;
        };

        this.overlay = new function() {
            var context = this;

            this.$overlay = $('.js-overlay');

            this.open = function() {
                context.$overlay.show();
                self.body.addClass('fixed');
            };

            this.close = function() {
                context.$overlay.hide();
                self.body.removeClass('fixed');
            };
        };
    };
    this.showPassword = new function() {
        var that = this;

        this.init = function() {
            var showButton = $('.form__show');

            $(showButton).click(function() {
                var passwordInput = $(this).siblings('.form__input');
                event.preventDefault();
                if ($(passwordInput).attr('type') === 'password'){
                    $(passwordInput).attr('type', 'text');
                    $(this).addClass('active');
                } else {
                    $(passwordInput).attr('type', 'password');
                    $(this).removeClass('active');
                }
            });
        };
    };
    this.addMask = new function() {
        var that = this;

        this.init = function() {
            var phoneInput = $('.js-phone-input');
            var birthdateInput = $('.js-birthdate-input');
            $(phoneInput).mask('+7 (999) 999-99-99').on('click', function () {
                if ($(this).val() === '+7 (___) ___-__-__') {
                    $(this).get(0).setSelectionRange(4, 4);
                }
            });
            $(birthdateInput).mask("99.99.9999").on('click', function () {
                if ($(this).val() === '__.__.____') {
                    $(this).get(0).setSelectionRange(0, 0);
                }
            });
        };
    };
};
