// This file was automatically generated from lens.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSealedDomain01

import io.kotest.matchers.shouldBe

import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address)
@optics data class Address(val street: Street, val city: City)
@optics data class Street(val name: String, val number: Int?)
@optics data class City(val name: String, val country: String)

typealias VATNumber = Int

@optics sealed interface SUser {
  val name: String
}

@optics data class SPerson(
  override val name: String,
  val age: Int
): SUser 

@optics data class SCompany(
  override val name: String,
  val vat: VATNumber
): SUser
