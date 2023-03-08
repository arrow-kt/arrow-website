// This file was automatically generated from lens-optional.md by Knit tool. Do not edit.
package arrow.website.examples.exampleLensOptional01

import io.kotest.matchers.shouldBe

import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address) {
  companion object
}
@optics data class Address(val street: Street, val city: City) {
  companion object
}
@optics data class Street(val name: String, val number: Int?) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}
