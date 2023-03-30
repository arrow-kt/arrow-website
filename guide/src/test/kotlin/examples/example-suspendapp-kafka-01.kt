// This file was automatically generated from kafka.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSuspendappKafka01

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
val topicName = "hello"
val bootstrapServers = ""
