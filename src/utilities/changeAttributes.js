/**
 * Setting attributes.
 *
 * @param {string} tile - Tile to set.
 * @param {string} attri - Attribute to set.
 */
export function setAttributes (tile, attri) {
  if (attri === 'hidden') {
    window.setTimeout(() => {
      tile.setAttribute('hidden', '')
    }, 650)
  } else {
    tile.setAttribute(attri, '')
  }
}

/**
 * Removing attributes.
 *
 * @param {string} tile - faceuptile.
 */
export function removeAttributes (tile) {
  window.setTimeout(() => {
    tile.removeAttribute('face-up', '')
    tile.removeAttribute('disabled', '')
  }, 850)
}
