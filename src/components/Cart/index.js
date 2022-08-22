import createElement from '../../assets/lib/create-element';
import escapeHtml from '../../assets/lib/escape-html';

import Modal from '../Modal/index.js'

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {
    // добавляет в массив cartItems объект товара
    if (product != null || product != undefined) {
      let index = this.cartItems.findIndex(item => item.product.id === product.id)
      if (index > -1) { // если продукт уже есть в массиве
        this.cartItems[index].count++
      } else { // если продукта нет - создаем новый объект
        let obj = {}
        obj.product = product
        obj.count = 1
        this.cartItems.push(obj)
      }
    }
    this.onProductUpdate(this.cartItems)
  }

  updateProductCount(productId, amount) {
    let index = this.cartItems.findIndex(item => item.product.id === productId)
    let currentCount = this.cartItems[index].count
    if (index != -1) { amount === 1 ? this.cartItems[index].count = currentCount + 1 : this.cartItems[index].count = currentCount - 1 }
    let indexOfProductWithCountNull = this.cartItems.findIndex(item => item.count === 0)
    if (indexOfProductWithCountNull != -1) { // если удовлетворяет условию
      this.cartItems.splice(indexOfProductWithCountNull, 1)
      this.removeHTML(productId)
    }
    if (this.cartItems.length === 0) this.removeModalWindow()
    this.onProductUpdate(productId)
  }

  isEmpty() {
    return this.cartItems.length === 0
  }

  getTotalCount() {
    // для оторбражения иконки корзины
    let totalCount = this.cartItems.reduce((sum, current) => sum + current.count, 0)
    return totalCount
  }

  getTotalPrice() {
    let getTotalPrice = this.cartItems.reduce((sum, current) => sum + current.product.price * current.count, 0)
    return getTotalPrice
  }

  renderProduct(product, count) { // верстка товара для показа в корзине
    return createElement(`
    <div class="cart-product" data-product-id="${product.id
      }">
      <div class="cart-product__img">
       <img src="/src/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/src/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/src/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() { // форма для ввода данных от пользователя
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
      2
    )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modal = new Modal()
    modal.open()
    let div = document.createElement('div')
    div.classList.add('modalWindow')
    for (let obj of this.cartItems) {
      div.append(this.renderProduct(obj.product, obj.count))
    }  // динамичски проходимся по cartItems, создаваемому при клике на продукты, создавая верстку
    div.append(this.renderOrderForm()) //создаем форму заказа
    modal.setTitle("Your order")
    modal.setBody(div)
    this.addEventToButtonsInModal()
    document.querySelector('.cart-form').addEventListener('submit', (event) => this.onSubmit(event))
  }

  addEventToButtonsInModal() {
    let buttonMinus = document.querySelectorAll('.cart-counter__button_minus');
    let buttonPlus = document.querySelectorAll('.cart-counter__button_plus');

    buttonMinus.forEach(btnMinus => btnMinus.addEventListener('click', (event) => {
      let productDatasetId = btnMinus.closest('[data-product-id]').dataset.productId;
      this.updateProductCount(productDatasetId, -1);
    }));

    buttonPlus.forEach(btnPlus => btnPlus.addEventListener('click', (event) => {
      let productDatasetId = btnPlus.closest('[data-product-id]').dataset.productId;
      this.updateProductCount(productDatasetId, 1);
    }));
  }

  onProductUpdate(productId) { // обновляет отображение товара в модальном окне
    this.cartIcon.update(this); // обновляет иконку корзины
    if (!document.body.classList.contains('is-modal-open')) return // если модальное окно не открыто
    let index = this.cartItems.findIndex(item => item.product.id === productId)
    if (index != -1) {
      this.changeHtmlOfProduct(index, productId)
    }
  }

  changeHtmlOfProduct(index, productId) {
    let modalBody = document.querySelector(".modal__body") // корневой элемент модального окна
    let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);// колчество товаров с данным id
    let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`); // стоимость товара с данным id
    let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`) // Элемент с суммарной стоимостью всех товаров

    productCount.innerHTML = this.cartItems[index].count
    productPrice.innerHTML = `€${(this.cartItems[index].product.price * this.cartItems[index].count).toFixed(2)}`
    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`
  }

  removeHTML(id) {
    let divWithId = document.querySelector(`[data-product-id="${id}"]`)
    if (divWithId) document.querySelector(`[data-product-id="${id}"]`).remove()
  }

  removeModalWindow() {
    if (document.querySelector(".modal")) document.querySelector(".modal").remove()
  }

  onSubmit(event) {
    event.preventDefault
    event.preventDefault()
    let cartForm = document.querySelector('.cart-form')
    document.querySelector('.cart-buttons__button').classList.add('is-loading')
    let cartFormInData = new FormData(cartForm)
    fetch("https://httpbin.org/post", {
      method: "POST",
      body: cartFormInData
    })
      .then(response => {
        if (response.ok) {
          document.querySelector(".modal__title").innerHTML = 'Success!'
          this.cartItems = []
          this.cartIcon.update(this)
          document.querySelector('.modal__body').innerHTML = ""
          document.querySelector('.modal__body').append(createElement(`<div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="/src/assets/images/delivery.gif">
          </p>
        </div>`))
        }
      })
  }
  chagneHtmlAfterResopnse() {
    document.querySelector(".modal__title").innerHTML = 'Success!'
    this.cartItems = []
    this.cartIcon.update(this)
    document.querySelector('.modal__body').innerHTML = ""
    document.querySelector('.modal__body').append(createElement(`<div class="modal__body-inner">
  <p>
    Order successful! Your order is being cooked :) <br>
    We’ll notify you about delivery time shortly.<br>
    <img src="/src/assets/images/delivery.gif">
  </p>
</div>`))

  }


  addEventListeners() {
    // обработчик на открытие модального окна
    this.cartIcon.elem.onclick = () => this.renderModal();
  }

}

