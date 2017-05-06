Move a message window
================================================================================

Example
--------------------------------------------------------------------------------

In the example below, the message window will move in 500 milliseconds.
`x` and `y` means the position of the image.
`x` and `y` can be set as `px` or `%`.
`scaleX` and `scaleY` means a ratio of scaling up and down.
Both default values of those are `1`.
`rotateX`, `rotateY` and `rotateZ` means angle of rotation.
All default values of those are `0deg`.
`width` means width of the message window.
`height` means height of the message window.
`width` and `height` can be set as `px` or `%`.
When `width` or `height` is set to `100%`,
the image will fill the background window.

```yaml
- config:
    message:
      position:
        x: 25%
        y: 100
        scaleX: 0.5
        scaleY: 0.5
        rotateZ: 30deg
        duration: 500
        timingFunction: ease-out
        width: 50%
```

The message window  will move and
the next direction will be executed simultaneously
unless `next: wait` is specified.

```yaml
- config:
    message:
      position:
        x: 100
        y: 100
        duration: 500
  next: wait
```
