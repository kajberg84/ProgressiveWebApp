/**
 * The berg-animal-game module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

const animalArray = new Array(14)
for (let i = 0; i < animalArray.length; i++) {
  animalArray[i] = (new URL(`animalpictures/${i}.png`, import.meta.url)).href
}

const backgroundArray = new Array(3)
for (let i = 0; i < backgroundArray.length; i++) {
  backgroundArray[i] = (new URL(`bgpictures/${i}.jpg`, import.meta.url)).href
}

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    --color:lightgreen;
  }
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Gloria Hallelujah', cursive;
    text-align:center;
    }

#mainanimalapp {
  position:relative;
  display: grid;
  width:1100px;
  height:800px;
  grid-template-rows:100px 200px 200px 300px;
  grid-template-columns:300px 300px 300px 200px;
  grid-template-areas:
  "topbar topbar topbar topbar"
  "animalstart animalstart animalstart statistic"
  "tracks tracks tracks statistic"
  "livingplace livingplace livingplace statistic"
  ;
}
 /* GridStyle */
#topbar {
  grid-area: topbar;
  background-image: linear-gradient(red, orange);
  font-size:40px;
}

#animalendscreen {
  color:yellow;
  background-image: linear-gradient(orange, purple);
  display: none;
  flex-direction:column;
  position:absolute; 
  width: 1100px;
  height: 800px; 
  justify-content:center;
  text-align: center; 
  align-items: center;
  z-index:100;
}

#animalstart {
  grid-area: animalstart;
  background:var(--color);
}

#tracks {
  grid-area: tracks;
  background:var(--color);
  background-image: linear-gradient(lightgreen, green);
}

#livingplace {
  grid-area: livingplace;
  display: grid;
  grid-template-columns:1fr 1fr 1fr;
  background:green;
}

#statistic {
  grid-area: statistic;
  background-image: linear-gradient(orange, yellow);
  font-size:22px;
}
 /* End GridStyle */

.statsbox{
  display:flex;
  justify-content: center;
  align-items: center;
  border:2px solid black;
  border-radius:50%;
  width:120px;
  height:120px;
  margin:auto;
  color:green;  
  font-size:2rem;
}

.animals {
  float:left;
  cursor: pointer;
  height:70px;
  width:70px;
  background:none;
  margin:1px;
}

 /* Dropzones styles */
.dropzones {
  width: 97%;
  height: 100%;
  margin:5px;
  display:flex;
  float:left;
  margin:2px;
  text-align:center;
  justify-content:center;
  align-items:center;
  opacity:1;
}

#farm {
  background:url("${backgroundArray[0]}") no-repeat center/100%;
  background-size: cover;
}
#savann {
  background:url("${backgroundArray[1]}") no-repeat center/100%;
  background-size: cover;
}
#forest {
  background:url("${backgroundArray[2]}") no-repeat center/100%;
  background-size: cover;
}
 /* End Dropzones styles */

</style>
<div id='mainanimalapp'>

 <div id='animalendscreen'>
    <div id='animalrating'>animalrating</div>
  </div>

  <div id='topbar'>Animal Game</div>

<!-- Animals here -->
  <div id='animalstart'>
  <img id='animal0' compare='forest' class='animals' draggable = 'true'>
  <img id='animal1' compare='forest' class='animals' draggable = 'true'>
  <img id='animal2' compare='forest' class='animals' draggable = 'true'>
  <img id='animal3' compare='forest' class='animals' draggable = 'true'>
  <img id='animal4' compare='forest' class='animals' draggable = 'true'>
  <img id='animal5' compare='farm' class='animals' draggable = 'true'>
  <img id='animal6' compare='farm' class='animals' draggable = 'true'>
  <img id='animal7' compare='farm' class='animals' draggable = 'true'>
  <img id='animal8' compare='farm' class='animals' draggable = 'true'>
  <img id='animal9' compare='farm' class='animals' draggable = 'true'>
  <img id='animal10' compare='savann' class='animals' draggable = 'true'>
  <img id='animal11' compare='savann' class='animals' draggable = 'true'>
  <img id='animal12' compare='savann' class='animals' draggable = 'true'>
  <img id='animal13' compare='savann' class='animals' draggable = 'true'>
  </div>

<!-- Wanted to ad tracks but was some difficulties and time ran away   <div id='tracks'></div> -->
<div id='tracks'></div>

  <!-- Drops here -->
  <div id='livingplace'>
    <div id='savann' class='dropzones'>savann</div>
    <div id='farm' class='dropzones'>farm</div>
    <div id='forest' class='dropzones'>forest</div>
  </div>

  <div id='statistic'>Wrong Home!
  <div class='statsbox' id='wrong'>0</div> Timer
  <div class='statsbox' id='timer'></div>
 
  </div>
</div>
`

/*
     * Define custom element.
     */
customElements.define('berg-animal-game',
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
      this._animalEndScreen = this.shadowRoot.querySelector('#animalendscreen')
      this._animalRating = this.shadowRoot.querySelector('#animalrating')
      this._dropzones = this.shadowRoot.querySelectorAll('.dropzones')
      this._animalStart = this.shadowRoot.querySelector('#animalstart')
      this._animals = this.shadowRoot.querySelectorAll('.animals')
      this._wrongGuess = this.shadowRoot.querySelector('#wrong')
      this._timeSpend = this.shadowRoot.querySelector('#timer')
      // Binds.
      this._dragstart = this._dragstart.bind(this)
      this._drop = this._drop.bind(this)
      this._handleDraggables = this._handleDraggables.bind(this)
      this._handleDroppables = this._handleDroppables.bind(this)
      this._shuffle = this._shuffle.bind(this)
      // Counters.
      this._wrongDrop = 0
      this._rightDrop = 0
      this._gameTimer = 0 // If i got time make a startgame window.
      this.animalZindex = 1
    }

    /**
     * Setting eventhandler for click the "X"button.
     */
    connectedCallback () {
      this._handleDraggables()
      this._handleDroppables()
      this._startTimer()
      this._shuffle()
    }

    /**
     * Configuring draggable animals.
     *
     * @param {*} event - Event.
     */
    _handleDraggables (event) {
      this._animals.forEach((animal, index) => {
        animal.addEventListener('dragstart', this._dragstart)
        animal.addEventListener('drag', this._drag)
        animal.setAttribute('src', animalArray[index])
      })
    }

    /**
     * Setting eventlisteners on droppable zones.
     *
     * @param {*} event - Event.
     */
    _handleDroppables (event) {
      this._dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragenter', this._dragenter)
        dropzone.addEventListener('dragover', this._dragover)
        dropzone.addEventListener('dragleave', this._dragleave)
        dropzone.addEventListener('drop', this._drop)
      })
    }

    /**
     * Fires when the user starts dragging of the object.
     *
     * @param {*}  event - event.
     * @returns {boolean} - true
     */
    _dragstart (event) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', event.target.id)
      return true
    }

    /**
     * Fires when the user is dragging the object.
     *
     * @param {*} event - event.
     * @returns {boolean} - false
     */
    _drag (event) {
      return false
    }

    /**
     * Fires when the object enters target area.
     *
     * @param {*} event - event.
     */
    _dragenter (event) {
      event.preventDefault()
    }

    /**
     * Fires when the object enters a droppable target area.
     *
     * @param {*} event - event.
     */
    _dragover (event) {
      event.target.style.opacity = 0.7
      event.preventDefault()
    }

    /**
     * Fires when the object leaves target area.
     *
     * @param {*} event - event.
     */
    _dragleave (event) {
      event.target.style.opacity = 1
    }

    /**
     * Fires when the user releases the mouse.
     *
     * @param {*} event - event.
     */
    _drop (event) {
      event.target.style.opacity = 1
      event.preventDefault()
      // Getting Id from dragged element.
      const droppedElementId = event.dataTransfer.getData('text/plain')
      const droppedElement = this.shadowRoot.querySelector(`#${droppedElementId}`)
      // Comparing own attribute with event.target.id
      if (droppedElement.getAttribute('compare') === event.target.getAttribute('id')) {
        droppedElement.style.position = 'absolute'
        event.target.appendChild(droppedElement)
        droppedElement.setAttribute('draggable', 'false')
        this._rightDrop++
      } else {
        this._wrongDrop++
        this._wrongGuess.textContent = `${this._wrongDrop}`
      }
      if (this._rightDrop === animalArray.length) {
        this._endAnimalGame()
      }
    }

    /**
     * Setting up animal endscreen.
     */
    _endAnimalGame () {
      this._animalEndScreen.style.display = 'flex'
      // Since this is for my babygirl she is always good.
      this._animalRating.textContent = 'You are really good <3. Keep it up'
      this._clearTimer()
    }

    /**
     * Game timer.
     */
    _startTimer () {
      this.timer = setInterval(() => {
        this._gameTimer++
        this._timeSpend.textContent = `${this._gameTimer}`
      }, 1000)
    }

    /**
     * Clearing timer.
     */
    _clearTimer () {
      clearInterval(this.timer)
      this._gameTimer = 0
    }

    /**
     * Shuffling elements.
     */
    _shuffle () {
      const imgElements = this._animalStart.children
      const frag = document.createDocumentFragment()
      while (imgElements.length) {
        frag.appendChild(imgElements[Math.floor(Math.random() * imgElements.length)])
      }
      this._animalStart.appendChild(frag)
    }
  }
)
