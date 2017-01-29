Display a background image
================================================================================

Example
--------------------------------------------------------------------------------

```yaml
- background:
    image: path/to/image.jpg
- I am a cat. I don't have my name yet.
```

The background image will be displayed and the next direction will be executed
simultaneously unless `next: wait` is specified.

```yaml
- background:
    image: path/to/image.jpg
  next: wait
- I am a cat. I don't have my name yet.
```

To change the display speed, specify the duration.

```yaml
- background:
    image: path/to/image.jpg
  config:
    duration: 5000
- I am a cat. I don't have my name yet.
```

To change the default display speed, specify only `config`.

```yaml
- config:
    background:
      duration: 100
- background:
    image: path/to/image.jpg
- I am a cat. I don't have my name yet.
```
