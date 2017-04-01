Change the display speed of sentences
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
is different from that of the first sentence.

```yaml
- I am a cat. I don't have my name yet.
- config:
    delay: 10
    duration: 100
- I don't know where I was born.
- I only remember that I was meowing in dim and wet place.
```

To change the display speed in the displaying sentence,
put control sequences into the sentence.
In the example below, `${delay=10}` and `${duration=100}`
will not be displayed but change the display speed for the remaining letters.

```yaml
- I am a cat.${delay=10}${duration=100} I don't have my name yet.
```
