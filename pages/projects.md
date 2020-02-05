---
layout: page
title: Projects
permalink: /projects/
order: "2"
---

<h3><b>Software projects</b></h3>

{% for post in site.categories["project"] %}

- [{{post.title}}](#{{post.ref}}) {%if post.star %}![](/assets/images/star.jpg) {%endif%}
  {% endfor %}

<h3><b>WIP Projects</b></h3>
{% for post in site.categories["wipProject"] %}

- [{{post.title}}](#{{post.ref}}) {%if post.star %}![](/assets/images/star.jpg) {%endif%}
  {% endfor %}

<br />

<br />

{% for post in site.categories["project"] %}
{% include project-post.html %}

{% endfor %}

<h3><b>WIP Projects</b></h3>

{% for post in site.categories["wipProject"] %}
{% include project-post.html %}

{% endfor %}
