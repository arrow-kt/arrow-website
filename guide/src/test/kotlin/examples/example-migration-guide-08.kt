// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide08

import arrow.core.Ior
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import io.kotest.matchers.shouldBe

fun evenOpt(i: Int): Option<Int> = if(i % 2 == 0) i.some() else None

fun migrateTraverse() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.fold(
      { a -> Some(Ior.Left(a)) },
      { b -> evenOpt(b).map { Ior.Right(it) } },
      { a, b -> evenOpt(b).map { Ior.Both(a, it) } }
   )

   result shouldBe Some(Ior.Right(124))
}
