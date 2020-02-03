---
layout: page
title: Experience
permalink: /experience/
order: "1"
---

<h2><b>Work Experience</b></h2>

{% for post in site.categories["work"] %}

- [{{post.role}}, {{post.title}}](#{{post.ref}})

{% endfor %}

<div style="font-size: 18px; margin-bottom: 30px">

    <!-- Having worked in various tech roles in the last few years,
    I gained valuable experience in  -->

</div>

{% for post in site.categories["work"] %}

<article class="archive-item">

<a name="{{post.ref}}"></a>

<h3 > <b>{{post.title}} </b></h3>

<h3 style="color:$grey-color"> <b>{{post.role}}</b></h3>

        {{post.content}}

</article>

{% endfor %}
