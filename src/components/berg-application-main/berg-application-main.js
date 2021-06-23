/**
 * The berg-application-main module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

const chatIcon = new URL('./mainpictures/chat7.png', import.meta.url).href
const memoryIcon = new URL('./mainpictures/memicon2.png', import.meta.url).href
const animalIcon = new URL('../../components/berg-animal-game/animalpictures/3.png', import.meta.url).href
const backGroundImage = new URL('./mainpictures/natur.jpg', import.meta.url).href

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
:host{
  --color:#52307c;
}

#mainwindow{
  display:grid;  
  height:100vh;
  width: minmax(800px,auto);
  grid-template-rows:93vh 7vh;
  overflow:hidden;
}

#appMain {
  grid-row: 1 / 2;
  background:var(--color) url("${backGroundImage}") no-repeat center/100%;
 }

#bottom {
  grid-row: 2 / 2;
  background-color:darkblue;
}

#appButtons{
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
}

.buttons {
  justify-content:center;
  align-items:center;
  cursor: pointer;
  border-radius:50%;
  width:50px;
  height: 50px;
  margin:3px;
}

#chaticon {
  background:var(--color) url("${chatIcon}") no-repeat center/100%;
}

#memoryicon {
  background:var(--color) url("${memoryIcon}") no-repeat center/100%;
}

#myownicon {
  background:var(--color) url("${animalIcon}") no-repeat center/100%;
}

#chaticon:hover,
#memoryicon:hover,
#myownicon:hover {
  background-color:blue;
}

</style>
<div id='mainwindow'> 
  <div id='appMain'>
    <slot name='mainwindowslot'></slot>
  </div>

  <div id='bottom'>

    <div id='appbuttons'>
      <button id='chaticon' name='berg-chat' class='buttons'></button>
      <button id='memoryicon' name='berg-memory-main' class='buttons'></button>
      <button id='myownicon' name='berg-animal-game' class='buttons'></button>
    </div>

  </div>
</div>
`

/*
 * Define custom element.
 */
customElements.define('berg-application-main',
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
      this.appId = 0
      this.appButtons = this.shadowRoot.querySelector('#appbuttons')
      this._bubbleName = this._bubbleName.bind(this)
    }

    /**
     * Connected callBack.
     */
    connectedCallback () {
      this._setEventListener()
    }

    /**
     * Seteventlistener for appbuttons.
     */
    _setEventListener () {
      this.appButtons.addEventListener('click', (event) => {
        event.preventDefault()
        if (!(event.target.nodeName === 'BUTTON')) {
          return
        }
        this._bubbleName(event.target.name)
      })
    }

    /**
     * CustomEvent for appname.
     *
     * @param {string} appName - Name of pressed button.
     */
    _bubbleName (appName) {
      const event = new CustomEvent('appname', {
        detail: {
          appName: appName,
          appUniqId: this.appId
        },
        bubbles: true
      })
      this.dispatchEvent(event)
      this.appId++
    }
  }
)
