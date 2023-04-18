// This file was automatically generated from validation.md by Knit tool. Do not edit.
package arrow.website.examples.exampleValidation01

import arrow.core.left
import arrow.core.right
import arrow.core.Either
import arrow.core.NonEmptyList
import arrow.core.toNonEmptyListOrNull
import arrow.core.recover
import arrow.core.mapOrAccumulate
import arrow.core.raise.*

data class Author(val name: String)
data class Book(val title: String, val authors: NonEmptyList<Author>)
