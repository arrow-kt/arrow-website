// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide05

fun booleanToString(b: Boolean): String = if (b) "IS TRUE! :)" else "IS FALSE.... :(" 

val e1: Either<String, Boolean> = false.right()
e1.foldMap(Monoid.string(), ::booleanToString) shouldBe "IS FALSE.... :("

// Executing automatic replacement
e1.fold({empty}, ::booleanToString) // empty is not found

// Adding the empty value to complete the replacement of the deprecated method
e1.fold("", ::booleanToString) shouldBe "IS FALSE.... :("

val nullableLongMonoid = object : Monoid<Long?> {
   override fun empty(): Long? = 0
   override fun Long?.combine(b: Long?): Long? =
      nullable { this@combine.bind() + b.bind() }
}

val validated: Validated<Long?, Int?> = 3.valid()
val res = validated.zip(nullableLongMonoid, Valid(Unit)) { a, _ -> a } // zip and Monoid are deprecated
res shouldBe Validated.Valid(3)

// Executing automatic replacement
val res = Either.zipOrAccumulate(
   { e1, e2 -> e1 + e2 }, // compilation error
   validated.toEither(), 
   Valid(Unit).toEither()) { a, _ -> a }.toValidated()

val validated: Validated<Long?, Int?> = 3.valid() 
val res = Either.zipOrAccumulate(
   { e1, e2 -> nullable { e1.bind() + e2.bind() } }, 
   validated.toEither(), 
   Valid(Unit).toEither()) { a, _ -> a }.toValidated()
res shouldBe Validated.Valid(3)

 val l: List<Int> = listOf(1,2,3,4,5)
 l.combineAll(Monoid.int()) shouldBe 10

// Executing automatic replacement
l.fold(initialValue) { a1, a2 -> a1 + a2 } // initialValue is not found

// Adding the empty value to complete the replacement of the deprecated method
l.fold(0) { a1, a2 -> a1 + a2 } shouldBe 10

val rEither: Either<String, Int> = 125.right()
val n = 3
rEither.replicate(n, Monoid.int()) shouldBe Either.Right(375)

// Executing automatic replacement
val res = if (n <= 0) Either.Right(initial) 
else rEither.map { b -> List<Int>(n) { b }.fold(initial) { r, t -> r + t } } // empty is not found

// Adding the empty value to complete the replacement of the deprecated method
val res = if (n <= 0) Either.Right(0) 
    else rEither.map { b -> List<Int>(n) { b }.fold(0) { r, t -> r + t } }

res shouldBe Either.Right(375)

public inline fun <C> crosswalk(fa: (B) -> Iterable<C>): List<Ior<A, C>> =
    fold(
      { emptyList() },
      { b -> fa(b).map { Right(it) } },
      { a, b -> fa(b).map { Both(a, it) } }
    )
import arrow.core.Ior
import arrow.core.listOf
import io.kotest.matchers.shouldBe

val rightIor: Ior<String, Int> = Ior.Right(125)
val result = rightIor.crosswalk { listOf(it) } 
result shouldBe listOf(Ior.Right(124))
