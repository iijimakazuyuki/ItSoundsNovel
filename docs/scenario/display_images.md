Display images
================================================================================

Example
--------------------------------------------------------------------------------

To display an image, name it and specify the path to an image file.
`z` means display order (`z-index`). The larger covers the smaller.
The default value of `z` is `-1`.
The value of `z` of background image is `-1000`.
`scaleX` and `scaleY` means a ratio of scaling up and down.
Both default values of those are `1`.
`rotateX`, `rotateY` and `rotateZ` means angle of rotation.
All default values of those are `0deg`.
The image will be displayed and the next direction will be executed
simultaneously unless `next: wait` is specified.

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
    z: -2
    scaleX: 0.01
    scaleY: 0.01
    rotateX: 180deg
  next: wait
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

The displayed image can be scaled.
In the example below, the image will be enlarged.

```yaml
- image:
    name: cat
    source: image/cat.png
    x: 10
    y: 10
    scaleX: 0.01
    scaleY: 0.01
  config:
    duration: 10
  next: wait
- image:
    name: cat
    scaleX: 1.0
    scaleY: 1.0
```

The displayed image can be rotated.
In the example below, the image will be turned over vertically.

```yaml
- image:
    name: cat
    source: image/cat.png
    x: 10
    y: 10
  config:
    duration: 10
  next: wait
- image:
    name: cat
    rotateX: 180deg
```

To change the display speed or moving speed, specify the duration
or the timing function.

```yaml
- image:
    name: cat
    source: image/cat.png
    x: 10
    y: 10
  config:
    duration: 5000
    timingFunction: ease-out
- wait
- image:
    name: cat
    x: 10
    y: 100
  config:
    duration: 100
    timingFunction: linear
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
      timingFunction: linear
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
