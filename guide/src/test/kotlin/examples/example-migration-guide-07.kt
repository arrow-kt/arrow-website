// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide07

import arrow.core.Ior
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import io.kotest.matchers.shouldBe

public inline fun <A, B, C> Ior<A, B>.traverse(fa: (B) -> Option<C>): Option<Ior<A, C>> {
    return fold(
      { a -> Some(Ior.Left(a)) },
      { b -> fa(b).map { Ior.Right(it) } },
      { a, b -> fa(b).map { Ior.Both(a, it) } }
    )
  }

fun evenOpt(i: Int): Option<Int> = if(i % 2 == 0) i.some() else None

fun deprecatedTraverse() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.traverse { evenOpt(it) }

   result shouldBe Some(Ior.Right(124))
}
