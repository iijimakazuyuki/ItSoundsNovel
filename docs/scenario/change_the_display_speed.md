Change the display speed
================================================================================

Example
--------------------------------------------------------------------------------

To change the display speed for only one sentence,
specify both `message` and `config`.

In the example below, the display speed of the first sentence
is different from that of the second sentence.

```yaml
- config:
    delay: 10
    duration: 100
  message: I am a cat. I don't have my name yet.
- I don't know where I was born.
```

To change the default display speed, specify only `config`.

In the example below, the display speed of the second or third sentence
is different from than that of the first sentence.

```yaml
- I am a cat. I Don't have my name yet.
- config:
    delay: 10
    duration: 100
- I don't know where I was born.
- I only remember that I was meowing in dim and wet place.
```
