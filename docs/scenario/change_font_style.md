Change font style
================================================================================

Example
--------------------------------------------------------------------------------

To change font style for only one sentence,
specify both `message` and `config`.

In the example below, the font style of the first sentence
is different from that of the second sentence.

```yaml
- config:
    fontSize: large
    fontStyle: italic
    fontWeight: bold
    fontFamily: cursive
    color: red
  message: I am a cat. I don't have my name yet.
- I don't know where I was born.
```

To change default font style, specify only `config`.

In the example below, the font style of the second or third sentence
is different from that of the first sentence.

```yaml
- I am a cat. I don't have my name yet.
- config:
    fontSize: large
    fontStyle: italic
    fontWeight: bold
    fontFamily: cursive
    color: red
- I don't know where I was born.
- I only remember that I was meowing in dim and wet place.
```

To change font style in the displaying sentence,
put control sequences into the sentence.
In the example below, `${fontSize=large}` and `${fontWeight=bold}`
will not be displayed but change the font style of the remaining letters.

```yaml
- I am a cat.${fontSize=large}${fontWeight=bold} I don't have my name yet.
```
