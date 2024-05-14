---
title: Integrations
description: Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.
sidebar_position: 10
sidebar_custom_props:
  description: Playing nice with the rest of the ecosystem
  icon: icon-generic-5.svg
  overview: true
---

# <decorated-text icon={frontMatter.sidebar_custom_props.icon} title={frontMatter.title} />

A library is more robust if it plays well with the rest of the ecosystem 
surrounding it. Arrow integrates with many useful libraries in the Kotlin
ecosystem. This is a non-exhaustive list, and we're happy to hear about support for
Arrow from other libraries.

:::note We'd love to hear from you!

Do you maintain or know of a library with support for Arrow? Feel free to 
[open an issue](https://github.com/arrow-kt/arrow/issues) in the repository, and we'll add it to this list. Thanks in advance! 🤩

:::

:::tip

There's a [custom set of rules](https://github.com/woltapp/arrow-detekt-rules)
for [Detekt](https://detekt.dev/) that can help you refine your style when
using Arrow.

:::

## Testing

### [Kotest](https://kotest.io/)

If you want to test the result of a function that uses a type defined in Arrow,
like `Either`, you can use the [matchers](https://kotest.io/docs/assertions/arrow.html)
extension library. If you're using property-based testing (you should!), you can
use [generators](https://kotest.io/docs/proptest/property-test-generators-arrow.html)
for Arrow types.

### [AssertJ](https://assertj.github.io/doc/)

Assertions covering `Either` and `Option` are provided by
[this library](https://github.com/rcardin/assertj-arrow-core).

## Serialization

See the [corresponding section](../quickstart/serialization).

## Configuration

### [Hoplite](https://github.com/sksamuel/hoplite)

Hoplite is a great library for handling configurations and supporting various sources, formats, and cascading setups. The library supports most
Arrow types for [decoding](https://github.com/sksamuel/hoplite#decoders).

## Validation

### [Akkurate](https://akkurate.dev/)

Akkurate provides a language to describe complex validation code. It provides [integration](https://akkurate.dev/docs/arrow-integration.html) with Arrow's typed error mechanism.

## HTTP

### [Retrofit](https://square.github.io/retrofit/)

If Retrofit is your library of choice for querying HTTP services, this
[small integration module](https://github.com/arrow-kt/arrow/tree/main/arrow-libs/core/arrow-core-retrofit)
may come in quite handy.

### [Ktor](https://ktor.io/)

The main point of contact between Ktor and Arrow is in
[serialization](../quickstart/serialization).

If you're using kotlinx.serialization, you need no further changes other than
importing the serializers with `@UseSerializers`.

If you want to use Arrow Core types directly as your request or response models, you will need to include the `ArrowModule` in your serializers module:

```kotlin
install(ContentNegotiation) {
  json(Json {
    serializersModule = ArrowModule
  })
}
```

If you're using Jackson, you can use the
[custom mapper](https://github.com/arrow-kt/arrow-integrations#ktor),
and pass it to the `ContentNegotiation` configuration.

```kotlin
install(ContentNegotiation) {
  register(ContentType.Application.Json, JacksonConverter(JsonMapper.mapper))
}
```

### [kJWT](https://github.com/nefilim/kJWT)

This library adds support for JSON Web Signatures and JSON Web Tokens
to the Kotlin and Arrow ecosystems.

## Caching

### [cache4k](https://reactivecircus.github.io/cache4k/)

You can easily integrate [cache4k](https://reactivecircus.github.io/cache4k/)
as caching mechanism for [memoization](../collections-functions/recursive/#memoization-takes-memory).
