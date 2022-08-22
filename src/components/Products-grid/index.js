import createElement from '../../assets/lib/create-element.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products
    this.displayedProducts = this.products;
    this.filters = {};
    this.elem = createElement(`
<div class="products-grid">
<div class="products-grid__inner">
  <!--ВОТ ТУТ БУДУТ КАРТОЧКИ ТОВАРОВ-->
</div>
</div>`)
    this.create(this.displayedProducts)
    this.addEventListeners()

  }

  create(products) {
    let cards = document.querySelectorAll(".card")
    if (cards.length > 0) {
      cards.forEach(item => item.remove())
    }
    this.productsGridInner = this.elem.querySelector('.products-grid__inner')
    for (let obj of products) { // объекты
      this.fillsSample(obj, this.productsGridInner)
    }
  }

  fillsSample(smt, object) {
    object.innerHTML += `
<div class="card">
<div class="card__top">
  <img
    src="./src/assets/images/products/${smt.image}"
    class="card__image"
    alt="product"
  />
  <span class="card__price">€${smt.price.toFixed(2)}</span>
</div>
<div class="card__body">
  <div class="card__title">${(smt.name)}</div>
  <button type="button" class="card__button">
    <img src="./src/assets/images/icons/plus-icon.svg" alt="icon" />
  </button>
</div>
</div>
`
  }
  updateFilter(filtersUpdate) {
    this.updateFiltersState(filtersUpdate) // возрващает this.filters
    let productsToDisplay = this.products
    for (let key in this.filters) {
      if (key === "noNuts" && this.filters[key] === true) {
        productsToDisplay = productsToDisplay.filter(item => item.nuts === undefined || item.nuts === false)
      }

      if (key === "vegeterianOnly" && this.filters[key] === true) {
        productsToDisplay = productsToDisplay.filter(item => item.vegeterian === true)
      }
      if (key === "maxSpiciness") {
        productsToDisplay = productsToDisplay.filter(item => item.spiciness <= this.filters[key])
      }
      if (key === "category" && this.filters[key] === "salads") {
        productsToDisplay = productsToDisplay.filter(item => item.category == "salads")
      }
      if (key === "category" && this.filters[key] === 'soups') {
        productsToDisplay = productsToDisplay.filter(item => item.category == 'soups')
      }
      if (key === "category" && this.filters[key] === "seafood-dishes") {
        productsToDisplay = productsToDisplay.filter(item => item.category == "seafood-dishes")
      }
    }
    this.create(productsToDisplay)
  }

  updateFiltersState(filterUpdate) {
    for (const [key, value] of Object.entries(filterUpdate)) {
      this.filters[key] = value
    }
  }

  addEventListeners() {
    this.elem.addEventListener('click', (event) => {
      if (!event.target.closest('.card__button')) return
      let cardName = event.target.closest(".card__body").querySelector('.card__title').innerHTML
      let productToCart = this.products.find(item => item.name === cardName)
      this.elem.dispatchEvent(new CustomEvent('product-add', {
        detail: productToCart.id,
        bubbles: true
      }));
    })

  }
}