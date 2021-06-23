/**
 * The berg-chat module
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

import { EmojiButton } from '@joeattardi/emoji-button'

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
  #chatarea {
    width:450px;
    height:500px;
    background-color:#ECFFFB;
    position:relative;
    border:solid 10px #52307c;
    color:#00C000;
  }

  #nickname {
    color:#000;
    display:flex;
    position:absolute; 
    z-index:1000;
    flex-direction:column;
    width:100%;
    height:100%;
    top:0;
    left:0;
    justify-content: center;
    align-items: center;
    background-color: rgba(82, 48, 124, 0.5);
  }

  #chatlist {
    height:399px;
    list-style:none;
    overflow-y:scroll;
    padding:0px;
    margin:0px;
  }

/* Input fields */
  #sendarea {
    display:flex;
    justify-content: center;
    flex-direction:row;
    bottom: 0;
    margin:3px;
    width: 95%;
    height:95px;
  }
  #nameid {
    text-align: center;
    width:100px;
    height:30px;
  }
  #chatmessage {
    width:100%;
  }
  .mytext {
    color:blue;
  }

/* Buttons */
  #namebutton{
    margin:10px;
    background-color:#52307c;
    color:yellow;
    width:100px;
    height:30px;

  }

  #chatbutton {
    margin:2px;
    justify-content: center;
    background-color:#52307c;
    color:yellow;
    width:50px;
    height:50px;
  }

  #emojibutton {
    margin:2px;
    justify-content: center;
    background-color:#52307c;
    position:relative;
    width:50px;
    height:30px;
  }

  </style>
<div id='chatarea'>
  <ul id='chatlist'></ul> 

  <div id='nickname'>
    <label for='name'>Nickname</label>
    <input type='text' name='name' id='nameid' placeholder='Nickname here...'>
    <button id='namebutton'>Start chat</button>
  </div>

  <div id='sendarea'>
    <textarea type='text' id='chatmessage' placeholder='Write here...'></textarea>
    <div>
    <button id='chatbutton'>Send</button>
    <button id='emojibutton'>😉</button>
    </div>
  </div>

</div>
`

/*
 * Define custom element.
 */
customElements.define('berg-chat',
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
      this._chatArea = this.shadowRoot.querySelector('#chataarea')
      this._nickPage = this.shadowRoot.querySelector('#nickname')
      this._nameButton = this.shadowRoot.querySelector('#namebutton')
      this._chatButton = this.shadowRoot.querySelector('#chatbutton')
      this._input = this.shadowRoot.querySelector('#nameid')
      this._chatMessage = this.shadowRoot.querySelector('#chatmessage')
      this._headLine = this.shadowRoot.querySelector('#nickname label')
      this._chatList = this.shadowRoot.querySelector('#chatlist')
      // Binds.
      this._nickname = this._nickname.bind(this)
      this._sendMessage = this._sendMessage.bind(this)
      // Create WebSocket connection.
      this.ws = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      // Handling emoji.
      this._emojiButton = this.shadowRoot.querySelector('#emojibutton')
      this._picker = new EmojiButton({
        emojisPerRow: 5,
        rows: 6,
        showSearch: false,
        showPreview: false,
        showRecents: false,
        zIndex: 1000
      })
    }

    /**
     * ConnectedCallBack.
     *
     */
    connectedCallback () {
      this._nameButton.addEventListener('click', (event) => {
        this._nickname(event)
      })
      this._chatButton.addEventListener('click', (event) => {
        this._sendMessage(event)
      })
      this._chatButton.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          this._sendMessage(event)
        }
      })

      /**
       * Connect to server.
       *
       * @param {*} event - event.
       */
      this.ws.onopen = (event) => {
        console.log('Connecting to server')
      }

      /**
       * Server response.
       *
       * @param {*} event - Event.
       */
      this.ws.onmessage = (event) => {
        console.log('Listening for message')
        console.log(`server got message ${event.data}`)
        this._writeToChat(event)
      }

      // Adding eventhandler on emojibutton
      this._emojiButton.addEventListener('click', (event) => {
        event.preventDefault()
        this._picker.togglePicker(this._emojiButton)
        console.log(this._picker.options)
      })

      this._picker.on('emoji', selection => {
        this._chatMessage.value += selection.emoji
      })
    }

    /**
     * Outputs to server.
     *
     * @param {*} event - Event.
     */
    _writeToChat (event) {
      const parsedResponse = JSON.parse(event.data)
      // Creating an li with message and appending it to ul.
      const li = document.createElement('li')
      li.textContent = `${parsedResponse.username}: ${parsedResponse.data}`
      this._chatList.appendChild(li)
    }

    /**
     * Handling nickname value.
     *
     * @param {*} event - event from buttonpress.
     */
    _nickname (event) {
      event.preventDefault()
      const nick = this._input.value
      if (nick.match(/^[a-zA-Z0-9\u00c0-\u017e\s]+$/)) {
        if (nick.length < 3 || nick.length > 35) {
          this._headLine.textContent = 'Nickname between 3-35 chars.'
        } else {
          this._nickPage.style.display = 'none'
          this._chatObject(nick)
        }
      }
    }

    /**
     * Inserting nickname to messageobject.
     *
     * @param {string} nick - Nickname.
     */
    _chatObject (nick) {
      this.message = {
        type: 'message',
        data: 'The message text is sent using the data property',
        username: `${nick}`,
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
    }

    /**
     * Handling text from textarea.
     *
     * @param {*} event - event.
     */
    _sendMessage (event) {
      event.preventDefault()
      this.message.data = this._chatMessage.value
      const messageJSON = JSON.stringify(this.message)
      this.ws.send(messageJSON)
      this._chatMessage.value = ''
    }
  }
)
