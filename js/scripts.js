$(document).ready(function() {
    sam.init();
});

var sam = new function() {
    var self = this;

    self.body = $('body');

    self.init = function() {
        self.menu.init();
    };

    this.menu = new function() {
        var that = this;

        this.init = function() {
            var hamburger = $('.js-hamburger'),
                header = $('.js-header'),
                menu = $('.js-menu'),
                hasSubmenu = $('.js-has-submenu');

            $(hamburger).click(function() {
                $(hamburger).toggleClass('open');
                $(header).toggleClass('open');
                $(menu).toggleClass('open');
                if ($(header).hasClass('open')) {
                    $('body').css('overflow', 'hidden');
                } else {
                    $('body').css('overflow', 'unset');
                }
            });

            $(hasSubmenu).click(function () {
                event.preventDefault();
                var submenu = $(this).find('.js-submenu');
                $(submenu).toggleClass('open');
            });
        };
    };
};
