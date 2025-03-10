"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[5866],{40740:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>a,default:()=>m,frontMatter:()=>c,metadata:()=>d,toc:()=>h});var t=n(85893),i=n(11151),o=n(53438),s=n(97048);const c={title:"Typed Errors"},a="",d={id:"learn/typed-errors/index",title:"Typed Errors",description:"Typed errors refer to a technique from functional programming in which we",source:"@site/content/docs/learn/typed-errors/index.md",sourceDirName:"learn/typed-errors",slug:"/learn/typed-errors/",permalink:"/learn/typed-errors/",draft:!1,unlisted:!1,editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/docs/learn/typed-errors/index.md",tags:[],version:"current",frontMatter:{title:"Typed Errors"},sidebar:"learnSidebar",previous:{title:"Migration to Arrow 1.2.0",permalink:"/learn/quickstart/migration"},next:{title:"Working with typed errors",permalink:"/learn/typed-errors/working-with-typed-errors"}},l={},h=[];function p(e){const r={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",li:"li",ol:"ol",p:"p",strong:"strong",...(0,i.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.h1,{id:"",children:(0,t.jsx)("decorated-text",{icon:(0,o.jA)().customProps.icon,title:c.title})}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.em,{children:"Typed errors"})," refer to a technique from functional programming in which we\nmake ",(0,t.jsx)(r.em,{children:"explicit"})," in the signature (or ",(0,t.jsx)(r.em,{children:"type"}),") the potential errors that may\narise during the execution of a piece of code. Arrow provides two different\n",(0,t.jsx)(r.strong,{children:"approaches"})," to typed errors:"]}),"\n",(0,t.jsxs)(r.ol,{children:["\n",(0,t.jsxs)(r.li,{children:["The ",(0,t.jsx)(r.code,{children:"Raise"})," DSL uses an extension receiver which represents a ",(0,t.jsx)(r.em,{children:"context"}),"\nin which errors of a certain type may be raised. This approach often results\nin a more idiomatic code.\nBy using ",(0,t.jsx)(r.em,{children:"wrapper types"}),", like ",(0,t.jsx)(r.code,{children:"Either"}),", ",(0,t.jsx)(r.code,{children:"Option"}),", or ",(0,t.jsx)(r.code,{children:"Result"}),", we indicate\nthat a computation might end with a logical error which we specify in the return\ntype."]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Regardless of your choice, Arrow provides a uniform API, and simple ways to\nmove from one style to the other."}),"\n",(0,t.jsxs)(r.p,{children:["If you want a ",(0,t.jsx)(r.strong,{children:"general introduction"})," we recommend the tutorial about\n",(0,t.jsx)(r.a,{href:"/learn/typed-errors/working-with-typed-errors",children:"working with typed errors"}),", followed by\nhow to model ",(0,t.jsx)(r.a,{href:"/learn/typed-errors/validation",children:"validation"})," in this style."]}),"\n",(0,t.jsxs)(r.p,{children:["If you are already ",(0,t.jsxs)(r.strong,{children:["familiar with ",(0,t.jsx)(r.code,{children:"Either"})]})," and similar wrapper types,\nyou can find information about their Arrow counterparts\n(",(0,t.jsxs)(r.a,{href:"/learn/typed-errors/nullable-and-option",children:["Nullable and ",(0,t.jsx)(r.code,{children:"Option"})]}),", ",(0,t.jsxs)(r.a,{href:"/learn/typed-errors/either-and-ior",children:[(0,t.jsx)(r.code,{children:"Either"})," and ",(0,t.jsx)(r.code,{children:"Ior"})]}),").\nWe stongly recommend to read ",(0,t.jsxs)(r.a,{href:"/learn/typed-errors/from-either-to-raise",children:["From ",(0,t.jsx)(r.code,{children:"Either"})," to ",(0,t.jsx)(r.code,{children:"Raise"})]})," to understand\nhow you can benefit from the typed errors DSL."]}),"\n",(0,t.jsx)(r.admonition,{title:"Where to find it",type:"note",children:(0,t.jsxs)(r.p,{children:["Typed errors live in the ",(0,t.jsx)(r.code,{children:"arrow-core"})," library, with high-arity versions of the\n",(0,t.jsx)(r.code,{children:"zipOrAccumulate"})," function available in ",(0,t.jsx)(r.code,{children:"arrow-core-high-arity"}),"."]})}),"\n",(0,t.jsx)(s.Z,{})]})}function m(e={}){const{wrapper:r}={...(0,i.a)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},66569:(e,r,n)=>{n.d(r,{k:()=>m});n(67294);var t=n(33692),i=n(44996);const o="linkCard_uxt7",s="icon_lqTJ",c="cardHeader_NaDd",a="cardBody_svEQ",d="paragraph_UbEf";var l=n(85893);function h(e){let{href:r,children:n}=e;return(0,l.jsx)(t.Z,{href:r,className:o,children:n})}function p(e){let{title:r,icon:n,body:t}=e;return(0,l.jsxs)("div",{className:"card",children:[(0,l.jsxs)("div",{className:`card__header ${c}`,children:[(0,l.jsx)("img",{className:s,src:(0,i.Z)(`/img/${n}`),alt:`${r} category`,title:`${r} category`,width:"48px",height:"48px"}),(0,l.jsx)("h2",{title:r,className:"text--truncate",children:r})]}),(0,l.jsx)("div",{className:`card__body ${a}`,children:(0,l.jsx)("p",{className:`${d}`,children:t})})]})}const m=e=>(0,l.jsx)(h,{href:e.href,children:(0,l.jsx)(p,{...e})})},97048:(e,r,n)=>{n.d(r,{Z:()=>l});n(67294);var t=n(53438),i=n(66569),o=n(85893);const s="icon-tutorial.svg";function c(e){let{item:r}=e;const n=function(){try{return(0,t.jA)()}catch{return}}()?.customProps?.icon,c={title:r.label,icon:r.customProps?.icon||n||s,href:r.href,body:r.customProps?.description??("link"===r.type&&(0,t.xz)(r.docId??void 0)).description??void 0};return(0,o.jsx)(i.k,{...c})}const a={container:"container_Mg1N"};function d(e){let{className:r}=e;const n=(0,t.jA)();return(0,o.jsx)(l,{items:n.items,className:r})}function l(e){const{items:r,className:n}=e;if(!r)return(0,o.jsx)(d,{...e});const i=(0,t.MN)(r);return(0,o.jsx)("section",{className:`${a.container} ${n}`,children:i.map(((e,r)=>(0,o.jsx)("article",{children:(0,o.jsx)(c,{item:e})},r)))})}},11151:(e,r,n)=>{n.d(r,{Z:()=>c,a:()=>s});var t=n(67294);const i={},o=t.createContext(i);function s(e){const r=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(o.Provider,{value:r},e.children)}}}]);