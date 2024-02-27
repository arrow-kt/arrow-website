// This file was automatically generated from from-fp.md by Knit tool. Do not edit.
package arrow.website.examples.exampleScalaMigration01

import arrow.core.*
import arrow.core.raise.either

data class Person(val name: String, val age: Int)
interface Problem
fun validName(name: String): Either<Problem, String> = TODO()
fun validAge(age: Int): Either<Problem, Int> = TODO()

fun mkPerson(name: String, age: Int): Either<Problem, Person> = either {
  val name_ = validName(name).bind()
  val age_  = validAge(age).bind()
  Person(name_, age_)
}
