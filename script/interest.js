(function ($) {
    const ROLE_KEY = 'app-role';
    const USER_KEY = 'app-user-current';
    const PENDING_INTEREST_KEY = 'pending-interest';
    const PENDING_SELECTION_KEY = 'pending-selection';

    const getRole = () => {
        try {
            return window.localStorage && localStorage.getItem(ROLE_KEY);
        } catch (e) {
            return '';
        }
    };

    const getUser = () => {
        try {
            return window.localStorage && localStorage.getItem(USER_KEY);
        } catch (e) {
            return '';
        }
    };

    $(document).ready(() => {
        const $btn = $('#car-interest-btn');
        const $modal = $('#interest-modal');
        const $form = $('#interest-form');
        const $cancel = $('#interest-cancel');
        const $name = $('#interest-name');
        const $card = $('#interest-card');
        const $expiry = $('#interest-expiry');
        const $pin = $('#interest-pin');
        const $address = $('#interest-address');
        const $gps = $('#interest-gps');
        const $toast = $('#interest-toast');
        const $toastClose = $('#interest-toast-close');
        const $title = $('#car-title');
        let coords = null;

        const role = getRole();
        // Show for guest/client; hide for admin
        if (role === 'admin') {
            $btn.addClass('is-hidden');
        } else {
            $btn.removeClass('is-hidden').removeAttr('disabled').removeClass('is-disabled');
        }

        const closeModal = () => {
            $modal.addClass('is-hidden');
            $form[0].reset();
            coords = null;
        };

        const openModal = () => {
            const r = getRole();
            if (r !== 'client' && r !== 'admin') return;
            $modal.removeClass('is-hidden');
        };

        const showToast = () => {
            if ($toast.length) {
                $toast.removeClass('is-hidden');
            }
        };

        const closeToast = () => {
            if ($toast.length) {
                $toast.addClass('is-hidden');
            }
        };

        if ($toastClose.length) {
            $toastClose.on('click', closeToast);
        }

        const getPendingSelection = () => {
            try {
                const raw = window.localStorage && localStorage.getItem(PENDING_SELECTION_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        };

        const setPendingSelection = () => {
            try {
                const sel = {
                    title: ($title.text() || '').trim(),
                    color: ($('#car-color-name').text() || '').trim(),
                    image: $('#car-image').attr('src') || ''
                };
                window.localStorage && localStorage.setItem(PENDING_SELECTION_KEY, JSON.stringify(sel));
            } catch (e) {
                // ignore
            }
        };

        const clearPendingSelection = () => {
            try {
                window.localStorage && localStorage.removeItem(PENDING_SELECTION_KEY);
                window.localStorage && localStorage.removeItem(PENDING_INTEREST_KEY);
            } catch (e) {
                // ignore
            }
        };

        const isPurchased = () => {
            if (!window.Purchases || !window.Purchases.load) return false;
            const user = getUser();
            const role = getRole();
            const title = ($title.text() || '').trim();
            const list = window.Purchases.load() || [];
            if (role === 'admin') {
                return list.some((p) => (p.carTitle || '').trim() === title);
            }
            return list.some((p) => (p.user === user) && (p.carTitle || '').trim() === title);
        };

        const updateInterestState = () => {
            const purchased = isPurchased();
            if (purchased) {
                $btn.text('Already purchased');
                $btn.prop('disabled', true).addClass('is-disabled');
            } else {
                $btn.text('Interested');
                $btn.prop('disabled', false).removeClass('is-disabled');
            }
        };

        if ($btn.length) {
            $btn.on('click', () => {
                const r = getRole();
                if (!r) {
                    try {
                        window.localStorage && localStorage.setItem(PENDING_INTEREST_KEY, '1');
                    } catch (e) {
                        // ignore storage errors
                    }
                    setPendingSelection();
                    window.parent.postMessage({ requireAuth: true }, '*');
                    return;
                }
                openModal();
            });
        }

        if ($cancel.length) {
            $cancel.on('click', (e) => {
                e.preventDefault();
                closeModal();
            });
        }

        const setAddress = (text) => {
            $address.val(text);
        };

        const formatCard = (value) => {
            const digits = value.replace(/\D/g, '').slice(0, 16);
            return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        };

        const formatExpiry = (value) => {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            if (digits.length <= 2) return digits;
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        };

        if ($card.length) {
            $card.on('input', function () {
                const formatted = formatCard($(this).val());
                $(this).val(formatted);
            });
        }

        if ($expiry.length) {
            $expiry.on('input', function () {
                const formatted = formatExpiry($(this).val());
                $(this).val(formatted);
            });
        }

        const handleGPS = () => {
            if (!navigator.geolocation) {
                setAddress('GPS unavailable');
                return;
            }
            $gps.prop('disabled', true).text('Locating...');
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    coords = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };

                    // Reverse geocode via Nominatim (public)
                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`;
                    fetch(url, { headers: { 'User-Agent': 'car-app/1.0' } })
                        .then((r) => r.json())
                        .then((data) => {
                            const addr = data?.display_name || 'Location captured';
                            setAddress(addr);
                        })
                        .catch(() => {
                            setAddress('Location captured');
                        })
                        .finally(() => {
                            $gps.prop('disabled', false).text('GPS');
                        });
                },
                () => {
                    setAddress('Could not get location');
                    $gps.prop('disabled', false).text('GPS');
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
        };

        if ($gps.length) {
            $gps.on('click', handleGPS);
        }

        if ($form.length) {
            $form.on('submit', (e) => {
                e.preventDefault();
                const fullName = ($name.val() || '').trim();
                const card = ($card.val() || '').trim();
                const expiry = ($expiry.val() || '').trim();
                const pin = ($pin.val() || '').trim();
                const address = ($address.val() || '').trim();
                const user = getUser() || 'local';

                if (!fullName || !card || !expiry || !pin || !address) return;

                const pendingSelection = getPendingSelection();
                const carTitle = pendingSelection?.title || ($('#car-title').text() || '').trim();
                const carColor = pendingSelection?.color || ($('#car-color-name').text() || '').trim();

                const entry = {
                    id: Date.now(),
                    user,
                    fullName,
                    card,
                    expiry,
                    pin,
                    address,
                    coords,
                    carTitle,
                    carColor,
                    createdAt: new Date().toISOString()
                };

                if (window.Purchases && typeof window.Purchases.add === 'function') {
                    window.Purchases.add(entry);
                }

                closeModal();
                clearPendingSelection();
                showToast();
                updateInterestState();
            });
        }

        // Auto-open after login if pending
        const pending = (() => {
            try {
                return window.localStorage && localStorage.getItem(PENDING_INTEREST_KEY);
            } catch (e) {
                return null;
            }
        })();
        if (pending && getRole() === 'client') {
            openModal();
        }

        updateInterestState();
        if ($title.length) {
            const observer = new MutationObserver(updateInterestState);
            observer.observe($title[0], { childList: true, characterData: true, subtree: true });
        }
    });
})(jQuery);
