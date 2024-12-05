"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[9362],{84259:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>r,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var i=t(85893),o=t(11151);const s={sidebar_position:3},a="Optionals",l={id:"learn/immutable-data/optional",title:"Optionals",description:"Optionals allow focusing on elements that may not be present. This includes",source:"@site/content/docs/learn/immutable-data/optional.md",sourceDirName:"learn/immutable-data",slug:"/learn/immutable-data/optional",permalink:"/learn/immutable-data/optional",draft:!1,unlisted:!1,editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/docs/learn/immutable-data/optional.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"learnSidebar",previous:{title:"Lenses",permalink:"/learn/immutable-data/lens"},next:{title:"Traversals",permalink:"/learn/immutable-data/traversal"}},r={},c=[{value:"Indexed collections",id:"indexed-collections",level:2},{value:"Nullable types",id:"nullable-types",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"optionals",children:"Optionals"}),"\n",(0,i.jsxs)(n.p,{children:["Optionals allow focusing on elements that may not be present. This includes\nnullable values and elements on indexed collections such as ",(0,i.jsx)(n.code,{children:"List"})," or ",(0,i.jsx)(n.code,{children:"Map"}),"."]}),"\n",(0,i.jsx)(n.admonition,{title:"In a rush?",type:"info",children:(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Optionals represent potentially missing values."}),"\n",(0,i.jsx)(n.li,{children:"Prisms extend optionals to represent class hierarchies."}),"\n",(0,i.jsxs)(n.li,{children:["To access the value, use ",(0,i.jsx)(n.code,{children:"getOrNull"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["To modify the value (",(0,i.jsx)(n.strong,{children:"only"})," if present), use ",(0,i.jsx)(n.code,{children:"set"})," and ",(0,i.jsx)(n.code,{children:"modify"}),"."]}),"\n"]})}),"\n",(0,i.jsx)(n.h2,{id:"indexed-collections",children:"Indexed collections"}),"\n",(0,i.jsx)(n.p,{children:"To exemplify why optionals are helpful, let's introduce a few domain classes\nthat model a small in-memory database mapping person names to the city in\nwhich they live."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-kotlin",children:"import arrow.optics.*\nimport arrow.optics.dsl.*\nimport arrow.optics.typeclasses.*\n\n@optics data class Db(val cities: Map<String, City>) {\n  companion object\n}\n@optics data class City(val name: String, val country: String) {\n  companion object\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"There's a notion of elements within a map, which we refer to by their key.\nHowever, we cannot model them as lenses because we don't know whether\na particular key is present in the map. Optionals come to the rescue: they are\noptics whose focus may not exist for a specific value."}),"\n",(0,i.jsxs)(n.p,{children:["As a result, the ",(0,i.jsx)(n.code,{children:"get"})," operation is replaced by ",(0,i.jsx)(n.code,{children:"getOrNull"}),", where ",(0,i.jsx)(n.code,{children:"null"}),"\nindicates that the value is not present. The following code snippet provides\nan example of that behavior using the ",(0,i.jsx)(n.code,{children:"index"})," provided by Arrow Optics."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-kotlin",children:'val db = Db(mapOf(\n  "Alejandro" to City("Hilversum", "Netherlands"),\n  "Ambrosio"  to City("Ciudad Real", "Spain")\n))\n\nfun example() {\n  Db.cities.index("Alejandro").country.getOrNull(db) shouldBe "Netherlands"\n  Db.cities.index("Jack").country.getOrNull(db) shouldBe null\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["One important (and sometimes surprising) behavior of optionals is that using\n",(0,i.jsx)(n.code,{children:"set"})," or ",(0,i.jsx)(n.code,{children:"modify"})," only transforms the value if it is already present. That means\nthat we cannot use ",(0,i.jsx)(n.code,{children:"index"})," to ",(0,i.jsx)(n.em,{children:"add"})," elements to the database, only to ",(0,i.jsx)(n.em,{children:"modify"}),"\nthose already present."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-kotlin",children:'fun example() {\n  val dbWithJack = Db.cities.index("Jack").set(db, City("London", "UK"))\n  // Jack was not really added to the database\n  ("Jack" in dbWithJack.cities) shouldBe false\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["If you want to perform a change over the collection, use ",(0,i.jsx)(n.code,{children:"modify"})," over the\nlens that corresponds to that field."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-kotlin",children:'fun example() {\n  val dbWithJack = Db.cities.modify(db) { it + ("Jack" to City("London", "UK")) }\n  // now Jack is finally in the database\n  ("Jack" in dbWithJack.cities) shouldBe true\n}\n'})}),"\n",(0,i.jsx)(n.admonition,{title:"More indexed collections",type:"tip",children:(0,i.jsxs)(n.p,{children:["The first parameter to the ",(0,i.jsx)(n.code,{children:"index"})," optional represents the type of collection\nyou are accessing. Currently, this argument can be ",(0,i.jsx)(n.code,{children:"Index.list"}),", ",(0,i.jsx)(n.code,{children:"Index.map"}),",\n",(0,i.jsx)(n.code,{children:"Index.sequence"}),", or ",(0,i.jsx)(n.code,{children:"Index.string"}),". The choice defines the type of keys\nand values expected by each operation."]})}),"\n",(0,i.jsx)(n.h2,{id:"nullable-types",children:"Nullable types"}),"\n",(0,i.jsx)(n.admonition,{title:"Breaking change in Arrow 2.x",type:"danger",children:(0,i.jsxs)(n.p,{children:["The Arrow Optics plug-in in Arrow 1.x creates optionals for fields with nullable\ntypes. This has sometimes led to surprises because, with an optional, you cannot\nmodify that value if it's ",(0,i.jsx)(n.code,{children:"null"}),". In Arrow 2.x, every field gives rise to a lens\ninstead. The old behavior is available via the ",(0,i.jsx)(n.code,{children:"notNull"})," extension function."]})}),"\n",(0,i.jsxs)(n.p,{children:["Kotlin supports the notion of ",(0,i.jsx)(n.a,{href:"https://kotlinlang.org/docs/null-safety.html",children:"nullable types"}),",\nwhich clearly specify when a value may be absent. The compiler prevents you from\ncalling a method or function that requires a non-",(0,i.jsx)(n.code,{children:"null"})," value with a potentially\nabsent one. These checks are also in place when working with Arrow Optics;\nif you have a ",(0,i.jsx)(n.code,{children:"nickname: Lens<Person, String?>"}),", you must account for\nnullability in each potential modification."]}),"\n",(0,i.jsxs)(n.p,{children:["It's also possible to turn a lens over a nullable type into an optional of the\nunwrapped type using ",(0,i.jsx)(n.code,{children:"notNull"}),". In the example above, ",(0,i.jsx)(n.code,{children:"nickname.notNull"}),"\nhas the type ",(0,i.jsx)(n.code,{children:"Optional<Person, String>"})," (notice the lack of ",(0,i.jsx)(n.code,{children:"?"})," at the end\nof the second type parameter). However, you should be aware that, in the same way\nas with indexed collections where you could not add or remove elements, with\n",(0,i.jsx)(n.code,{children:"notNull"}),", you cannot change whether the value is ",(0,i.jsx)(n.code,{children:"null"})," or not; only modify\nit if it's already not null."]})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},11151:(e,n,t)=>{t.d(n,{Z:()=>l,a:()=>a});var i=t(67294);const o={},s=i.createContext(o);function a(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);