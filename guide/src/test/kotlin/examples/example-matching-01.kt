// This file was automatically generated from matching.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMatching01

import arrow.optics.*
import arrow.optics.match.*

@optics data class Name(
  val firstName: String, val lastName: String
) { companion object }

@optics sealed interface User { companion object }
@optics data class Person(
  val name: Name, val age: Int
): User { companion object }
@optics data class Company(
  val name: String, val director: Name, val address: String
): User { companion object }

val User.name: String get() = this.matchOrThrow {
  // Company(name = nm, director = Name(lastName = d))
  User.company(Company.name, Company.director(Name.lastName)) then { (nm, d) -> "$nm, att. $d" }
  // Person(Name(firstName = fn), age if it < 18)
  User.person(Person.name(Name.firstName), Person.age.takeIf { it < 18 }) then { (fn, _) -> fn }
  // Person(Name(firstName = fn, lastName = ln))
  User.person(Person.name(Name.firstName, Name.lastName)) then { (fn, ln) -> "Sir/Madam $fn $ln" }
}

fun User.directorOrNull(): Name? = this.matchOrThrow {
  User.company(Company.director) then { it }
  default { null }
}
