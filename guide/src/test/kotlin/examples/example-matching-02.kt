// This file was automatically generated from matching.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMatching02

import arrow.match.*

data class Name(
  val firstName: String, val lastName: String
)

sealed interface User
data class Person(
  val name: Name, val age: Int
): User
data class Company(
  val name: String, val director: Name, val address: String
): User

val User.name: String get() = this.matchOrThrow {
  // Company(name = nm, director = Name(lastName = d))
  Company::class.of(Company::name, Company::director.of(Name::lastName)) then { (nm, d) -> "$nm, att. $d" }
  // Person(Name(firstName = fn), age if it < 18)
  Person::class.of(Person::name.of(Name::firstName), Person::age.takeIf { it < 18 }) then { (fn, _) -> fn }
  // Person(Name(firstName = fn, lastName = ln))
  Person::class.of(Person::name.of(Name::firstName, Name::lastName)) then { (fn, ln) -> "Sir/Madam $fn $ln" }
}
