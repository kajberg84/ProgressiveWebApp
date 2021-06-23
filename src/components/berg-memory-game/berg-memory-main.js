/**
 * The berg-memory-game module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import '../berg-flipping-tile'
import { setAttributes, removeAttributes } from '../../utilities/changeAttributes.js'

const imgArray = new Array(8)
for (let i = 0; i < imgArray.length; i++) {
  imgArray[i] = (new URL(`image/image${i}.jpg`, import.meta.url)).href
}

const dubbleArray = imgArray.concat(imgArray)
dubbleArray.sort()

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
@import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap');

:host{
  --color:#52307c;
  --color2: #809fff;
  z-index:1;
}

#main {
  background:var(--color2);
  background-image: linear-gradient(orange, purple);
  color:var(--color);
  width:450px;
  height:500px; 
  justify-content:center;
  text-align: center; 
  border:solid 10px var(--color);
}

#endscreen {
  color:yellow;
  background-image: linear-gradient(orange, purple);
  display: none;
  flex-direction:column;
  position:absolute; 
  width: 450px;
  height: 500px; 
  justify-content:center;
  text-align: center; 
  align-items: center;
  z-index:100;
}

#main h1 {
  font-family: 'Gloria Hallelujah', cursive;
  position: relative;
  font-size:45px;
  margin:10px;
}

#playingboard {
  display: grid;
  grid-template-columns: repeat(4, 80px);
  gap: 10px;
  justify-content:center;
  text-align: center; 
}

#playingboard.small {
  grid-template-columns: repeat(2, 80px);
}

#small, #medium, #large {
  cursor: pointer;
  margin:10px;
  width:70px;
  height:18px;
  justify-content:center; 
  color:yellow;
  background-color:var(--color); 
}

#retrybutton {
  position:relative;
    background-color:var(--color);
    color:yellow;
    margin:10px;
    width:200px;
    height:60px;
  }

 /* Counter for pair found and total flipped */
#pairfound, #totflipped, #timerbox  {
  position:relative;
  display:flex;
  justify-content: center;
  align-items: center;
  border-style:dotted;
  width:45px;
  height:45px;
}

berg-flipping-tile {
  width: 80px;
  height: 80px;
}

/* Tile-front image */
berg-flipping-tile::part(tile-front) {
  background: var(--color) url("${imgArray[8]}") no-repeat center/120%;
}
</style>

  <div id="main"> 

  <div id='endscreen'>
    <div id='userscore'>userscore</div>
    <div id='userrating'>userrating</div>
    <button id='retrybutton'>Play again</button>
  </div>

<table style='width: 100%'>
  <tr>
  <td style='width:45px'>
  <label for='timer'>Time</label>
    <div id='timerbox' name='timer'>
      <div id='timesquare'>0</div>
    </div>
  </td>
  <td style='width:45px'></td>
  <td><h1 style='z-index:100'>Memory</h1></td>

  <td style='width:45px'>
    <label for='pairs'>Pairs</label>
    <div id='pairfound' name='pairs'>
      <div id='pairsquare'>0</div>
    </div>
</td>

    <td style='width:45px'>
      <label for='total'> Flipped</label>
      <div id='totflipped' name='total'>
        <div id='flippedsquare'>0</div>
      </div>
    </td>
  </tr>

</table>

     <!-- Buttons for choosing boardsize -->
    <div class='buttons'> 
      <button id='small'>2x2</button>
      <button id='medium'>4x2</button>
      <button id='large'>4x4</button>
    </div>

  <!-- Tile-Template -->  
    <template id='tile-template'>
      <berg-flipping-tile>
          <img />
      </berg-flipping-tile>
    </template>

  <div id='playingboard'></div>
</div>
`
/*
 * Define custom element.
 */
customElements.define('berg-memory-main',
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
      this._endscreen = this.shadowRoot.querySelector('#endscreen')
      this._retrybutton = this.shadowRoot.querySelector('#retrybutton')
      this._pairSquare = this.shadowRoot.querySelector('#pairsquare')
      this._flippSquare = this.shadowRoot.querySelector('#flippedsquare')
      this._timeSquare = this.shadowRoot.querySelector('#timesquare')
      this._tiletemplate = this.shadowRoot.querySelector('#tile-template')
      this.buttons = this.shadowRoot.querySelector('.buttons')
      this.playingBoard = this.shadowRoot.querySelector('#playingboard')
      // Binds.
      this._flippingTiles = this._flippingTiles.bind(this)
      this._playAgain = this._playAgain.bind(this)
      // Globals.
      this._prevFlippedTileId = ''
      this._currAmountFlippedTiles = 0
      this._totalTimesFlipped = 0
      this._pickedSize = 16
      this._foundPair = 0
      this._gameTimer = 0
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.playingBoard.addEventListener('tileflip', this._flippingTiles)
      this._retrybutton.addEventListener('click', this._playAgain)
      this._setStartingBoard()
      this._changeBoardSize()
    }

    /**
     * After disconnect.
     */
    disconnectedCallback () {
      this.playingBoard.removeEventListener('tileflip', this._flippingTiles)
      this._retrybutton.removeEventListener('click', this._playAgain)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this._createPlayingBoard(newValue)
      }
    }

    /**
     * Play again!
     *
     * @param {*} event - event.
     */
    _playAgain (event) {
      event.preventDefault()
      this._resetBoard()
    }

    /**
     * Setting Starting board.
     */
    _setStartingBoard () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 16)
      }
    }

    /**
     * Changing boardSize.
     */
    _changeBoardSize () {
      this.buttons.addEventListener('click', (event) => {
        if (!(event.target.nodeName === 'BUTTON')) {
          return
        }
        this._resetBoard()

        if (event.target.id === 'small') {
          this._pickedSize = 4
        } else if (event.target.id === 'medium') {
          this._pickedSize = 8
        } else {
          this._pickedSize = 16
        }

        while (this.playingBoard.firstChild) {
          this.playingBoard.removeChild(this.playingBoard.lastChild)
        }
        this._createPlayingBoard(this._pickedSize)
      })
    }

    /**
     * Setting boardsize. Setting startsize to large.
     *
     * @param {number} boardSize - size of board.
     */
    _createPlayingBoard (boardSize) {
      if (boardSize === 4) {
        this.playingBoard.classList.add('small')
      } else {
        this.playingBoard.classList.remove('small')
      }
      // Cloning template and appending to playingBoard
      for (let i = 0; i < boardSize; i++) {
        const tile = this._tiletemplate.content.cloneNode(true)
        this.playingBoard.appendChild(tile)
      }

      this.allTiles = this.playingBoard.querySelectorAll('img')
      let x = 0

      // Giving uniqid to both tiles with same image.
      this.allTiles.forEach((tile, index) => {
        tile.setAttribute('src', dubbleArray[index])
        tile.setAttribute('uniqid', x)
        if ((index + 1) % 2 === 0) {
          x++
        }
      })

      // Shuffling all elements.
      const divs = this.playingBoard.children
      const frag = document.createDocumentFragment()
      while (divs.length) {
        frag.appendChild(divs[Math.floor(Math.random() * divs.length)])
      }
      this.playingBoard.appendChild(frag)
      this._startTimer()
    }

    /**
     * Handling tiles flipped event.
     *
     * @param {*} event - event.
     */
    _flippingTiles (event) {
      if (this._currAmountFlippedTiles === 2) { return }
      this._totalTimesFlipped++
      this._currAmountFlippedTiles += 1

      // Assigning a variable to the last flipped tiles uniqid.
      this._flippedTileId = event.detail.flippingTile
        .querySelector('img').getAttribute('uniqid')
      const allBoardTiles = this.playingBoard.querySelectorAll('berg-flipping-tile')
      setAttributes(event.detail.flippingTile, 'disabled')

      if (this._currAmountFlippedTiles === 2) {
        // Disabling all while comparing.
        allBoardTiles.forEach(tile => {
          tile.setAttribute('disabled', 'true')
        })
        // If match.
        if (this._flippedTileId === this._prevFlippedTileId) {
          setAttributes(event.detail.flippingTile, 'hidden')
          setAttributes(this._prevFlippedTile, 'hidden')
          this._foundPair++
        } else {
          removeAttributes(event.detail.flippingTile)
          removeAttributes(this._prevFlippedTile)
        }
        this._currAmountFlippedTiles = 0

        // Removing disable after compared.
        setTimeout(() => {
          allBoardTiles.forEach(tile => {
            tile.removeAttribute('disabled')
          })
        }, 850)
      }

      // Storing the first tile Flipped.
      this._prevFlippedTileId = this._flippedTileId
      this._prevFlippedTile = event.detail.flippingTile

      this._pairSquare.textContent = `${this._foundPair}`
      this._flippSquare.textContent = `${this._totalTimesFlipped}`
      if (this._foundPair === (this._pickedSize / 2)) {
        setTimeout(() => {
          this._memoryEnd()
        }, 850)
      }
    }

    /**
     * Reseting board.
     */
    _resetBoard () {
      this._clearTimer()
      this._pairSquare.textContent = 0
      this._flippSquare.textContent = 0
      this._timeSquare.textContent = 0
      this._foundPair = 0
      this._totalTimesFlipped = 0
      this._currAmountFlippedTiles = 0
      this.allTiles = []
      this._endscreen.style.display = 'none'
    }

    /**
     * Starting timer.
     *
     */
    _startTimer () {
      this.timer = setInterval(() => {
        this._gameTimer++
        this._timeSquare.textContent = `${this._gameTimer}`
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
     * Typing out endscore and rating.
     */
    _memoryEnd () {
      let rating = 'You only get rating if you play on a large board.'
      if (this._foundPair === 8) {
        if (this._totalTimesFlipped === 16) {
          rating = 'Go buy a lottery ticket!!!'
        } else if (this._totalTimesFlipped > 16 && this._totalTimesFlipped <= 26 && this._gameTimer < 35) {
          rating = 'You are a memorypro.'
        } else if (this._totalTimesFlipped > 26 && this._totalTimesFlipped < 34 && this._gameTimer < 50) {
          rating = 'Your are quite good at this.'
        } else {
          rating = 'You need to practise or be faster.'
        }
      }
      // Setting up endscreen
      this._endscreen.querySelector('#userscore').textContent = `You flipped ${this._totalTimesFlipped} tiles to complete the memory.`
      this._endscreen.querySelector('#userrating').textContent = `${rating}`
      this._endscreen.style.display = 'flex'
      this._clearTimer()
    }
  }
)
