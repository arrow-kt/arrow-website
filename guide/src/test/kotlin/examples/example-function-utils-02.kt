// This file was automatically generated from utils.md by Knit tool. Do not edit.
package arrow.website.examples.exampleFunctionUtils02

import arrow.core.partially1

fun List<String>.everybodyDancesTwo() = forEach(::dance.partially1(2))
fun dance(rounds: Int, person: String): Unit { TODO() }
