---
layout: blog-post
title: Applets
permalink: /blog/applets/
---

{% for post in site.categories["applet"] %}

<h3>
    <a href = "{{post.link}}"> {{post.title}}</a> {%if post.star %} <img src="/assets/images/star.jpg"> {%endif%}
</h3><div class="blog-index"> {{post.description}}

<div class="gray">
    {{post.date | date: "%B %-d, %Y"}}
</div>
<br />

</div>
{% endfor %}
