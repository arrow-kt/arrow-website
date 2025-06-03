---
title: Example projects
sidebar_position: 9
description: Bigger projects where the design guidelines are put into practice
---

# Example projects

Here are some projects which use Arrow and follow the design guidelines. The purpose is showcasing these techiques in bigger applications; docs require small examples for comprehension, but sometimes they don't give the full picture that one of these complete applications can.

## [Real World](https://github.com/nomisRev/ktor-arrow-example)

[Real World](https://medium.com/@ericsimons/introducing-realworld-6016654d36b5) is a blogging platform that has been purposedly created to highlights the possibilities of each language and ecosystem. The linked implementation uses:

- [Ktor](https://ktor.io/) as HTTP framework.
- [SQLDelight](https://cashapp.github.io/sqldelight) for database access.
- [Kotest](https://kotest.io/) for property-based testing.

## [Functional Quiz](https://github.com/TevJ/kfp-quiz)

Service to create an answer quizzes, written in a functional style. Apart from Arrow, this project uses:

- [http4k](https://www.http4k.org/) as HTTP framework.
- [Exposed](https://github.com/JetBrains/Exposed) for database access.

## [MasterMind](https://gist.github.com/jakzal/3f0ee968fe8073ee81e328ecbd59fe8b)

Implementation of the game using functional event sourcing. The [accompanying blog post](https://zalas.pl/functional-event-sourcing-example-in-kotlin/) is part of a [series](https://zalas.pl/series/event-sourcing/) that covers both domain modelling and event sourcing.

## [Weather App](https://github.com/serras/WeatherApp)

Small weather forecast application built with [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) Desktop.

- [Ktor Client](https://ktor.io/docs/getting-started-ktor-client.html) to perform HTTP requests.
- [Kotest](https://kotest.io/) for property-based testing.
  - [Turbine](https://github.com/cashapp/turbine) to test ViewModels.

## GitHub Alerts

This application manages subscriptions to GitHub repository events, and turns them into Slack messages. It is architected as a series of microservices which communicate using [Apache Kafka](https://kafka.apache.org/)
message queues, by means of [kotlin-kafka](https://github.com/nomisRev/kotlin-kafka) and
[Avro4k](https://github.com/avro-kotlin/avro4k).

The same project is available using two different sets of technologies.

- The [Ktor version](https://github.com/47deg/gh-alerts-subscriptions-kotlin) uses [Ktor](https://ktor.io/) as HTTP framework.
  - [Cohort](https://github.com/sksamuel/cohort) for health checks,
  - [Tegral](https://tegral.zoroark.guru/docs/modules/core/openapi/ktor) for generating OpenAPI specs.
  - [SQLDelight](https://cashapp.github.io/sqldelight) for database access.
- The [Spring version](https://github.com/xebia-functional/gh-alerts-subscriptions-kotlin-spring) uses the [Spring](https://spring.io/) modules for Kotlin.
