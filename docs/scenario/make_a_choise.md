Make a choise
================================================================================

Example
--------------------------------------------------------------------------------

In the example below,
A button labeled `Yes` and a button labeled `No` are displayed.
If `Yes` button is clicked, `flag` will be set.
If `No` button is clicked, `flag` will be cleared.

Caution: a button whose id is `button1` and
a button whose id is `button2` should be put to HTML,
otherwise no buttons will be displayed.

```yaml
- button:
  - name: button1
    message: Yes
    status:
    - name: flag
      value: on
  - name: button2
    message: No
    status:
    - name: flag
      value: off
```

If `hide: none` is specified, the button will not be hidden when it is clicked.

```yaml
- button:
  - name: button1
    message: Yes
    hide: none
    status:
    - name: flag
      value: on
```
