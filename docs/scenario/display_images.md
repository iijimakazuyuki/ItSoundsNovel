Display images
================================================================================

Example
--------------------------------------------------------------------------------

To display an image, name it and specify the path to an image file.

```yaml
- image:
    name: cat1
    source: image/cat1.png
    x: 10
    y: 10
- image:
    name: cat2
    source: image/cat2.png
    x: 100
    y: 10
```

The displayed image can be moved.
In the example below, the image will move from left to right.

```yaml
- image:
    name: cat
    source: image/cat.png
    x: 10
    y: 10
- wait
- image:
    name: cat
    x: 100
    y: 10
```

To change the display speed or moving speed, specify the duration.

```yaml
- image:
    name: cat
    source: image/cat.png
    x: 10
    y: 10
  config:
    duration: 5000
- wait
- image:
    name: cat
    x: 10
    y: 100
  config:
    duration: 100
- wait
```

To change the default display speed or moving speed, specify only `config`.

```yaml
- image:
    name: cat
    source: image/cat.png
    x: 10
    y: 10
- wait
- image:
    name: cat
    source: image/cat.png
    x: 100
    y: 10
- wait
- config:
    image:
      duration: 100
- image:
    name: cat
    x: 10
    y: 10
- wait
```

To remove an image, write its name and `control: remove`.

```yaml
- image:
    name: cat
    control: remove
```
