Make a branch
================================================================================

Example
--------------------------------------------------------------------------------

In the example below,
if `condition` is `on`, a message will be displayed.

```yaml
- if:
  - name: condition
    value: on
  message: I am a cat. I don't have my name yet.
```

In the example below,
if `condition1` is `on` **and** `condition2` is `on`,
a message will be displayed.

```yaml
- if:
  - name: condition1
    value: on
  - name: condition2
    value: on
  message: I am a cat. I don't have my name yet.
```

In the example below,
if `condition1` is `on` **or** `condition2` is `on`,
a message will be displayed.

```yaml
- if:
  - name: condition1
    value: on
  status:
  - name: condition1or2
    value: on
- if:
  - name: condition2
    value: on
  status:
  - name: condition1or2
    value: on
- if:
  - name: condition1or2
    value: on
  message: I am a cat. I don't have my name yet.
```
