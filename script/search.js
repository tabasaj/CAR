$(document).ready(() => {
    const $searchInput = $('#car-search');
    const $cards = $('.car-card');

    if (!$searchInput.length || !$cards.length) return;

    const filter = () => {
        const term = $searchInput.val().toString().toLowerCase().trim();
        $cards.each(function () {
            const $card = $(this);
            const title = $card.find('.car-card__title').text().toLowerCase();
            const badge = $card.find('.car-card__badge').text().toLowerCase();
            const tagline = $card.find('.car-card__text').text().toLowerCase();
            const match = title.includes(term) || badge.includes(term) || tagline.includes(term);
            $card.toggle(match || term === '');
        });
    };

    $searchInput.on('input', filter);
});
