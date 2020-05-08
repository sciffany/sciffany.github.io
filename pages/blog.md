---
layout: blog-post
title: Blog
permalink: /blog/
order: "5"
---

{% for post in site.categories["blog"] %}

<h2>
    <a href = "{{post.permalink}}" class="blog-index-title"> {{post.title}}</a>
</h2>

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
