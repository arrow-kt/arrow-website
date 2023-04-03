// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide07

import arrow.core.Ior
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import io.kotest.matchers.shouldBe

fun evenOpt(i: Int): Option<Int> = if(i % 2 == 0) i.some() else None

fun deprecatedTraverse() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.traverse { evenOpt(it) }

   result shouldBe Some(Ior.Right(124))
}
