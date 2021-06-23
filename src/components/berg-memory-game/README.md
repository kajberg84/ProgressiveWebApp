# &lt;berg-memory-game&gt;

A web component that represents a memory game.

## Attributes

### `boardsize`

The `boardsize` attribute, specifies the size of the grid. Its value must be `large` (4x4), `medium` (4x2) or `small` (2x2).

Default value: large

The `uniqid` attribute, is set to all the tiles that the memory-game is creating. Same `uniqid` for same tile.

## Events

| Event Name      | Fired When          |
| --------------- | --------------------|
| `tileflip`      | One tile is flipped.|

## Methods

* ### ShufflingTiles

* ### FlippingTiles

Storing one flipped tile(if only one).  
When second is flipped comparing with stored tile.  
If correct hide it.  
If wrong flipp both tiles back.

* ### RetryMethod

Allowing player to retry after game is done.

* ### EndScore

#### Only on largeboard

##### Different outputs that depends on

Time  
Flipped tries

Exampel:  
If all corrects(16 flipped tiles):
`Go buy a lottery ticket!!!`

### Import

#### Importing fontstyle from

* [GoogleApis.com](https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap)
