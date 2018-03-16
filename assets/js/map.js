if (window.matchMedia('(min-width: 992px)').matches) {
    ymaps.ready(initMap);
    function initMap() {
        var myMap, objects;
        myMap = new ymaps.Map('map', {
            center: [54.736445, 55.995324],
            zoom: 10,
            controls: []
        });
        ymapsTouchScroll(myMap);
        var zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: "small"
            }
        });
        myMap.controls.add(zoomControl);

        objects = ymaps.geoQuery(ymaps.geocode('[[pdoField? &id=`[[++site_start]]` &field=`address`]]'))
            //[[getImageList? &tvname=`addresses` &tpl=`@CODE:.add(ymaps.geocode('[[+address]]',{results: 1}))`]]
            .addToMap(myMap);
        objects.then(function () {
            objects.each(function (object) {
                object.options.set('iconLayout', 'default#image');
                object.options.set('iconImageHref', '../assets/css/img/mappoint.svg');
                object.options.set('iconImageSize', [95, 85]);
                object.options.set('iconImageOffset', [-30, -100]);
            });
            myMap.setBounds(objects.getBounds(), {
                checkZoomRange: true,
                zoomMargin: [80, 0, 0, 0]
            }).then(function () {
                myMap.setZoom(15);
            });
        });
    }
}