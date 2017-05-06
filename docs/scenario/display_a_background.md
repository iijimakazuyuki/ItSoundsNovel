Display a background
================================================================================

Example
--------------------------------------------------------------------------------

To display a background image,
specify the path to the background image.

```yaml
- background:
    image: path/to/image.jpg
- I am a cat. I don't have my name yet.
```

To change background color, specify the color.

```yaml
- background:
    color: white
- I am a cat. I don't have my name yet.
```

The background will be displayed and the next direction will be executed
simultaneously unless `next: wait` is specified.

```yaml
- background:
    image: path/to/image.jpg
  next: wait
- I am a cat. I don't have my name yet.
```

To change the display speed, specify the duration or the timing function.

```yaml
- background:
    image: path/to/image.jpg
  config:
    duration: 5000
    timingFunction: linear
- I am a cat. I don't have my name yet.
```

To change the default display speed, specify only `config`.

```yaml
- config:
    background:
      duration: 100
      timingFunction: linear
- background:
    image: path/to/image.jpg
- I am a cat. I don't have my name yet.
```

To remove a background image, write `control: remove`.

```yaml
- background:
    control: remove
```
