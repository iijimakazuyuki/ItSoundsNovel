Load a scenario
================================================================================

Example
--------------------------------------------------------------------------------

Below example loads your scenario, but it cannot be displayed
unless there is a message window.
The `window` argument is necessary for saving or loading progress.

```html
<script src="{path/to/visual-novel.js}"></script>
<script type="text/javascript">
    var VisualNovel = require('visual-novel');
    var scenario = new VisualNovel.Scenario(window);
    scenario.load('{your scenario file name here}');
</script>
```
