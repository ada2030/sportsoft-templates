$(document).ready(function() {
    beforeAfter.init();
});

var beforeAfter = new function() {
    $('.js-before-after').beforeAfter({
        movable: true,
        clickMove: true,
        alwaysShow: true,
        position: 50,
        opacity: 1,
        activeOpacity: 1,
        hoverOpacity: 1,
        separatorColor: '#01040D',
        bulletColor: '#D50334',
        arrowColor: '#121318',
    });
};
