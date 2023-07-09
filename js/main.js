'use strict';

AOS.init({
    offset: 100,
    once: true,
});


const burger = document.querySelector('.burger');
const menu = document.querySelector('.header__menu');
const menuLink = document.querySelectorAll('.menu__link')

burger.addEventListener('click', () => {
    burger.classList.toggle('burger--active');
    menu.classList.toggle('header__menu--active');
});


menuLink.forEach(function (item, idx) {
    item.addEventListener('click', function () {
        burger.classList.remove('burger--active');
        menu.classList.remove('header__menu--active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', scrollBehav)
});
function scrollBehav(e) {
    e.preventDefault();
    scrollToId(this.hash);
}
function scrollToId(id) {
    let section = document.querySelector(id);
    let pos = section.offsetTop - 80
    if ("scrollBehavior" in document.body.style) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: "smooth"
        })
    } else {
        window.scrollTo(0, pos);
    }
}


const cartBtn = document.querySelector('.cart__btn');
const miniCart = document.querySelector('.mini-cart');

cartBtn.addEventListener('click', () => {
    miniCart.classList.toggle('mini-cart--visible');
});

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.classList.contains('cart__btn')) {
        miniCart.classList.remove('mini-cart--visible');
    }
});

const accordions = document.querySelectorAll('.faq-accordion');

accordions.forEach(el => {
    el.addEventListener('click', (e) => {
        const self = e.currentTarget;
        const control = self.querySelector('.faq-accordion__control');
        const content = self.querySelector('.faq-accordion__content');

        self.classList.toggle('open');

        // если открыт аккордеон
        if (self.classList.contains('open')) {
            control.setAttribute('aria-expanded', true);
            content.setAttribute('aria-hidden', false);
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            control.setAttribute('aria-expanded', false);
            content.setAttribute('aria-hidden', true);
            content.style.maxHeight = null;
        }
    });
});


ymaps.ready(init);
function init() {
    // Создание карты.
    const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 7
    });
}


const catalogList = document.querySelector('.catalog__list');
const catalogMore = document.querySelector('.catalog__more');
const prodModal = document.querySelector('[data-graph-target="prod-modal"]');
const prodModalSlider = prodModal.querySelector('.modal-slider .swiper-wrapper');
const prodModalPreview = prodModal.querySelector('.modal-preview');
const prodModalInfo = prodModal.querySelector('.modal-info__wrapper');
const prodModalDescr = prodModal.querySelector('.prod-bottom__descr');
const prodModalFeatures = prodModal.querySelector('.prod-bottom__feature');
const prodModalVideo = prodModal.querySelector('.prod-modal__video');

let prodQuantity = 6;
let dataLength = null;
let modal = 0;

const normalPrice = (str) => {
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const prodSlider = new Swiper('.modal-slider__container', {
    slidesPerView: 1,
    spaceBetween: 20,
});

if (catalogList) {
    const loadProducts = (quantity = 5) => {
        fetch('https://vouqreel.github.io/SnickShop-JSON/data.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);

                dataLength = data.length;

                catalogList.innerHTML = '';

                for (let i = 0; i < dataLength; i++) {
                    if (i < quantity) {
                        let item = data[i];
                        console.log(item)

                        catalogList.innerHTML += `

                            <li class="catalog__item" data-aos="fade-right" data-aos-duration="300">
                                <article class="catalog__product">
                                    <div class="product__image">
                                        <img src="${item.mainImage}" alt="${item.title}">
                                        <div class="product__actions">
                                            <button class="btn-reset product__button" data-id="${item.id}" aria-label="Показать информацию о товаре" data-graph-path="prod-modal">
                                                <svg>
                                                    <use xlink:href="img/sprite.svg#eye"></use>
                                                </svg>
                                            </button>
                                            <button class="btn-reset product__button add-to-cart-btn" data-id="${item.id}" aria-label="Добавить товар в корзину">
                                                <svg>
                                                    <use xlink:href="img/sprite.svg#cart"></use>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 class="product__title">
                                        ${item.title}
                                    </h3>
                                    <span class="product__price">
                                        ${normalPrice(item.price)} р
                                    </span>
                                </article>
                            </li>
                        `;
                    }
                }

                cartLogic();

                modal = new GraphModal({
                    isOpen: (modal) => {
                        if (modal.modalContainer.classList.contains('prod-modal')) {
                            const openBtnId = modal.previousActiveElement.dataset.id;

                            loadModalData(openBtnId);
                            prodSlider.update();
                        }
                    },
                });
            });
    };
    loadProducts(prodQuantity);

    const loadModalData = (id = 1) => {
        fetch('https://vouqreel.github.io/SnickShop-JSON/data.json')
            .then((response) => {
                return response.json();
            })

            .then((data) => {

                prodModalInfo.innerHTML = '';
                prodModalDescr.textContent = '';
                prodModalSlider.innerHTML = '';
                prodModalPreview.innerHTML = '';
                prodModalFeatures.innerHTML = '';
                prodModalVideo.innerHTML = '';

                for (let dataItem of data) {
                    if (dataItem.id == id) {
                        console.log(dataItem);

                        const slides = dataItem.gallery.map(image => {
                            return `
                                <div class="swiper-slide">
                                    <img src="${image}" alt="">
                                </div>
                            `;
                        });

                        const preview = dataItem.gallery.map((image, idx) => {
                            return `
                                <div class="modal-preview__item" tabindex="0" data-index="${idx}">
                                    <img src="${image}" alt="">
                                </div>
                            `;
                        });

                        const sizes = dataItem.sizes.map((size, idx) => {
                            return `
                                <li class="modal-sizes__item">
                                    <button class="modal-sizes__button btn-reset">
                                        ${size}
                                    </button>
                                </li>
                            `;
                        });

                        prodModalSlider.innerHTML = slides.join('');
                        prodModalPreview.innerHTML = preview.join('');

                        prodModalInfo.innerHTML = `

                            <h3 class="modal-info__title">
                                ${dataItem.title}
                            </h3>
                            <div class="modal-info__rate">
                                <img src="img/star.svg" alt="Рейтинг 5 из 5">
                                <img src="img/star.svg" alt="#">
                                <img src="img/star.svg" alt="#">
                                <img src="img/star.svg" alt="#">
                                <img src="img/star.svg" alt="#">
                            </div>
                            <div class="modal-info__sizes">
                                <span class="modal-info__subtitle">
                                    Выберите размер
                                </span>
                                <ul class="modal-info__sizes-list modal-sizes list-reset">
                                    ${sizes.join('')}
                                </ul>
                            </div>
                            <div class="modal-info__price">
                                <span class="modal-info__current-price">
                                    ${dataItem.price} р
                                </span>
                                <span class="modal-info__old-price">
                                    ${dataItem.oldPrice ? dataItem.oldPrice + 'р' : ''}
                                </span >
                            </div >
                        `;

                        prodModalDescr.textContent = dataItem.description;

                        let featuresItem = '';
                        Object.keys(dataItem.chars).forEach(function eachKey(key) {
                            featuresItem += `<p class="prod-bottom-feature__item">${key}: ${dataItem.chars[key]}</p>`
                        });

                        prodModalFeatures.innerHTML = featuresItem;

                        if (dataItem.video) {
                            prodModalVideo.style.display = 'block';
                            prodModalVideo.innerHTML = `
                                <iframe src="${dataItem.video}"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                                gyroscope; picture-in-picture" allowfullscreen></iframe>
                            `;
                        } else {
                            prodModalVideo.style.display = 'none';
                        }
                    }
                }
            })
            .then(() => {
                prodSlider.update();
                document.querySelectorAll('.modal-preview__item').forEach(el => {
                    el.addEventListener('click', (e) => {
                        const idx = parseInt(e.currentTarget.dataset.index);
                        prodSlider.slideTo(idx);
                    });
                });
            });
    };

    catalogMore.addEventListener('click', (e) => {
        prodQuantity = prodQuantity + 3;
        loadProducts(prodQuantity);

        if (prodQuantity > + dataLength) {
            catalogMore.style.display = 'none';
        } else {
            catalogMore.style.display = 'block'
        }
    });
}

let price = 0;
const miniCartList = document.querySelector('.mini-cart__list');
const fullPrice = document.querySelector('.mini-cart__sum');
const cartCount = document.querySelector('.cart__count');

const priceWithoutSpaces = (str) => {
    return str.replace(/\s/g, '');
};

const plusFullPrice = (currentPrice) => {
    return price += currentPrice;
};

const minusFullPrice = (currentPrice) => {
    return price -= currentPrice;
};


const printFullPrice = () => {
    fullPrice.textContent = `${normalPrice(price)} р`;
}

const printQuantity = (num) => {
    cartCount.textContent = num;
}

const loadCartData = (id = 1) => {
    fetch('https://vouqreel.github.io/SnickShop-JSON/data.json')
        .then((response) => {
            return response.json();
        })

        .then((data) => {
            for (let dataItem of data) {
                if (dataItem.id == id) {
                    console.log(dataItem);
                    miniCartList.insertAdjacentHTML('afterbegin', `
                    <li class="mini-cart__item" data-id="${dataItem.id}">
                        <article class="mini-cart__product mini-product">
                            <div class="mini-product__image">
                                <img src="${dataItem.mainImage}" alt="${dataItem.title}">
                                                    </div>
                                <div class="mini-product__content">
                                    <div class="mini-product__text">
                                        <h3 class="mini-product__title">
                                            ${dataItem.title}
                                        </h3>
                                        <span class="mini-product__price">
                                            ${dataItem.price} р
                                        </span>
                                    </div>
                                    <button class="btn-reset mini-product__delete" aria-label="Убрать товар">
                                        Удалить
                                    </button>
                                </div>
                        </article>
                    </li>
                    `);
                    return dataItem;
                }
            }
        })

        .then((item) => {
            plusFullPrice(item.price);
            printFullPrice();
            let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;
            if (num > 0) {
                cartCount.classList.add('cart__count--visible');
            }
            printQuantity(num);
        })
};

const cartLogic = () => {
    const productBtn = document.querySelectorAll('.add-to-cart-btn');

    productBtn.forEach(el => {
        el.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            loadCartData(id);

            document.querySelector('.cart__btn').classList.remove('cart__btn--inactive');


            e.currentTarget.classList.add('product__button--disabled');
        });
    });

    miniCartList.addEventListener('click', (e) => {
        if (e.target.classList.contains('mini-product__delete')) {
            const self = e.target;
            const parent = self.closest('.mini-cart__item');
            const price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));
            const id = parent.dataset.id;

            console.log(document.querySelector(`.product__button[data-id="${id}"]`))

            document.querySelector(`.add-to-cart-btn[data-id="${id}"]`).classList.remove('product__button--disabled');

            parent.remove();

            minusFullPrice(price);
            printFullPrice();

            let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;

            if (num == 0) {
                cartCount.classList.remove('cart__count--visible');
                miniCart.classList.remove('mini-cart--visible');
                document.querySelector('.cart__btn').classList.add('cart__btn--inactive');
            }

            printQuantity(num);
        }
    });
};

const openOrderModal = document.querySelector('.mini-cart__order');
const orderModalList = document.querySelector('.cart-modal-order__list');
const orderModalQuantity = document.querySelector('.cart-modal-order__quantity span');
const orderModalSum = document.querySelector('.cart-modal-order__sum span');
const orderModalShow = document.querySelector('.cart-modal-order__show');

openOrderModal.addEventListener('click', () => {
    const productsHtml = document.querySelector('.mini-cart__list').innerHTML;
    orderModalList.innerHTML = productsHtml;

    orderModalQuantity.textContent = `${document.querySelectorAll('.mini-cart__list .mini-cart__item').length}`;
    orderModalSum.textContent = fullPrice.textContent;
});

orderModalShow.addEventListener('click', () => {
    orderModalList.classList.toggle('cart-modal-order__list--visible');
    orderModalShow.classList.toggle('cart-modal-order__show--active');
});

orderModalList.addEventListener('click', (e) => {
    if (e.target.classList.contains('mini-product__delete')) {
        const self = e.target;
        const parent = self.closest('.mini-cart__item');
        const price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));
        const id = parent.dataset.id;

        console.log(document.querySelector(`.product__btn[data-id="${id}"]`))

        document.querySelector(`.add-to-cart-btn[data-id="${id}"]`).classList.remove('product__btn--disabled');

        parent.style.display = 'none';

        setTimeout(() => {
            parent.remove();

        }, 100);

        document.querySelector(`.mini-cart__item[data-id="${id}"]`).remove();


        minusFullPrice(price);
        printFullPrice();

        setTimeout(() => {
            let num = document.querySelectorAll('.cart-modal-order__list .mini-cart__item').length;
            console.log(num)

            if (num == 0) {
                cartCount.classList.remove('cart__count--visible');
                miniCart.classList.remove('mini-cart--visible');
                document.querySelector('.cart__btn').classList.add('cart__btn--inactive');

                modal.close();
            }

            printQuantity(num);
        }, 100);
    }
});


const quizData = [{
    number: 1,
    title: "Какой тип кроссовок рассматриваете?",
    answer_alias: "type",
    answers: [{
        answer_title: "Скейтерские кроссовки",
        type: "checkbox",
        image: "img/quiz-image-2.png"
    },
    {
        answer_title: "Баскетбольные кроссовки",
        type: "checkbox",
        image: "img/quiz-image-3.png"
    },
    {
        answer_title: "Беговые кроссовки",
        type: "checkbox",
        image: "img/quiz-image-4.png"
    },
    {
        answer_title: "Повседневные кроссовки",
        type: "checkbox",
        image: "img/quiz-image-5.png"
    },
    {
        answer_title: "Кроссовки для фитнеса",
        type: "checkbox",
        image: "img/quiz-image-6.png"
    }
    ]
},
{
    number: 2,
    title: "Какой размер вам подойдет?",
    answer_alias: "size",
    answers: [{
        answer_title: "Менее 36",
        type: "radio"
    },
    {
        answer_title: "36-38",
        type: "radio"
    },
    {
        answer_title: "39-41",
        type: "radio"
    },
    {
        answer_title: "42-44",
        type: "radio"
    },
    {
        answer_title: "45 и больше",
        type: "radio"
    }
    ]
},
{
    number: 3,
    title: "Уточните какие-либо моменты",
    answer_alias: "message",
    answers: [{
        answer_title: "Введите сообщение",
        type: "textarea"
    },
    ]
}
];

const quizTemplate = (data = [], dataLength = 0, options) => {
    const { number, title } = data;
    const { nextBtnText } = options;
    const answers = data.answers.map(item => {

        if (item.type === 'checkbox') {
            return `
            <li class="quiz-question__item" data-aos="fade-right" data-aos-duration="300">
                <div class="quiz-question__image">
                    <img src="${item.image}" alt="Тип кроссовок">
                </div>
                <label class="custom-checkbox quiz-question__label">
                    <input type="${item.type}" class="custom-checkbox__field quiz-question__answer" data-valid="false" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
                    <span class="custom-checkbox__content">${item.answer_title}</span>
                </label>
            </li>
        `;
        } else if (item.type === 'textarea') {
            return `
            <label class="quiz-question__label">
                <textarea placeholder="${item.answer_title}" class="quiz-question__message"></textarea>
            </label>
        `;
        }

        else if (item.type === 'radio') {
            return `
            <li class="quiz-question__item">
                <label class="custom-checkbox quiz-question__label">
                    <input type="${item.type}" class="custom-checkbox__field quiz-question__answer" data-valid="false" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
                    <span class="custom-checkbox__content">${item.answer_title}</span>
                </label>
            </li>
        `;
        } else {
            return `
            <label class="quiz-question__label">
                <input type="${item.type}" data-valid="false" class="quiz-question__answer" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
                <span>${item.answer_title}</span>
            </label>
        `;
        }

    });

    return `
        <div class="quiz-question">
            <h3 class="quiz-question__title">${title}</h3>
            <ul class="quiz-question__answers list-reset">
                ${answers.join('')}
            </ul>
            <div class="quiz-bottom">
                <div class="quiz-question__count">${number} из ${dataLength}</div>
                <button type="button" class="btn btn-reset btn--secondary quiz-question__btn" data-next-btn>${nextBtnText}</button>
            </div>
        </div>
        `
};

class Quiz {
    constructor(selector, data, options) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.data = data;
        this.counter = 0;
        this.dataLength = this.data.length;
        this.resultArray = [];
        this.tmp = {};
        this.init()
        this.events()
    }

    init() {
        console.log('init!');
        this.$el.innerHTML = quizTemplate(this.data[this.counter], this.dataLength, this.options);
    }

    nextQuestion() {
        console.log('next question!');

        if (this.valid()) {
            if (this.counter + 1 < this.dataLength) {
                this.counter++;
                this.$el.innerHTML = quizTemplate(this.data[this.counter], this.dataLength, this.options);

                if ((this.counter + 1 == this.dataLength)) {
                    document.querySelector('.quiz-question__answers').style.display = 'block';
                }
            } else {
                console.log('А все! конец!');
                document.querySelector('.quiz-questions').style.display = 'none';
                document.querySelector('.last-question').style.display = 'block';
                document.querySelector('.quiz__title').textContent = 'Ваша подборка готова!';
                document.querySelector('.quiz__descr').textContent = 'Оставьте свои контактные данные, чтобы бы мы могли отправить  подготовленный для вас каталог';
            }
        } else {
            console.log('Не валидно!')
        }
    }

    events() {
        console.log('events!')
        this.$el.addEventListener('click', (e) => {
            if (e.target == document.querySelector('[data-next-btn]')) {
                this.addToSend();
                this.nextQuestion();
            }

            if (e.target == document.querySelector('[data-send]')) {
                this.send();
            }
        });

        this.$el.addEventListener('change', (e) => {
            if (e.target.tagName == 'INPUT') {
                if (e.target.type !== 'checkbox' && e.target.type !== 'radio') {
                    let elements = this.$el.querySelectorAll('input')

                    elements.forEach(el => {
                        el.checked = false;
                    });
                }
                this.tmp = this.serialize(this.$el);
            }
        });
    }

    valid() {
        let isValid = false;

        let textarea = this.$el.querySelector('textarea');

        if (textarea) {
            if (textarea.value.length > 0) {
                isValid = true;
                return isValid;
            }
        }


        let elements = this.$el.querySelectorAll('input');
        elements.forEach(el => {
            switch (el.nodeName) {
                case 'INPUT':
                    switch (el.type) {
                        case 'text':
                            if (el.value) {
                                isValid = true;
                            } else {
                                el.classList.add('error')
                            }
                        case 'checkbox':
                            if (el.checked) {
                                isValid = true;
                            } else {
                                el.classList.add('error')
                            }
                        case 'radio':
                            if (el.checked) {
                                isValid = true;
                            } else {
                                el.classList.add('error')
                            }
                    }
            }
        });

        return isValid;
    }

    addToSend() {
        this.resultArray.push(this.tmp)
    }

    send() {
        if (this.valid()) {
            const formData = new FormData();

            for (let item of this.resultArray) {
                for (let obj in item) {
                    formData.append(obj, item[obj].substring(0, item[obj].length - 1));
                }
            }

            const response = fetch("mail.php", {
                method: 'POST',
                body: formData
            });
        }
    }

    serialize(form) {
        let field, s = {};
        let valueString = '';
        if (typeof form == 'object' && form.nodeName == "FORM") {
            let len = form.elements.length;
            for (let i = 0; i < len; i++) {
                field = form.elements[i];

                if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                            if (field.options[j].selected)
                                s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                        }
                    } else if ((field.type != 'checkbox' && field.type != 'radio' && field.value) || field.checked) {
                        valueString += field.value + ',';

                        s[field.name] = valueString;


                    }
                }
            }
        }
        return s
    }
}

window.quiz = new Quiz('.quiz-form .quiz-questions', quizData, {
    nextBtnText: "Следующий шаг",
    sendBtnText: "Отправить",
});


const rangeSlider = document.getElementById('range-slider');

if (rangeSlider) {
    noUiSlider.create(rangeSlider, {
        start: [6990, 24990],
        connect: true,
        step: 1,
        range: {
            'min': [6990],
            'max': [24990]
        }
    });

    const input0 = document.getElementById('input-0');
    const input1 = document.getElementById('input-1');
    const inputs = [input0, input1];

    rangeSlider.noUiSlider.on('update', function (values, handle) {
        inputs[handle].value = Math.round(values[handle]);
    });

    const setRangeSlider = (i, value) => {
        let arr = [null, null];
        arr[i] = value;

        rangeSlider.noUiSlider.set(arr);
    };

    inputs.forEach((el, index) => {
        el.addEventListener('change', (e) => {
            setRangeSlider(index, e.currentTarget.value);
        });
    });
}
