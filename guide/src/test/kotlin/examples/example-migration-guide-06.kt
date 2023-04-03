// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide06

import arrow.core.Ior
import io.kotest.matchers.shouldBe

fun migrateCrosswalk() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.fold(
      { emptyList<Int>() },
      { b -> listOf(b).map { Ior.Right(it) } },
      { a, b -> listOf(b).map { Ior.Both(a, it) } }
   )
   result shouldBe listOf(Ior.Right(124))
}
