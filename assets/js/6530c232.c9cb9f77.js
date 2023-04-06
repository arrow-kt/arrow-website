"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[2477],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>h});var a=t(67294);function l(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){l(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function r(e,n){if(null==e)return{};var t,a,l=function(e,n){if(null==e)return{};var t,a,l={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(l[t]=e[t]);return l}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}var p=a.createContext({}),s=function(e){var n=a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=s(e.components);return a.createElement(p.Provider,{value:n},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,l=e.mdxType,i=e.originalType,p=e.parentName,u=r(e,["components","mdxType","originalType","parentName"]),d=s(t),c=l,h=d["".concat(p,".").concat(c)]||d[c]||m[c]||i;return t?a.createElement(h,o(o({ref:n},u),{},{components:t})):a.createElement(h,o({ref:n},u))}));function h(e,n){var t=arguments,l=n&&n.mdxType;if("string"==typeof e||l){var i=t.length,o=new Array(i);o[0]=c;var r={};for(var p in n)hasOwnProperty.call(n,p)&&(r[p]=n[p]);r.originalType=e,r[d]="string"==typeof e?e:l,o[1]=r;for(var s=2;s<i;s++)o[s]=t[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},30305:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>r,toc:()=>s});var a=t(87462),l=(t(67294),t(3905));const i={id:"nullable-and-option",title:"Why nullable types & Option?",description:"Difference between nullable types and Option, and when to use each.",sidebar_position:2},o="Why nullable types & Option?",r={unversionedId:"learn/typed-errors/nullable-and-option",id:"learn/typed-errors/nullable-and-option",title:"Why nullable types & Option?",description:"Difference between nullable types and Option, and when to use each.",source:"@site/content/docs/learn/typed-errors/nullable-and-option.md",sourceDirName:"learn/typed-errors",slug:"/learn/typed-errors/nullable-and-option",permalink:"/learn/typed-errors/nullable-and-option",draft:!1,editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/docs/learn/typed-errors/nullable-and-option.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"nullable-and-option",title:"Why nullable types & Option?",description:"Difference between nullable types and Option, and when to use each.",sidebar_position:2},sidebar:"learnSidebar",previous:{title:"Working with typed errors",permalink:"/learn/typed-errors/working-with-typed-errors"},next:{title:"Either & Ior",permalink:"/learn/typed-errors/either-and-ior"}},p={},s=[{value:"Working with Option",id:"working-with-option",level:2},{value:"Extracting values from Option",id:"extracting-values-from-option",level:2},{value:"Option &amp; nullable DSL",id:"option--nullable-dsl",level:2},{value:"Inspecting <code>Option</code> values",id:"inspecting-option-values",level:2},{value:"Conclusion",id:"conclusion",level:2}],u={toc:s},d="wrapper";function m(e){let{components:n,...t}=e;return(0,l.kt)(d,(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"why-nullable-types--option"},"Why nullable types & Option?"),(0,l.kt)("p",null,"If you have worked with Java at all in the past, you have likely come across a ",(0,l.kt)("inlineCode",{parentName:"p"},"NullPointerException")," at some time (other languages will throw similarly named errors in such a case).\nUsually, this happens because some method returns ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," when you weren't expecting it and, thus, isn't dealing with that possibility in your client code.\nA value of ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," is often abused to represent an absent optional value. Kotlin already solves the problem by getting rid of ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," values altogether and providing its own unique syntax ",(0,l.kt)("a",{parentName:"p",href:"https://kotlinlang.org/docs/reference/null-safety.html"},"Null-safety machinery based on ",(0,l.kt)("inlineCode",{parentName:"a"},"?")),"."),(0,l.kt)("p",null,"Since Kotlin already has nullable types, why do we need Arrow's ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," type? There are only ",(0,l.kt)("strong",{parentName:"p"},"a few")," cases where you should use ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," instead of nullable types, and one is the ",(0,l.kt)("em",{parentName:"p"},"nested nullability")," problem. Let's see an example:"),(0,l.kt)("p",null,"We write a small ",(0,l.kt)("inlineCode",{parentName:"p"},"firstOrElse")," function, which should return the list's first element or the default value if the list is ",(0,l.kt)("strong",{parentName:"p"},"empty"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()\n\nfun example() {\n  emptyList<Int?>().firstOrElse { -1 } shouldBe -1\n  listOf(1, null, 3).firstOrElse { -1 } shouldBe 1\n}\n")),(0,l.kt)("p",null,"Running this code with an ",(0,l.kt)("inlineCode",{parentName:"p"},"emptyList")," or a non-empty list seems to work as expected."),(0,l.kt)("admonition",{title:"Unexpected result",type:"danger"},(0,l.kt)("p",{parentName:"admonition"},"We get an unexpected result if we run this function with a list that contains ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," as the ",(0,l.kt)("strong",{parentName:"p"},"first")," value.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun example() {\n  listOf(null, 2, 3).firstOrElse { -1 } shouldBe null\n}\n")),(0,l.kt)("p",null,"Now we're executing the function on a list that ",(0,l.kt)("inlineCode",{parentName:"p"},"isNotEmpty"),", so we expect it to return the first element of value ",(0,l.kt)("inlineCode",{parentName:"p"},"null"),".\nInstead, it returns ",(0,l.kt)("inlineCode",{parentName:"p"},"-1"),", the default value we specified in case the list ",(0,l.kt)("inlineCode",{parentName:"p"},"isEmpty"),"!"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'Exception in thread "main" java.lang.AssertionError: Expected null but actual was -1\n')),(0,l.kt)("p",null,"This is known as the ",(0,l.kt)("em",{parentName:"p"},"nested nullability")," problem, which can be solved using ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," instead of nullable types.\nSo let's analyze what is going wrong here and how we can fix it. When we look at the implementation of our ",(0,l.kt)("inlineCode",{parentName:"p"},"firstOrElse")," function,\nwe see that we're using ",(0,l.kt)("inlineCode",{parentName:"p"},"firstOrNull")," to get the first element of the list, and if that is ",(0,l.kt)("inlineCode",{parentName:"p"},"null"),", we return the default value."),(0,l.kt)("p",null,"However, our generic parameter of ",(0,l.kt)("inlineCode",{parentName:"p"},"Any")," has an upperbound of ",(0,l.kt)("inlineCode",{parentName:"p"},"Any?"),", so we can pass in a list of nullable values.\nThis means that ",(0,l.kt)("inlineCode",{parentName:"p"},"firstOrNull")," can return ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," if the first element of the list is ",(0,l.kt)("inlineCode",{parentName:"p"},"null"),", and we're not handling that case."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()\n")),(0,l.kt)("p",null,"We can solve this in two ways. One is by restricting ",(0,l.kt)("inlineCode",{parentName:"p"},"A")," to have an upperbound of ",(0,l.kt)("inlineCode",{parentName:"p"},"Any")," instead,\nbut then we limit this function to only work with non-nullable types."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun <A : Any> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()\n")),(0,l.kt)("p",null,"Our previous examples of ",(0,l.kt)("inlineCode",{parentName:"p"},"List<Int?>")," would not even compile in that case, so this is not a good solution.\nInstead, we could use ",(0,l.kt)("inlineCode",{parentName:"p"},"firstOrNone"),", and then we can handle the case where the first element is ",(0,l.kt)("inlineCode",{parentName:"p"},"null"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun <A> List<A>.firstOrElse(default: () -> A): A =\n  when(val option = firstOrNone()) {\n    is Some -> option.value\n    None -> default()\n  }\n")),(0,l.kt)("p",null,"If we rerun our previous examples, they all behave as expected since we can rely on ",(0,l.kt)("inlineCode",{parentName:"p"},"None")," to detect the case where the list is empty."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun example() {\n  emptyList<Int?>().firstOrElse { -1 } shouldBe -1\n  listOf(1, null, 3).firstOrElse { -1 } shouldBe 1\n  listOf(null, 2, 3).firstOrElse { -1 } shouldBe null\n}\n")),(0,l.kt)("p",null,"Sometimes you might still want to use ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," instead of nullable types, even when you're not the author of these generic functions.\nSome libraries such as ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/ReactiveX/RxJava/wiki/What's-different-in-2.0#nulls"},"RxJava")," and ",(0,l.kt)("a",{parentName:"p",href:"https://projectreactor.io/docs/core/release/reference/#null-safety"},"Project Reactor")," don't support nullable types in all their APIs.\nIf you still need to work with ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," in combination with generic APIs that don't allow nullable types, you can use ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," to work around this problem."),(0,l.kt)("admonition",{title:"Arrow DSL",type:"tip"},(0,l.kt)("p",{parentName:"admonition"},"Arrow also provides special DSL syntax for ",(0,l.kt)("em",{parentName:"p"},"nullable")," & ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," types")),(0,l.kt)("h2",{id:"working-with-option"},"Working with Option"),(0,l.kt)("p",null,"Arrow offers a special DSL syntax for all of its types and provides it for ",(0,l.kt)("em",{parentName:"p"},"nullable types"),". So let's review both below.\nBefore we get started, we need to know how to construct an ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," from a (nullable) value and vice versa."),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"Option<A>")," is a container for an optional value of type ",(0,l.kt)("inlineCode",{parentName:"p"},"A"),". If the value of type ",(0,l.kt)("inlineCode",{parentName:"p"},"A")," is present, the ",(0,l.kt)("inlineCode",{parentName:"p"},"Option<A>")," is an instance of ",(0,l.kt)("inlineCode",{parentName:"p"},"Some<A>"),", containing the current value of type ",(0,l.kt)("inlineCode",{parentName:"p"},"A"),". If the value is absent, the ",(0,l.kt)("inlineCode",{parentName:"p"},"Option<A>")," is the object ",(0,l.kt)("inlineCode",{parentName:"p"},"None"),".\nAnd we have four constructors available to create an ",(0,l.kt)("inlineCode",{parentName:"p"},"Option<A>"),", their regular ",(0,l.kt)("inlineCode",{parentName:"p"},"class")," constructors, and two extension functions that return ",(0,l.kt)("inlineCode",{parentName:"p"},"Option<A>"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'val some: Some<String> = Some("I am wrapped in something")\nval none: None = None\n\nval optionA: Option<String> = "I am wrapped in something".some()\nval optionB: Option<String> = none<String>()\n\nfun example() {\n  some shouldBe optionA\n  none shouldBe optionB\n}\n')),(0,l.kt)("p",null,"Creating a ",(0,l.kt)("inlineCode",{parentName:"p"},"Option<A>")," from a nullable type ",(0,l.kt)("inlineCode",{parentName:"p"},"A?")," can be helpful when we need to lift nullable values into Option. This can be done with the ",(0,l.kt)("inlineCode",{parentName:"p"},"Option.fromNullable")," function or the ",(0,l.kt)("inlineCode",{parentName:"p"},"A?.toOption()")," extension function."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'fun example() {\n  val some: Option<String> = Option.fromNullable("Nullable string")\n  val none: Option<String> = Option.fromNullable(null)\n  \n  "Nullable string".toOption() shouldBe some\n  null.toOption<String>() shouldBe none\n}\n')),(0,l.kt)("admonition",{title:"Take care",type:"danger"},(0,l.kt)("p",{parentName:"admonition"},"If ",(0,l.kt)("inlineCode",{parentName:"p"},"A?")," is null, you should explicitly use the ",(0,l.kt)("inlineCode",{parentName:"p"},"Some")," or ",(0,l.kt)("inlineCode",{parentName:"p"},".some()")," constructor.\nOtherwise, you will get a ",(0,l.kt)("inlineCode",{parentName:"p"},"None")," instead of a ",(0,l.kt)("inlineCode",{parentName:"p"},"Some")," due to the ",(0,l.kt)("em",{parentName:"p"},"nested nullable")," problem.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun example() {\n  val some: Option<String?> = Some(null)\n  val none: Option<String?> = Option.fromNullable(null)\n  \n  some shouldBe null.some()\n  none shouldBe None\n}\n")),(0,l.kt)("h2",{id:"extracting-values-from-option"},"Extracting values from Option"),(0,l.kt)("p",null,"So now that we know how to construct ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," values, how can we extract the value from it?\nThe easiest way to extract the ",(0,l.kt)("inlineCode",{parentName:"p"},"String")," value from the ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," would be to turn it into a ",(0,l.kt)("em",{parentName:"p"},"nullable type")," using ",(0,l.kt)("inlineCode",{parentName:"p"},"getOrNull")," and work with it as we would typically do with nullable types."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'fun example() {\n  Some("Found value").getOrNull() shouldBe "Found value"\n  None.getOrNull() shouldBe null\n}\n')),(0,l.kt)("p",null,"Another way would be to provide a default value using ",(0,l.kt)("inlineCode",{parentName:"p"},"getOrElse"),". This is similar to the ",(0,l.kt)("inlineCode",{parentName:"p"},"?:")," operator in Kotlin, but instead of giving a default value for ",(0,l.kt)("inlineCode",{parentName:"p"},"null"),", we provide a default value for ",(0,l.kt)("inlineCode",{parentName:"p"},"None"),".\nIn the example below, we provide a default value of ",(0,l.kt)("inlineCode",{parentName:"p"},'"No value"'),"when the ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," is ",(0,l.kt)("inlineCode",{parentName:"p"},"None"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'fun example() {\n  Some( "Found value").getOrElse { "No value" } shouldBe "Found value"\n  None.getOrElse { "No value" } shouldBe "No value"\n}\n')),(0,l.kt)("p",null,"Since ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," is modeled as a ",(0,l.kt)("inlineCode",{parentName:"p"},"sealed class"),", we can use exhaustive ",(0,l.kt)("inlineCode",{parentName:"p"},"when")," statements to ",(0,l.kt)("em",{parentName:"p"},"pattern match")," on the possible cases."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'fun example() {\n  when(val value = 20.some()) {\n    is Some -> value.value shouldBe 20\n    None -> fail("$value should not be None")\n  }\n  \n  when(val value = none<Int>()) {\n    is Some -> fail("$value should not be Some")\n    None -> value shouldBe None\n  }\n}\n')),(0,l.kt)("h2",{id:"option--nullable-dsl"},"Option & nullable DSL"),(0,l.kt)("p",null,"Now that we know how to construct ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," values and turn ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," back into regular (nullable) values,\nlet's see how we can use the ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," and nullable DSL to work with ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," & nullable values in an imperative way."),(0,l.kt)("p",null,"When working with nullable types, we often need to check if the value is ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," or not and then do something with it. We typically do that by using ",(0,l.kt)("inlineCode",{parentName:"p"},"?.let { }"),", but this quickly results in a lot of nested ",(0,l.kt)("inlineCode",{parentName:"p"},"?.let { }")," blocks.\nArrow offers ",(0,l.kt)("inlineCode",{parentName:"p"},"bind()")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"ensureNotNull")," to get rid of this issue, so let's look at an example and some other interesting functions that Arrow provides in its DSL."),(0,l.kt)("p",null,"Imagine we have a ",(0,l.kt)("inlineCode",{parentName:"p"},"User")," domain class that has ",(0,l.kt)("em",{parentName:"p"},"nullable")," email address, and we want to find a user by their id and then email them."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'@JvmInline value class UserId(val value: Int)\ndata class User(val id: UserId, val email: Email?)\n\nfun QueryParameters.userId(): UserId? = get("userId")?.toIntOrNull()?.let { UserId(it) }\nfun findUserById(id: UserId): User? = TODO()\nfun sendEmail(email: Email): SendResult? = TODO()\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun sendEmail(params: QueryParameters): SendResult? =\n  params.userId()?.let { userId ->\n    findUserById(userId)?.email?.let { email ->\n      sendEmail(email)\n    }\n  }\n")),(0,l.kt)("p",null,"There is already quite some nesting going on and quite a lot of ",(0,l.kt)("inlineCode",{parentName:"p"},"?"),", but we can use ",(0,l.kt)("inlineCode",{parentName:"p"},"bind()")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"ensureNotNull")," to get rid of the nesting."),(0,l.kt)("admonition",{title:"Seamlessly mix",type:"tip"},(0,l.kt)("p",{parentName:"admonition"},"The ",(0,l.kt)("inlineCode",{parentName:"p"},"nullable")," DSL can seamlessly be mixed with ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," by calling ",(0,l.kt)("inlineCode",{parentName:"p"},"bind")," on ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," values.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'@JvmInline value class UserId(val value: Int)\ndata class User(val id: UserId, val email: Email?)\n\nfun QueryParameters.userId(): UserId? = get("userId")?.toIntOrNull()?.let { UserId(it) }\nfun findUserById(id: UserId): Option<User> = TODO()\nfun sendEmail(email: Email): SendResult? = TODO()\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun sendEmail(params: QueryParameters): SendResult? = nullable {\n  val userId = ensureNotNull(params.userId())\n  val user = findUserById(userId).bind()\n  val email = user.email.bind()\n  sendEmail(email)\n}\n")),(0,l.kt)("p",null,"Similarly, this same pattern applies to ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," and other data types such as ",(0,l.kt)("inlineCode",{parentName:"p"},"Either"),", which is covered in other sections."),(0,l.kt)("admonition",{title:"Seamlessly mix",type:"tip"},(0,l.kt)("p",{parentName:"admonition"},"The ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," DSL can seamlessly be mixed with ",(0,l.kt)("em",{parentName:"p"},"nullable types")," using ",(0,l.kt)("inlineCode",{parentName:"p"},"ensureNotNull"),".")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'@JvmInline value class UserId(val value: Int)\ndata class User(val id: UserId, val email: Email?)\n\nfun QueryParameters.userId(): Option<UserId> =\n  get("userId")?.toIntOrNull()?.let(::UserId).toOption()\n\nfun findUserById(id: UserId): Option<User> = TODO()\nfun sendEmail(email: Email): Option<SendResult> = TODO()\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun sendEmail(params: QueryParameters): Option<SendResult> = option {\n  val userId = params.userId().bind()\n  val user = findUserById(userId).bind()\n  val email = ensureNotNull(user.email)\n  sendEmail(email).bind()\n}\n")),(0,l.kt)("h2",{id:"inspecting-option-values"},"Inspecting ",(0,l.kt)("inlineCode",{parentName:"h2"},"Option")," values"),(0,l.kt)("p",null,"Besides extracting the value from an ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," or sequencing nullable or ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," based logic, we often just need to ",(0,l.kt)("em",{parentName:"p"},"inspect")," the values inside it.\nWith ",(0,l.kt)("em",{parentName:"p"},"nullable types"),", we can simply use ",(0,l.kt)("inlineCode",{parentName:"p"},"!= null")," to inspect the value, but with ",(0,l.kt)("inlineCode",{parentName:"p"},"Option"),", we can check whether option has value or not using ",(0,l.kt)("inlineCode",{parentName:"p"},"isSome")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"isNone"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun example() {\n  Some(1).isSome() shouldBe true\n  none<Int>().isNone() shouldBe true\n}\n")),(0,l.kt)("p",null,"The same function exists to check if ",(0,l.kt)("inlineCode",{parentName:"p"},"Some")," contains a value that passes a certain predicate. For ",(0,l.kt)("em",{parentName:"p"},"nullable types"),", we would use ",(0,l.kt)("inlineCode",{parentName:"p"},"?.let { } ?: false"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"fun example() {\n  Some(2).isSome { it % 2 == 0 } shouldBe true\n  Some(1).isSome { it % 2 == 0 } shouldBe false\n  none<Int>().isSome { it % 2 == 0 } shouldBe false\n}\n")),(0,l.kt)("p",null,"And, finally, sometimes we just need to execute a side effect if the value is present. For ",(0,l.kt)("em",{parentName:"p"},"nullable types"),", we would use ",(0,l.kt)("inlineCode",{parentName:"p"},"?.also { }")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"?.also { if(it != null) { } }"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'fun example() {\n  Some(1).onSome { println("I am here: $it") }\n  none<Int>().onNone { println("I am here") }\n  \n  none<Int>().onSome { println("I am not here: $it") }\n  Some(1).onNone { println("I am not here") }\n}\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-text"},"I am here: 1\nI am here\n")),(0,l.kt)("h2",{id:"conclusion"},"Conclusion"),(0,l.kt)("p",null,"Typically, when working in Kotlin, you should prefer working with ",(0,l.kt)("em",{parentName:"p"},"nullable types")," over ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," as it is more idiomatic.\nHowever, when writing generic code, we sometimes need ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," to avoid the ",(0,l.kt)("em",{parentName:"p"},"nested nullability")," issues, or when working with libraries that don't support ",(0,l.kt)("em",{parentName:"p"},"null values")," such as Project Reactor or RxJava."),(0,l.kt)("p",null,"Arrow offers a neat DSL to work with ",(0,l.kt)("inlineCode",{parentName:"p"},"Option")," and ",(0,l.kt)("em",{parentName:"p"},"nullable types")," in an imperative way, which makes it easy to work with them both in a functional way.\nThey seamlessly integrate, so you can use whatever you need and prefer when you need it."))}m.isMDXComponent=!0}}]);