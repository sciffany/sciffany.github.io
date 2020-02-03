---
layout: page
title: Projects
permalink: /projects/
order: "2"
---

<h2><b>Software projects</b></h2>

{% for post in site.categories["project"] %}

- [{{post.title}}](#{{post.ref}})

{% endfor %}

<div style="font-size: 18px; margin-bottom: 30px">

    <!-- Having worked in various tech roles in the last few years,
    I gained valuable experience in  -->

</div>

{% for post in site.categories["project"] %}

<article class="archive-item">

    <a name="{{post.ref}}"></a>


    <div class="card-contents">
        <div class="card-col-1">

        <div class="hover-image">
            <img src="/assets/images/{{post.image}}.png" width="300px" height="250px"  border="2" style="border-radius: 10px; object-fit: cover; border-color: black;"/>
        </div>
        </div>
        <div class="card-col-2">
        <h3 style="margin-bottom:10px;"> <b>{{post.title}} </b></h3>

        {{post.content}}

        </div>

    </div>

</article>

{% endfor %}
