---
title: Quickstart
sidebar_custom_props:
  icon: icon-quickstart.svg
  overview: true
position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# <decorated-text icon={frontMatter.sidebar_custom_props.icon}>Quickstart</decorated-text>

Arrow aims to be the _perfect companion_ to your Kotlin journey. That means it focuses on tasks most developers deal with, like modifying data or managing resources. Given these aims, Arrow strives to provide _idiomatic_ solutions and integrate with core Kotlin concepts such as coroutines.

Arrow is inspired by the great work made in other programming language communities, especially from _functional_, _data-oriented_ and _concurrent_ programming. This doesn't mean you need to know any of those ideas to use the libraries; Arrow exposes these concepts in ways that do not feel alien to Kotlin programmers.

:::info DSLs

Arrow uses Domain Specific Languages (DSLs) to provide a more concise syntax for many tasks.
This is just a fancy way of saying that Arrow libraries often have a core function that ought to be called with a lambda,
and inside that new scope you get access to additional behaviors.

:::

### Typed errors

<Tabs groupId="typedErrors1">
  <TabItem value="typedErrors1Explanation" label="Domain errors">

With Arrow you can succinctly describe what kind of **domain errors** may arise in your functions.
This brings extra clarity to your code, as you can more easily track what failure may happen,
and also extra safety, as the compiler will ensure that you don't forget to handle a possible error.

  </TabItem>
  <TabItem value="typedErrors1Example" label="Show me the code">

  ```kotlin
  // these signatures mark the possible errors
  suspend fun findUser(id: UserId): Either<UserNotFound, User> { TODO() }
  
  // you build larger computations using the 'Raise' DSL
  suspend fun fromTheSameCity(id1: UserId, id2: UserId): Either<UserNotFound, Boolean> =
    either {  // this begins a 'Raise' block
      val user1 = findUser(id1).bind()  // 'bind' aborts computation on failure
      val user2 = findUser(id2).bind()
      return user1.city == user2.city
    }
  ```

  </TabItem>
</Tabs>

<Tabs groupId="typedErrors2">
  <TabItem value="typedErrors2Explanation" label="Validation and accumulation">

Arrow does not only provide fail-first behavior for errors, but also error **accumulation**.
This is especially useful when validating user input, as you often want to report as many problems at once.

  </TabItem>
  <TabItem value="typedErrors2Example" label="Show me the code">

  ```kotlin
  // To be updated when 'accumulating' is documented
  ```

  </TabItem>
</Tabs>

### Concurrency and resources

<Tabs groupId="concurrency1">
  <TabItem value="concurrency1Text" label="Simpler parallelism and racing">

Kotlin coroutines are a powerful mechanism for concurrency. However, sometimes you need to describe what you want
to happen in more detail than you may want. Arrow provides higher-level constructs that focus on the intent:
**parallelism and racing** (executing several computations concurrently but waiting only for the first one).
Cancellations and exceptions are handled following the Structured Concurrency principles.

  </TabItem>
  <TabItem value="concurrency1Example" label="Show me the code">

  ```kotlin
  // obtain information in parallel, taking a maximum of 5 tasks concurrently
  suspend fun getFriendNames(id: UserId): List<User> =
    getFriendIds(id).parMap(concurrency = 5) { findUser(it) }

  // implement a caching strategy for users,
  // get the first result that succeeds
  suspend fun findUserRacing(id: UserId): User = racing {
    race { UserRepository.findUser(id) }
    race { LocalCache.getUser(id) }
  }
  ```

  </TabItem>
</Tabs>

<Tabs groupId="concurrency2">
  <TabItem value="concurrency2Explanation" label="Resource management">

Allocation and release of resources is not easy, especially when we have multiple resources that depend on each other.
The Resource DSL adds the ability to install **resources** and ensure proper finalization even in the face of exceptions and cancellations.
Furthermore, your code moves from a mess of nested `try`s or `use`s to a **linear** sequence of operations.

  </TabItem>
  <TabItem value="concurrency2Example" label="Show me the code">

  ```kotlin
  suspend fun main(): Unit = resourceScope {
    // register several resources
    val client = autoCloseable { HttpClient() }  // compatible with 'AutoCloseable'
    val dataSource = install({ DataSource(client) }) { s, _ -> s.disconnect() }
    // use dataSource here
  }
  ```

  </TabItem>
</Tabs>

<Tabs groupId="concurrency3">
  <TabItem value="concurrency3Explanation" label="Transactions">

Sharing data across multiple concurrent computations is always tricky, 
especially when this data is not just a single atomic value.
Arrow provides a higher level notion of **transactions** for your state,
providing protection for whole execution blocks, and introducing the notion
of rollback for failed computations.

  </TabItem>
  <TabItem value="concurrency3Example" label="Show me the code">

  ```kotlin
  // STM is 'Software Transactional Memory'
  // TVar is an atomic transactional variable
  fun STM.withdraw(acc: TVar<Int>, amount: Int) {
    val current = acc.read()
    // failing this check will rollback the transaction
    require(current - amount >= 0) { "Not enough money in the account!" }
    acc.write(current - amount)
  }
  ```

  </TabItem>
</Tabs>

### Resilience

<Tabs groupId="resilience1">
  <TabItem value="resilience1Explanation" label="Retries">

Most, if not all, of the systems we develop nowadays require the cooperation of other services, 
which may live in the same process, on the same machine, or may require some network communication. 
This creates a lot of different potential scenarios where things may fail.
Arrow provides a simple yet powerful way to define **policies** for **retrying** failed computations.

  </TabItem>
  <TabItem value="resilience1Example" label="Show me the code">

  ```kotlin
  // - exponential backoff of 10ms for the first minute,
  // - then try 10s for 50 times,
  // - add some jitter to the entire process
  fun <A> complexPolicy(): Schedule<A, List<A>> = Schedule
      .exponential<A>(10.milliseconds).doWhile { _, duration -> duration < 60.seconds }
      .andThen(Schedule.spaced<A>(10.seconds) and Schedule.recurs(50))
      .jittered()

  // use this policy to download the avatar
  suspend fun downloadAvatar(user: User) =
    complexPolicy().retry { HttpClient().get(user.avatarUrl) }
  ```

  </TabItem>
</Tabs>

<Tabs groupId="resilience2">
  <TabItem value="resilience2Explanation" label="Circuit breaker">

In even more complex scenarios simple retry may not be the solution.
This is especially true when a service is overloaded, since additional interaction may only worsen its overloaded state.
Arrow provides a **circuit breaker** mechanism that can be shared between concurrent computations,
with a much better protocol to resume execution until several failed attempts.

  </TabItem>
  <TabItem value="resilience2Example" label="Show me the code">

  ```kotlin
  val circuitBreaker = CircuitBreaker(
    openingStrategy = OpeningStrategy.Count(10),
    resetTimeout = 2.seconds,
    exponentialBackoffFactor = 1.2,
    maxResetTimeout = 60.seconds,
  )

  // use this policy to download the avatar
  suspend fun downloadAvatar(user: User) =
    circuitBreaker.protectOrThrow { HttpClient().get(user.avatarUrl) }
  ```

  </TabItem>
</Tabs>

### Immutable data

<Tabs groupId="optics1">
  <TabItem value="optics1Explanation" label="Update nested data">

Immutable data has many advantages in terms of safety — and Kotlin makes it easy
to use them with data classes and sealed hierarchies. However, updating those structures
using only the provided `copy` may become quite tedious if the data is nested.
Arrow **optics** give you the tools to write the concise code you always wanted.

  </TabItem>
  <TabItem value="options1Example" label="Show me the code">

  ```kotlin
  // instead of this
  fun Person.capitalizeCountry(): Person = this.copy(
    address = address.copy(
      city = address.city.copy(
        country = address.city.country.capitalize()
      )
    )
  )

  // you can write any of the following two
  fun Person.capitalizeCountryCopy(): Person = this.copy {
    Person.address.city.country transform { it.capitalize() }
  }
  fun Person.capitalizeCountryModify(): Person =
    Person.address.city.country.modify(this) { it.capitalize() }
  ```

  </TabItem>
</Tabs>

<Tabs groupId="optics2">
  <TabItem value="optics2Explanation" label="Traverse collections">

The other difficult part of immutable data is traversing collections,
either to aggregate data or to modify some part of them.
Fortunately, the optics mechanism also applies to collections,
so all of your immutable data manipulation can use the same vocabulary.

  </TabItem>
  <TabItem value="options2Example" label="Show me the code">

  ```kotlin
  // traverse every Person in the list and update its age
  // the result is a new list with the modified elements
  fun List<Person>.happyBirthdayOptics(): List<Person> =
    Every.list<Person>().age.modify(this) { age -> age + 1 }
  ```

  </TabItem>
</Tabs>

### And more!

This was just a quick overview of the main features provided by Arrow.
Smaller utilities for collections, functions, coroutines, and errors,
are also part of the ecosystem. The docs describe (almost) all of them,
so just take a look around and find what you may need.


:::info Give it a try?

- [Set up](/learn/quickstart/setup) Arrow in your project and start exploring!
- Look at some [example projects](/learn/projects) using Arrow in both frontend and backend 
- Explore the main topics in more depth: [typed errors](/learn/typed-errors/), [concurrency and resources](/learn/coroutines/), [resilience](/learn/resilience/), and [immutable data](/learn/immutable-data/)
- Learn about [design and architecture](/learn/design) using functional and data-oriented programming concepts
- Look at the [list of libraries](/learn/quickstart/libs/) and [integrations](/learn/integrations/) to see how Arrow fits in your existing project

:::
