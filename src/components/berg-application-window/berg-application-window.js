/**
 * The berg-application-window module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>

#appwindow {
  position:absolute;
  left:0;
  top:0;
  background-color:grey;
  color: blue;
  justify-content:center;
  align-items:center;
  display: inline-block;
}

#topbar {
  height:21px;
  background-color:#809fff;
}

#closebutton {
  height:100%;
  cursor: pointer;
  position:relative;
  float:right;
  justify-content:center;
  opacity:0.5;
  border: none;
  background: none;
}

#closebutton:hover{
  background: white;
  opacity:1;
}

</style>

<div id='appwindow'>
  <div id='topbar'>
    <button id='closebutton'> X </button>
  </div>
  <slot name='applicationslot'></slot>
</div>
`

/*
 * Define custom element.
 */
customElements.define('berg-application-window',
  /**
   * Creating an anonymous class.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /**
       *Setting references for easier handling.
       */
      this._closeButton = this.shadowRoot.querySelector('#closebutton')
      this._appWindow = this.shadowRoot.querySelector('#appwindow')
      this._topbar = this.shadowRoot.querySelector('#topbar')
      // Binds
      this._closeApp = this._closeApp.bind(this)
      this._mouseDown = this._mouseDown.bind(this)
    }

    /**
     * Setting eventhandler for click the "X"button.
     */
    connectedCallback () {
      this._closeButton.addEventListener('click', this._closeApp)
      this._topbar.addEventListener('mousedown', this._mouseDown)
    }

    /**
     * After disconnect.
     */
    disconnectedCallback () {
      this._closeButton.removeEventListener('click', this._closeApp)
      this._topbar.removeEventListener('mousedown', this._mouseDown)
    }

    /**
     * Setting up drag and drop for applicationwindow.
     *
     * @param {*} event - event.
     */
    _mouseDown (event) {
      event.preventDefault()
      let previousMouseX = event.clientX // sätter prevx = där jag tröck
      let previousMouseY = event.clientY
      let target = null
      // console.log(previousMouseX + ' förstaX')
      // console.log(previousMouseY + ' förstaY')
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)
      window.addEventListener('mouseleave', mouseLeave)
      /**
       * Setting up mouseMove.
       *
       * @param {*} event - event
       */
      function mouseMove (event) {
        event.preventDefault()
        if (target === null) {
          target = event.target
        }
        // Calculating the new mouseposition.
        const mouseMovedX = previousMouseX - event.clientX
        const mouseMovedY = previousMouseY - event.clientY
        // console.log(mouseMovedX + ' movedX')
        // console.log(mouseMovedY + ' movedY')
        const rect = target.getBoundingClientRect()
        // console.log(rect + ' rect')
        // Setting window style.
        target.style.left = rect.left - mouseMovedX + 'px'
        target.style.top = rect.top - mouseMovedY + 'px'

        // console.log(target)
        if (rect.top < 0) {
          target.style.top = 0 + 'px'
          mouseLeave()
        }
        if (rect.left < 0) {
          target.style.left = 0 + 'px'
          mouseLeave()
        }
        // Allowing window to be draged 400px outside right / bottom.
        if (rect.right > (screen.width - 400)) {
          target.style.left = screen.width - 400 + 'px'
          mouseLeave()
        }
        if (rect.bottom > (screen.height - 400)) {
          target.style.top = screen.height - 400 + 'px'
          mouseLeave()
        }
        previousMouseX = event.clientX
        previousMouseY = event.clientY
      }

      /**
       * Setting up mouseUp.
       *
       * @param {*} event - event.
       */
      function mouseUp (event) {
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
        window.removeEventListener('mouseleave', mouseLeave)
      }

      /**
       * Setting up mouseUp.
       */
      function mouseLeave () {
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
        window.removeEventListener('mouseleave', mouseLeave)
      }
    }

    /**
     * Customevent for removing app.
     */
    _closeApp () {
      const event = new CustomEvent('removeapp', {
        detail: {
          removeapp: this
        },
        bubbles: true
      })
      this.dispatchEvent(event)
      this.remove()
    }
  }
)
