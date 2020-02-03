---
layout: page
title: Experience
permalink: /experience/
order: "1"
---

<h3><b>Work</b></h3>

{% for post in site.categories["work"] %}

- [{{post.title}} {%if post.clar%}, {{post.clar}} {%endif%}](#{{post.ref}}) {% endfor %}

<div style="font-size: 18px; margin-bottom: 30px; margin-top:50px"></div>

<h3 style= "margin-top: 30px;"><b>Education</b></h3>

{% for post in site.categories["edu"] %}

- [{{post.title}} {%if post.clar%}, {{post.clar}} {%endif%}](#{{post.ref}}) {% endfor %}

<div style="font-size: 18px; margin-bottom: 30px; margin-top:50px"></div>

<div align="center">
  <h2 style= "margin-top: 30px;"><b>Work</b></h2>
</div>
<hr/>
{% for post in site.categories["work"] %}

<article class="archive-item" style="margin-top: 30px;">


  <div class="card-contents">
    <div class="card-col-1" align="right" style="padding-right:40px;">
      <a href="{{post.link}}" style="color:black;" ><h3><b>{{post.title}} </b></h3></a>
      
        <div class="plain-subs"><b>{{post.role}}</b></div>
        <div class="date">{{post.dur}}</div>
 
    </div>

    <div class="card-col-2">
      {{post.content}}

      {%if post.gh%}
          <div>
            <a href="{{ post.gh }}">
              <img src="/assets/images/github.png" class="project-icon" />
            </a>
            <a href="{{ post.gh }}">
              <span class="tiny">
                Github
              </span>
            </a>
          </div>
          {%endif%}
    </div>

  </div>
</article>

{% endfor %}

<div align="center">
  <h2 style= "margin-top: 30px;"><b>Education</b></h2>
  <hr/>
</div>

{% for post in site.categories["edu"] %}

<article class="archive-item" style="margin-top: 30px;">
  <a name="{{post.ref}}"></a>

  <div class="card-contents">
    <div class="card-col-1" align="right" style="padding-right:40px;">
      <a href="{{post.link}}" style="color:black;" ><h3><b>{{post.title}} </b></h3></a>
      
        <div class="plain-subs"><b>{{post.role}}</b></div>
        <div class="date">{{post.dur}}</div>
 
    </div>

    <div class="card-col-2">
      {{post.content}}

      {%if post.gh%}
          <div>
            <a href="{{ post.gh }}">
              <img src="/assets/images/github.png" class="project-icon" />
            </a>
            <a href="{{ post.gh }}">
              <span class="tiny">
                Github
              </span>
            </a>
          </div>
          {%endif%}
    </div>

  </div>
</article>

{% endfor %}
