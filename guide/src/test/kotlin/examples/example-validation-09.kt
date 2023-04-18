// This file was automatically generated from validation.md by Knit tool. Do not edit.
package arrow.website.examples.exampleValidation09

import arrow.core.left
import arrow.core.right
import arrow.core.Either
import arrow.core.NonEmptyList
import arrow.core.toNonEmptyListOrNull
import arrow.core.recover
import arrow.core.mapOrAccumulate
import arrow.core.raise.*

sealed interface BookValidationError
object EmptyTitle: BookValidationError
object NoAuthors: BookValidationError
data class EmptyAuthor(val index: Int): BookValidationError

object EmptyAuthorName

data class Author private constructor(val name: String) {
  companion object {
    operator fun invoke(name: String): Either<EmptyAuthorName, Author> = either {
      ensure(name.isNotEmpty()) { EmptyAuthorName }
      Author(name)
    }
  }
}

data class Book private constructor(val title: String, val authors: NonEmptyList<Author>) {
  companion object {
    operator fun invoke(
      title: String, authors: Iterable<String>
    ): Either<NonEmptyList<BookValidationError>, Book> = either {
      zipOrAccumulate<BookValidationError, Unit, NonEmptyList<Author>, Book>(
        { ensure(title.isNotEmpty()) { EmptyTitle } },
        { 
          val validatedAuthors: Either<NonEmptyList<BookValidationError>, List<Author>> = either { authors.withIndex().mapOrAccumulate { nameAndIx ->
            Author(nameAndIx.value)
              .mapLeft { EmptyAuthor(nameAndIx.index) }
              .bind()
          } }
          ensureNotNull(validatedAuthors.bindNel().toNonEmptyListOrNull()) { NoAuthors }
        }
      ) { _, validatedAuthors ->
        Book(title, validatedAuthors)
      }
    }
  }
}
