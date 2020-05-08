---
layout: blog-post
permalink: /blog/phaser-tut
categories: [blog]
title: Phaser 3 Initialization Tutorial
description: How to initialize a Phaser 3 game
tags: [coding, phaser, tutorial]
comments: true
---

Below is a quick walkthrough on how to initialize a web browser game using Phaser 3.

<figure>
  
  <img src="/assets/images/bubbas-image.png" width="300px"/>
  <figcaption>
    Sample web game created with Phaser 3
  </figcaption>
</figure>

# Download Node.js

Download Node.js from the <a href="https://nodejs.org/en/">official website</a> and follow the instructions there. Check that you have Node.js by running 

<div class="blog-file-label">terminal/command line</div>
{% highlight html %}
node --version
{% endhighlight %}


# Download http-server

Download <b><i>http-server</i></b> using npm. With this, you are able to launch your own web server and serve up the game.

<div class="blog-file-label">terminal/command line</div>
{% highlight html %}
npm install http-server
{% endhighlight %}


Check the you have http-server by running the following.

<div class="blog-file-label">terminal/command line</div>
{% highlight html %}
http-server .
{% endhighlight %}

Your terminal should say
{% highlight html %}
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://your.ip.address:8080
{% endhighlight %}
If you see this, that means that
your folder is being correctly served You can check this by visiting <span class="ib">localhost:8080</span> through your fave browser.
You can abort your server by hitting Ctrl+C in terminal.


# Initial HTML file

Create a root folder. Inside it, have a file called <span class="ib">index.html</span>. This is the main page that will be served by your server. Import <span class="ib">Phaser.js script</span> from online to enable Phaser.js functionalities, and import a file called <i><b>main.js</b></i> (which we'll edit in a while).

<div class="blog-file-label">index.html</div>
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

Using <span class="ib">main.js</span>, you can initialize a Phaser game with your very own scenes and configurations.


My scene names are <span class="ib">StartGame</span> and <span class="ib">Game</span>, but you can replace yours with a different set of names.
Don't forget to replace <i><b>startGame.js, game.js, ...</b></i> too with the different files you'd use for your game.


<div class="blog-file-label">main.js</div>
{% highlight javascript %}
/* Replace with your own scene names and file names */
import StartGame from "./startGame.js"
import Game from "./game.js"

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
  scene: [StartGame, Game] /* Replace with scene objects that you imported */
}

new Phaser.Game(config)
{% endhighlight %}


# Initialize scene

Now, add these to each of your scene files. Each scene must extend Phaser.Scene, and inherit two functions, <b><i>preload()</i></b> and <b><i>create()</i></b>.

<div class="blog-file-label">startGame.js</div>
{% highlight javascript %}
/* Replace StartGame with scene name */
export default class StartGame extends Phaser.Scene { 
  constructor() {
    super("startGame") /* Replace with scene key */
  }
  preload() {

  }
  create() {
    
  }
}


{% endhighlight %}
Make sure to replace <i><b>StartGame</b></i> with your scene name, and replace <i><b>"startGame"</b></i> with a scene key. Do the same for <b>Game.js</b> or whatever scene your game has.

# Add components
Now, you can add components, such as rectangles, images, interaction, sounds, etc to your game.
<br/>

<b>Example</b>
<div class="blog-file-label"> startGame.js</div>
{% highlight javascript %}
create() {
  this.add.rectangle(0, 0, 200, 100, 0xff0000)
}
{% endhighlight %}


Here is a <a href="/blog/phaser">cheat sheet</a> for the various components you can add to make your game.



# Launch Game
Now, open  your terminal
<br/>

Activate your game to see if it works.

<div class="blog-file-label">terminal/command line</div>
{% highlight html %}
http-server .
{% endhighlight %}

<b>What you should see</b>
<br/>
When you open up localhost:8080, or whatever port in your browser, here is what you should see.

<img src="/assets/images/blog/phaserRect.png" width="300px"/> 

# Done

Hooray! We've just intialized a generic Phaser Game. We can further build on this by <a href="/blog/phaser">adding components</a> and logic.
