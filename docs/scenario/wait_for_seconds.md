Wait for seconds
================================================================================

Example
--------------------------------------------------------------------------------

```yaml
- I don't know where I was born.
- wait: 5000
- I only remember that I was meowing in dim and wet place.
```

To wait for seconds in the displaying sentence,
put control sequences into the sentence.
In the example below, `${sleep=1000}` will not be displayed
but the next character will be delayed for 1000 milliseconds.

```yaml
- I am a cat.${sleep=1000} I don't have my name yet.
```
