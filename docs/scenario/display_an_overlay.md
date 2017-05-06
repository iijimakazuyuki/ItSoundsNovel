Display an overlay
================================================================================

Example
--------------------------------------------------------------------------------

To display an overlay, specify the color.

```yaml
- overlay:
    color: red
    opacity: 0.1
- I am a cat. I don't have my name yet.
```

An overlay will cover a background window.

An overlay can be used for a flash.

```yaml
- overlay:
    color: white
  config:
    duration: 100
    timingFunction: ease-out
  next: wait
- overlay:
    color: transparent
  config:
    duration: 100
    timingFunction: ease-in
  next: wait
- I am a cat. I don't have my name yet.
```
