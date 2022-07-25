package coop.polypoly.core

data class QueryResult (
    val solutions: Array<QuerySolution>?
)

data class QuerySolution (
    val values: Array<Map<String, String>>
)
