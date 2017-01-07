Play background music
================================================================================

Example
--------------------------------------------------------------------------------

To play background music, write `bgm:`
and specify the path to a music file or files.
To stop background music, write `bgm: stop`.

```yaml
- bgm: path/to/bgm_1.mp3
- I am a cat. I don't have my name yet.
- bgm:
  - path/to/bgm_2.mp3
  - path/to/bgm_2.ogg
- I don't know where I was born.
- bgm: stop
- I only remember that I was meowing in dim and wet place.
```

Background music repeats unless you specify `loop: none`.

```yaml
- bgm: path/to/bgm.mp3
  loop: none
```

Background music repeats from its beginning to the end
unless you specify `loop: head:` by seconds.
In the example below, when the background music is played to the end,
it will repeat from 2.5 seconds.

```yaml
- bgm: path/to/bgm.mp3
  loop:
    head: 2.5
```
