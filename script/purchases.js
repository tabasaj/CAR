(function () {
    const KEY = 'app-purchases';

    const load = () => {
        try {
            const raw = window.localStorage && localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    };

    const save = (list) => {
        try {
            window.localStorage && localStorage.setItem(KEY, JSON.stringify(list));
        } catch (e) {
            // ignore storage errors
        }
    };

    const add = (entry) => {
        const list = load();
        list.push(entry);
        save(list);
    };

    window.Purchases = { load, save, add };
})();
