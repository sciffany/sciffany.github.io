---
layout: blog-post
permalink: /blog/phaser-tut
categories: [blog]
title: Phaser 3 Initialization Tutorial
description: How to initialize a Phaser 3 game
tags: [gaming]
comments: true
---

Below is a quick walkthrough on how to initialize a web browser game using Phaser 3.
This tutorial assumes you have <a href="https://nodejs.org/en/">Node.js</a> in your system.
<figure>
  
  <img src="/assets/images/bubbas-image.png" width="300px"/>
  <figcaption>
    Sample web game created with Phaser 3
  </figcaption>
</figure>

# Download http-server

We download <b><i>http-server</i></b> using npm. With this, we are able to launch our own web server and serve up the game.

<class class="blog-date">
  <i>terminal/command line</i>
</class>
{% highlight html %}
npm install http-server
{% endhighlight %}


# Initial HTML file

We import Phaser.js script from online, and import our <i><b>main.js</b></i> script as well.

<class class="blog-date">
  <i>index.html</i>
</class>
{% highlight html %}

<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.18/dist/phaser-arcade-physics.min.js"></script>
  </head>
  <body>
      <script type="module" src="main.js"></script>
  </body>
</html> {% endhighlight %}

# Initialize Phaser in javascript

We initialize a Phaser game with our very own scenes and configurations.


My scene names are <i><b>Loading, StartGame, Game, EndGame</b></i>, but you can replace yours with a different set of names.
Don't forget to replace <i><b>game.js, endGame.js, ...</b></i> too with the different files you'd use for your game.


<class class="blog-date">
  <i>main.js</i>
</class>
{% highlight javascript %}
/* Replace with your own scene names and file names */
import Game from "./game.js"
import EndGame from "./endGame.js"
import StartGame from "./startGame.js"
import Loading from "./loading.js"

var config = {
  type: Phaser.CANVAS,
  width: 800, 
  height: 660,
  physics: {
    default: "arcade"
  },
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: [Loading, StartGame, Game, EndGame] /* Replace with scene objects that you imported */
}

new Phaser.Game(config)
{% endhighlight %}




# Initialize scene

Now, each scene must extend Phaser.Scene, and inherit two functions, <b><i>preload</i></b> and <b><i>create</i></b> 

<class class="blog-date">
  <i>endGame.js</i>
</class>
{% highlight javascript %}

export default class EndGame extends Phaser.Scene { //replace
  constructor() {
    super("endGame") //replace
  }
  preload() {

  }
  create() {
    
  }
}

{% endhighlight %}
Make sure to replace <i><b>EndGame</b></i> with your scene name.
<br/>
And replace <i><b>endGame</b></i> with a scene name.



# Add components
Now, we can add components, such as rectangles, images, interaction etc to your game.
<br/>
Here is a <a href="/blog/phaser">cheat sheet.</a>
