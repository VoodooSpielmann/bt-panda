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
            var id;
            id = guid();
            $(this).attr('id', id);
            if ($(this).next().is('label')) {
                return $(this).next().attr('for', id);
            }
        });
        return $('label').not('[for]').each(function() {
            var id;
            id = guid();
            if ($(this).next().is('input,textarea,select')) {
                $(this).attr('for', id);
                return $(this).next().attr('id', id);
            } else if ($(this).prev().is('input,textarea,select')) {
                $(this).attr('for', id);
                return $(this).prev().attr('id', id);
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


    /* Подгрузка параметров ресурса в модальное окно через /assets/ajax.php в #catalogModalBody. */
    $(document).on('click','.btn-catalog',function(e){
        e.preventDefault();
        var migxid = $(this).data('migxid') || 0;
        $("#catalogModalBody").load("/assets/ajax.php",{action:"getContent",migxid:migxid});
    });
    
    /* Разбор параметров из MIGX. На входе json. Параметры уходят в #toID. */
    function jsonMIGX(jsonInput,toID){
        var objFull = JSON.parse(jsonInput);
        i = 0;
        while (i < objFull.length){
            $(toID).append('<p>' + objFull[i].parameter + ' ' + objFull[i].value + '</p>');
            i++;
        }
    }

    /* Разбор многоуровневого набора параметров из MIGX в json в toID (1 уровень), и toIDTab (2 уровень). */
    function jsonInsideMIGX(jsonInput,toID,toIDTab){
        var objFull = JSON.parse(jsonInput);
        i = 0;
        while (i < objFull.length){
            /* Вывод первого уровня параметров: id, параметр, изображение в #toID*/
            $(toID).append('<p id="tab' + objFull[i].MIGX_id + '" data-toggle="tab" data-parameter="' + objFull[i].parameter + '" data-image="' + objFull[i].image + '">' + objFull[i].parameter + '</p>');
            $(toIDTab).append('<div id="getLevelTwo' + objFull[i].MIGX_id + '"><ul></ul></div>');
            var objFullInside = JSON.parse(objFull[i].value);
            var j = 0;
            while (j < objFullInside.length) {
                /* Вывод второго уровня параметров: id, параметр 2 уровня, значение в #toIDTab #getLevelTwo[id] ul*/
                $(toIDTab + ' #getLevelTwo' + objFull[i].MIGX_id + ' ul').append('<li><p id="point' + objFullInside[j].MIGX_id + '">' + objFullInside[j].parameter + ' - ' + objFullInside[j].value + '</p></li>');
                j++;
            }
            i++;
        }
    }

    /* Подгрузка параметров ресурса в модальное окно через /assets/ajax.php в #orderModalTitle. */
    $(document).on('click','.read-more',function(e){
        e.preventDefault();
        var id = $(this).data('id') || 0;
        $("#orderModalTitle").load("/assets/ajax.php",{action:"getContent",id:id}, function(response){
            if (response) {
                var data = eval("(" + response + ")");
                /*Стандартное поле*/
                $('#orderModalPagetitle').val(data.pagetitle);
                /*Дополнительное поле*/
                $('#orderModalValue').html(data.value);
                if(data.valueMaybe) {
                    $('#orderModalValueMaybe').html(data.valueMaybe);
                }
                /*Изображение с возможностью возврата исходного изображения через data-oldimage. */
                $("#orderModalImage").attr("src", data.image).data("oldimage", data.image);
                /*MIGX*/
                if(data.parameters){
                    jsonMIGX(data.parameters,'#orderModalParameters');
                }
                if(data.parametersTwoLevel){
                    jsonInsideMIGX(data.parametersTwoLevel,'#orderModalParametersFirstLevel','#orderModalParametersSecondLevel');
                }
                $("#orderModal").modal('show');
            }
        });
    });

    /* Очистка полей для MIGX. */
    $('#orderModal').on('hidden.bs.modal', function () {
        $('#orderModalParameters').html('');
        $('#orderModalParametersFirstLevel').html('');
        $('#orderModalParametersSecondLevel').html('');
    });

    /*Запись data-value в input #getValue при нажатии на .getvalue. */
    $(document).on('click','.getvalue',function(){
        $('#getValue').val($(this).data("value"));
    });
});