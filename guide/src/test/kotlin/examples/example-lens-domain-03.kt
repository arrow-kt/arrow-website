// This file was automatically generated from lens.md by Knit tool. Do not edit.
package arrow.website.examples.exampleLensDomain03

import io.kotest.matchers.shouldBe

import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address)
@optics data class Address(val street: Street, val city: City)
@optics data class Street(val name: String, val number: Int?)
@optics data class City(val name: String, val country: String)

fun Person.moveToAmsterdamModify(): Person =
  Person.address.city.name.set(
    Person.address.city.country.set(this, "Netherlands"),
    "Amsterdam"
  )

fun Person.moveToAmsterdamCopy(): Person = copy {
  Person.address.city.name set "Amsterdam"
  Person.address.city.country set "Netherlands"
}

fun Person.capitalizeNameAndCountry(): Person = copy {
  Person.address.city.name transform { it.capitalize() }
  Person.address.city.country transform { it.capitalize() }
}

fun Person.moveToAmsterdamInside(): Person = copy {
  inside(Person.address.city) {
    City.name set "Amsterdam"
    City.country set "Netherlands"
  }
}
