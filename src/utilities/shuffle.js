/**
 * Shuffling Module.
 *
 * @author Kaj Berg <kb223aw@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Fisher-Yates Shuffle.
 *
 * @param {string[]} array - array with images.
 * @returns {string[]} - shuffled array.
 */
export function shufflesArray (array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}
