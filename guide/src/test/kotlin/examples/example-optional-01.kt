// This file was automatically generated from optional.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOptional01

import io.kotest.matchers.shouldBe

import arrow.optics.*
import arrow.optics.dsl.*
import arrow.optics.typeclasses.*

@optics data class Db(val cities: Map<String, City>) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}

val db = Db(mapOf(
  "Alejandro" to City("Hilversum", "Netherlands"),
  "Ambrosio"  to City("Ciudad Real", "Spain")
))

fun example() {
  Db.cities.index(Index.map(), "Alejandro").country.getOrNull(db) shouldBe "Netherlands"
  Db.cities.index(Index.map(), "Jack").country.getOrNull(db) shouldBe null
}
