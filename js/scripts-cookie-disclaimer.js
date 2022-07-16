$(document).ready(function() {
    cookieDisclaimer.init();
});

var cookieDisclaimer = new function() {
    var cookieName = 'show-banner-cookies';
    var cookie = $.cookie(cookieName);
    if (!cookie) {
        setTimeout(function() {
            $(".js-cookie-banner").toggle(true, 300);
        }, 500);
    }
    $(".js-cookie-banner-accept").click(function() {
        $.cookie(cookieName, 1, {expires: 30, path: '/'});
        $(".js-cookie-banner").slideUp(300);
    });
};
