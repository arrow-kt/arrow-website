---
title: Arrow plug-in for IntelliJ 0.1 is here!
category: articles
tags: [intellij, articles]
---

# Arrow plug-in for IntelliJ 0.1 is here!

One of the main goals of the Arrow project is to produce libraries
that follow well-known Kotlin idioms, and we strive to make them
as discoverable as possible. Nevertheless, the surface of some
components, like [typed errors](/learn/typed-errors/),
is quite large.
For that reason, we have been busy in the last weeks preparing
the first release of the
[Arrow plug-in for IntelliJ-based IDEs](https://plugins.jetbrains.com/plugin/24550-arrow).

This first version already focuses on three different aspects of
Arrow usage where we found that an additional companion can make
a big difference. The first aspect is the usage of typed errors:
the IDE will now suggest missing `.bind()` or `.bindAll()`,
mapping of error using `withError`, and promoting idioms like
`ensure` whenever possible.

The second aspect is warning about wrong usages of Arrow APIs
which cannot be prevented by Kotlin's type system alone. This includes
escaping of `Raise` contexts -- for example, using `sequence` or
`flow` inside `either` --, using `Atomic` with primitive types 
-- where `AtomicInt` or `AtomicBoolean` should be used instead --,
or matching on `Eval` instances directly instead of using the
provided API -- which can easily lead to broken invariants.

The third aspect is applying some known recipes which may be hard
to know upfront. The first release includes a suggestion to add
the corresponding [serializer](/learn/quickstart/setup/serialization/)
when a type marked as `@Serializable` includes an Arrow Core type.
This is an area which we would like to explore more, helping with
the difficulties raised by the community.

The plug-in lives in a [separate repository](https://github.com/arrow-kt/arrow-intellij).
Please let us know your experience, and don't be shy to open issues
with suggestions for more features. They would help not only you
but potentially every user of the Arrow library.
