Change message window color
================================================================================

Example
--------------------------------------------------------------------------------

In the example below, background color of the message window will change
in 500 milliseconds.

```yaml
- config:
    message:
      background:
        color: black
        duration: 500
        timingFunction: ease
```

Background color of the message window  will change and
the next direction will be executed simultaneously
unless `next: wait` is specified.

```yaml
- config:
    message:
      background:
        color: black
        duration: 500
        timingFunction: ease
  next: wait
```
