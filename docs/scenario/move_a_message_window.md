Move a message window
================================================================================

Example
--------------------------------------------------------------------------------

In the example below, the message window will move in 500 milliseconds.
`scaleX` and `scaleY` means a ratio of scaling up and down.
Both default values of those are `1`.
`rotateX`, `rotateY` and `rotateZ` means angle of rotation.
All default values of those are `0deg`.

```yaml
- config:
    message:
      position:
        x: 100
        y: 100
        scaleX: 0.5
        scaleY: 0.5
        rotateZ: 30deg
        duration: 500
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
