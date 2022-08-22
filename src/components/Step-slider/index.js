import createElement from '../../assets/lib/create-element';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps
    this.value = value
    this.segments = this.steps - 1
    this.create()
    this.addEventClick()
    this.addDragandDrop()

  }
  create() {
    this.valuePercents = this.value / this.segments * 100
    this.elem = createElement(`
    <div class="slider">
    <div class="slider__thumb" style="left: ${this.valuePercents}%;">
      <span class="slider__value">${this.value}</span>
    </div>
    <div class="slider__progress" style="width: ${this.valuePercents}%;"></div>
    <div class="slider__steps">
    </div>
  </div>
`)

    this.sliderSteps = this.elem.querySelector('.slider__steps')
    let numberOfSteps = this.steps

    for (let i = 0; i < numberOfSteps; i++) {
      let span = document.createElement('span')
      this.sliderSteps.append(span)

    }
    this.elem.querySelector('.slider__steps').children[this.value].classList.add('slider__step-active')

  }

  addEventClick() {

    this.elem.addEventListener('click', (event) => {
      let left = event.clientX - this.elem.getBoundingClientRect().left // от начала слайдера до места клика
      let leftRelative = left / this.elem.offsetWidth
      let segments = this.steps - 1
      let approximateValue = leftRelative * segments
      let value = Math.round(approximateValue)
      let valuePercents = value / segments * 100
      this.changeStep(value, valuePercents)
      this.changeClass(value)
      this.elem.dispatchEvent(new CustomEvent('slider-change', {
        detail: value,
        bubbles: true
      }))

    })
  }

  changeStep(value, valuePercents) {
    this.elem.querySelector('.slider__value').innerHTML = value
    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress')
    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`

  }

  changeClass(value) {
    this.sliderSteps = this.elem.querySelector('.slider__steps')
    let spanList = this.sliderSteps.querySelectorAll("span")


    for (let span of spanList) {
      span.classList.remove("slider__step-active")
    }

    this.elem.querySelector('.slider__steps').children[value].classList.add('slider__step-active')
  }

  addDragandDrop() {
    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress')
    thumb.ondragstart = () => false;
    let self = this
    thumb.addEventListener('pointerdown', (event) => {
      this.elem.classList.add("slider_dragging")
      thumb.style.position = 'absolute';
      thumb.style.zIndex = 1000;

      function rr(event) {
        self.pointermove(event, self.elem)
      }


      document.addEventListener('pointermove', rr)
      document.addEventListener('pointerup', () => {

        document.removeEventListener('pointermove', rr)
        if (document.querySelector(".slider_dragging")) document.querySelector(".slider_dragging").classList.remove("slider_dragging")
        this.elem.dispatchEvent(new CustomEvent('slider-change', {
          detail: this.value01,
          bubbles: true
        }))

      }) // pointerup


    }) //скобочки от pointerdown

  }

  pointermove(event, elem) {
    let left = event.clientX - elem.getBoundingClientRect().left // положение в пикселях клика относительно элемента
    let leftRelative = left / elem.offsetWidth // 

    if (leftRelative < 0) {
      leftRelative = 0
    }
    if (leftRelative > 1) {
      leftRelative = 1
    }

    let leftPercents = leftRelative * 100
    let segments = this.steps - 1;
    let approximateValue = leftRelative * segments
    let value = Math.round(approximateValue)
    this.value01 = value
    this.changeStep(value, leftPercents)
    this.changeClass(value)

  }



}
