---
sidebar_position: 1
description: Working with collections with at least one element
---

# Non-empty collections

Nullable types give us the ability to have zero or one appearance of a value,
collections allow us to have any number of them. However, in some scenarios, we need to work with collections that should contain **at least one** element. Arrow provides both [`NonEmptyList`](https://arrow-kt.github.io/arrow/arrow-core/arrow.core/-non-empty-list/index.html)
and [`NonEmptySet`](https://arrow-kt.github.io/arrow/arrow-core/arrow.core/-non-empty-set/index.html).

One concrete example is given by [error accumulation](../../typed-errors/working-with-typed-errors/#accumulating-errors).
A type like `Either<List<Problem>, Result>` may take us to the weird case in
which we end with `Left`, but we have no `Problem`s in the `List`. To avoid
this issue, Arrow makes `mapOrAccumulate` and `zipOrAccumulate` return
`Either<NonEmptyList<Problem>, Result>` instead.

The API of non-empty collections follows the conventions from [`kotlin.collections`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/).
On top of that, some types become stronger to ensure or keep track of the
non-empty nature of the collection.

- [`nonEmptyListOf`](https://arrow-kt.github.io/arrow/arrow-core/arrow.core/non-empty-list-of.html) and [`nonEmptySetOf`](https://arrow-kt.github.io/arrow/arrow-core/arrow.core/non-empty-set-of.html) require at least one value as argument.
- `map`, `zip`, and similar operations which respect the size of the arguments
  return non-empty collections.
- Concatenation where one of the arguments is non-empty ensures that the result
  is also non-empty.
