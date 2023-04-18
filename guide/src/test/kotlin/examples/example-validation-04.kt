// This file was automatically generated from validation.md by Knit tool. Do not edit.
package arrow.website.examples.exampleValidation04

import arrow.core.left
import arrow.core.right
import arrow.core.Either
import arrow.core.NonEmptyList
import arrow.core.toNonEmptyListOrNull
import arrow.core.recover
import arrow.core.mapOrAccumulate
import arrow.core.raise.*

data class Author(val name: String)

sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

data class Book private constructor(
  val title: String, val authors: NonEmptyList<Author>
) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<BookValidationError, Book> = TODO()
  }
}
