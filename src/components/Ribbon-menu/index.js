import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.creator()
    this.scroll()
    this.click()
  }
  creator() {
    this.elem = createElement(
      `<div class="ribbon">
  <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
    <img src="/src/assets/images/icons/angle-icon.svg" alt="icon">
  </button>
  <nav class="ribbon__inner">
  </nav>
  <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible ">
    <img src="/src/assets/images/icons/angle-icon.svg" alt="icon">
  </button>
</div>`
    )
    this.ribbonInner = this.elem.querySelector('.ribbon__inner')
    this.categories.map(item => {
      this.ribbonInner.innerHTML += (`<a href="#" class="ribbon__item" data-id=${item.id}>${item.name}</a>`)
    })
    this.elem.querySelector('[data-id=""]').classList.add("ribbon__item_active")

  }
  scroll() {
    this.ribbonInner = this.elem.querySelector('.ribbon__inner')
    let buttonRight = this.elem.querySelector('.ribbon__arrow_right')
    let buttonLeft = this.elem.querySelector('.ribbon__arrow_left')

    buttonLeft.addEventListener('click', () => this.ribbonInner.scrollBy(-350, 0))
    
    buttonRight.addEventListener('click', () => this.ribbonInner.scrollBy(350, 0))

    this.ribbonInner.addEventListener('scroll', () => {
      let scrollLeft = this.ribbonInner.scrollLeft
      let clientWidth = this.ribbonInner.clientWidth
      let scrollWidth = this.ribbonInner.scrollWidth
      let ScrollRight = scrollWidth - clientWidth - scrollLeft
      buttonRight.classList.add('ribbon__arrow_visible')
      buttonLeft.classList.add('ribbon__arrow_visible')

      if (scrollLeft === 0) buttonLeft.classList.remove('ribbon__arrow_visible')
      if (ScrollRight < 1) buttonRight.classList.remove('ribbon__arrow_visible')
    })
  }
  click() {
    this.ribbonInner.addEventListener('click', (event) => {
      if (!event.target.classList.contains("ribbon__item")) return
        event.preventDefault()
        this.elem.querySelector(".ribbon__item_active").classList.remove("ribbon__item_active")
        event.target.classList.add("ribbon__item_active")
        this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
          detail: event.target.dataset.id,
          bubbles: true
        }))
    })
  }

}