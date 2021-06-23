/**
 * The berg-flipping-tile web component module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

const BACK = (new URL('flippingimages/questionmark.png', import.meta.url)).href

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
        display: block;
        height: 80px;
        width: 80px;
        perspective: 1000px;
        position: relative;
    }

    :host([hidden]) #tile {
        cursor: default;
        pointer-events: none;
        box-shadow: none;
    }
    
    :host([hidden]) #tile>* {
        visibility: hidden;
    }

    :host([face-up]) #tile {
      transform: rotateY(180deg);
    }

    #tile {
      display: inline-block;
      height: 100%;
      width: 100%;
      padding:0;
      border-radius: 15px;
      background-color: #52307c;
      cursor: pointer;
      box-shadow:0px 2px 5px 1px black;
      transform-style: preserve-3d;
      transition: 0.5s;
    }

    #tile[disabled] {
      cursor: default;
      pointer-events: none;
    }

    #front,
    #back {
      width: 100%;
      height: 100%;
      border-radius: 15px;
      position: absolute;
      top:0;
      left:0;
      backface-visibility: hidden;
    }

    #front {
      background-color:#52307c;
      transform: rotateY(180deg);
    }

    #back {
      background:#52307c url("${BACK}") no-repeat center/60%;
    }

    slot {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    slot>* {
        width: 95%;
        height: 95%;
    }
    /* ::slotted() represents any element that has been placed into a slot. */
    ::slotted(img) {
        width: 90%;
        height: 90%;
        border-radius:35%; 
    }

  </style>
  
  <button part="tile-main" id="tile">
    <div part="tile-front" id="front">
      <slot></slot>
    </div>
    <div part="tile-back" id="back"></div>
  </button>
`

/*
 * Define custom element.
 */
customElements.define('berg-flipping-tile',
  /**
   * Represents a flipping tile.
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

      // Settings references.
      this._setReferences()
    }

    /**
     *Setting references for easier handling.
     */
    _setReferences () {
      this.tile = this.shadowRoot.querySelector('#tile')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', this._flipTile)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._flipTile)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['face-up', 'disabled', 'hidden']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      // Disabling
      if (name === 'disabled') {
        this.tile.setAttribute('disabled', '')
      } else if (name === 'hidden') { // Hidden/diss
        this.tile.setAttribute('hidden', 'disabled')
        this.tile.style.backfaceVisibility = 'hidden'
      } else {
        this.tile.setAttribute('face-up', '')
      }
    }

    /**
     * Flipping the tile.
     *
     * @param {*} event - event.
     */
    _flipTile (event) {
      event.preventDefault()
      if (this.hasAttribute('disabled') || this.hasAttribute('hidden')) {
        return
      }
      this.setAttribute('face-up', '')

      // Creating a customevent for faceup event.
      this.dispatchEvent(new CustomEvent('tileflip', {
        bubbles: true,
        detail: { hasFaceUp: this.hasAttribute('face-up'), flippingTile: this }
      }))
    }
  }
)
