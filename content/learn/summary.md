# Summary

<details>
<summary><span style={{ fontSize: '115%' }}>Typed Errors</span> (<a href="../typed-errors">guide</a>)</summary>

<details>
<summary>Run a computation with potential errors</summary>

#### Handle any potential outcomes

- `fold(program, failure, success)` to handle the main two cases, and re-throw any exceptions.
- `fold(program, error, failure, success)` to handle all three potential cases.

#### Obtain the result as a wrapper type

These functions create a new scope where all the operators in this section become available.

- `result` to obtain `Result<A>`, the error type is fixed to `Throwable`.
- `either` to obtain `Either<E, A>`.
- `nullable` and `option` discard any error information.

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
<summary>Handle potential errors</summary>

These functions allow raising errors of the same type that the surrounding block.

- `recover` to perform some action when the block fails.
- `catch` to perform some action when the block throws an exception.

</details>

<details>
<summary>Accumulate independent errors</summary>

These functions use `NonEmptyList<E>` as the surrounding error type.

- `mapOrAccumulate` to operate over a collection of items.
- `zipOrAccumulate` to operate over independent blocks, with potentially different types.

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
<summary><span style={{ fontSize: '115%' }}>Immutable data</span> (guide)</summary>

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
