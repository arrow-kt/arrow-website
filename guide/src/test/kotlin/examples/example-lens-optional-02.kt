// This file was automatically generated from lens-optional.md by Knit tool. Do not edit.
package arrow.website.examples.exampleLensOptional02

import io.kotest.matchers.shouldBe


import arrow.optics.*

data class Address(val street: Street, val city: City) {
  companion object
}
data class Street(val name: String, val number: Int?) {
  companion object
}
data class City(val name: String, val country: String) {
  companion object
}

data class Person(val name: String, val age: Int, val address: Address) {
  companion object {
    val name: Lens<Person, String> = TODO()
    val age: Lens<Person, Int> = TODO()
    val address: Lens<Person, Address> = TODO()
  }
}
