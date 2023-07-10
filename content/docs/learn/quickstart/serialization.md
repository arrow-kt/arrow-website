---
id: serialization
title: Serialization
description: How to (de)serialize Arrow Core types.
sidebar_position: 2
---

# Serialization

Arrow Core types, such as `Either` or `NonEmptyList`, often appear as part
of serializable types. We've decided to keep the Core library as slim as
possible; in particular we didn't want to depend on particular serialization
libraries. As a result, you need a bit of additional ceremony compared to
using built-in types, which we discuss in this section.

## [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)

If you're using kotlinx.serialization, you need to depend on the
`arrow-core-serialization` with the same version of your `arrow-core`.
Declare your serializable types as usual. However, when one of the fields
mentions a type from Arrow Core,

```
@Serializable
data class Book(val title: String, val authors: NonEmptyList<String>)
```

you need to "import" the serializer into the file. The easiest way is to
include a `UseSerializers` annotation at the very top.

```
@file:UseSerializers(
  EitherSerializer::class,
  IorSerializer::class,
  ValidatedSerializer::class,
  OptionSerializer::class,
  NonEmptyListSerializer::class,
  NonEmptySetSerializer::class
)
```

The list above mentions all the serializers, but you only need to add those
which are used in your fields. Don't worry too much: if you miss one, the
kotlinx.serialization plug-in gives you an error.

## [Jackson](https://github.com/FasterXML/jackson)

If you're using Jackson for serialization, [this module](https://github.com/arrow-kt/arrow-integrations#jackson-module)
adds support for Arrow types. You just need to call an additional method when
creating the mapper.

```kotlin
val mapper = ObjectMapper()
    .registerKotlinModule()
    .registerArrowModule()   // <- this is the one
```
