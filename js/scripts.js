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
    };

    this.menu = new function() {
        var that = this;

        this.init = function() {
            var hamburger = $('.js-hamburger'),
                hamburgerOpen = $('.js-hamburger-open'),
                hasSubmenu = $('.js-has-submenu');

            $(hamburger).click(function() {
                $(hamburgerOpen).toggleClass('open');
                $(this).toggleClass('open');
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
};
