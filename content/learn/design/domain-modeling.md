---
sidebar_position: 1
---

# Domain modeling

The goal of functional domain modeling is to describe your business domain as accurately as possible to achieve more type-safety, maximize the use of the compiler with our domain and, thus, prevent bugs and reduce unit testing. Additionally, it makes it easier to communicate about the domain, since the domain is the touchpoint with the real world. Kotlin is a good fit for functional domain modeling. It offers us `data class`, `sealed class`, `enum class`, and `value class`. And we have Arrow, which offers us some interesting generic data types such as `Either` and `Ior`.

> This article was originally published at [47 Degrees' blog](https://www.47deg.com/blog/functional-domain-modeling/).

In some codebases, you can find the following primitive type based implementation of an `Event`:

```kotlin
data class Event(
  val id: Long
  val title: String,
  val organizer: String,
  val description: String,
  val date: LocalDate
)
```

The types used here have little or no meaning since `title`, `organizer`, and `description` all share the same type. This makes our code prone to subtle bugs where we might be relying on `title` instead of `description`, and the compiler would not be able to help us out. Let's take a look at an example where things go wrong without the compiler being able to help us.

```kotlin
Event(
  0L,
  "Simon Vergauwen",
  "In this blogpost we dive into functional DDD...",
  "Functional Domain Modeling",
  LocalDate.now()
)
```

Here, we have mixed up `organizer`, `description`, but the compiler is happy and constructs the `Event` object. There are more cases where you can fall into this trap; for example, when destructuring.

So how do we prevent this from happening, or how can we improve our domain model to be better typed? We use `value class`, Kotlin's feature to disguise an already-existing type under a new name. Doing this causes no additional overhead, since `value class` is erased at runtime. At the moment of writing, every appearance of `value class` requires a corresponding `@JvmInline` annotation.

```kotlin
@JvmInline value class EventId(val value: Long)
@JvmInline value class Organizer(val value: String)
@JvmInline value class Title(val value: String)
@JvmInline value class Description(val value: String)

data class Event(
  val id: EventId
  val title: Title,
  val organizer: Organizer,
  val description: Description,
  val date: LocalDate
)
```

If we go back to our previous example, the compiler now fails to compile since we pass `Organizer ` where `Title` is expected, `Description` where `Organizer` is expected, and so on.

```kotlin
Event(
  EventId(0L),
  Organizer("Simon Vergauwen"),
  Description("In this blogpost we dive into functional DDD..."),
  Title("Functional Domain Modeling"),
  LocalDate.now()
)
```

In functional programming, this type of data composition is also known as a **product type** or a **record**, which models an _and_ relationship.
So we can say that an `Event` exists out of an `EventId` _and_ a `Title` _and_ an `Organizer` _and_ a `Description` _and_ a `LocalDate`, which tells us much more than an `Event` that exists out of a `Long` _and_ a `String` _and_ a `String` _and_ a `String` _and_ a `LocalDate`.

Let's say that we need to evolve our `Event` model to keep track of any age restrictions. We could model this with `String` again, but that would only worsen our original problem. So let's say we follow the [MPAA film ratings](https://en.wikipedia.org/wiki/Motion_Picture_Association_film_rating_system), which is an enumeration of 5 different cases. Since we're clearly talking about a *fixed set* of cases, or enumeration, we use an `enum class`.

```kotlin
enum class AgeRestriction(val description: String) {
  General("All ages admitted. Nothing that would offend parents for viewing by children."),
  PG("Some material may not be suitable for children. Parents urged to give \"parental guidance\""),
  PG13("Some material may be inappropriate for children under 13. Parents are urged to be cautious."),
  Restricted("Under 17 requires accompanying parent or adult guardian. Contains some adult material."),
  NC17("No One 17 and Under Admitted. Clearly adult.")
}
```

Using an `enum class` is much more powerful than `String` for reasons beyond the problems we already explained above. A `String` has an infinite number of possible values, while now we only have 5 different possible values.
So it's much easier to reason about `AgeRestriction` than it would be to reason and work with `String`.

In functional programming, this type of data composition is also known as a **sum type**, which models an _or_ relationship.
So we can say that an `AgeRestriction `is either `General` _or_ `PG` _or_ `PG13` _or_ `Restricted` _or_ `NC17`.
This tells us much more than if it was just a `String`. A `String` would have an infinite number of values, while `AgeRestriction` modeled as an `enum class` only has 5 different values.
So using sum types can drastically reduce the complexity of our types.

With online events on the rise, we have a different kind of event that doesn't take place at a `Address`, but rather at a certain `Url`. So, depending on what kind of `Event` it is, the data inside will be slightly different. Naively we could implement this as follows:

```kotlin
@JvmInline value class Url(val value: String)

@JvmInline value  class City(val value: String)
@JvmInline value  class Street(val value: String)
data class Address(val city: City, val street: Street)

data class Event(
  val id: EventId
  val title: Title,
  val organizer: Organizer,
  val description: Description,
  val date: LocalDate,
  val ageRestriction: AgeRestriction,
  val isOnline: Boolean,
  val url: Url?,
  val address: Address?
)
```

This is a common encoding, but can be quite problematic. Depending on if `isOnline` is `true`, `url` will be non-`null` and vice-versa for `address`. However, after checking `isOnline`, both `url` and `address` is still null, so we'll end up with code like this.

```kotlin
fun printLocation(event: Event): Unit =
  if(event.isOnline) {
    event.url?.value?.let(::println)
  } else {
    event.address?.let(::println)
  }
```

But, even worse, we can also easily break the intended contract like in the example below.

```kotlin
Event(
	Id(0L),
	Title("Functional Domain Modeling"),
	Organizer("47 Degrees"),
	Description("Building software with functional DDD..."),
	LocalDate.now(),
	AgeRestriction.General,
	true,
	null,
	null
)
```

The compiler is happy with the below definition, even though our intended contract said that, if it's `isOnline`, then `url` would be non-`null`.
We can prevent this issue by introducing a `sealed class` to combine `Event.Online` and `Event.AtAddress` in a typed way.

```kotlin
sealed class Event {
  abstract val id: EventId
  abstract val title: Title
  abstract val organizer: Organizer
  abstract val description: Description
  abstract val ageRestriction: AgeRestriction
  abstract val date: LocalDate

  data class Online(
    override val id: EventId,
    override val title: Title,
    override val organizer: Organizer,
    override val description: Description,
    override val ageRestriction: AgeRestriction,
    override val date: LocalDate,
    val url: Url
  ) : Event()

  data class AtAddress(
    override val id: EventId,
    override val title: Title,
    override val organizer: Organizer,
    override val description: Description,
    override val ageRestriction: AgeRestriction,
    override val date: LocalDate,
    val address: Address
  ) : Event()
}
```

This not only solves the issue we had before where we can instantiate an online `Event` without an `Url`, but it also offers a much nicer way of working with the data. Instead of `if(event.isOnline)`, we can now use an exhaustive `when` to pattern match on `Event`, and due to Kotlin's smart casting, we can safely access `url` in the case that it's `Event.Online`.

```kotlin
fun printLocation(event: Event): Unit =
  when(event) {
  	is Online -> println(event.url.value)
  	is AtAddress -> println("${event.address.city}: ${event.address.street}")
  }
```

This type of data composition is also known as a **sum type**, which models an _or_ relationship, but `sealed class` offers us more powerful capabilities than `enum class`.
A `sealed class` allows _cases_ to exist out of `object`, `data class`, or even another `sealed class`. An `enum class` cannot extend another class, so it cannot be a _case_ of a `sealed class`.
Here, our `sealed class` exists out of 2 _cases_, an `Online` _or_ `AtAddress` `Event`, where `Online` and `AtAddress` are **product types** of several other types.
A rule of thumb in Kotlin is to use an `enum class` when the _cases_ don't contain any data or, in other words, if all _cases_ can be modeled as _object_.

As we've already seen in the examples above, modeling your domain precisely has many benefits. It can eliminate certain bugs, such as instantiating data incorrectly. It makes our code/model easier to reason about by eliminating invalid values, and it can improve code relying on our models.

Let's take a look at how we can use Arrow's data types to further clear up domain problems in our code. In our program, we have some `EventService` that can fetch an upcoming `Event` based on a `EventId`.

```kotlin
interface EventService {
  suspend fun fetchUpcomingEvent(id: EventId): Event
}
```

What is completely missing from our `EventService` is the different kind of error scenarios we could encounter. It's only modeled through `Throwable` in `suspend`. So if we'd want to explicitly model the error domain, we could use any of the techniques we've already seen above.

Here, we model 2 different cases:
 1. An event is not found.
 2. An event is no longer upcoming, but has already happened.

```kotlin
sealed class Error {
  data class EventNotFound(val id: EventId): Error()
  data class EventPassed(val event: Event): Error()
}
```

We can compose these two separate domains, `Error` and `Event`, using `Either` from `Arrow Core`. This allows us to model an _or_ relationship, meaning that `fetchUpcomingEvent` _either_ returns an `Error` _or_ an `Event`, but never both. So `Either` is a **generic** sum type, which allows us to generically compose two separate domains with each other in an _or_ relationship.

So, if we update our `EventService`:

```kotlin
interface EventService {
  suspend fun fetchUpcomingEvent(id: EventId): Either<Error, Event>
}
```

Since `Either` is defined as `sealed class` in [Arrow Core](https://arrow-kt.io/docs/core/), we can use the same technique as we used above with `when` to extract the `Error` or `Event` in a safe way.

In this article we've seen how we can improve our domain by:
 - Eliminating primitive types in our domain definition, and using `value class` to prevent runtime overhead.
 - Using `enum class` and `sealed class` to model disjunctions in our domain, such as certain data being available depending on the type of `Event`.
 - Utilizing Arrow's `Either` to compose two different domains with an _or_ relationship.
