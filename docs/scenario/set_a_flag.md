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
