---
layout: blog-post
title: Blog
permalink: /blog/
order: "5"
---

<div class="blog-index">

Here, I document things I learn and blog about my mini projects. Hopefully, others will find these information useful. I'll be writing mainly about coding, math, animation, but will every now and then also share about topics such as life.

</div>
<br/>

{% for post in site.categories["blog"] %}

<h3>
    <a href = "{{post.permalink}}" style="color: #1F664D"> {{post.title}}</a>
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
