---
sidebar_position: 10
---

# Integrations

A library is stronger if it plays well together with the rest of the ecosystem 
surrounding it. Arrow integrates with many useful libraries in the Kotlin
ecosystem. This is a non-exhaustive list, we're happy to hear about support for
Arrow from other libraries.

:::tip

There's a [custom set of rules](https://github.com/woltapp/arrow-detekt-rules)
for [Detekt](https://detekt.dev/), which can help you refine your style when
using Arrow.

:::

## Testing

### [Kotest](https://kotest.io/)

If you want to test the result of a function which uses a type defined in Arrow,
like `Either`, you can use the [matchers](https://kotest.io/docs/assertions/arrow.html)
extension library. If you're using property-based testing (you should!), you can
use [generators](https://kotest.io/docs/proptest/property-test-generators-arrow.html)
for Arrow types.

## Serialization

### [Jackson](https://github.com/FasterXML/jackson)

If you're using Jackson for serialization, [this module](https://github.com/arrow-kt/arrow-integrations#jackson-module)
add support for Arrow types. You just need to call an additional method when
creating the mapper.

```kotlin
val mapper = ObjectMapper()
    .registerKotlinModule()
    .registerArrowModule()   // <- this is the one
```

## Configuration

### [Hoplite](https://github.com/sksamuel/hoplite)

Hoplite is a great library to handle configurations, with support for many
different sources, formats, and cascading setups. The library supports most
Arrow types for [decoding](https://github.com/sksamuel/hoplite#decoders).

## HTTP

### [Retrofit](https://square.github.io/retrofit/)

If Retrofit is your library of choice for querying HTTP services, this
[small integration module](https://github.com/arrow-kt/arrow/tree/main/arrow-libs/core/arrow-core-retrofit)
may come in quite handy.

### [Ktor](https://ktor.io/)

Either for client or server purposes, you can set up Ktor to [use Jackson
with your custom mapper](https://github.com/arrow-kt/arrow-integrations#ktor).
That way you get access to (de)serialization for Arrow types.

```kotlin
install(ContentNegotiation) {
  register(ContentType.Application.Json, JacksonConverter(JsonMapper.mapper))
}
```
