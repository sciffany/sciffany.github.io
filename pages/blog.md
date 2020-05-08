---
layout: blog-post
title: Blog
permalink: /blog/
order: "5"
---

{% for post in site.categories["blog"] %}

<h3>
    <a href = "{{post.permalink}}"> {{post.title}}</a>
</h3>
<div class="blog-index">
{{post.description}}

<div class="gray mini">
    Tags: {{post.tags}}
</div>

<div class="gray">
    {{post.date | date_to_long_string: "ordinal", "US"}}
</div>
<br />

</div>
{% endfor %}
