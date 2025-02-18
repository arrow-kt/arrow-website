// This file was automatically generated from outcome-progress.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOutcome03

import opensavvy.progress.*
import opensavvy.state.outcome.*
import opensavvy.state.progressive.*

fun <E, A> printProgress(po: ProgressiveOutcome<E, A>) {
    po.onSuccess {
        println("current value is $it")
    }
    po.onLoading {
        println("loading...")
    }
}
