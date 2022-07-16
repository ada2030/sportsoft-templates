$(document).ready(function() {
    addMask.init();
});

var addMask = new function() {
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
