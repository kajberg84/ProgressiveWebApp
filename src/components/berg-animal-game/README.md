# &lt;berg-animal-game&gt;

A web component that represents animals finding home.

## Attributes

### `draggable`

A Boolean attribute which, if true, allowed to drag the object.
Default value: undefined

### `compare`

An own attribute for comparing the animals with their living place.

## Events

| Event Name | Fired When             |
| ---------- | -----------------------|
| `dragstart`| Starts dragging.       |
| `drag`     | Dragging.              |
| `dragenter`| Object enters target.  |
| `dragleave`| Object leaves target.  |
| `drop`     | Object is released.    |
| `dragover` | Object Enters a target.|


## Styling with CSS

The main window is a grid-template.

On all animals:

```html
    <img id='' compare='forest' class='animals' draggable = 'true'/>
```

On all dropzones:

```html
   <div id='forest' class='dropzones'>forest</div>
```

## Implemented methods

* Shuffle
* Starttimer
* Cleartimer
