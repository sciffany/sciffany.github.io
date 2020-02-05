---
layout: plain-post
permalink: /foof-design/
categories: [games]
image: map-design
description: 2D tile-based map designer for Foof Game below
algo:
challenge:
graphics: Adobe Photoshop, MS Paint
lang: AS3
---

<div align="center" style="margin-bottom: 20px;">

Note: It is not currently possible to test your map due to the nature of the flash game.

  <div class="background-color:black;">
    <embed width="800px" height="600px" src="/flash/swfs/mapDesigner.swf" />
  </div>

<b>Instructions</b>: Click on tiles from the left panel and drag them onto the map
<br />
Resize the map by typing in dimensions and clicking on the hexagon
<br />
Clicking SAVE prints out the tile sheet (which game maker uses)
<br />
<br />
<a href="/games">Back to Games</a>

  <script>
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var fh = fso.CreateTextFile("/test.txt", 8, true);
    fh.WriteLine("foo");
    fh.Close();
  </script>

</div>
