---
title: Summary
description: Summary
sidebar_position: 11
sidebar_custom_props:
  icon: icon-tutorial.svg
---

# <decorated-text icon={frontMatter.sidebar_custom_props.icon} title={frontMatter.title} />

<details>
<summary><span style={{ fontSize: '115%' }}>Typed errors</span> (<a href="../typed-errors">guide</a>)</summary>

<details>
<summary>Run a computation with potential errors</summary>

For any given value of `val program: Raise<E>.() -> A`, the following functions are available:

#### Handle any potential outcomes

- `recover(program, error)` to recover from any error.
- `fold(program, error, success)` to handle error and success case, and re-throw any exceptions.
- `fold(program, exception, error, success)` to handle exception, error and success case.

#### Obtain the result as a wrapper type

These functions create a `Raise` scope where all the operators in this section become available.

- `either(program)` to obtain `Either<E, A>`.
- `result(program)` to obtain `Result<A>`, the error type is fixed to `Throwable`.
- `nullable(program)` to obtain `A?`, the error type is fixed to `Null`.
- `option(program)` to obtain `Option<A>`, the error type is fixed to `None`.

#### Embed any potential errors in the block

- If the call has `Raise<E>` as receiver, _nothing_ is needed.
- If the call returns a wrapper type (`Result`, `Either`, ...), call `.bind()`.

</details>

<details>
<summary>Indicate that an error occurred</summary>

#### DSL syntax

- `raise` to _raise_ a typed error of `E` meaning that the computation has failed.
- `ensure` to _raise_ a typed error of `E` when predicate is `false`.
- `ensureNotNull` to _raise_ a typed error of `E` when value is `null`.

#### Wrapper types

- `Either.Left` and `.left()` to wrap a value as error in `Either`
- `Ior.Left` and `.leftIor()` to wrap a value as error in `Ior`

</details>

<details>
<summary>Handle potential errors (<a href="../typed-errors/#recovering-from-typed-errors-and-exceptions">guide</a>)</summary>

These functions allow raising errors of the same type that the surrounding block.

- `recover(program, error)` to recover from any error.
- `catch(program, exception)` to perform some action when the block throws an exception.

</details>

<details>
<summary>Accumulate errors (<a href="../typed-errors/#validation-accumulating-errors">guide</a>)</summary>

These functions use `NonEmptyList<E>` as the surrounding error type, or take `(E, E) -> E` as the error accumulator.

- `zipOrAccumulate` to operate over independent blocks, with potentially different types.
- `mapOrAccumulate` to operate over a collection of items.

</details>

</details>

<details>
<summary><span style={{ fontSize: '115%' }}>Coroutines / <code>suspend</code>ed actions</span> (guide)</summary>

<details>
<summary>Run several of them</summary>

#### Independently in parallel

- `parMap` to operate over a collection of items.
- `parZip` to combine the result of independent actions, with potentially different return types.

#### Race (only the fastest is returned)

- `raceN` to race 2 or 3 computations.

</details>

<details>
<summary>Protect from potential problems</summary>

- `Schedule.retry` to repeat an action until successful.
- `Schedule.repeat` to repeat an action, correctly handling problems.
- `resourceScope` for correct acquisition and release of resources.

For more resilience options check the `arrow-fx-resilience` package.

</details>

</details>

<details>
<summary><span style={{ fontSize: '115%' }}>Immutable data</span> (<a href="../immutable-data">guide</a>)</summary>

<details>
<summary>Generate optics</summary>

- **User-defined data**: mark the class with the `@optics` annotation and apply the KSP plug-in.
- **Collections**: traversals that work on every element of a collections are available in the `Every` object.

</details>

<details>
<summary>Obtain data</summary>

- `get` obtains the single focused element. <span style={{ fontSize: '80%' }}>(Available for `Lens`.)</span>
- `getOrNull` obtains an optional focused element as nullable. <span style={{ fontSize: '80%' }}>(Available for `Optional`, `Prism`, `Lens`.)</span>
- `getAll` obtains all focused elements as `List`. <span style={{ fontSize: '80%' }}>(Available for every optic.)</span>
- `foldMap` combines all the focused elements in a single element. <span style={{ fontSize: '80%' }}>(Available for every optic.)</span>

The `Traversal` type offers an API closely matching that of `Iterable`.

</details>

<details>
<summary>Copy value with modified data</summary>

- `modify` applies an operation to every focused element.
- `set` changes the value of every focused element.
- `copy` provides a DSL to perform several modifications over the same value.

</details>

<details>
<summary>Generate a new value</summary>

- `reverseGet` constructs a value by means of a `Prism`.

</details>

</details>
