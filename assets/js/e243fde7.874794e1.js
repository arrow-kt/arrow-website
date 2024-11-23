"use strict";(self.webpackChunkarrow_website=self.webpackChunkarrow_website||[]).push([[4149],{27195:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>t,toc:()=>l});var r=s(85893),o=s(11151);const i={sidebar_position:2},c="Resource",t={id:"learn/coroutines/resource-safety",title:"Resource",description:"Allocation and release of resources is not easy, especially when",source:"@site/content/docs/learn/coroutines/resource-safety.md",sourceDirName:"learn/coroutines",slug:"/learn/coroutines/resource-safety",permalink:"/learn/coroutines/resource-safety",draft:!1,unlisted:!1,editUrl:"https://github.com/arrow-kt/arrow-website/edit/main/content/docs/learn/coroutines/resource-safety.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"learnSidebar",previous:{title:"High-level concurrency",permalink:"/learn/coroutines/parallel"},next:{title:"Graceful shutdown",permalink:"/learn/coroutines/suspendapp/"}},a={},l=[{value:"Understanding the problem",id:"understanding-the-problem",level:2},{value:"Dealing with resources properly",id:"dealing-with-resources-properly",level:2},{value:"Using <code>resourceScope</code>",id:"using-resourcescope",level:3},{value:"Interfacing with Java",id:"interfacing-with-java",level:3},{value:"Using <code>Resource</code>",id:"using-resource",level:3},{value:"Integration with typed errors",id:"integration-with-typed-errors",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"resource",children:"Resource"}),"\n",(0,r.jsxs)(n.p,{children:["Allocation and release of resources is not easy, especially when\nwe have multiple resources that depend on each other. The Resource DSL\nadds the ability to ",(0,r.jsx)(n.em,{children:"install"})," resources and ensure proper finalization even\nin the face of exceptions and cancellations. Arrow's Resource co-operated\nwith Structured Concurrency and KotlinX Coroutines."]}),"\n",(0,r.jsx)(n.admonition,{title:"Media resources",type:"info",children:(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://www.youtube.com/watch?v=zKrTBH8jqH4",children:(0,r.jsx)(n.em,{children:"Graceful Resource Handling"})})," by Simon Vergauwen"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://kotlindevday.com/videos/grateful-shutdown-with-structured-concurrency-simon-vergauwen/",children:(0,r.jsx)(n.em,{children:"Graceful Shutdown with Structured Concurrency"})})," by Simon Vergauwen"]}),"\n"]})}),"\n",(0,r.jsx)(n.admonition,{title:"Where to find it",type:"note",children:(0,r.jsxs)(n.p,{children:["Resource management is part of the ",(0,r.jsx)(n.code,{children:"arrow-fx-coroutines"})," library. The separate ",(0,r.jsx)(n.code,{children:"arrow-autoclose"})," library provides a similar API but without integration with Kotlin's coroutine mechanism."]})}),"\n",(0,r.jsx)(n.h2,{id:"understanding-the-problem",children:"Understanding the problem"}),"\n",(0,r.jsxs)(n.p,{children:["The following program is ",(0,r.jsx)(n.strong,{children:"not"})," safe because it is prone to leak ",(0,r.jsx)(n.code,{children:"dataSource"}),"\nand ",(0,r.jsx)(n.code,{children:"userProcessor"})," when an exception or cancellation signal occurs while using the service."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:'class UserProcessor {\n  fun start(): Unit = println("Creating UserProcessor")\n  fun shutdown(): Unit = println("Shutting down UserProcessor")\n}\n\nclass DataSource {\n  fun connect(): Unit = println("Connecting dataSource")\n  fun close(): Unit = println("Closed dataSource")\n}\n\nclass Service(val db: DataSource, val userProcessor: UserProcessor) {\n  suspend fun processData(): List<String> = \n    throw RuntimeException("I\'m going to leak resources by not closing them")\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"For example, the following application would leak resources."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:"suspend fun example() {\n  val userProcessor = UserProcessor().also { it.start() }\n  val dataSource = DataSource().also { it.connect() }\n  val service = Service(dataSource, userProcessor)\n\n  service.processData()\n\n  dataSource.close()\n  userProcessor.shutdown()\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["If we were using Kotlin JVM, we might rely on ",(0,r.jsx)(n.code,{children:"Closeable"})," or ",(0,r.jsx)(n.code,{children:"AutoCloseable"})," and rewrite our code."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:"suspend fun example() {\n  UserProcessor().use { userProcessor ->\n    userProcessor.start()\n    DataSource().use { dataSource ->\n      dataSource.connect()\n      Service(dataSource, userProcessor).processData()\n    }\n  }\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["However, while we fixed the closing of ",(0,r.jsx)(n.code,{children:"UserProcessor"})," and ",(0,r.jsx)(n.code,{children:"DataSource"}),", there are still issues with this code:"]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["It requires implementing ",(0,r.jsx)(n.code,{children:"Closeable"})," or ",(0,r.jsx)(n.code,{children:"AutoCloseable"}),", which is only possible for Kotlin JVM but not available for Multiplatform."]}),"\n",(0,r.jsxs)(n.li,{children:["Requires implementing an interface or wrapping external types with something like ",(0,r.jsx)(n.code,{children:"class CloseableOf<A>(val type: A): Closeable"}),"."]}),"\n",(0,r.jsx)(n.li,{children:"Requires nesting of different resources in callback tree, not composable."}),"\n",(0,r.jsxs)(n.li,{children:["Enforces ",(0,r.jsx)(n.code,{children:"close"})," method name, renamed ",(0,r.jsx)(n.code,{children:"UserProcessor#shutdown"})," to ",(0,r.jsx)(n.code,{children:"close"})]}),"\n",(0,r.jsxs)(n.li,{children:["Cannot run ",(0,r.jsx)(n.code,{children:"suspend"})," functions within ",(0,r.jsx)(n.code,{children:"fun close(): Unit"}),"."]}),"\n",(0,r.jsx)(n.li,{children:"No exit signal; we don't know if we exited successfully, with an error or cancellation."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Resource solves these issues. The main idea is that each resource has three\nstages: 1\ufe0f\u20e3 acquiring the resource, 2\ufe0f\u20e3 using the resource, and 3\ufe0f\u20e3 releasing the\nresource. With ",(0,r.jsx)(n.code,{children:"Resource"}),", we bundle steps (1) and (3), and the implementation\nensures that everything works correctly, even in the event of exceptions or\ncancellations."]}),"\n",(0,r.jsx)(n.admonition,{title:"Graceful Shutdowns",type:"note",children:(0,r.jsxs)(n.p,{children:["Correct release of resources when the application is terminating is important\nin several scenarios.\n",(0,r.jsx)(n.a,{href:"../suspendapp/",children:"SuspendApp"})," improves on\n",(0,r.jsx)(n.code,{children:"Resource"})," to gracefully deal with shutdown and termination."]})}),"\n",(0,r.jsx)(n.h2,{id:"dealing-with-resources-properly",children:"Dealing with resources properly"}),"\n",(0,r.jsx)(n.p,{children:"You can use Arrow's Resource in two ways:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Using ",(0,r.jsx)(n.code,{children:"resourceScope"})," and functions with ",(0,r.jsx)(n.code,{children:"ResourceScope"})," as its receiver."]}),"\n",(0,r.jsxs)(n.li,{children:["Wrapping the entire resource allocation and release as a ",(0,r.jsx)(n.code,{children:"Resource<A>"})," value,\nwhich we later ",(0,r.jsx)(n.code,{children:"use"})," in a larger block."]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"using-resourcescope",children:["Using ",(0,r.jsx)(n.code,{children:"resourceScope"})]}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"ResourceScope"})," DSL allows you to ",(0,r.jsx)(n.em,{children:"install"})," resources and safely interact with them.\nIn fact, that's the only operation you need to learn about: ",(0,r.jsx)(n.code,{children:"install"})," takes both\nthe acquisition and release steps as arguments. The result of this function is\nwhatever was acquired, plus the promise of running the finalizer at the end of\nthe block."]}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["The Resource DSL gives you enough flexibility to perform different actions\ndepending on how the execution finished: successful completion, exceptions,\nor cancellation. The second argument to the finalizer is of type ",(0,r.jsx)(n.code,{children:"ExitCase"}),"\nand represents the reason why the finalizer is run."]})}),"\n",(0,r.jsxs)(n.p,{children:["The code below shows our ",(0,r.jsx)(n.code,{children:"example"})," rewritten to use ",(0,r.jsx)(n.code,{children:"resourceScope"}),". Note that\nwe acquire our ",(0,r.jsx)(n.code,{children:"UserProcessor"})," and ",(0,r.jsx)(n.code,{children:"DataSource"})," in parallel, using the ",(0,r.jsxs)(n.a,{href:"../parallel",children:[(0,r.jsx)(n.code,{children:"parZip"}),"\noperation in Arrow"]}),". This means that their ",(0,r.jsx)(n.code,{children:"start"})," and ",(0,r.jsx)(n.code,{children:"connect"}),"\nmethods can run in parallel."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:"suspend fun ResourceScope.userProcessor(): UserProcessor =\n  install({ UserProcessor().also { it.start() } }) { p, _ -> p.shutdown() }\n\nsuspend fun ResourceScope.dataSource(): DataSource =\n  install({ DataSource().also { it.connect() } }) { ds, _ -> ds.close() }\n\nsuspend fun example(): Unit = resourceScope {\n  val service = parZip({ userProcessor() }, { dataSource() }) { userProcessor, ds ->\n    Service(ds, userProcessor)\n  }\n  val data = service.processData()\n  println(data)\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The code above also showcases a very common pattern of resource acquisition:\nrunning the constructor, followed by calling some start method using Kotlin's\n",(0,r.jsx)(n.code,{children:"also"})," scope function."]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["To achieve its behavior, ",(0,r.jsx)(n.code,{children:"install"})," invokes the ",(0,r.jsx)(n.code,{children:"acquire"})," and ",(0,r.jsx)(n.code,{children:"release"})," step\nas ",(0,r.jsx)(n.a,{href:"https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/",children:"NonCancellable"}),".\nIf a cancellation signal or an exception is received during ",(0,r.jsx)(n.code,{children:"acquire"}),", the\nresource is assumed to ",(0,r.jsx)(n.strong,{children:"not"})," have been acquired and thus will not trigger the\nrelease function; any composed resources that are already acquired are guaranteed\nto release as expected."]})}),"\n",(0,r.jsx)(n.h3,{id:"interfacing-with-java",children:"Interfacing with Java"}),"\n",(0,r.jsxs)(n.p,{children:["If you're running on the JVM, Arrow provides built-in integration with\n",(0,r.jsx)(n.a,{href:"https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html",children:(0,r.jsx)(n.code,{children:"AutoCloseable"})}),"\nin the form of the ",(0,r.jsx)(n.a,{href:"https://apidocs.arrow-kt.io/arrow-fx-coroutines/arrow.fx.coroutines/closeable.html",children:(0,r.jsx)(n.code,{children:"closeable"})})," function."]}),"\n",(0,r.jsxs)(n.h3,{id:"using-resource",children:["Using ",(0,r.jsx)(n.code,{children:"Resource"})]}),"\n",(0,r.jsxs)(n.p,{children:["The usage of ",(0,r.jsx)(n.code,{children:"resource"})," is very similar to ",(0,r.jsx)(n.code,{children:"install"}),". The main difference\nis that the result is a value of type ",(0,r.jsx)(n.code,{children:"Resource<T>"}),", where ",(0,r.jsx)(n.code,{children:"T"})," is the type of\nthe resource to acquire. But such a value doesn't run the acquisition step,\nit's simply a ",(0,r.jsx)(n.em,{children:"recipe"})," describing how that's done; to actually acquire the\nresource, you need to call ",(0,r.jsx)(n.code,{children:".bind()"})," inside a ",(0,r.jsx)(n.code,{children:"resourceScope"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:'val userProcessor: Resource<UserProcessor> = resource({\n  UserProcessor().also { it.start() }\n}) { p, _ -> p.shutdown() }\n\nval dataSource: Resource<DataSource> = resource({\n  DataSource().also { it.connect() }\n}) { ds, exitCase ->\n  println("Releasing $ds with exit: $exitCase")\n  withContext(Dispatchers.IO) { ds.close() }\n}\n\nval service: Resource<Service> = resource {\n  Service(dataSource.bind(), userProcessor.bind())\n}\n\nsuspend fun example(): Unit = resourceScope {\n  val data = service.bind().processData()\n  println(data)\n}\n'})}),"\n",(0,r.jsxs)(n.admonition,{type:"info",children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.em,{children:"Why provide two ways to accomplish the same goal?"}),"\nAlthough ",(0,r.jsx)(n.code,{children:"resourceScope"})," provides nicer syntax in general, some usage patterns\nlike acquiring several resources become easier when the steps are saved in\nan actual class."]}),(0,r.jsxs)(n.p,{children:["The actual magic is that ",(0,r.jsx)(n.code,{children:"Resource"})," is nothing more than a type alias for\nparameter-less function using ",(0,r.jsx)(n.code,{children:"ResourceScope"}),","]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:"typealias Resource<A> = suspend ResourceScope.() -> A\n"})})]}),"\n",(0,r.jsxs)(n.p,{children:["Although the primary usage pattern is to give ",(0,r.jsx)(n.code,{children:"resource"})," the acquisition and\nrelease steps directly, there's another way to define a ",(0,r.jsx)(n.code,{children:"Resource<T>"}),".\nArrow provides a ",(0,r.jsx)(n.code,{children:"resource"})," for more complex scenarios that takes a block\nwith ",(0,r.jsx)(n.code,{children:"ResourceScope"})," as a receiver. That allows calling ",(0,r.jsx)(n.code,{children:"install"})," as required."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:"val userProcessor: Resource<UserProcessor> = resource {\n  val x: UserProcessor = install(\n    {  UserProcessor().also { it.start() } },\n    { processor, _ -> processor.shutdown() }\n  )\n  x\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"integration-with-typed-errors",children:"Integration with typed errors"}),"\n",(0,r.jsxs)(n.p,{children:["Resource management cooperates with ",(0,r.jsx)(n.a,{href:"../../typed-errors",children:"typed error builders"}),".\nIt's important to be aware that the order in which we open the scopes\naffects the behavior. To be more concrete, let's consider the two possible\nnestings of ",(0,r.jsx)(n.code,{children:"resourceScope"})," and ",(0,r.jsx)(n.code,{children:"either"}),"."]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["When ",(0,r.jsx)(n.code,{children:"either"})," is in the outermost position and ",(0,r.jsx)(n.code,{children:"resourceScope"})," is inside of it,\na bind that crosses the ",(0,r.jsx)(n.code,{children:"resourceScope"})," results in the release finalizer\nbeing called with ",(0,r.jsx)(n.code,{children:"Cancelled"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:'either<String, Int> {\n  resourceScope {\n    val a = install({ }) { _, ex -> println("Closing A: $ex") }\n    raise("Boom!")\n  } // Closing A: ExitCase.Cancelled\n} // Either.Left(Boom!)\n'})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["With reverse nesting order of ",(0,r.jsx)(n.code,{children:"either"})," and ",(0,r.jsx)(n.code,{children:"resourceScope"}),', then resources\nare released with a normal state since nothing "failed."']}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-kotlin",children:'resourceScope {\n  either<String, Int> {\n    val a = install({ }) { _,ex -> println("Closing A: $ex") }\n    raise("Boom!")\n  } // Either.Left(Boom!)\n} // Closing A: ExitCase.Completed\n'})}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["We remark that, in both cases, resources are correctly released. If you're\nfinalizer works in the same way for every possible ",(0,r.jsx)(n.code,{children:"ExitCase"}),", then there's no\nvisible difference between both."]}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["If you want to know more, this ",(0,r.jsx)(n.a,{href:"https://kotlinlang.slack.com/archives/C5UPMM0A0/p1677093177834299",children:"conversation"}),"\nin the Kotlin Slack goes into more detail."]})})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},11151:(e,n,s)=>{s.d(n,{Z:()=>t,a:()=>c});var r=s(67294);const o={},i=r.createContext(o);function c(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);