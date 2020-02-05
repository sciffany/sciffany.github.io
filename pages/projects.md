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

<br />

{% for post in site.categories["project"] %}
{% include project-post.html %}

{% endfor %}
