(function ($, Backbone) {
    if (!Backbone) return;

    var ROLE_KEY = 'app-role';
    var USER_KEY = 'app-user-current';

    function getRole() {
        try {
            return (window.localStorage && localStorage.getItem(ROLE_KEY)) || '';
        } catch (e) {
            return '';
        }
    }

    function getUser() {
        try {
            return (window.localStorage && localStorage.getItem(USER_KEY)) || '';
        } catch (e) {
            return '';
        }
    }

    function maskCard(card, expiry) {
        var digits = (card || '').replace(/\D/g, '');
        var last4 = digits.slice(-4);
        var mask = '**** **** **** ' + (last4 ? last4 : '****');
        return expiry ? mask + ' (' + expiry + ')' : mask;
    }

    var ClientModel = Backbone.Model.extend({
        defaults: {
            id: null,
            user: '',
            fullName: '',
            card: '',
            expiry: '',
            address: '',
            carTitle: ''
        }
    });

    var ClientCollection = Backbone.Collection.extend({
        model: ClientModel
    });

    var ClientTableView = Backbone.View.extend({
        initialize: function (options) {
            this.collection = options.collection;
            this.$tbody = this.$('tbody');
            this.$emptyRow = $('#clients-empty-row');
            this.$empty = $('#clients-empty');
            this.listenTo(this.collection, 'reset update change', this.render);
            this.render();
        },
        render: function () {
            var list = this.collection.toJSON();
            this.$tbody.empty();

            if (!list.length) {
                if (this.$empty.length) this.$empty.removeClass('is-hidden');
                if (this.$emptyRow.length) {
                    this.$emptyRow.removeClass('is-hidden');
                    this.$tbody.append(this.$emptyRow);
                } else {
                    this.$tbody.append('<tr><td colspan="5">No purchases yet.</td></tr>');
                }
                return this;
            }

            if (this.$empty.length) this.$empty.addClass('is-hidden');

            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var row = $('<tr/>');
                row.append($('<td/>').text(item.user || ''));
                row.append($('<td/>').text(item.fullName || ''));
                row.append($('<td/>').text(maskCard(item.card, item.expiry)));
                row.append($('<td/>').text(item.address || ''));
                row.append($('<td/>').text(item.carTitle || ''));
                this.$tbody.append(row);
            }

            return this;
        }
    });

    function loadPurchases() {
        var all = (window.Purchases && window.Purchases.load && window.Purchases.load()) || [];
        var role = getRole();
        var user = getUser();
        if (role === 'client') {
            return all.filter(function (p) {
                return p.user === user;
            });
        }
        return all;
    }

    function bootstrap() {
        var collection = new ClientCollection(loadPurchases());
        new ClientTableView({ el: '.clients__table-card', collection: collection });

        function reload() {
            collection.reset(loadPurchases());
        }
        window.addEventListener('storage', reload);
    }

    $(document).ready(bootstrap);
})(jQuery, window.Backbone);
