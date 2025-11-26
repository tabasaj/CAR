(() => {
    const KEY = 'car-manager-cars';

    const load = () => {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Failed to load cars from storage', e);
            return null;
        }
    };

    const save = (cars) => {
        try {
            localStorage.setItem(KEY, JSON.stringify(cars));
        } catch (e) {
            console.warn('Failed to save cars to storage', e);
        }
    };

    window.CarLocalStore = { load, save };
})();
