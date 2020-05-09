---
layout: blog-post
permalink: /blog/phaser-tut
categories: [blog]
title: Phaser 3 Initialization Tutorial
description: How to initialize a Phaser 3 game
tags: [coding, phaser, tutorial]
comments: true
---

Below is a quick walkthrough on how to initialize a web browser game using Phaser 3. We will be producing the following "Hello World" scene.

<img src="/assets/images/blog/phaserRect.png" width="400px;" align="center">

# Step 1: Download Node.js
---

We need Node.js to be able to use http-server which serves our resources to the browser.

Download Node.js from the <a href="https://nodejs.org/en/">official website</a> and follow the instructions there. Check that you have Node.js by running the following on your command line.

    $ node --version

Node package manager (npm) should come installed with Node.js.

# Step 2: Download http-server
---

After downloading Node.js and npm, download http-server using npm.

{% highlight html %}
$ npm install http-server
{% endhighlight %}

With this, you are able to launch your own web server and serve up the game.
Check the you have http-server by running the following command.

{% highlight html %}
$ http-server .
{% endhighlight %}

Your terminal should display the following message.
{% highlight html %}
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://your.ip.address:8080
{% endhighlight %}
If you see this, that means that
your folder is being correctly served. You can check this by visiting <span class="b">localhost:8080</span> through your fave browser.
You can abort your server by hitting Ctrl+C in terminal.

# Step 3: Initial HTML file
---

Create a folder. Inside it, create a file called **index.html.**

This is the main page that will be served by your server. 

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

Here, we import `phaser.js` script from online to enable Phaser.js functionalities, and import a file called `main.js` (which we'll edit in a while).

# Step 4: Initialize Phaser in javascript
---

Using <span class="b">main.js</span>, you can initialize a Phaser game with your very own scenes and configurations.


My scene names are `StartGame` and `Game`, but you can replace yours with a different set of names.
Don't forget to replace `startGame.js` and `game.js` too with the different files you'd use for your game.


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

# Step 5: Initialize scene
---

In **StartGame.js** and your other scene files, make each scene extend Phaser.Scene, and inherit two functions, `preload()` and `create()`.

<div class="blog-file-label">startGame.js</div>
{% highlight javascript %}
/* Replace StartGame with scene name */
export default class StartGame extends Phaser.Scene { 
  constructor() {
    super("startGame") /* Replace with scene key */
  }
  preload() {
    // to be filled
  }
  create() {
    // to be filled
  }
}

{% endhighlight %}
Make sure to replace <b>StartGame</b> with your scene name, and replace <b>"startGame"</b> with any scene key to identify the scene. Do the same for <b>Game.js</b> or whatever scene your game has.


# Step 6: Add components
---

Now, you can add components, such as rectangles, images, interaction, sounds, etc to your game.
<br/>

**Example**
<br/>
Here, we add the text "Hello World!" in the center of our game, and set the anchor point of the text to the middle.

<div class="blog-file-label"> startGame.js</div>
{% highlight javascript %}
create() {
    const textSprite = this.add.text(400, 300, 'Hello World in Phaser 3!', { fontFamily:'Arial', fontSize: "30px", fill: "#00ff00" })
    textSprite.setOrigin(0.5, 0)
}
{% endhighlight %}


Here is a <a href="/blog/phaser">cheat sheet</a> for the various components you can add to make your game.

# Step 7: Launch Game
---

Now, open  your terminal
<br/>

Activate your game to see if it works.

{% highlight html %}
$ http-server .
{% endhighlight %}

<b>What you should see</b>
<br/>
When you open up localhost:8080, or whatever port in your browser, here is what you should see.

<img src="/assets/images/blog/phaserRect.png" width="300px"/> 

# Hooray!

We've just intialized a generic Phaser Scene. We can further build on this by <a href="/blog/phaser">adding components</a> and logic.
