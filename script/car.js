$(document).ready(() => {
    const modalRoot = document.getElementById('car-modal-root');
    const formModalRoot = document.getElementById('car-form-modal-root');
    const addButton = document.getElementById('car-add-btn');
    const carGrid = document.querySelector('.car-grid');
    let modalTemplate = '';
    let carFormTemplate = '';

    const cars = {
        grs: {
            id: 'grs',
            badge: 'GR-S',
            title: 'HILUX 2.8 GR-S 4x4 A/T',
            tagline: 'Performance-focused with GR Sport styling.',
            price: '₱2,480,000',
            transmission: '6 Speed AT',
            fuel: 'Diesel',
            seating: '5 seats',
            image: '../assets/hilux2.8_gr_red.webp',
            alt: 'Hilux 2.8 GR-S in Emotional Red',
            colors: [
                { label: 'Emotional Red', image: '../assets/hilux2.8_gr_red.webp',  alt: 'Hilux 2.8 GR-S in Emotional Red' },
                { label: 'Attitude Black', image: '../assets/hilux2.8_gr_black.webp', alt: 'Hilux 2.8 GR-S in Attitude Black' }
            ]
        },
        conquest: {
            id: 'conquest',
            badge: 'Conquest',
            title: 'HILUX 2.8 CONQUEST 4x4 A/T',
            tagline: 'Trail-ready utility with daily comfort.',
            price: '₱2,210,000',
            transmission: '6 Speed AT',
            fuel: 'Diesel',
            seating: '5 seats',
            image: '../assets/hilux2.8_con_red.webp',
            alt: 'Hilux 2.8 Conquest in Emotional Red',
            colors: [
                { label: 'Emotional Red', image: '../assets/hilux2.8_con_red.webp',  alt: 'Hilux 2.8 Conquest in Emotional Red' },
                { label: 'Platinum White Pearl', image: '../assets/hilux2.8_con_white.webp', alt: 'Hilux 2.8 Conquest in Platinum White Pearl' },
                { label: 'Attitude Black', image: '../assets/hilux2.8_con_black.webp', alt: 'Hilux 2.8 Conquest in Attitude Black' },
                { label: 'Bronze Metallic', image: '../assets/hilux2.8_con_bronzemetalic.webp', alt: 'Hilux 2.8 Conquest in Bronze Metallic' },
                { label: 'Silver Metallic', image: '../assets/hilux2.8_con_metalic.webp', alt: 'Hilux 2.8 Conquest in Silver Metallic' }
            ]
        },
        vibrant: {
            id: 'vibrant',
            badge: 'Vibrant',
            title: 'HILUX 2.8 VIBRANT 4x4 A/T',
            tagline: 'Vivid colorways with the same Hilux capability.',
            price: '₱2,300,000',
            transmission: '6 Speed AT',
            fuel: 'Diesel',
            seating: '5 seats',
            image: '../assets/hilux2.8_vibrant_blue.png',
            alt: 'Hilux 2.8 Vibrant in Vibrant Blue',
            colors: [
                { label: 'Vibrant Blue', image: '../assets/hilux2.8_vibrant_blue.png', alt: 'Hilux 2.8 Vibrant in Vibrant Blue' },
                { label: 'Vibrant Green', image: '../assets/hilux2.8_vibrant_green.png', alt: 'Hilux 2.8 Vibrant in Vibrant Green' },
                { label: 'Vibrant Orange', image: '../assets/hilux2.8_vibrant_orange.png', alt: 'Hilux 2.8 Vibrant in Vibrant Orange' }
            ]
        }
    };

    const storedCars = window.CarLocalStore?.load();
    if (storedCars && typeof storedCars === 'object') {
        Object.assign(cars, storedCars);
    }

    const colorState = new Map();
    const ADD_PLACEHOLDER =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox=\"0 0 180 180\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"%23f6f8fb\"/><stop offset=\"100%\" stop-color=\"%23eef1f6\"/></linearGradient></defs><circle cx=\"90\" cy=\"90\" r=\"82\" fill=\"none\" stroke=\"%23e5e7eb\" stroke-dasharray=\"6 8\" stroke-width=\"3\"/><g opacity=\"0.95\"><path d=\"M63 56c0-4.4 3.6-8 8-8h38l12 12v56c0 4.4-3.6 8-8 8H71c-4.4 0-8-3.6-8-8V56Z\" fill=\"url(%23g)\" stroke=\"%23e2e8f0\" stroke-width=\"2\"/><path d=\"M109 48v11c0 2.8 2.2 5 5 5h11\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M76 70h20M76 80h12\" stroke=\"%23cbd5e1\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><g transform=\"translate(58 100)\"><circle cx=\"32\" cy=\"32\" r=\"22\" fill=\"%2322c55e\" stroke=\"%23ffffff\" stroke-width=\"3\"/><path d=\"M32 20v24M20 32h24\" stroke=\"white\" stroke-width=\"4\" stroke-linecap=\"round\"/></g></svg>';
    const MODAL_FALLBACK = `<div class="car-modal">
    <button class="car-modal__close" type="button" aria-label="Close details" data-close-modal>&times;</button>
    <div class="car-modal__media">
        <button class="car-modal__color-nav car-modal__color-nav--prev is-hidden" type="button" aria-label="Previous color" data-modal-nav="prev">&lsaquo;</button>
        <img class="car-modal__image" src="" alt="">
        <button class="car-modal__color-nav car-modal__color-nav--next is-hidden" type="button" aria-label="Next color" data-modal-nav="next">&rsaquo;</button>
    </div>
    <div class="car-modal__body">
        <div class="car-modal__row car-modal__row--top">
            <input class="car-modal__title car-modal__input" data-field="title" type="text" placeholder="Title" value="">
            <input class="car-modal__badge car-modal__input" data-field="badge" type="text" placeholder="Badge" value="">
            <div class="car-modal__input-group">
                <span class="car-modal__prefix">₱</span>
                <input class="car-modal__price car-modal__input" data-field="price" data-number type="number" min="0" step="1" placeholder="Amount" value="0">
            </div>
        </div>
        <textarea class="car-modal__tagline car-modal__input car-modal__textarea" data-field="tagline" placeholder="Tagline"></textarea>
        <div class="car-modal__specs car-modal__specs--grid">
            <input class="car-modal__input" data-field="transmission" type="text" placeholder="Transmission" value="">
            <input class="car-modal__input" data-field="fuel" type="text" placeholder="Fuel type" value="">
            <input class="car-modal__input" data-field="seating" data-number type="number" min="1" step="1" placeholder="Seating capacity" value="5">
        </div>
        <div class="car-modal__colors">
            <div class="car-modal__colors-header">
                <h3>Colors</h3>
                <span class="car-modal__colors-help">Edit color labels</span>
            </div>
            <div class="car-modal__color-list" data-color-fields></div>
        </div>
    </div>
</div>`;

    const fetchModalTemplate = () => {
        if (modalTemplate) return Promise.resolve(modalTemplate);
        return fetch('../components/cardetailsmodal.html')
            .then((resp) => resp.text())
            .then((html) => {
                modalTemplate = html || MODAL_FALLBACK;
                return modalTemplate;
            })
            .catch(() => {
                modalTemplate = MODAL_FALLBACK;
                return modalTemplate;
            });
    };

    const fetchFormTemplate = () => {
        if (carFormTemplate) return Promise.resolve(carFormTemplate);
        return fetch('../components/carformmodal.html')
            .then((resp) => resp.text())
            .then((html) => {
                carFormTemplate = html || MODAL_FALLBACK;
                return carFormTemplate;
            })
            .catch(() => {
                carFormTemplate = MODAL_FALLBACK;
                return carFormTemplate;
            });
    };

    fetchModalTemplate();
    fetchFormTemplate();

    const closeModal = () => {
        modalRoot.classList.add('is-hidden');
        modalRoot.innerHTML = '';
    };

    const closeFormModal = () => {
        formModalRoot.classList.add('is-hidden');
        formModalRoot.innerHTML = '';
    };

    const persistCars = () => {
        if (window.CarLocalStore) {
            window.CarLocalStore.save(cars);
        }
    };

    const renderCard = (card, car) => {
        const idx = colorState.get(car.id) ?? 0;
        const color = car.colors?.[idx] || car.colors?.[0] || { image: car.image, alt: car.alt, label: '' };
        const img = card.querySelector('.car-card__image');
        if (img && color) {
            img.src = color.image;
            img.alt = color.alt || `${car.title} in ${color.label || ''}`.trim();
        }
        const badge = card.querySelector('.car-card__badge');
        const price = card.querySelector('.car-card__price');
        const title = card.querySelector('.car-card__title');
        const text = card.querySelector('.car-card__text');
        const specs = card.querySelectorAll('.car-card__specs span');
        if (badge) badge.textContent = car.badge || '';
        if (price) price.textContent = car.price || '';
        if (title) title.textContent = car.title || '';
        if (text) text.textContent = car.tagline || '';
        if (specs?.length >= 3) {
            specs[0].textContent = car.transmission || '';
            specs[1].textContent = car.fuel || '';
            specs[2].textContent = car.seating || '';
        }
    };

    const createCardElement = (car) => {
        const article = document.createElement('article');
        article.className = 'car-card';
        article.setAttribute('data-car-id', car.id);
        article.innerHTML = `
            <div class="car-card__actions">
                <button class="car-card__action car-card__action--menu" type="button" aria-label="Actions for ${car.badge}" data-car-id="${car.id}">
                    <span class="car-card__action-icon">◂</span>
                </button>
                <div class="car-card__menu" aria-hidden="true">
                    <button class="car-card__menu-item car-card__menu-view" type="button" data-car-id="${car.id}">
                        <img class="car-card__menu-icon" src="../assets/icons/pencil.svg" alt="" aria-hidden="true">
                    </button>
                    <button class="car-card__menu-item car-card__menu-delete" type="button" data-car-id="${car.id}">
                        <img class="car-card__menu-icon" src="../assets/icons/trash-2.svg" alt="" aria-hidden="true">
                    </button>
                </div>
            </div>
            <div class="car-card__media">
                <button class="car-card__color-nav car-card__color-nav--prev is-hidden" type="button" aria-label="Previous color" data-nav="prev">&lsaquo;</button>
                <img class="car-card__image" src="" alt="">
                <button class="car-card__color-nav car-card__color-nav--next is-hidden" type="button" aria-label="Next color" data-nav="next">&rsaquo;</button>
            </div>
            <div class="car-card__content">
                <div class="car-card__meta">
                    <span class="car-card__badge"></span>
                    <span class="car-card__price"></span>
                </div>
                <h2 class="car-card__title"></h2>
                <p class="car-card__text"></p>
                <div class="car-card__specs">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        renderCard(article, car);
        return article;
    };

    const openModal = (car) => {
        if (!modalTemplate) {
            modalTemplate = MODAL_FALLBACK;
        }
        modalRoot.innerHTML = modalTemplate;
        modalRoot.classList.remove('is-hidden');

        const imageEl = modalRoot.querySelector('.car-modal__image');
        const titleEl = modalRoot.querySelector('[data-field="title"]');
        const taglineEl = modalRoot.querySelector('[data-field="tagline"]');
        const priceEl = modalRoot.querySelector('[data-field="price"]');
        const badgeEl = modalRoot.querySelector('[data-field="badge"]');
        const transmissionEl = modalRoot.querySelector('[data-field="transmission"]');
        const fuelEl = modalRoot.querySelector('[data-field="fuel"]');
        const seatingEl = modalRoot.querySelector('[data-field="seating"]');
        const prevBtn = modalRoot.querySelector('[data-modal-nav="prev"]');
        const nextBtn = modalRoot.querySelector('[data-modal-nav="next"]');
        const colorFields = modalRoot.querySelector('[data-color-fields]');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        modalRoot.appendChild(fileInput);

        const modalColors = car.colors ? [...car.colors] : [];
        const getSlidesCount = () => modalColors.length + 1; // final slide is add-new
        const hasSlides = getSlidesCount() > 1;

        if (hasSlides) {
            prevBtn?.classList.remove('is-hidden');
            nextBtn?.classList.remove('is-hidden');
        }

        const renderColorFields = () => {
            if (!colorFields) return;
            colorFields.innerHTML = '';
            modalColors.forEach((color, idx) => {
                const item = document.createElement('div');
                item.className = 'car-modal__color-item';

                const label = document.createElement('div');
                label.className = 'car-modal__color-label';
                label.textContent = `Color ${idx + 1}`;

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'car-modal__color-input';
                input.value = color.label || '';
                input.setAttribute('data-color-index', String(idx));

                item.append(label, input);
                colorFields.appendChild(item);
            });
        };

        let modalIndex = Math.min(colorState.get(car.id) ?? 0, Math.max(modalColors.length - 1, 0));

        const setModalColor = (nextIndex) => {
            const total = getSlidesCount();
            const idx = Math.min(Math.max(nextIndex, 0), total - 1); // clamp to prevent looping
            const isAddSlide = idx === modalColors.length;
            const color = modalColors[idx];

            imageEl?.removeAttribute('data-add-trigger');
            imageEl?.classList.remove('is-add');

            if (imageEl) {
                if (isAddSlide) {
                    imageEl.src = ADD_PLACEHOLDER;
                    imageEl.alt = 'Add new image';
                    imageEl.classList.add('is-add');
                    imageEl.dataset.addTrigger = 'true';
                } else if (color) {
                    imageEl.src = color.image;
                    imageEl.alt = color.alt || `${car.title} in ${color.label}`;
                }
            }

            if (!isAddSlide) {
                colorState.set(car.id, idx);
            }

            modalIndex = idx;
        };

        const addNewColor = (src) => {
            const label = `New Color ${modalColors.length + 1}`;
            const newColor = { label, image: src, alt: `${car.title} ${label}` };
            modalColors.push(newColor);
            if (Array.isArray(car.colors)) {
                car.colors.push(newColor);
            }
            renderColorFields();
            setModalColor(modalColors.length - 1);
        };

        const setValue = (el, value, mode) => {
            if (!el) return;
            if ('value' in el) {
                if (mode === 'number') {
                    const cleaned = (value ?? '').toString().replace(/[^\d.]/g, '');
                    el.value = cleaned;
                } else {
                    el.value = value ?? '';
                }
            } else {
                el.textContent = value ?? '';
            }
        };

        if (imageEl && !modalColors.length) {
            imageEl.src = car.image;
            imageEl.alt = car.alt;
        }
        setValue(titleEl, car.title);
        setValue(taglineEl, car.tagline);
        setValue(priceEl, car.price, 'number');
        setValue(badgeEl, car.badge);
        setValue(transmissionEl, car.transmission);
        setValue(fuelEl, car.fuel);
        setValue(seatingEl, car.seating, 'number');

        renderColorFields();

        if (hasSlides) {
            setModalColor(modalIndex);
            prevBtn?.addEventListener('click', () => setModalColor(modalIndex - 1));
            nextBtn?.addEventListener('click', () => setModalColor(modalIndex + 1));
        } else if (imageEl) {
            imageEl.src = car.image;
            imageEl.alt = car.alt;
        }

        const handleAddClick = () => {
            fileInput.value = '';
            fileInput.click();
        };

        if (imageEl) {
            imageEl.addEventListener('click', () => {
                if (imageEl.dataset.addTrigger === 'true') {
                    handleAddClick();
                }
            });
        }

        fileInput.addEventListener('change', () => {
            const [file] = fileInput.files || [];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const src = e.target?.result;
                if (typeof src === 'string') addNewColor(src);
            };
            reader.readAsDataURL(file);
        });

        const saveButton = modalRoot.querySelector('[data-save-modal]');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const updated = {
                    title: titleEl?.value || car.title,
                    badge: badgeEl?.value || car.badge,
                    price: priceEl?.value || car.price,
                    tagline: taglineEl?.value || car.tagline,
                    transmission: transmissionEl?.value || car.transmission,
                    fuel: fuelEl?.value || car.fuel,
                    seating: seatingEl?.value || car.seating,
                    colors: modalColors
                };
                // Simple persistence: update in-memory car object
                Object.assign(car, updated);
                persistCars();
                closeModal();
            });
        }

        const numericInputs = modalRoot.querySelectorAll('[data-number]');
        numericInputs.forEach((input) => {
            input.addEventListener('input', () => {
                const cleaned = input.value.replace(/[^\d.]/g, '');
                input.value = cleaned;
            });
        });

        const closeButtons = modalRoot.querySelectorAll('[data-close-modal]');
        closeButtons.forEach((btn) => btn.addEventListener('click', closeModal, { once: true }));
        modalRoot.addEventListener(
            'click',
            (e) => {
                if (e.target === modalRoot) closeModal();
            },
            { once: true }
        );
    };

    const openFormModal = () => {
        if (!carFormTemplate) {
            carFormTemplate = MODAL_FALLBACK;
        }
        formModalRoot.innerHTML = carFormTemplate;
        formModalRoot.classList.remove('is-hidden');

        const imageEl = formModalRoot.querySelector('.car-modal__image');
        const titleEl = formModalRoot.querySelector('[data-field="title"]');
        const badgeEl = formModalRoot.querySelector('[data-field="badge"]');
        const priceEl = formModalRoot.querySelector('[data-field="price"]');
        const taglineEl = formModalRoot.querySelector('[data-field="tagline"]');
        const transmissionEl = formModalRoot.querySelector('[data-field="transmission"]');
        const fuelEl = formModalRoot.querySelector('[data-field="fuel"]');
        const seatingEl = formModalRoot.querySelector('[data-field="seating"]');
        const colorInput = formModalRoot.querySelector('[data-color-index]');
        const addCarBtn = formModalRoot.querySelector('[data-add-car]');
        const closeButtons = formModalRoot.querySelectorAll('[data-close-modal]');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        formModalRoot.appendChild(fileInput);

        let imageSrc = ADD_PLACEHOLDER;
        if (imageEl) {
            imageEl.src = ADD_PLACEHOLDER;
            imageEl.classList.add('is-add');
            imageEl.dataset.addTrigger = 'true';
            imageEl.addEventListener('click', () => fileInput.click());
        }

        const prevBtn = formModalRoot.querySelector('[data-modal-nav=\"prev\"]');
        const nextBtn = formModalRoot.querySelector('[data-modal-nav=\"next\"]');
        const formColors = [];
        let formIndex = 0;

        const renderFormColors = () => {
            const colorList = formModalRoot.querySelector('[data-color-fields]');
            if (!colorList) return;
            colorList.innerHTML = '';
            formColors.forEach((color, idx) => {
                const item = document.createElement('div');
                item.className = 'car-modal__color-item';

                const label = document.createElement('div');
                label.className = 'car-modal__color-label';
                label.textContent = `Color ${idx + 1}`;

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'car-modal__color-input';
                input.value = color.label || '';
                input.setAttribute('data-color-index', String(idx));

                input.addEventListener('input', () => {
                    formColors[idx].label = input.value;
                    formColors[idx].alt = `${titleEl?.value || 'New Car'} in ${input.value}`;
                });

                item.append(label, input);
                colorList.appendChild(item);
            });
        };

        const updateNavVisibility = () => {
            const hasSlides = formColors.length + 1 > 1;
            if (hasSlides) {
                prevBtn?.classList.remove('is-hidden');
                nextBtn?.classList.remove('is-hidden');
            } else {
                prevBtn?.classList.add('is-hidden');
                nextBtn?.classList.add('is-hidden');
            }
        };

        const setFormSlide = (nextIndex) => {
            const total = formColors.length + 1;
            const idx = Math.min(Math.max(nextIndex, 0), total - 1);
            const isAddSlide = idx === formColors.length;
            const color = formColors[idx];

            if (imageEl) {
                if (isAddSlide) {
                    imageEl.src = ADD_PLACEHOLDER;
                    imageEl.alt = 'Add new image';
                    imageEl.classList.add('is-add');
                    imageEl.dataset.addTrigger = 'true';
                } else if (color) {
                    imageEl.src = color.image;
                    imageEl.alt = color.alt;
                    imageEl.classList.remove('is-add');
                    delete imageEl.dataset.addTrigger;
                }
            }
            formIndex = idx;
            updateNavVisibility();
        };

        if (prevBtn) prevBtn.addEventListener('click', () => setFormSlide(formIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => setFormSlide(formIndex + 1));
        updateNavVisibility();

        const pushFormImage = (src) => {
            const label = colorInput?.value || `Custom Color ${formColors.length + 1}`;
            const alt = `New car in ${label}`;
            formColors.push({ label, image: src, alt });
            if (imageEl) {
                imageEl.src = src;
                imageEl.classList.remove('is-add');
            }
            updateNavVisibility();
            setFormSlide(formColors.length - 1);
            renderFormColors();
        };

        fileInput.addEventListener('change', () => {
            const [file] = fileInput.files || [];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const src = e.target?.result;
                if (typeof src === 'string') {
                    imageSrc = src;
                    pushFormImage(src);
                }
            };
            reader.readAsDataURL(file);
        });

        const saveNewCar = () => {
            const id = `car-${Date.now()}`;
            const title = titleEl?.value || 'New Car';
            const badge = badgeEl?.value || 'Badge';
            const priceValue = priceEl?.value ? priceEl.value.replace(/[^\d.]/g, '') : '0';
            const price = `₱${priceValue}`;
            const tagline = taglineEl?.value || '';
            const transmission = transmissionEl?.value || '';
            const fuel = fuelEl?.value || '';
            const seating = seatingEl?.value || '';
            const colorLabel = colorInput?.value || 'Custom Color';

            const newCar = {
                id,
                badge,
                title,
                tagline,
                price,
                transmission,
                fuel,
                seating,
                image: imageSrc,
                alt: `${title} in ${colorLabel}`,
                colors: formColors.length
                    ? formColors
                    : [{ label: colorLabel, image: imageSrc, alt: `${title} in ${colorLabel}` }]
            };

            cars[id] = newCar;
            const cardEl = createCardElement(newCar);
            carGrid.appendChild(cardEl);
            attachCard(cardEl, newCar);
            persistCars();
            closeFormModal();
        };

        if (addCarBtn) addCarBtn.addEventListener('click', saveNewCar);
        closeButtons.forEach((btn) => btn.addEventListener('click', closeFormModal, { once: true }));
        formModalRoot.addEventListener(
            'click',
            (e) => {
                if (e.target === formModalRoot) closeFormModal();
            },
            { once: true }
        );
    };
    const setCardColor = (card, car, nextIndex) => {
        const colors = car.colors || [];
        if (!colors.length) return;
        const index = ((nextIndex % colors.length) + colors.length) % colors.length;
        const color = colors[index];
        const img = card.querySelector('.car-card__image');
        if (img && color) {
            img.src = color.image;
            img.alt = color.alt || `${car.title} in ${color.label}`;
        }
        colorState.set(car.id, index);
    };

    const initColorNav = (card) => {
        const id = card.getAttribute('data-car-id');
        const car = cars[id];
        if (!car || !car.colors || car.colors.length < 2) return;

        const prevBtn = card.querySelector('[data-nav="prev"]');
        const nextBtn = card.querySelector('[data-nav="next"]');
        [prevBtn, nextBtn].forEach((btn) => btn && btn.classList.remove('is-hidden'));

        const current = colorState.get(car.id) ?? 0;
        setCardColor(card, car, current);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const idx = colorState.get(car.id) ?? 0;
                setCardColor(card, car, idx - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const idx = colorState.get(car.id) ?? 0;
                setCardColor(card, car, idx + 1);
            });
        }
    };

    const attachCard = (card, car) => {
        if (!car) return;
        const id = car.id;
        colorState.set(id, 0);
        setCardColor(card, car, 0);
        renderCard(card, car);
        initColorNav(card);
        const actionBtn = card.querySelector('.car-card__action--menu');
        const menu = card.querySelector('.car-card__menu');
        const viewBtn = card.querySelector('.car-card__menu-view');
        const deleteBtn = card.querySelector('.car-card__menu-delete');

        const closeMenu = () => menu?.classList.remove('is-open');

        if (actionBtn && menu) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('is-open');
            });
            document.addEventListener('click', closeMenu);
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                closeMenu();
                const selectedIndex = colorState.get(id) ?? 0;
                const selectedColor = car.colors?.[selectedIndex];
                const payload = selectedColor
                    ? { ...car, image: selectedColor.image, alt: selectedColor.alt || `${car.title} in ${selectedColor.label}` }
                    : car;
                if (modalTemplate) {
                    openModal(payload);
                } else {
                    fetchModalTemplate().then(() => {
                        if (modalTemplate) openModal(payload);
                    });
                }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                closeMenu();
                card.remove();
                delete cars[id];
                colorState.delete(id);
                persistCars();
            });
        }
    };

    // Re-render cards from data (localStorage aware)
    if (carGrid) {
        carGrid.innerHTML = '';
        Object.values(cars).forEach((car) => {
            const card = createCardElement(car);
            carGrid.appendChild(card);
            attachCard(card, car);
        });
    }

    if (addButton) {
        addButton.addEventListener('click', () => {
            if (carFormTemplate) {
                openFormModal();
            } else {
                fetchFormTemplate().then(openFormModal);
            }
        });
    }
});
