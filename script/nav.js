
function initMenuNavigation() {
    const $navLinks = $('#nav-list a[data-page]');
    const $logoutOpen = $('#nav-logout');
    const ROLE_KEY = 'app-role';

    const getRole = () => {
        try {
            return (window.localStorage && localStorage.getItem(ROLE_KEY)) || '';
        } catch (e) {
            return '';
        }
    };

    const applyRoleVisibility = () => {
        const role = getRole();
        const $carItem = $('#nav-car').closest('li');
        const $clientsItem = $('#nav-clients').closest('li');
        const $clientsLink = $('#nav-clients');
        const $logoutItem = $('#nav-logout').closest('li');
        const $authItem = $('#nav-auth').closest('li');

        if (!role) {
            $carItem.addClass('is-hidden');
            $clientsItem.addClass('is-hidden');
            $clientsLink.text('Clients');
            $logoutItem.addClass('is-hidden');
            $authItem.removeClass('is-hidden');
        } else if (role === 'client') {
            $carItem.addClass('is-hidden');
            $clientsItem.removeClass('is-hidden');
            $clientsLink.text('My Purchase');
            $logoutItem.removeClass('is-hidden');
            $authItem.addClass('is-hidden');
        } else {
            $carItem.removeClass('is-hidden');
            $clientsItem.removeClass('is-hidden');
            $clientsLink.text('Clients');
            $logoutItem.removeClass('is-hidden');
            $authItem.addClass('is-hidden');
        }
    };

    applyRoleVisibility();
    window.addEventListener('storage', applyRoleVisibility);

    $navLinks.on('click', function (e) {
        e.preventDefault();

        $navLinks.removeClass('active');
        $(this).addClass('active');

        var page = $(this).attr('data-page');
        window.parent.postMessage({ page: page }, '*');
    });

    if ($logoutOpen.length) {
        $logoutOpen.on('click', function (e) {
            e.preventDefault();
            window.parent.postMessage({ logout: true }, '*');
        });
    }
}
function initMainNavigation() {
    const $logoutModal = $('#logout-modal');
    const $logoutCancel = $('#logout-cancel');
    const $logoutConfirm = $('#logout-confirm');
    const $frame = $('#content-frame');
    const ROLE_KEY = 'app-role';
    const USER_KEY = 'app-user-current';
    const PENDING_INTEREST_KEY = 'pending-interest';
    const $menuRow = $('.menu-row');

    const getRole = () => {
        try {
            return (window.localStorage && localStorage.getItem(ROLE_KEY)) || '';
        } catch (e) {
            return '';
        }
    };

    const isAuthPage = (src) => src && src.indexOf('loginsignupform') !== -1;
    const setNavVisible = (visible) => {
        if (!$menuRow.length) return;
        $menuRow.toggleClass('is-hidden', !visible);
    };

    const navigateTo = (page) => {
        if (!$frame.length || !page) return;
        const target = page.endsWith('.html') ? page : `components/${page}.html`;
        $frame.attr('src', target);
        setNavVisible(!isAuthPage(target));
    };

    const closeLogoutModal = () => $logoutModal.addClass('is-hidden');
    const openLogoutModal = () => $logoutModal.removeClass('is-hidden');

    $(window).on('message', function (event) {
        const data = event.originalEvent.data || {};
        const page = data.page;
        const role = data.role || getRole();

        if (page) {
            navigateTo(page);
        }

        if (data.requireAuth) {
            try {
                window.localStorage && localStorage.setItem(PENDING_INTEREST_KEY, '1');
            } catch (e) {
                // ignore storage errors
            }
            navigateTo('components/loginsignupform.html');
        }

        if (data.logout) {
            openLogoutModal();
        }

        if (data.loginSuccess) {
            // already stored role in auth form; ensure nav is back and go to home
            navigateTo('home');
        }
    });

    if ($logoutCancel.length) {
        $logoutCancel.on('click', closeLogoutModal);
    }

    if ($logoutConfirm.length) {
        $logoutConfirm.on('click', function () {
            try {
                window.localStorage && localStorage.removeItem(ROLE_KEY);
                window.localStorage && localStorage.removeItem(USER_KEY);
            } catch (e) {
                // ignore storage errors
            }
            closeLogoutModal();
            navigateTo('components/loginsignupform.html');
        });
    }

    // Initial load handling
    const storedRole = getRole();
    const initialSrc = $frame.attr('src') || '';
    if (storedRole) {
        navigateTo('home');
    } else {
        setNavVisible(!isAuthPage(initialSrc));
    }
}
