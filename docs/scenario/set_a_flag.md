Set a flag
================================================================================

Example
--------------------------------------------------------------------------------

In the example below, `flag1` will be set and `flag2` will be cleared.
And a status message, `flag1 is on` will be displayed in the status window.

```yaml
- status:
    name: flag1
    value: on
    display: 'flag1 is set'
- status:
    name: flag2
    value: off
```

In the example below, `variable` will be set an integer between 1 and 5.
And `${value}` in the status message will be that value.

```yaml
- status:
    name: variable
    value:
      type: random
      min: 1
      max: 5
    display: variable is ${value}
```

To clear the status message, specify `display: none`.

```yaml
- status:
    name: flag1
    display: none
- status:
    name: flag2
    value: on
    display: none
```

To display a status message in another status window, specify `target`.

```yaml
- status:
    name: flag1
    display: 'flag1 is set'
    target: '#anotherWindow'
```
