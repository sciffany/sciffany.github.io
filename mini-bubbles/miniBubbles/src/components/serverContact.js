import { textConfig } from "./helper.js"
import { productionConf, developerConf } from "./../config.js"

const configToUse = developerConf

const { GAME_DEV, SERVER_URL } = configToUse

const X_OFFSET = 400
const Y_OFFSET = 600

const GAME_ID = "74"

/*
 * Contacts the server and returns myObj if possible.
 * If not, then alert the status or messages the user something is wrong
 */
async function serverContact(datastring, messageSetter) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: encodeDataString(datastring)
    })

    const status = await response.status
    const message = await response.text()
    const myObj = await JSON.parse(message)

    if (status === 200) {
      messageSetter("Contacted server")
      return myObj
    } else {
      alert(`State: ${readyState} | status: ${status}`)
    }
  } catch (error) {
    messageSetter("Oops! Something went wrong. Please try again.")
  }
  return
}

/*
 * Function that handles contents of myObj during start game
 * displays message to user for different done states
 */
export async function handleStartGame(scene) {
  const messageSetter = messageBox(scene)
  const myObj = await serverContact(
    {
      gameID: GAME_ID,
      startgame: "create",
      gamedev: GAME_DEV
    },
    messageSetter
  )

  if (!myObj) {
    return
  }
  var message
  switch (myObj.done) {
    case "1":
      /* start game*/
      return myObj
      break
    case "10":
      /* not logged in*/
      message = "Oops! It appears you are not logged in."
      break
    case "11":
      /* game record not created */
      message = "Hmmm... Game record was not created. Please try again."
      break
    case "13":
      /* game record not created */
      message = "Hmmm... Game record not found. Score not saved."
      break
    case "15":
      /* unknown game status */
      message = "Hmmm... Unable to determine game status. Please try again"
      break
    default:
      /* unknown response received: done */
      message = "Hmmm... There was an unknown response."
  }
  messageSetter(message)
  return
}

/*
 * Function that handles contents of myObj during end game
 * displays message to user for different done states
 */
export async function handleEndGame(scene, messageSetter) {
  const myObj = await serverContact(
    {
      gameID: GAME_ID,
      startgame: "savescore",
      authcode: scene.authCode - scene.finalScore,
      finalScore: scene.finalScore,
      gameTime: scene.gameTime,
      gamedev: GAME_DEV
    },
    messageSetter
  )

  var message

  switch (myObj.done) {
    case "2":
      /* score saved */
      var paid = myObj.paid /* were game tokens paid out? */
      var pbest = myObj.pbest /* was this your personal best score? */
      message = "Score saved. "
      if (paid > 0) {
        message += " " + paid + " tokens added."
      } else {
        message += " No tokens paid."
      }
      if (pbest > 0) {
        message += " Personal Best Score!"
      }
      break
    case "10":
      /* not logged in*/
      message = "Oops! It appears you are not logged in."
      break
    case "11":
      /* game record not created */
      message = "Hmmm... Game record was not created. Please try again."
      break
    case "12":
      /* game record not created */
      message = "Hmmm... Authentication failed. Play another game!"
      break
    case "13":
      /* game record not created */
      message = "Hmmm... Game record not found. Score not saved."
      break
    case "15":
      /* unknown game status */
      message = "Hmmm... Unable to determine game status. Please try again"
      break
    default:
      /* unknown response received: done */
      message = "Hmmm... There was an unknown response. (" & myObj.done & ")"
  }

  messageSetter(message)
}

/*
 * Adds a sprite below the page to show status message.
 * Returns messageSetter - a function for setting messages.
 */
function messageBox(scene) {
  // scene.add.rectangle(X_OFFSET, Y_OFFSET, 800, 150, 0x000000)
  const textSprite = scene.add
    .bitmapText(300, Y_OFFSET - 50, "blow", "Contacting server..", 40)
    .setDataEnabled()

  textSprite.setOrigin(0.5)
  const messageSetter = message => textSprite.setText(message)
  return messageSetter
}

/*
 * Encodes datastring (obj) into a string
 */
function encodeDataString(datastring) {
  let urlEncodedDataPairs = [],
    name

  for (name in datastring) {
    urlEncodedDataPairs.push(
      encodeURIComponent(name) + "=" + encodeURIComponent(datastring[name])
    )
  }

  return urlEncodedDataPairs.join("&").replace(/%20/g, "+")
}
