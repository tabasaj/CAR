(function ($, Backbone) {
    if (!Backbone) return;

    var palette = ['#c53030', '#1f2937', '#2563eb', '#059669', '#f59e0b', '#7c3aed'];

    var Car = Backbone.Model.extend({
        defaults: {
            id: '',
            title: '',
            model: '',
            tagline: '',
            msrp: '0',
            currency: '₱',
            transmission: '',
            fuel: '',
            seating: '',
            colors: []
        }
    });

    var CarList = Backbone.Collection.extend({
        model: Car
    });

    var hexByLabel = {
        'emotional red': '#b9282d',
        'platinum white pearl': '#f5f5f5',
        'attitude black': '#0a0a0a',
        'bronze metallic': '#7c6651',
        'silver metallic': '#c2c7cb',
        'vibrant blue': '#0ea5e9',
        'vibrant green': '#16a34a',
        'vibrant orange': '#f97316'
    };

    function normalizeCars() {
        var stored = window.CarLocalStore && window.CarLocalStore.load && window.CarLocalStore.load();
        var list = stored ? Object.values(stored) : [];
        var source = list.length ? list : [
            {
                id: 'grs',
                title: 'HILUX 2.8 GR-S 4x4 A/T',
                model: 'Hilux 2.8 GR-S',
                tagline: 'Performance-focused with GR Sport styling.',
                msrp: '2,480,000',
                currency: '₱',
                transmission: '6 Speed AT',
                fuel: 'Diesel',
                seating: '5',
                colors: [
                    { id: 'gr-red', label: 'Emotional Red', hex: '#b9282d', image: '../assets/hilux2.8_gr_red.webp' },
                    { id: 'gr-black', label: 'Attitude Black', hex: '#0a0a0a', image: '../assets/hilux2.8_gr_black.webp' }
                ]
            },
            {
                id: 'conquest',
                title: 'HILUX 2.8 CONQUEST 4x4 A/T',
                model: 'Hilux 2.8 Conquest',
                tagline: 'Trail-ready utility with daily comfort.',
                msrp: '2,210,000',
                currency: '₱',
                transmission: '6 Speed AT',
                fuel: 'Diesel',
                seating: '5',
                colors: [
                    { id: 'con-red', label: 'Emotional Red', hex: '#b9282d', image: '../assets/hilux2.8_con_red.webp', alt: 'Hilux 2.8 Conquest in Emotional Red' },
                    { id: 'con-white', label: 'Platinum White Pearl', hex: '#f5f5f5', image: '../assets/hilux2.8_con_white.webp', alt: 'Hilux 2.8 Conquest in Platinum White Pearl' },
                    { id: 'con-black', label: 'Attitude Black', hex: '#0f0f0f', image: '../assets/hilux2.8_con_black.webp', alt: 'Hilux 2.8 Conquest in Attitude Black' },
                    { id: 'con-bronze', label: 'Bronze Metallic', hex: '#7c6651', image: '../assets/hilux2.8_con_bronzemetalic.webp', alt: 'Hilux 2.8 Conquest in Bronze Metallic' },
                    { id: 'con-silver', label: 'Silver Metallic', hex: '#c2c7cb', image: '../assets/hilux2.8_con_metalic.webp', alt: 'Hilux 2.8 Conquest in Silver Metallic' }
                ]
            },
            {
                id: 'vibrant',
                title: 'HILUX 2.8 VIBRANT 4x4 A/T',
                model: 'Hilux 2.8 Vibrant',
                tagline: 'Vivid colorways with the same Hilux capability.',
                msrp: '2,300,000',
                currency: '₱',
                transmission: '6 Speed AT',
                fuel: 'Diesel',
                seating: '5',
                colors: [
                    { id: 'vib-blue', label: 'Vibrant Blue', hex: '#0ea5e9', image: '../assets/hilux2.8_vibrant_blue.png', alt: 'Hilux 2.8 Vibrant in Vibrant Blue' },
                    { id: 'vib-green', label: 'Vibrant Green', hex: '#16a34a', image: '../assets/hilux2.8_vibrant_green.png', alt: 'Hilux 2.8 Vibrant in Vibrant Green' },
                    { id: 'vib-orange', label: 'Vibrant Orange', hex: '#f97316', image: '../assets/hilux2.8_vibrant_orange.png', alt: 'Hilux 2.8 Vibrant in Vibrant Orange' }
                ]
            }
        ];

        return source.map(function (car, idx) {
            var msrp = (car.price || car.msrp || '').toString().replace(/[^\d]/g, '') || '0';
            var currency = car.currency || '₱';
            var colors = (car.colors && car.colors.length ? car.colors : [{ label: 'Default', image: car.image, alt: car.alt }]).map(function (c, cIdx) {
                var label = c.label || ('Color ' + (cIdx + 1));
                var key = label.toLowerCase();
                var hex = c.hex || hexByLabel[key] || palette[cIdx % palette.length];
                return {
                    id: c.id || ((car.id || idx) + '-color-' + cIdx),
                    label: label,
                    hex: hex,
                    image: c.image || car.image,
                    alt: c.alt || ((car.title || car.model || 'Model') + ' in ' + label)
                };
            });

            return {
                id: car.id || ('car-' + idx),
                title: car.title || car.model || 'New Model',
                model: car.model || car.title || 'New Model',
                tagline: car.tagline || '',
                msrp: msrp,
                currency: currency,
                transmission: car.transmission || '',
                fuel: car.fuel || '',
                seating: car.seating || '',
                colors: colors
            };
        });
    }

    var carCollection = new CarList(normalizeCars());
    var modelIndex = 0;
    var colorIndex = 0;

    var $title = $('#car-title');
    var $image = $('#car-image');
    var $tagline = $('#car-tagline');
    var $colorName = $('#car-color-name');
    var $swatches = $('#car-colors');
    var $progress = $('#car-progress');
    var $currency = $('.car-carousel__currency');
    var $price = $('#car-price');
    var $transmission = $('#car-transmission');
    var $fuel = $('#car-fuel');
    var $seating = $('#car-seating');

    function clampIndex(index, max) {
        if (index < 0) return max;
        if (index > max) return 0;
        return index;
    }

    function renderProgress() {
        $progress.empty();
        carCollection.each(function (m, idx) {
            var dot = $('<span/>', {
                class: 'car-carousel__progress-dot' + (idx === modelIndex ? ' is-active' : '')
            });
            $progress.append(dot);
        });
    }

    function renderSwatches(colors) {
        $swatches.empty();

        colors.forEach(function (color, idx) {
            var swatch = $('<button/>', {
                type: 'button',
                class: 'car-carousel__swatch' + (idx === colorIndex ? ' is-active' : ''),
                'aria-label': color.label,
                'data-index': idx
            });

            var chip = $('<span/>', { class: 'car-carousel__swatch-chip' }).css('background-color', color.hex);
            var check = $('<span/>', { class: 'car-carousel__swatch-check', text: '✓' });

            swatch.append(chip, check);

            swatch.on('click', function () {
                var newIndex = Number($(this).attr('data-index'));
                if (newIndex === colorIndex) return;
                colorIndex = newIndex;
                render();
            });

            $swatches.append(swatch);
        });
    }

    function render() {
        var model = carCollection.at(modelIndex);
        if (!model) return;
        var data = model.toJSON();
        var color = data.colors[colorIndex] || data.colors[0];
        if (!color) return;

        $title.text(data.title);
        $tagline.text(data.tagline);
        $colorName.text(color.label);
        $currency.text(data.currency || '₱');
        $price.text(data.msrp);
        $transmission.text(data.transmission);
        $fuel.text(data.fuel);
        $seating.text(data.seating);

        $image.addClass('is-loading');
        $image.one('load', function () {
            $(this).removeClass('is-loading');
        });
        $image.attr({
            src: color.image,
            alt: 'Toyota ' + data.model + ' in ' + color.label
        });

        renderSwatches(data.colors);
        renderProgress();
    }

    function showNextModel(direction) {
        var maxIndex = carCollection.length - 1;
        modelIndex = clampIndex(modelIndex + direction, maxIndex);
        colorIndex = 0;
        render();
    }

    function bindNavigation() {
        $('.car-carousel__nav--next').on('click', function () {
            showNextModel(1);
        });
        $('.car-carousel__nav--prev').on('click', function () {
            showNextModel(-1);
        });
    }

    $(document).ready(function () {
        carCollection.reset(normalizeCars());
        modelIndex = 0;
        colorIndex = 0;
        bindNavigation();
        render();
    });
})(jQuery, window.Backbone);
