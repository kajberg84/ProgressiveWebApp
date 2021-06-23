# &lt;berg-application-main&gt;

A web component that behavs and should feel like an user-interface on an ordinary operating system.

## CustomEvent

### Dispatching name of clicked app

| Event Name | Fired When             |
| ---------- | -----------------------|
| `appname`  | clicking on a appicon. |

## Styling with CSS

Maincolor for this application.

```css
:host{
  --color:#52307c;(purple)
}
```

## Applications

```html
<button name='chat'></button>
<button name='memory'></button>
<button name='animal'></button>
```
