---
id: serialization
title: .. with serialization
description: How to (de)serialize Arrow Core types.
sidebar_position: 1
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
  OptionSerializer::class,
  NonEmptyListSerializer::class,
  NonEmptySetSerializer::class
)
```

The list above mentions all the serializers, but you only need to add those
which are used in your fields. Don't worry too much: if you miss one, the
kotlinx.serialization plug-in gives you an error.

Additionally, you can use `arrow.core.serialization.ArrowModule` to register run-time [contextual serialization](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md#contextual-serialization) support of the Arrow Core types. 

```
val format = Json { serializersModule = ArrowModule }
```

or by merging with another serializers module

```
val format = Json { serializersModule = myModule + ArrowModule }
```

This will allow for use of the Arrow Core types as the value to be serialized without specifying the serializer explicitly:

```
val payload = format.encodeToString(nonEmptyListOf("hello", "world"))
```

:::note

Using `@UseSerializers` to provide static _compile-time_ serialization of fields containing Arrow Core types is usually preferable to annotating fields with `@Contextual` and relying on _run-time_ resolution, wherever possible.

:::

:::info Additional reading

[_Marshalling Arrow Types in Ktor_](https://garthgilmour.medium.com/marshalling-arrow-types-in-ktor-bc471aa3650)
by Garth Gilmour includes additional information about using Arrow Core types
in a Ktor project.

:::

## [Jackson](https://github.com/FasterXML/jackson)

If you're using Jackson for serialization, you need to depend on the
`arrow-core-jackson` with the same version of your `arrow-core`.
You just need to call an additional method when
creating the mapper.

```
val mapper = ObjectMapper()
    .registerKotlinModule()
    .registerArrowModule()   // <- this is the one
```
