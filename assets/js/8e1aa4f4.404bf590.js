"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[7025],{40502:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var t=r(85893),i=r(11151);const a={title:"Arrow 2.0 release",image:"https://xebia.com/wp-content/uploads/2023/04/arrow-release-ftr.jpg",category:"articles",no_image_on_post:!0,tags:["core","articles"]},o="Arrow 2.0 release",s={permalink:"/community/blog/2024/12/05/arrow-2-0",editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/blog/2024-12-05-arrow-2-0.md",source:"@site/content/blog/2024-12-05-arrow-2-0.md",title:"Arrow 2.0 release",description:"We are happy to announce the next major release of Arrow, version 2.0!",date:"2024-12-05T00:00:00.000Z",tags:[{label:"core",permalink:"/community/blog/tags/core"},{label:"articles",permalink:"/community/blog/tags/articles"}],readingTime:4.85,hasTruncateMarker:!1,authors:[],frontMatter:{title:"Arrow 2.0 release",image:"https://xebia.com/wp-content/uploads/2023/04/arrow-release-ftr.jpg",category:"articles",no_image_on_post:!0,tags:["core","articles"]},unlisted:!1,nextItem:{title:"Arrow Open Space @ Lambda World",permalink:"/community/blog/2024/10/03/arrow-open-space"}},l={authorsImageUrls:[]},c=[{value:"Upgrading to 2.0",id:"upgrading-to-20",level:2},{value:"Simple accumulation in Raise",id:"simple-accumulation-in-raise",level:2},{value:"Additions to Fx",id:"additions-to-fx",level:2},{value:"Clearer retries for particular exceptions",id:"clearer-retries-for-particular-exceptions",level:2},{value:"Improved optics",id:"improved-optics",level:2},{value:"Better support for kotlinx.serialization",id:"better-support-for-kotlinxserialization",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,i.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"We are happy to announce the next major release of Arrow, version 2.0!"}),"\n",(0,t.jsx)(n.p,{children:"This release is built with the new K2 compiler, and this gives us the ability\nto support a wider range of platforms, including WebAssembly. From now on, we shall\nprovide artifacts for every platform supported by Kotlin."}),"\n",(0,t.jsx)(n.p,{children:"Apart from stabilization and general bug fixing, the theme of this release\nis improving the different DSLs provided by Arrow libraries. Our goal is to\nempower developers to write more succinct and readable code."}),"\n",(0,t.jsx)("center",{children:(0,t.jsx)("p",{children:(0,t.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/2sfnDkPWoUw?si=pLR9n67BSOzN1TGf",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerpolicy:"strict-origin-when-cross-origin",allowfullscreen:!0})})}),"\n",(0,t.jsx)(n.h2,{id:"upgrading-to-20",children:"Upgrading to 2.0"}),"\n",(0,t.jsxs)(n.p,{children:["As previously announced, migrating your projects to this release should be hassle-free\nif your code compiled in 1.2.x without any deprecation warnings. Note that we talk about\n",(0,t.jsx)(n.strong,{children:"source"})," compatibility here, we had to break ",(0,t.jsx)(n.strong,{children:"binary"})," compatibility in several places\nto implement improvements, such as in ",(0,t.jsx)(n.code,{children:"NonEmptyList"})," and ",(0,t.jsx)(n.a,{href:"https://github.com/arrow-kt/arrow/pull/3504",children:(0,t.jsx)(n.code,{children:"Schedule"})}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["There are two exceptions to this seamless transition. First, it was discovered that some\nfunctions for ",(0,t.jsx)(n.code,{children:"Map"})," in ",(0,t.jsx)(n.code,{children:"Raise"})," collide with those of the standard library. Furthermore,\nArrow's variants return other ",(0,t.jsx)(n.code,{children:"Map"}),", whereas the ones in the standard library return ",(0,t.jsx)(n.code,{children:"List"}),".\nThe decision was to ",(0,t.jsx)(n.a,{href:"https://github.com/arrow-kt/arrow/pull/3512/files#diff-b378045af72d02f1e5d4037d411102fcdb768239abeabedf69a4520b74ad0278",children:"rename them"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["The second breaking change is related to ",(0,t.jsx)(n.a,{href:"#improved-optics",children:"improved optics"}),", please\nconsult that section for further information."]}),"\n",(0,t.jsx)(n.h2,{id:"simple-accumulation-in-raise",children:"Simple accumulation in Raise"}),"\n",(0,t.jsxs)(n.p,{children:["One of the core concepts when working with typed errors is the distinction\nbetween fail-first and ",(0,t.jsx)(n.a,{href:"/learn/typed-errors/working-with-typed-errors/#accumulating-different-computations",children:"accumulation of errors"}),". Until now, the latter mode\nrequired using ",(0,t.jsx)(n.code,{children:"zipOrAccumulate"})," and ",(0,t.jsx)(n.code,{children:"mapOrAccumulate"}),", which sometimes obscure the actual\nflow of the computation."]}),"\n",(0,t.jsxs)(n.p,{children:["In Arrow 2.0 we have sprinkled some DSL dust over ",(0,t.jsx)(n.code,{children:"Raise"}),", and now you can\nwrite your code in a more linear way. Inside an ",(0,t.jsx)(n.code,{children:"accumulate"})," block (or in\ngeneral, any ",(0,t.jsx)(n.code,{children:"RaiseAccumulate"}),") you use ",(0,t.jsx)(n.code,{children:"by accumulating"})," to execute some\ncomputation keeping all the errors."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-kotlin",children:"// version with `zipOrAccumulate`\nzipOrAccumulate(\n    { checkOneThing() },\n    { checkOtherThing() }\n) { a, b -> doSomething(a, b) }\n\n// version with `accumulate`\naccumulate {\n    val a by accumulating { checkOneThing() }\n    val b by accumulating { checkOtherThing() }\n    doSomething(a, b)\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["This DSL also includes shortcuts for the most common operations, like\n",(0,t.jsx)(n.code,{children:"bind"}),"ing and accumulating any problem, or checking a single property\nof some data."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-kotlin",children:"accumulate {\n    val name by Name(rawName).bindOrAccumulate()\n    ensureOrAccumulate(age >= 18) { UnderAge }\n    Person(name, age)\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Note that the API may still undergo some change. At this point you need ",(0,t.jsx)(n.code,{children:"@OptIn(ExperimentalRaiseAccumulateApi::class)"})," to allow their usage in your code."]}),"\n",(0,t.jsx)(n.h2,{id:"additions-to-fx",children:"Additions to Fx"}),"\n",(0,t.jsxs)(n.p,{children:["Writing coroutine-heavy code may become cumbersome over time, especially if\none intends to use as much concurrency as possible. Arrow Fx includes a ",(0,t.jsx)(n.code,{children:"parZip"}),"\nfunction, but not everybody enjoys having so many brackets."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-kotlin",children:"parZip(\n    { downloadFile() },\n    { loadDataFromDatabase() }\n) { file, data -> Result(file, data) }\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The new ",(0,t.jsxs)(n.a,{href:"/learn/coroutines/parallel/#await-all-scopes",children:[(0,t.jsx)(n.code,{children:"awaitAll"})," scope"]})," tries to improve the situation by tweaking the\nusual ",(0,t.jsx)(n.code,{children:"async"})," mechanism, ensuring that all ",(0,t.jsx)(n.code,{children:"Deferred"})," values are ",(0,t.jsx)(n.code,{children:"await"}),"ed\nonce the first one is requested. That means that the previous code behaves\nidentically to the following, that is, the call ",(0,t.jsx)(n.code,{children:"file.await()"})," implicitly\nawaits every ",(0,t.jsx)(n.code,{children:"async"})," defined up to that point."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-kotlin",children:"awaitAll {\n    val file = async { downloadFile() }\n    val data = async { loadDataFromDatabase() }\n    Result(file.await(), data.await())\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["We've also improved the STM block by ",(0,t.jsx)(n.a,{href:"/learn/coroutines/stm/#reading-and-writing-concurrent-state",children:"allowing delegation"})," as a means to\nread or change the value of a ",(0,t.jsx)(n.code,{children:"TVar"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-kotlin",children:"fun STM.deposit(accVar: TVar<Int>, amount: Int): Unit {\n    val acc by accVar       // delegation here\n    val current = acc       // implicit 'read'\n    acc = current + amount  // implicit 'write'\n}\n"})}),"\n",(0,t.jsx)(n.h2,{id:"clearer-retries-for-particular-exceptions",children:"Clearer retries for particular exceptions"}),"\n",(0,t.jsxs)(n.p,{children:["Until now, the ",(0,t.jsxs)(n.a,{href:"/learn/resilience/retry-and-repeat/",children:[(0,t.jsx)(n.code,{children:"retry"})," operation"]})," in the Resilience module would capture\nany ",(0,t.jsx)(n.code,{children:"Throwable"})," exception. From version 2.0 on you can specify a subclass\nof ",(0,t.jsx)(n.code,{children:"Throwable"})," to be the target for retrying, whereas the rest of\nexceptions will bubble as usual."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-kotlin",children:"Schedule.recurs<Throwable>(2)\n        .retry<IllegalArgumentException, _> { ... }\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The subclass of exceptions must be given as a type argument.\nAlas, Kotlin does not allow giving only a subset of those, and ",(0,t.jsx)(n.code,{children:"retry"}),"\nhas two type parameters (the second one represents the output type of\nthe ",(0,t.jsx)(n.code,{children:"Schedule"}),"). Fortunately, you can ask the compiler to infer the\nsecond one using ",(0,t.jsx)(n.code,{children:"_"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"improved-optics",children:"Improved optics"}),"\n",(0,t.jsxs)(n.p,{children:["The largest ",(0,t.jsx)(n.strong,{children:"breaking changes"})," in Arrow 2.0 relate to optics.\nFirst of all, the ",(0,t.jsx)(n.a,{href:"/learn/immutable-data/intro/#many-optics-to-rule-them-all",children:"optics hierarchy"})," has been greatly simplified:\nnow we have traversals, optionals, lenses, prisms, and isos, and no more\nintermediate types. This smaller amount of types means that the type of\noptic compositions become easier to understand."]}),"\n",(0,t.jsxs)(n.p,{children:["We have also changed the generation of optics via the compiler plug-in\n(that is, the ",(0,t.jsx)(n.code,{children:"@optics"})," annotation) with respect to nullable fields.\nIn the 1.x series, a value of type ",(0,t.jsx)(n.code,{children:"String?"})," would be presented as\n",(0,t.jsx)(n.code,{children:"Optional<T, String>"}),"; this makes impossible to change the value from\n",(0,t.jsx)(n.code,{children:"null"})," to an actual ",(0,t.jsx)(n.code,{children:"String"})," using only optics operations. From version\n2.0, that field is represented as ",(0,t.jsx)(n.code,{children:"Lens<T, String?>"}),". To get the 1.x\nbehavior you should apply ",(0,t.jsx)(n.code,{children:".notNull"})," after the optic corresponding to\nthe field."]}),"\n",(0,t.jsxs)(n.p,{children:["A smaller breaking change is that generated optics are no longer\n",(0,t.jsx)(n.a,{href:"https://github.com/arrow-kt/arrow/pull/3505",children:"inlined by default"}),".\nThis should prevent a large amount of warnings in which the compiler\ncomplain that inlining is not significant. Note that the previous behavior\nis still available under a flag."]}),"\n",(0,t.jsxs)(n.p,{children:["One pain point when building ",(0,t.jsx)(n.a,{href:"/learn/immutable-data/traversal/",children:"traversals"})," was the need to provide an\nargument to ",(0,t.jsx)(n.code,{children:".every"}),", like ",(0,t.jsx)(n.code,{children:".every(Every.list())"}),". This new version\nbrings an improved variant that requires no arguments if the type\nof the ",(0,t.jsx)(n.code,{children:"Iterable"})," is known. Similar improvements have been applied\nto ",(0,t.jsx)(n.code,{children:".at"})," and ",(0,t.jsx)(n.code,{children:".index"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"better-support-for-kotlinxserialization",children:"Better support for kotlinx.serialization"}),"\n",(0,t.jsxs)(n.p,{children:["Using Arrow Core data types as part of serialized data requires additional integration.\nIn 1.2.x we started providing compile-time ",(0,t.jsxs)(n.a,{href:"/learn/quickstart/serialization/#kotlinxserialization",children:["support for ",(0,t.jsx)(n.code,{children:"kotlinx.serialization"})]}),".\nFrom 2.0 on we also provide ",(0,t.jsx)(n.code,{children:"ArrowModule"})," for\n",(0,t.jsx)(n.a,{href:"https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md#contextual-serialization",children:"contextual serialization"}),". This is needed, among others, when the data is processed\nby Ktor."]})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},11151:(e,n,r)=>{r.d(n,{Z:()=>s,a:()=>o});var t=r(67294);const i={},a=t.createContext(i);function o(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),t.createElement(a.Provider,{value:n},e.children)}}}]);