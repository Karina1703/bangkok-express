import createElement from '/src/assets/lib/create-element.js';

export default class Carousel {

  constructor(slides) {
    this.slides = slides;
    this.create()
    this.initCarousel()
    this.addEventListeners()
  }

  create() {
  
    this.elem = createElement(`<div class="carousel">
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/src/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/src/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>`)
    this.elem01 = createElement(`<div class="carousel__inner"></div>`)

    this.slides.map(item => {
      this.elem01.innerHTML += `
      <div class="carousel__slide" data-id="${item.id}">
        <img src="/src/assets/images/carousel/${item.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${item.price.toFixed(2)}</span>
          <div class="carousel__title">${item.name}</div>
          <button type="button" class="carousel__button">
            <img src="/src/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      `
      this.elem.append(this.elem01)
    })
  }

  initCarousel() {

    let forward = this.elem.querySelector('.carousel__arrow_right')
    let back = this.elem.querySelector('.carousel__arrow_left')

    let a = 0
    back.style.display = "none"

    forward.addEventListener('click', () => {
      back.style.display = ''

      if (a < (this.elem01.offsetWidth * (this.slides.length - 1))) {
        a += this.elem01.offsetWidth
        this.elem01.style.transform = `translateX(-${a}px)`
      }
      if (a === this.elem01.offsetWidth * (this.slides.length - 1)) {
        forward.style.display = 'none'
      }
    })
    back.addEventListener('click', () => {
      if (a > 0) {
        a -= this.elem01.offsetWidth
        this.elem01.style.transform = `translateX(-${a}px)`
      }
      if (a == 0) {
        back.style.display = "none"
      }
    })
  }

  addEventListeners() {
    this.elem.onclick = ({ target }) => {
      let button = target.closest('.carousel__button');
      if (button) {
        let id = target.closest('[data-id]').dataset.id;

        this.elem.dispatchEvent(new CustomEvent('product-add', {
          detail: id,
          bubbles: true
        }));
      }
    }

  }
}
