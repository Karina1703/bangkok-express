import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.create()
    this.addCloseButtonListener()
    this.addEscListener()
  }
  create() {
    this.elem = createElement(`
    <div class="modal">
    
    <div class="modal__overlay"></div>

    <div class="modal__inner">
      <div class="modal__header">
       
        <button type="button" class="modal__close">
          <img src="./src/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>

        <h3 class="modal__title">
        
        </h3>
      </div>

      <div class="modal__body">
       
      </div>
    </div>

  </div>
 
  `)

  }

  setTitle(title) {
    let modalTitle = this.elem.querySelector(".modal__title")
    modalTitle.innerHTML = title
  }

  setBody(body) {
    this.modalBody = this.elem.querySelector(".modal__body")
    if (this.modalBody) {
      this.modalBody.innerHTML = ""
      this.modalBody.append(body)
    } else { alert('hothing')}

  }

  open() {
    document.body.classList.add('is-modal-open')
    document.body.append(this.elem)
  }

  close() {
    this.elem.remove()
    document.body.classList.remove('is-modal-open')

  }

  addCloseButtonListener() {
    this.elem.addEventListener('click', (event) => {
      if (event.target.closest(".modal__close")) this.close()
    })
  }

  addEscListener() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') this.close()
    })
  }
}

