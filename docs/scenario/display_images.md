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
    x: 10o
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

To remove an image, write its name and `control: remove`.

```yaml
- image:
    name: cat
    control: remove
