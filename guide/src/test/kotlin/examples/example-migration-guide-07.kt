// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide07

public inline fun <C> traverse(fa: (B) -> Option<C>): Option<Ior<A, C>> {
    return fold(
      { a -> Some(Left(a)) },
      { b -> fa(b).map { Right(it) } },
      { a, b -> fa(b).map { Both(a, it) } }
    )
  }
import arrow.core.Ior
import arrow.core.listOf
import io.kotest.matchers.shouldBe

fun evenOpt(i: Int): Option<Int> = if(i % 2 == 0) i.some() else None

val rightIor: Ior<String, Int> = Ior.Right(124)
val result = rightIor.traverse {evenOpt(it)}

result shouldBe Some(Ior.Right(124))
