---
title: Typed Errors
---

import { useCurrentSidebarCategory } from '@docusaurus/theme-common';
import DocCardList from '@theme/DocCardList';

# Typed errors

_Typed errors_ refer to a technique from functional programming in which we
make _explicit_ in the signature (or _type_) the potential errors that may
arise during the execution of a piece of code. Arrow provides two different
**approaches** to typed errors:

1. The `Raise` DSL uses an extension receiver which represents a _context_
   in which errors of a certain type may be raised. This approach often results
   in a more idiomatic code.
2. By using _wrapper types_, like `Either`, `Option`, or `Result`, we indicate
   that a computation might end with a logical error which we specify in the return
   type.

Regardless of your choice, Arrow provides a uniform API, and simple ways to
move from one style to the other.

If you want a **general introduction** we recommend the tutorial about
[working with typed errors](working-with-typed-errors.md), followed by
how to model [validation](validation.md) in this style.

If you are already **familiar with `Either`** and similar wrapper types,
you can find information about their Arrow counterparts
([Nullable and `Option`](nullable-and-option.md), [`Either` and `Ior`](either_ior.md)).
We stongly recommend to read [From `Either` to `Raise`](from-either-to-raise.md) to understand
how you can benefit from the typed errors DSL.

:::note Where to find it

Typed errors live in the `arrow-core` library, with high-arity versions of the
`zipOrAccumulate` function available in `arrow-core-high-arity`.

:::

<DocCardList />
