// This file was automatically generated from validation.md by Knit tool. Do not edit.
package arrow.website.examples.exampleValidation03

import arrow.core.left
import arrow.core.right
import arrow.core.Either
import arrow.core.NonEmptyList
import arrow.core.toNonEmptyListOrNull
import arrow.core.recover
import arrow.core.raise.*

object EmptyAuthorName

data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = either {
      ensure(name.isNotEmpty()) { EmptyAuthorName }
      Author(name)
    }
  }
}
