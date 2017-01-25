Load a scenario
================================================================================

Example
--------------------------------------------------------------------------------

Below example loads your scenario, but it cannot be displayed
unless there is a message window.
The `window` argument is necessary for saving or loading progress.

```html
<script src="{path/to/it-sounds-novel.js}"></script>
<script type="text/javascript">
    var ItSoundsNovel = require('it-sounds-novel');
    var scenario = new ItSoundsNovel.Scenario(window);
    scenario.load('{your scenario file name here}');
</script>
```
