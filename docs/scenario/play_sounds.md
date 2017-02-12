Play sounds
================================================================================

Example
--------------------------------------------------------------------------------

```yaml
- I don't know where I was born.
- sound: path/to/sound.mp3
- I only remember that I was meowing in dim and wet place.
- sound:
  - path/to/sound.mp3
  - path/to/sound.ogg
- I saw something called human beings for the first time there.
```

To stop playing sound, write `sound: stop`.

```yaml
- I don't know where I was born.
- sound: path/to/sound.mp3
- I only remember that I was meowing in dim and wet place.
- sound: stop
- I saw something called human beings for the first time there.
```
