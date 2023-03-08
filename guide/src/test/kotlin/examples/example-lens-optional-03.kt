// This file was automatically generated from lens-optional.md by Knit tool. Do not edit.
package arrow.website.examples.exampleLensOptional03

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

fun main() {
  val me = Person(
    "Alejandro", 35, 
    Address(Street("Kotlinstraat", 1), City("Hilversum", "Netherlands"))
  )

  Person.name.get(me) shouldBe "Alejandro"
  
  val meAfterBirthdayParty = Person.age.modify(me) { it + 1 }
  Person.age.get(meAfterBirthdayParty) shouldBe 36

  val newAddress = Address(Street("Kotlinplein", null), City("Amsterdam", "Netherlands"))
  val meAfterMoving = Person.address.set(me, newAddress)
  Person.address.get(meAfterMoving) shouldBe newAddress
}
