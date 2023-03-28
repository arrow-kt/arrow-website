---
title: Integrations
description: Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.
sidebar_position: 10
sidebar_custom_props:
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

## Serialization

### [Jackson](https://github.com/FasterXML/jackson)

If you're using Jackson for serialization, [this module](https://github.com/arrow-kt/arrow-integrations#jackson-module)
adds support for Arrow types. You just need to call an additional method when
creating the mapper.

```kotlin
val mapper = ObjectMapper()
    .registerKotlinModule()
    .registerArrowModule()   // <- this is the one
```

## Configuration

### [Hoplite](https://github.com/sksamuel/hoplite)

Hoplite is a great library for handling configurations and supporting various sources, formats, and cascading setups. The library supports most
Arrow types for [decoding](https://github.com/sksamuel/hoplite#decoders).

## HTTP

### [Retrofit](https://square.github.io/retrofit/)

If Retrofit is your library of choice for querying HTTP services, this
[small integration module](https://github.com/arrow-kt/arrow/tree/main/arrow-libs/core/arrow-core-retrofit)
may come in quite handy.

### [Ktor](https://ktor.io/)

For client or server purposes, you can set up Ktor to [use Jackson
with your custom mapper](https://github.com/arrow-kt/arrow-integrations#ktor).
That way, you can access (de)serialization for Arrow types.

```kotlin
install(ContentNegotiation) {
  register(ContentType.Application.Json, JacksonConverter(JsonMapper.mapper))
}
```

### [kJWT](https://github.com/nefilim/kJWT)

This library adds support for JSON Web Signatures and JSON Web Tokens
to the Kotlin and Arrow ecosystems.
