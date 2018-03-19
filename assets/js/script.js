$(document).ready(function(){
    /* Автоматическое проставление id и for для label и input. */
    var bindLabels, guid;
    guid = function() {
        var s4;
        s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    window.guid = guid;
    bindLabels = function() {
        $('input[type="checkbox"], input[type="radio"]').not('[id]').each(function() {
            var id = guid();
                th = $(this);
            th.attr('id', id);
            if (th.next().is('label')) {
                return th.next().attr('for', id);
            }
        });
        return $('label').not('[for]').each(function() {
            var id = guid();
                th = $(this);
            if (th.next().is('input,textarea,select')) {
                th.attr('for', id);
                return th.next().attr('id', id);
            } else if (th.prev().is('input,textarea,select')) {
                th.attr('for', id);
                return th.prev().attr('id', id);
            }
        });
    };
    bindLabels();

    /*График работы. Нужно проставить id day[1-7] в html.*/
    var now = new Date();
    var currentDay = now.getDay();
    currentDay = (currentDay == 0) ? 7 : currentDay;
    if ($('day' + currentDay)){
        $('#day' + currentDay).addClass('active');
    }

    /* Получение текущего года. */
    $('#getFullYear').html(now.getFullYear());
    
    /* Подгрузка параметров ресурса в модальное окно через /assets/ajax.php в #orderModalTitle.*/
    $(document).on('click','.loadAjax',function(e){
        e.preventDefault();
        var id = $(this).data('id') || 0;
        $(".loadAjaxBlock").load("/assets/ajax.php",{action:"getContent",id:id}, function(response){
            if (response) {
                $("#modal").modal('show');
            }
        });
    });

    /*Запись data-value в input #getValue при нажатии на .getvalue.*/
    $(document).on('click','.getvalue',function(){
        $('#getValue').val($(this).data("value"));
    });

    /*Резиновая по высоте карта с блоком контактов внутри него. Опирается на высоту .contacts.*/
    var mapHeight = $('.contacts').innerHeight();
    $('.map').innerHeight(mapHeight+110);

    /*Плавный скролл к якорю*/
    $('a[href^="#"]').click(function() {
        var el = $(this).attr("href");

        /*Работает из мобильного меню*/
        if($('body').hasClass('open')) {
            $('body').removeClass('open');
        }

        $("body,html").animate({
            scrollTop: $(el).offset().top
        }, 500);
        return false;
    });

    /*Мобильное меню*/
    $('.btn-mobile-menu').click(function () {
        $('body').toggleClass('open');
    });

    /*Запись данных в форму в модальном окне*/
    $('[data-target]').on('click', '', function () {
        var th = $(this);
        if (th.data("reason")){
            $('.callOrderReason').val(th.data("reason"));
        }
        if (th.data("button")){
            $('.callOrderButton').text(th.data("button"));
        }
        if (th.data("header")){
            $('.callOrderHeader').text(th.data("header"));
        }
        if (th.data("goal")){
            $('.goalMetrikaModal').val(th.data("goal"));
        }
    });

    /*Калькулятор*/
    function calculator(cssClass, callback) {

        var inp = $(cssClass).find("input[data-price]"),
            sel = $(cssClass).find("select[data-price]"),
            chk = $(cssClass).find("input[type='checkbox'][data-price]"),
            th = $(cssClass);

        th.find('[data-price]').on("keyup change ", function () {
            var sum = 0,
                result = 0,
                resultSelect = 0,
                resultCheckbox = 0,
                arr = [];

            /*Инпуты*/
            for (var i = 0; i < inp.length; i++) {
                var iv = inp[i].value,
                    im = inp[i].name,
                    ip = inp[i].dataset.price;
                if (!isNaN(iv)) {
                    result = iv * ip;
                    arr[im] = iv;
                    sum += result;
                }
            }

            /*Селекты*/
            for (var u = 0; u < sel.length; u++) {
                var sc = sel[u],
                    sm = sc.name;
                for (var j = 0; j < sc.length; j++) {
                    if (sc[j].selected == true) {
                        var sv = sc[j].value;
                        arr[sm] = sv;
                        resultSelect = sc[j].dataset.price;
                        sum += Number(resultSelect);
                    }
                }
            }

            /*Чекбоксы*/
            for (var o = 0; o < chk.length; o++) {
                if (chk[o].checked == true) {
                    var cv = chk[o].value,
                        cm = chk[o].name,
                        cp = chk[o].dataset.price;
                    resultCheckbox = cp;
                    arr[cm] = cv;
                    sum += Number(resultCheckbox);
                }
            }

            arr['total'] = sum;

            callback(arr); //массив с результатами
        });
    }

    /*Вызов калькулятора, индивидуальные настройки*/
    calculator('.calculator', function (arr) {
        var th = $('.calculator'),
            res = th.find('.price');

        //console.log(arr);
        res.text(arr['total'] + ' рублей');
        th.find('input[name=price]').val(arr['total'] + ' рублей');
    });

    /*Input c data-onlynumbers, в который можно вводить только цифры*/
    var input = $("[data-onlynumbers]"),
        regexp = /^\-?[0-9]*$/;

    input.keypress(function (e) {
        var check = $(this).val() + String.fromCharCode(e.charCode);
        if (!regexp.test(check)) {
            return false;
        }
    });

    /*Цели метрики*/
    /*$(document).on('af_complete', function(event, response) {
        if (response.success) {
            var goal = response.form[0].getElementsByClassName('goalMetrika')[0].value;
            //var counter = response.form[0].getElementsByClassName('metrikaCounter')[0].value;
            eval('yaCounter111111111.reachGoal('+goal+')');
            gtag('event', goal, {'event_category': 'category'});
        }
    });*/

});