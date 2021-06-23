/**
 * The main script file of the application.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */
import './components/berg-flipping-tile/berg-flipping-tile.js'
import './components/berg-application-main/berg-application-main.js'
import './components/berg-application-window/berg-application-window.js'
import './components/berg-memory-game/berg-memory-main.js'
import './components/berg-chat/berg-chat.js'

const appMain = document.querySelector('#application-main')
let appPosition = 15
const allApplications = [] // All apps for easier handling.

// EventListener for appname from "berg-application-main".
document.addEventListener('appname', (event) => {
  if (appPosition < 1) {
    appPosition = 15
  }
  // Creating application and window.
  const createApp = document.createElement(event.detail.appName)
  const applicationWindow = document.createElement('berg-application-window')

  // Setting attributes and styles to application window.
  createApp.setAttribute('slot', 'applicationslot')
  applicationWindow.setAttribute('slot', 'mainwindowslot')
  applicationWindow.style.top = `${appPosition}%`
  applicationWindow.style.left = `${appPosition}%`
  applicationWindow.style.position = 'absolute'
  applicationWindow.style.zIndex = `${allApplications.length + 1}`
  applicationWindow.setAttribute('appuniqid', `${event.detail.appUniqId}`)

  // Setting focused window ontop all other.
  applicationWindow.addEventListener('mousedown', () => {
    allApplications.forEach((app) => {
      if (app.style.zIndex > applicationWindow.style.zIndex) {
        app.style.zIndex--
      }
    })
    applicationWindow.style.zIndex = allApplications.length
  })

  applicationWindow.appendChild(createApp)
  allApplications.push(applicationWindow)
  appMain.appendChild(applicationWindow)
  appPosition--
})

// EventListener on appremoval from "berg-application-window"
document.addEventListener('removeapp', (event) => {
  const removeUniqId = event.detail.removeapp.getAttribute('appuniqid')
  // Removing app uniqid from array.
  allApplications.forEach((app, index) => {
    if (app.getAttribute('appuniqid') === removeUniqId) {
      allApplications.splice(index, 1)
    }
  })
})
