---
id: validation
title: Validation
description: Worked out example of validation.
sidebar_position: 4
---

# Validation

<!--- TEST_NAME ValidationTest -->

<!--- INCLUDE .*
import arrow.core.left
import arrow.core.right
import arrow.core.Either
import arrow.core.NonEmptyList
import arrow.core.toNonEmptyListOrNull
import arrow.core.recover
import arrow.core.mapOrAccumulate
import arrow.core.raise.*
-->

This tutorial shows a concrete example of using typed errors to implement
domain validation. In particular, we begin with the following domain:

```kotlin
data class Author(val name: String)
data class Book(val title: String, val authors: NonEmptyList<Author>)
```
<!--- KNIT example-validation-01.kt -->

over which we want to implement the following rules:

1. The given title should not be empty,
2. The list of authors should [not be empty](../../collections-functions/non-empty/),
3. None of the author names should be empty.

We want to accumulate as many error as possible.

## Smart constructors

The `Author` class exposes its constructor, so we cannot prevent from creating
wrong values. One could introduce a `require` in the constructor, but we prefer
to use the typed error mechanism instead. A common pattern in this case is to
_hide_ the constructor, and provide a _smart constructor_ by adding an `invoke`
operator in the companion.

```kotlin
object EmptyAuthorName

data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = TODO()
  }
}
```
<!--- KNIT example-validation-02.kt -->

This way the users of this class still use `Author("me")` to create a new name,
in the same way one would use a constructor, but actually our `invoke` function
is called. This allows us to refine the type to an `Either`, which can return
an error. The implementation uses the `either` computation block, with `ensure`
describing the constraint #3.

<!--- INCLUDE
object EmptyAuthorName
-->

```kotlin
data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = either {
      ensure(name.isNotEmpty()) { EmptyAuthorName }
      Author(name)
    }
  }
}
```
<!--- KNIT example-validation-03.kt -->

## Fail-first vs. accumulation

We are going to use a similar approach for `Book`, introducing a smart
constructor. We have several different errors, though, which we define as
a hierarchy. Note that `EmptyAuthor` is a different type than before,
since we want to accommodate the index of the author.

<!--- INCLUDE
data class Author(val name: String)
-->

```kotlin
sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

data class Book private constructor(
  val title: String, val authors: NonEmptyList<Author>
) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<BookValidationError, Book> = TODO()
  }
}
```
<!--- KNIT example-validation-04.kt -->

Let's forget about validating each author for a moment, and just implement the
emptiness checks for the title and the authors list. Note that in the latter
case we perform both the check and the conversion to `NonEmptyList` in a single
go using `ensureNotNull`.

<!--- INCLUDE
sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

data class Author(val name: String)
-->

```kotlin
data class Book private constructor(
  val title: String, val authors: NonEmptyList<Author>
) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<BookValidationError, Book> = either {
      ensure(title.isNotEmpty()) { EmptyTitle }
      ensureNotNull(authors.toNonEmptyListOrNull()) { NoAuthors }
      Book(title, TODO())
    }
  }
}
```
<!--- KNIT example-validation-05.kt -->

This code has a problem, though: it only returns _one_ error, even if there are
two problems with the data of the `Book`. We would rather use an _accumulation_
approach, so we can give back as much information as possible to the user.
This requires two changes to the code:
- The result type is now a `NonEmptyList` of problems,
- We need to wrap the different validations in `zipOrAccumulate`.

<!--- INCLUDE
sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

data class Author(val name: String)
-->

```kotlin
data class Book private constructor(
  val title: String, val authors: NonEmptyList<Author>
) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<NonEmptyList<BookValidationError>, Book> = either {
      zipOrAccumulate(
        { ensure(title.isNotEmpty()) { EmptyTitle } },
        { ensureNotNull(authors.toNonEmptyListOrNull()) { NoAuthors } }
      ) { _, _ ->
        Book(title, TODO())
      }
    }
  }
}
```
<!--- KNIT example-validation-06.kt -->

The result of each of the arguments of `zipOrAccumulate` are available in the
trailing lambda. In this case we are not using them: we have the `title`
already available, and for the list of authors we still need to perform the
conversion from `String` to `Author`.

:::tip Arguments to zipOrAccumulate

All but the last argument to `zipOrAccumulate` represent the different
validations we want to run aggregating their output. Those arguments are
often _blocks_ wrapped in `{` curly braces `}`, which is a bit unusual for
most Kotliners.

:::

## Validating a list

The next step is turning the given `authors`, which is a list of `String`s, into
a list of `Author`s. We need to run the smart constructor, thus, but at the same
time we should accumulate any potential problems. Since this is related to
author checks, we'll include this as part of the second validation.

<!--- INCLUDE
sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

object EmptyAuthorName

data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = either {
      ensure(name.isNotEmpty()) { EmptyAuthorName }
      Author(name)
    }
  }
}
-->

```kotlin
data class Book private constructor(
  val title: String, val authors: NonEmptyList<Author>
) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<NonEmptyList<BookValidationError>, Book> = either {
      zipOrAccumulate(
        { ensure(title.isNotEmpty()) { EmptyTitle } },
        { 
          val validatedAuthors = mapOrAccumulate(authors.withIndex()) {
            Author(it.value)
              .recover { _ -> raise(EmptyAuthor(it.index)) }
              .bind()
          }
          ensureNotNull(validatedAuthors.toNonEmptyListOrNull()) { NoAuthors }
        }
      ) { _, authorsNel ->
        Book(title, authorsNel)
      }
    }
  }
}
```
<!--- KNIT example-validation-07.kt -->

This additional check is quite complex, so let's unravel it step by step:
- We use `authors.withIndex()` to create an iterable containing the values
  in conjunction with the index they live in, this is necessary to create
  the right `EmptyAuthor` error value.
- With `mapOrAccumulate` we state that we want to perform some validation over
  a collection of elements, accumulating each possible error.
- The call to `Author(it.value)` return an `Either` with the wrong error type
  (`EmptyAuthorName` instead of `EmptyAuthor`). To transform this value we
  use the `recover` extension function.

:::tip Recover vs. Map Left

Another possibility would be to use `mapLeft { EmptyAuthor(it.index) }`.
The difference between `recover` and `mapLeft` is that the latter only transforms
the error value, whereas in the former you can use any typed error computation.

:::

- Finally, we use `.bind()` to embed the `Either` into the computation block.
  Essentially, every time you are using a value of type `Either` inside an
  `either` (or any other `Raise` block), such a call is required.

The result of the mapping is a `List<Author>`, that we can now use to create the
final `Book`. This value is available in the last lambda of `zipOrAccumulate`,
that we've called `validatedAuthors` in the code above.

### Variants of map + accumulation

In the code above there's one section which can be written in several different
ways, namely the mapping over a list while accumulating any errors raised
during the processing of each of the elements.

```
val validatedAuthors = mapOrAccumulate(authors.withIndex()) { nameAndIx ->
  Author(nameAndIx.value)
    .mapLeft { EmptyAuthor(nameAndIx.index) }
    .bind()
}
```

This first version uses the variant of `mapOrAccumulate` which lives in
`Raise` and takes the collection to work on as first argument. This variant
provides `Raise` inside the block (hence the need to call `.bind()`), and
`raise`s automatically if any error is found.

Another way to write the code above is creating a list of `Either` using
`map`, and then using `.bindAll()` at the very end. This often turns into
simpler code when your validations use wrapper types, as we do here, since
you don't need to call the intermediate `.bind()`.

<!--- INCLUDE
sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

object EmptyAuthorName

data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = either {
      ensure(name.isNotEmpty()) { EmptyAuthorName }
      Author(name)
    }
  }
}

data class Book private constructor(val title: String, val authors: NonEmptyList<Author>) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<NonEmptyList<BookValidationError>, Book> = either {
      zipOrAccumulate(
        { ensure(title.isNotEmpty()) { EmptyTitle } },
        { 
          val validatedAuthors = authors.withIndex().map { nameAndIx ->
            Author(nameAndIx.value)
              .mapLeft { EmptyAuthor(nameAndIx.index) }
          }.bindAll()
          ensureNotNull(validatedAuthors.toNonEmptyListOrNull()) { NoAuthors }
        }
      ) { _, validatedAuthors ->
        Book(title, validatedAuthors)
      }
    }
  }
}
-->
<!--- KNIT example-validation-08.kt -->

```
val validatedAuthors = authors.withIndex().map { nameAndIx ->
  Author(nameAndIx.value)
    .mapLeft { EmptyAuthor(nameAndIx.index) }
}.bindAll()
```


<!--- INCLUDE
sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

object EmptyAuthorName

data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = either {
      ensure(name.isNotEmpty()) { EmptyAuthorName }
      Author(name)
    }
  }
}

data class Book private constructor(val title: String, val authors: NonEmptyList<Author>) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<NonEmptyList<BookValidationError>, Book> = either {
      zipOrAccumulate<BookValidationError, Unit, NonEmptyList<Author>, Book>(
        { ensure(title.isNotEmpty()) { EmptyTitle } },
        { 
          val validatedAuthors: Either<NonEmptyList<BookValidationError>, List<Author>> = either { authors.withIndex().mapOrAccumulate { nameAndIx ->
            Author(nameAndIx.value)
              .mapLeft { EmptyAuthor(nameAndIx.index) }
              .bind()
          } }
          ensureNotNull(validatedAuthors.bindNel().toNonEmptyListOrNull()) { NoAuthors }
        }
      ) { _, validatedAuthors ->
        Book(title, validatedAuthors)
      }
    }
  }
}
-->
<!--- KNIT example-validation-09.kt -->

Any of these approaches are equivalent, given that the function that validates
each of the elements doesn't perform any side effects.
