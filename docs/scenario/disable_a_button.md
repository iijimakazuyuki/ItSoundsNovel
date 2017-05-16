Disable a button
================================================================================

Example
--------------------------------------------------------------------------------

To disable the next button, make its status `unavaiable`.

```yaml
- config:
    ui:
      next:
        status: unavaiable
```

To hide the next button, make its status `invisible`.

```yaml
- config:
    ui:
      next:
        status: invisible
```

To show and enable the next button, make its status `avaiable`.

```yaml
- config:
    ui:
      next:
        status: avaiable
```

A save button and a load button can be used similarly.
