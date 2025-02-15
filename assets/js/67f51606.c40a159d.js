"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[535],{25e3:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var n=o(85893),r=o(11151);const i={title:"Work on more integration",category:"articles",no_image_on_post:!0,tags:["core","articles"]},a="Working on more integration",s={permalink:"/community/blog/2025/02/15/integration",editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/blog/2025-02-15-integration.md",source:"@site/content/blog/2025-02-15-integration.md",title:"Work on more integration",description:"Once Arrow 2.0 is finally released,",date:"2025-02-15T00:00:00.000Z",tags:[{label:"core",permalink:"/community/blog/tags/core"},{label:"articles",permalink:"/community/blog/tags/articles"}],readingTime:1.6,hasTruncateMarker:!1,authors:[],frontMatter:{title:"Work on more integration",category:"articles",no_image_on_post:!0,tags:["core","articles"]},unlisted:!1,nextItem:{title:"Arrow 2.0 release",permalink:"/community/blog/2024/12/05/arrow-2-0"}},c={authorsImageUrls:[]},l=[];function h(e){const t={a:"a",code:"code",em:"em",p:"p",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.p,{children:["Once Arrow 2.0 is finally ",(0,n.jsx)(t.a,{href:"https://arrow-kt.io/community/blog/2024/12/05/arrow-2-0/",children:"released"}),",\na fair question is what are the new goals of the Arrow project.\nThis post outlines some of the future plans of the maintainer team.\nHaving said so, Arrow welcomes any contribution \u2014 code or ideas \u2014\nthat fits its goal of being a ",(0,n.jsx)(t.em,{children:"companion in the Kotlin journey"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["Apart from the any needed bugfixes, we aim to improve our integration\nwith the broader Kotlin ecosystem, a line of work we started with\nthe ",(0,n.jsx)(t.a,{href:"https://arrow-kt.io/learn/quickstart/compose/#updating-the-model",children:"optics module for Compose"}),".\nOne line of work already in progress is better integration with Ktor.\nWe would really appreciate any input on what integrations you miss\nas Arrow user."]}),"\n",(0,n.jsxs)(t.p,{children:["At this point, the ",(0,n.jsxs)(t.a,{href:"https://github.com/arrow-kt/",children:[(0,n.jsx)(t.code,{children:"arrow-kt"})," organization"]}),"\nhas more than 50 projects. Of those, only a handful have graduated\nfrom a proof-of-concept into part of Arrow. To make this status\nmore clear, the ",(0,n.jsx)(t.code,{children:"arrow-integrations"})," and SuspendApp projects are\nnow hosted in the main ",(0,n.jsx)(t.code,{children:"arrow"})," repository. This means that those\nprojects become part of the regular Arrow release schedule, instead\nof the current model in which some libraries may be outdated for a\nfew weeks. Furthermore, it removes some burden from maintainers, which\nnow only need to care about one single repository."]}),"\n",(0,n.jsxs)(t.p,{children:["Speaking of maintainance, in the past weeks we have been paying some\nof the debt in our build files, that had grown too wild.\nTechnically, we have moved from separate ",(0,n.jsx)(t.a,{href:"https://github.com/arrow-kt/arrow-gradle-config",children:(0,n.jsx)(t.code,{children:"arrow-gradle-config"})}),"\ninto a convention plug-in withing the same repository.\nThis process has revealed some lack of uniformity between the\ndifferent projects, especially with respect to supported platforms.\nFrom now on, all Arrow libraries support Native targets in\n",(0,n.jsx)(t.a,{href:"https://kotlinlang.org/docs/native-target-support.html",children:"tiers 1 and 2"}),",\nplus Windows + MinGW."]}),"\n",(0,n.jsx)(t.p,{children:"From the point of view of Arrow users, the only visible part of\nthis transition is that the next version of Arrow integration modules\nand SuspendApp should be 2.1.0, instead of 0.x. Note that no breaking\nchanges are expected, regardless of the major version bump."})]})}function d(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},11151:(e,t,o)=>{o.d(t,{Z:()=>s,a:()=>a});var n=o(67294);const r={},i=n.createContext(r);function a(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);