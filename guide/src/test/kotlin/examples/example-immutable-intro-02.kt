// This file was automatically generated from intro.md by Knit tool. Do not edit.
package arrow.website.examples.exampleImmutableIntro02

import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address)
@optics data class Address(val street: Street, val city: City)
@optics data class Street(val name: String, val number: Int?)
@optics data class City(val name: String, val country: String)

fun Person.capitalizeCountryModify(): Person =
  Person.address.city.country.modify(this) { it.capitalize() }

fun Person.capitalizeCountryCopy(): Person =
  this.copy {
    Person.address.city.country transform { it.capitalize() }
  }
