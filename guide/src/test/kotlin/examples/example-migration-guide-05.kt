// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide05

import arrow.core.Either
// import arrow.core.replicate
// import arrow.core.Valid
// import arrow.core.Validated
// import arrow.core.combineAll
import arrow.core.Ior
import arrow.core.raise.nullable
import arrow.core.right
// import arrow.core.valid
import arrow.core.zip
// import arrow.typeclasses.Monoid
import io.kotest.matchers.shouldBe

fun booleanToString(b: Boolean): String = if (b) "IS TRUE! :)" else "IS FALSE.... :(" 

// Adding the empty value to complete the replacement of the deprecated method
fun migrateFoldMap() {
   val e1: Either<String, Boolean> = false.right()
   e1.fold({""}, ::booleanToString) shouldBe "IS FALSE.... :("
}

// Adding the initial value to complete the replacement of the deprecated method
fun migrateCombineAll() {
   val l: List<Int> = listOf(1, 2, 3, 4, 5)
   l.fold(0) { a1, a2 -> a1 + a2 } shouldBe 10
}

// Adding the empty value to complete the replacement of the deprecated method
fun migrateReplicate() {
   val rEither: Either<String, Int> = 125.right()
   val n = 3
   val res = if (n <= 0) Either.Right(0)
   else rEither.map { b -> List<Int>(n) { b }.fold(0) { r, t -> r + t } }

   res shouldBe Either.Right(375)
}

public inline fun <A, B, C> Ior<A, B>.crosswalk(fa: (B) -> Iterable<C>): List<Ior<A, C>> =
    fold(
      { emptyList() },
      { b -> fa(b).map { Ior.Right(it) } },
      { a, b -> fa(b).map { Ior.Both(a, it) } }
    )

fun deprecatedCrosswalk() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.crosswalk { listOf(it) }
   result shouldBe listOf(Ior.Right(124))
}
