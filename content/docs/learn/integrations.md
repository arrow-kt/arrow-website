---
title: Integrations
description: Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.
sidebar_position: 10
sidebar_custom_props:
  description: Playing nice with the rest of the ecosystem
  icon: icon-generic-5.svg
  overview: true
---

# Integrations

A library is more robust if it plays well with the rest of the ecosystem 
surrounding it. Arrow integrates with many useful libraries in the Kotlin
ecosystem. This is a non-exhaustive list, and we're happy to hear about support for
Arrow from other libraries.

:::note We'd love to hear from you!

Do you maintain or know of a library with support for Arrow? Feel free to 
[open an issue](https://github.com/arrow-kt/arrow/issues) in the repository, and we'll add it to this list. Thanks in advance! 🤩

:::

### Linting

**[Detekt](https://detekt.dev/).**
There's a [custom set of rules](https://github.com/woltapp/arrow-detekt-rules)
that can help you refine your style when using Arrow.

### Testing

**[Kotest](https://kotest.io/).**
If you want to test the result of a function that uses a type defined in Arrow,
like `Either`, you can use the [matchers](https://kotest.io/docs/assertions/arrow.html)
extension library. If you're using property-based testing (you should!), you can
use [generators](https://kotest.io/docs/proptest/property-test-generators-arrow.html)
for Arrow types.

**[AssertJ](https://assertj.github.io/doc/).**
Assertions covering `Either` and `Option` are provided by
[this library](https://github.com/rcardin/assertj-arrow-core).

### Serialization

See the [corresponding section](../quickstart/setup/serialization) in the documentation.

### Configuration

**[Hoplite](https://github.com/sksamuel/hoplite).**
Hoplite is a great library for handling configurations and supporting various sources, formats, and cascading setups. The library supports most
Arrow types for [decoding](https://github.com/sksamuel/hoplite#decoders).

### Validation and Errors

**[Akkurate](https://akkurate.dev/).**
Akkurate provides a language to describe complex validation code. It provides [integration](https://akkurate.dev/docs/arrow-integration.html) with Arrow's typed error mechanism.

**[Result4k](https://github.com/fork-handles/forkhandles/tree/trunk/result4k).**
The Arrow project provides support for Result4k in its `Raise` framework for typed errors.

### Caching

**[cache4k](https://reactivecircus.github.io/cache4k/).**
You can easily integrate [cache4k](https://reactivecircus.github.io/cache4k/)
as caching mechanism for [memoization](../collections-functions/recursive/#memoization-takes-memory).

### HTTP

**[Retrofit](https://square.github.io/retrofit/).**
If Retrofit is your library of choice for querying HTTP services, this
[small integration module](https://apidocs.arrow-kt.io/arrow-core-retrofit/index.html)
may come in quite handy.

**[kJWT](https://github.com/nefilim/kJWT).**
This library adds support for JSON Web Signatures and JSON Web Tokens
to the Kotlin and Arrow ecosystems.

### [Ktor](https://ktor.io/)

**Graceful shutdown.**
SuspendApp may be [directly integrated](/learn/coroutines/suspendapp/ktor/)
in Ktor servers to provide graceful shutdown.

**[Serialization](../quickstart/setup/serialization).**
If you're using kotlinx.serialization, you need no further changes other than
importing the serializers with `@UseSerializers`.
If you want to use Arrow Core types directly as your request or response models, you will need to include the `ArrowModule` in your serializers module:

```
install(ContentNegotiation) {
  json(Json {
    serializersModule = ArrowModule
  })
}
```

If you're using Jackson, you can use a custom mapper,
and pass it to the `ContentNegotiation` configuration.

```
object JsonMapper {
  val mapper: ObjectMapper = ObjectMapper()
    .registerModule(KotlinModule(singletonSupport = SingletonSupport.CANONICALIZE))
    .registerArrowModule()
    .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    .disable(JsonParser.Feature.INCLUDE_SOURCE_IN_LOCATION)
    .setSerializationInclusion(JsonInclude.Include.NON_ABSENT)
}

install(ContentNegotiation) {
  register(ContentType.Application.Json, JacksonConverter(JsonMapper.mapper))
}
```

**[Resilience](../resilience/).**
The [`arrow-resilience-ktor-client`](https://apidocs.arrow-kt.io/arrow-resilience-ktor-client/index.html) module provides Ktor client plug-ins for retry/repeat and circuit breakers based on Arrow's.
