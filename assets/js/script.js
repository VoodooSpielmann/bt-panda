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
        if (th.data("header")){
            $('.callOrderHeader').text(th.data("header"));
        }
        if (th.data("goal")){
            $('#goalMetrikaModal').val(th.data("goal"));
        }
    });
});