"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[5972],{57858:(e,r,i)=>{i.r(r),i.d(r,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>n,metadata:()=>c,toc:()=>a});var s=i(85893),t=i(11151);const n={title:"Overview of libraries",description:"Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.",sidebar_position:1,sidebar_custom_props:{icon:"icon-docs.svg"}},o="Overview of libraries",c={id:"learn/quickstart/libs",title:"Overview of libraries",description:"Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.",source:"@site/content/docs/learn/quickstart/libs.md",sourceDirName:"learn/quickstart",slug:"/learn/quickstart/libs",permalink:"/learn/quickstart/libs",draft:!1,unlisted:!1,editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/docs/learn/quickstart/libs.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Overview of libraries",description:"Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.",sidebar_position:1,sidebar_custom_props:{icon:"icon-docs.svg"}},sidebar:"learnSidebar",previous:{title:"Quickstart",permalink:"/learn/quickstart/"},next:{title:"From other FP languages",permalink:"/learn/quickstart/from-fp"}},l={},a=[];function d(e){const r={a:"a",code:"code",em:"em",h1:"h1",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.h1,{id:"overview-of-libraries",children:"Overview of libraries"}),"\n",(0,s.jsxs)(r.p,{children:["Arrow is not a single library, but a collection of them. The guiding principle is that each Arrow library should be ",(0,s.jsx)(r.em,{children:"self-contained"}),": each library improves or extends a single commonly-used library in the Kotlin ecosystem (like ",(0,s.jsx)(r.code,{children:"arrow-core"})," and ",(0,s.jsx)(r.code,{children:"arrow-fx-coroutines"}),") or a particular Kotlin language feature (like ",(0,s.jsx)(r.code,{children:"arrow-optics"}),"), or focuses on a particular set of tasks (like ",(0,s.jsx)(r.code,{children:"arrow-resilience"}),")."]}),"\n",(0,s.jsxs)(r.p,{children:["Note that during the transition to Arrow 2.x some libraries were further split. If you are an Arrow 1.x user you can follow the deprecation warnings to make the switch to the new organization, or read our ",(0,s.jsx)(r.a,{href:"../../quickstart/migration/",children:"1.2.0 migration guide"}),"."]}),"\n",(0,s.jsxs)(r.table,{children:[(0,s.jsx)(r.thead,{children:(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.th,{children:"Library"}),(0,s.jsx)(r.th,{children:"Features"})]})}),(0,s.jsxs)(r.tbody,{children:[(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-core"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)(r.em,{children:["Companion to ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/api/latest/jvm/stdlib/",children:"Kotlin's standard library"})]})]}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"../../typed-errors/",children:"Typed errors"}),", including ",(0,s.jsx)(r.code,{children:"Raise"}),", ",(0,s.jsx)(r.code,{children:"Either"}),", and ",(0,s.jsx)(r.code,{children:"Option"})," ",(0,s.jsx)("br",{})," ",(0,s.jsx)(r.a,{href:"../../collections-functions/non-empty",children:"Non-empty collections"})," ",(0,s.jsx)("br",{})," ",(0,s.jsx)(r.a,{href:"../../collections-functions/recursive/",children:"Memoized recursive functions"})]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-fx-coroutines"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)(r.em,{children:["Companion to ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/",children:"KotlinX Coroutines"})]})]}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"../../coroutines/parallel",children:"High-level concurrency"}),", including ",(0,s.jsx)(r.code,{children:"parMap"})," and ",(0,s.jsx)(r.code,{children:"parZip"})," ",(0,s.jsx)("br",{})," ",(0,s.jsx)(r.a,{href:"../../coroutines/resource-safety/",children:"Resource management"})," (with ",(0,s.jsx)(r.code,{children:"suspend"}),")"]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-autoclose"})}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"../../coroutines/resource-safety/",children:"Resource management"})," (no ",(0,s.jsx)(r.code,{children:"suspend"}),")"]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"suspendapp"})}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.a,{href:"../../coroutines/suspendapp/",children:"Graceful shutdown"})})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-resilience"})}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.a,{href:"../../resilience/",children:"Resilience patterns"})})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-optics"})," + ",(0,s.jsx)(r.code,{children:"arrow-optics-ksp-plugin"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)(r.em,{children:["Companion to ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/docs/data-classes.html",children:"data"})," and ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/docs/sealed-classes.html",children:"sealed"})," classes"]})]}),(0,s.jsxs)(r.td,{children:["Utilities for ",(0,s.jsx)(r.a,{href:"../../immutable-data/intro/",children:"immutable data"})]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-fx-stm"})}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"../../coroutines/stm/",children:"Software Transactional Memory"})," (STM)"]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-atomic"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)(r.em,{children:["Multiplatform-ready ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/",children:"references"})]})]}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.a,{href:"../../coroutines/concurrency-primitives/#atomic",children:"Atomic references"})})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-collectors"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)(r.em,{children:["Companion to ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html",children:(0,s.jsx)(r.code,{children:"fold"})})," and ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html",children:(0,s.jsx)(r.code,{children:"reduce"})})]})]}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.a,{href:"../../collections-functions/collectors/",children:"Aggregation with single traversal"})})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-eval"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)(r.em,{children:["More powerful ",(0,s.jsx)(r.a,{href:"https://kotlinlang.org/docs/delegated-properties.html#lazy-properties",children:"laziness"})]})]}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.a,{href:"../../collections-functions/eval/",children:"Control over evaluation"})})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-functions"})," ",(0,s.jsx)("br",{})," ",(0,s.jsxs)("small",{children:["Part of ",(0,s.jsx)(r.code,{children:"arrow-core"})," in 1.x"]})]}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.a,{href:"../../collections-functions/utils/",children:"Utilities for functions"})})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-core-high-arity"})}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"arrow-core"})," for more than 10 parameters"]})]})]})]}),"\n",(0,s.jsxs)(r.table,{children:[(0,s.jsx)(r.thead,{children:(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.th,{children:"Library"}),(0,s.jsx)(r.th,{children:"Integrates with"})]})}),(0,s.jsxs)(r.tbody,{children:[(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-core-serialization"})}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"https://kotlinlang.org/docs/serialization.html",children:"KotlinX Serialization"})," for core types"]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-cache4k"})}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"https://reactivecircus.github.io/cache4k/",children:"cache4k"})," for ",(0,s.jsx)(r.a,{href:"../../collections-functions/recursive/",children:"memoization"})]})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"arrow-optics-compose"})}),(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.a,{href:"https://developer.android.com/jetpack/compose/state",children:"Compose state management"})," with ",(0,s.jsx)(r.a,{href:"../../immutable-data/intro/",children:"optics"})]})]})]})]})]})}function h(e={}){const{wrapper:r}={...(0,t.a)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},11151:(e,r,i)=>{i.d(r,{Z:()=>c,a:()=>o});var s=i(67294);const t={},n=s.createContext(t);function o(e){const r=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),s.createElement(n.Provider,{value:r},e.children)}}}]);