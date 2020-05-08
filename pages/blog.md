---
layout: blog-post
title: Blog
permalink: /blog/
order: "5"
---

{% for post in site.categories["blog"] %}

<h2>
    <a href = "{{post.permalink}}"> {{post.title}}</a> {%if post.star %}![](/assets/images/star.jp {%endif%}
</h2><div class="blog-index"> {{post.description}}

<div class="gray mini">
    Tags: {%for tag in post.tags %} {{ tag }} | {%endfor%}
</div>

<div class="gray">
    {{post.date | date: "%B %-d, %Y" }}
</div>
<br />

</div>
{% endfor %}
