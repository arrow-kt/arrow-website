// This file was automatically generated from from-fp.md by Knit tool. Do not edit.
package arrow.website.examples.exampleScalaMigration02

import arrow.core.*
import arrow.core.raise.either

data class Person(val name: String, val age: Int)
interface Problem
fun validName(name: String): Either<Problem, String> = TODO()
fun validAge(age: Int): Either<Problem, Int> = TODO()

fun mkUser(name: String, age: Int): Either<Problem, Person> = either {
  Person(validName(name).bind(), validAge(age).bind())
}
