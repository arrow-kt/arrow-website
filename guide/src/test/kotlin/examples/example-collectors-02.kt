// This file was automatically generated from collectors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleCollectors02

import arrow.collectors.Collectors
import arrow.collectors.collect
import arrow.collectors.zip

fun divide(x: Int, y: Int): Double = x.toDouble() / y.toDouble()

val averageCollector = zip(Collectors.sum, Collectors.length, ::divide)
val list = listOf(1, 2, 3)

val average = list.collect(averageCollector)
