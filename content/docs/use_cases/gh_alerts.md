# GitHub Alerts

This project is an example implementation of a set of microservices that
manage subscriptions to GitHub repository events, and turns them into Slack
messages. The implementation uses the following technologies:

- Arrow (needless to say)
  - [SuspendApp](https://arrow-kt.github.io/suspendapp/) for graceful shutdowns
- [Ktor](https://ktor.io/) as HTTP framework
  - [Cohort](https://github.com/sksamuel/cohort) for health checks
  - [Tegral](https://tegral.zoroark.guru/docs/modules/core/openapi/ktor) for generating OpenAPI specs
- [SQLDelight](https://cashapp.github.io/sqldelight) for database access
- [kotlin-kafka](https://github.com/nomisRev/kotlin-kafka) for message queues
- [Kotest](https://kotest.io/) for property-based testing
- [Testcontainers](https://www.testcontainers.org/) for integration testing


:::info Source code available

This project is located in [this repository](https://github.com/47deg/gh-alerts-subscriptions-kotlin)

:::
