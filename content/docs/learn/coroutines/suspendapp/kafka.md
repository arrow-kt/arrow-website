---
title: ... with Kafka
sidebar_position: 3
---

# SuspendApp with Kafka

When streaming _records_ from Kafka we need to _commit_ (acknowledge) the offset of the _records_
we've processed.
The official recommendation for doing this is committing offsets in batches, so we typically don't send the commit event
to Kafka for every processed record.
Instead, we commit the offset every 5 seconds (or every x records, 5s is default).

Imagine the application getting stopped after 4,5 seconds, either by _Ctrl+C_ or K8S or another type of
containerization.
We could've processed thousands, or tens of thousands of events by that time.
If we don't commit these offsets before shutting down we'd have to re-process all the events.

We can easily prevent this with SuspendApp, and [kotlin-kafka](https://github.com/nomisRev/kotlin-kafka)
or [reactor-kafka](https://github.com/reactor/reactor-kafka).
Both these high-level Kafka libraries guarantee committing offsets upon termination of the stream, this includes
cancellation!
In the example below, all calls to `acknowledge` will be committed to Kafka before the SuspendApp terminates when
receiving `SIGTERM` or `SIGINT`.

```kotlin
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.map
import org.apache.kafka.common.serialization.StringDeserializer
import io.github.nomisRev.kafka.receiver.KafkaReceiver
import io.github.nomisRev.kafka.receiver.ReceiverSettings
import arrow.continuations.SuspendApp

fun main() = SuspendApp {
  val settings: ReceiverSettings<Nothing, String> = ReceiverSettings(
    bootstrapServers = bootstrapServers,
    groupId = "group-id",
    valueDeserializer = StringDeserializer()
  )
  KafkaReceiver(settings)
    .receive(topicName)
    .map { record ->
      println("${record.key()} -> ${record.value()}")
      record.offset.acknowledge()
    }.collect()
}
```

<!--- INCLUDE
val topicName = "hello"
val bootstrapServers = ""
-->

<!--- KNIT example-suspendapp-kafka-01.kt -->
