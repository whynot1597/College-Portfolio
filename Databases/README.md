**CMSI 486** Introduction to Database Systems, Fall 2020

# Assignment 1216
So it all comes to this—after implementing multiple mini-stacks for the same hypothetical application across different database paradigms, it’s time to pick the one that you feel can expand best into a full database software development kit (SDK) for that application. Which paradigm will you choose? That’s up to you. What application will you envision? That’s up to you also, though presumably you already have a fair idea for what that will be, given that you have already written multiple queries for it and some simple command-line programs that preview its functionality.

Whichever way you go, you will bootstrap this application with data from your chosen dataset (which you have presumably already done in a previous assignment, but this one gives you an opportunity to improve on that). But you will also make sure that the application is fully capable of adding, updating, and deleting information from that database as well.

As a little side trip, we will take a glimpse at the theoretical side of the relational database model, so that you have some sense of the underpinnings that allowed relational databases to be implemented in the first place.

## Background Reading
Not surprisingly, for this culminating assignment your final background reading material comprises whatever background reading was applicable to the database paradigm that you choose. We won’t repeat that here; just go back to the mini-stack assignment corresponding to your chosen database model and review what’s there.

### Theoretical/Conceptual Reading
What we _will_ reiterate, because it gets deeper examination as we close out the course, are readings pertaining to the theoretical foundations of the relational database model—foundations that were instrumental to that logical data model’s success and for which equivalents would be worth seeking when pursuing future endeavors in computer science:
* E. F. Codd’s seminal [A relational model of data for large shared data banks](https://dl.acm.org/doi/10.1145/362384.362685)
* Elmasri & Navathe [Chapter 5](https://www.cs.purdue.edu/homes/bb/cs448_Fall2017/lpdf/Chapter05.pdf)
* Elmasri & Navathe [Chapter 8](https://www.cs.purdue.edu/homes/bb/cs448_Fall2017/lpdf/Chapter08.pdf)
* Elmasri & Navathe [Chapter 14](https://www.cs.purdue.edu/homes/bb/cs448_Fall2017/lpdf/Chapter14.pdf)
* Jeffrey Ullman’s [Foundations of Computer Science Chapter 8](http://infolab.stanford.edu/~ullman/focs/ch08.pdf)

### Technical/Operational Reading
On the technical/operational side, we have two new areas: transactions and indexing/physical schemas. These areas are universal to databases regardless of database type, and so each of our representative systems has corresopnding resources for each area. In addition, transactions also factor into database programming and thus there are programming resources for them as well.

#### Transactions
* SQL: [`BEGIN`](https://www.postgresql.org/docs/current/sql-begin.html), [`COMMIT`](https://www.postgresql.org/docs/current/sql-commit.html), [`ROLLBACK`](https://www.postgresql.org/docs/current/sql-rollback.html) (among others)
* SQLAlchemy: [Transactions and Connection Management](https://docs.sqlalchemy.org/en/13/orm/session_transaction.html)
* Sequelize: [Transactions](https://sequelize.org/master/manual/transactions.html)
* MongoDB: [Transactions](https://docs.mongodb.com/manual/core/transactions/) and [Transactions in Applications](https://docs.mongodb.com/manual/core/transactions-in-applications/)
* Elasticsearch doesn’t have native transactions, but [they can be emulated](https://alexmarquardt.com/2019/12/05/emulating-transactional-functionality-in-elasticsearch-with-two-phase-commits/)
* Neo4j: [Transactions](https://neo4j.com/docs/cypher-manual/current/introduction/transactions/) and [Session API](https://neo4j.com/docs/driver-manual/current/session-api/)

#### Indexing and Physical Schemas
* SQL: [`CREATE INDEX` command](https://www.postgresql.org/docs/current/sql-createindex.html)
* MongoDB: [Indexes](https://docs.mongodb.com/manual/indexes/)
* Elasticsearch: Tips for tuning [search speed](https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-search-speed.html) and [indexing speed](https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-indexing-speed.html)
* Neo4j: [Indexes for search performance](https://neo4j.com/docs/cypher-manual/current/administration/indexes-for-search-performance/)

## For Submission: Full Database Application SDK
Expand one of your database mini-stacks into a full software development kit (SDK) for an envisioned end-user application that relies on the dataset (and additions/changes to it) that you have been using for most of the semester.

### “Whad-_About.md_ It” (Hugh Grant as Michael Felgate, `5415` _Mickey Blue Eyes_ 1999)
_about.md_ is back to take its final, fullest form. Provide a complete _about.md_ that includes the following (from previous versions)…
* Link to the baseline dataset files
* What the dataset contains
* The application you have envisioned that uses this dataset: general description, prominent use cases (involving underlying data)

…with these new sections:
* Rationale for why you chose the logical data model for this dataset and application—why was it the best fit? What features/characteristics were in its favor? What weren’t in its favor (but clearly wasn’t enough to overturn it)?
* Assessment—now that the assignment is done, how does your group feel about this choice?

Consider integrating your database schema (see [below](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957)) into this document, if technically feasible. At a minimum, you should include a link to the file when appropriate.

### “That Little _.gitignore_” (Rupert Grint as Ron Weasley, _Harry Potter and the Deathly Hallows Part 2_ 2011)
Perhaps the least-changed part of these assignments: make sure your _.gitignore_ file has been edited to exclude raw dataset files from _git_ modification tracking.

### “You Always Do Drag Me Into Your Crazy _Schemas, Preprocessors, and Loaders_” (Vivian Vance as Ethel Mertz, `14325|76|9826|1882|1017`_I Love Lucy_ 1951–1957)
Provide all of the information needed in order to get the database set up and loaded. This includes but is not limited to:
* A schema diagram of your database, using notation appropriate for the chosen logical data model
* Schema, mappings, or other DDL (if applicable)
* Preprocessing code for preparing the raw dataset files for loading (if any)
* Loader code for populating the database
* _New with the SDK:_ Determine and implement an appropriate indexing scheme, based on your application’s needs (Elasticsearch is exempt from this)—you may build this into your loader programs, or specify this as a command to be executed at the database level
* _New with the SDK:_ A complete, step-by-step _setup.md_ document containing complete instructions for setting up the database (you may assume that the user knows how to prepare an empty file structure for the database server, so the instructions can take it from that point on)

#### Show the Impact of Your Index
Except for Elasticsearch, provide objective evidence in _setup.md_ that your chosen index(es) have a concrete impact on your queries:
* Show “explain” output indicating how the query plan changes _before_ and _after_ the index is created
* Show `time` output indicating the real-time speed difference for the same query from _before_ and _after_ the index is created

For the maximum impact, try to index something that spans your largest data collection.

### “I’d Rather Take My Chances as a Supernaturally-Possessed _DAL_” (Brad Dourif as Chucky, `12997` _Seed of Chucky_ 2004)
Surprise surprise, the centerpiece of your SDK is…the software. Supply a fully-decked DAL with the following features/functions.

#### Configuration Code Driven by Environment Variables
Most of you have already done this, so just don’t mess it up.

#### Featured Query Functions
Implement two (2) DAL functions for non-trivial “top-level”/“featured” queries—operations that capture a primary/central use case of your intended application.
* Choose queries of some sophistication: involve multiple entities (join/nested object/edges) or a grouped aggregate query
* Simple “subset of a single entity based on simple criteria” don’t count

For each function, supply a detailed comment block that includes the following:
* A natural language statement of a query (as you’ve done in previous assignments, but now in the code)
* Specification of all function parameters
* Specification of the return value
* At least one copy-pasteable example of the query, with specific values already provided

#### Full-Cycle CRUD for at Least One Entity
Make sure your DAL has full CRUD functionality for at least one entity in the database, meaning that a user has the complete ability to create, retrieve, update, and delete occurrences of that entity via your DAL, without having to go to the level of the database (i.e., no need to run _psql_ nor _mongo_ nor _curl_ http://localhost:9200 nor Neo4j Browser).
* Creation function
* User-readable search function (which includes an ID so that the user can then call…)
* Get-one-entity-by-ID function
* Update function
* Delete function

Provide the same information in the comment blocks for these functions as the featured queries (though most likely, the descriptions will be much simpler): natural language statement, specifications of function parameters and return values, and a copy-pasteable example of the query (or queries), with specific values already provided. State any assumptions, restrictions, or other domain-specific characteristics that apply to these functions (e.g., required values, default values, constraints, etc.).

**At least one (1) of these functions must require a transaction:** This means that one or more of the _CUD_ functions must perform an operation that requires more than one query (functions that solely read from the database only need transactions for the most complex of queries, which you are highly unlikely to have given the scope of your datasets). You are most likely to find this requirement with an entity that has relationships with another entity. _Do not implement a transaction without actually needing one._

Elasticsearch is exempt from the transaction requirement. Further, some systems have advanced features that allow operations to _cascade_ such that multiple entities may be touched by a single query: for the purposes of the transaction requirement, do _not_ make use of those features and just implement your operation as multiple queries within a transaction.

#### Helper Functions for Usability
To ensure that your SDK is ready for end-users, supply any necessary helper functions whose parameters can be provided by an end-user which then return values that can be used for other queries. The prime example here is for any query that takes IDs—end-users will almost never know what IDs to use for various operations. Instead, a more usable search or filter is performed first, after which the application would know what ID(s) to use.

The user-readable search function in the CRUD suite is one such function. This allows a user to locate an entity of interest through a human-readable search term, which then supplies ID information that can either retrieve that specific entity in full (get-one-entity-by-ID) or update/delete that entity.

Your envisioned application may require more of these. Specify and implement whatever you feel is needed, again supplying a comment block that describes them completely: natural language statement, specifications of function parameters and return values, and a copy-pasteable example of the query (or queries), with specific values already provided.

### “With the Right Leverage and the Proper _Application Proof-of-Concept_, the Door Will Lift Free” (Orlando Bloom as Will Turner, `1905` _Priates of the Caribbean: The Curse of the Black Pearl_ 2003)
Your DAL won’t run itself—it needs end-user programs to shine. Provide such programs to demonstrate a “proof-of-concept” for what your envisioned application can do with this DAL. This proof-of-concept can take any of these forms:
* Command-line suite: Collection of programs that, together, show off the functions in your DAL
* Integrated text-based program: A single executable program which can run all of these functions (e.g., via a menu/keyboard interface)
* (only if you’ve already built one) Web or GUI application: This is most likely in a separate GitHub repository—point to it, provide instructions on how to run it, and provide instructions on how to access the features that use your DAL

All programs must:
1. Accept input from the user (no fully-hardcoded arguments in function calls)
2. Provide reasonable input validation
3. Provide reasonable error handling (no stack traces!)
4. Include adequate help when appropriate (e.g., if the user runs a program with no/insufficient arguments)

### Operational Directives/Suggestions
The first two are new/different from before:
- Every group’s applications and datasets are different and have unique characteristics—if you feel that yours has aspects that do not match the instructions, deliverables given here, _talk to me right away_. We can find ways to adjust the assignment accordingly
- If you have been given feedback that your dataset is too limited (e.g., insufficient entities, low richness/content, trivial/unnecessary relationships, etc.), also _talk to me right away_. We will also need to set parameters for the assignment to ensure that you learn what is needed from it. In fairness to other groups that picked applications/datasets of sufficient sophistication, failure to discuss and make these adjustments will _incur a reverse degree of difficulty deduction_
- Make sure to divide the implementation work relatively evenly within your group. Most groups have four (4) members and there is plenty of work to spread around. Let each member “run point” on some set of tasks so that someone is on top of things but of course allow yourselves to help each other.
- Once more, do _not_ commit dataset files to the repository—they may be too large for that. Provide links instead. Edit _.gitignore_ to avoid accidental commits.
- Not everyone’s computer might have enough storage or other capacity—AWS is an option but watch your credits; or, designate someone as the “host” for doing work and find ways to collaborate over a screenshare and (friendly) remote control of a classmate’s screen.

## For Submission: Statement of Work Retrospective
> “As for you, here tomorrow, write a _statement of work retrospective_” (Subtitled character in Bruce Lee film _Xi lu xiang_/_The Kid_ 1950)

* Reflect on your overall group database stack work for the semester in a _group-retrospective.md_ document. Describe what each group member worked on through all of the database mini-stack assignments as well as this last full SDK
* Write an individual email directly to me stating anything that you prefer not to include in the shared _statement-of-work.md_—even if you have nothing to add, _write to me anyway_, so I know that you didn’t miss a chance to speak up. So that I don’t miss it, use the subject line “CMSI 486 _group name_ individual statement of work”

The points for this deliverable pertain to _submission only_ and not its content. If warranted, individual adjustments to final grades may be made based on the information provided in these items.

## For Submission: Tutorial Video
> “Thanks to the genius of the _theory of relations video_, many customers also became friends” (Taylor Nichols as Ted Boynton, `7659` _Barcelona_ 1994)
Unrelated to the SDK

The last week of class will look at the theoretical foundations of the relational database model—foundations that remain unique and unmatched in the world of generalized database management systems. As a distinct deliverable from the full database SDK, record a tutorial video where _each_ member takes a turn to explain or talk through one of the following:
* A favorite relational algebra operation beyond σ, π, and ρ (but of course you can use these operations in your explanation)
* A favorite normal form above 1NF
* A proof of a favorite relational theorem or lemma

Coordinate/negotiate your choices with each other so that you don’t repeat yourselves.

At a minimum, provide (a) an explanation of the topic and (b) a concrete example—ideally from your own application! Writing on a piece of paper then holding it up to the camera will be fine (especially for the explanation). A screen-shared document that has a dynamic table feature may work best as a visual aid for the example.

Keep the video concise, to the point, and, if possible…fun! I just want to make sure you pick _something_ up from this last unit and provide some assurance that you won’t get all “deer in the headlights” if someone asks you about this in the future 🚘🦌🚨

Supply the video through whatever approach is feasible (which will likely not include GitHub nor Brightspace): link, Box file, other high-capacity storage.

## How to Turn it In
Commit everything to GitHub. Reiterating the deliverables, they are:
- [_about.md_](#whad-aboutmd-it-hugh-grant-as-michael-felgate-5415-mickey-blue-eyes-1999)
- [_.gitignore_](#that-little-gitignore-rupert-grint-as-ron-weasley-harry-potter-and-the-deathly-hallows-part-2-2011)
- [Schema diagram](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957)
- [Schema, mappings, or other DDL](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957), if applicable
- [Preprocessing program(s)](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957), if applicable
- [Loader program(s)](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957)
- [Indexing scheme](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957)
    * Implementation (e.g., part of the loader code, easily-executable command, etc.)
    * Evidence of impact (before-after query explanation; before-after query benchmarks) as part of [_setup.md_](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957)
- [_setup.md_](#you-always-do-drag-me-into-your-crazy-schemas-preprocessors-and-loaders-vivian-vance-as-ethel-mertz-1432576982618821017i-love-lucy-19511957)
- [DAL code](#id-rather-take-my-chances-as-a-supernaturally-possessed-dal-brad-dourif-as-chucky-12997-seed-of-chucky-2004)
- [Application proof-of-concept](#with-the-right-leverage-and-the-proper-application-proof-of-concept-the-door-will-lift-free-orlando-bloom-as-will-turner-1905-priates-of-the-caribbean-the-curse-of-the-black-pearl-2003)
- [Statement of work retrospective](#for-submission-statement-of-work-retrospective)
    * _group-retrospective.md_
    * Individual email to me
- [Tutorial video](#for-submission-tutorial-video)

Review the instructions in the deliverables’ respective sections to see what goes in them.

## Specific Point Allocations
This assignment is scored according to outcomes _1a_, _1b_, _1c_ or _1d_, _2a_, _2b_, _3a_–_3d_, and _4a_–_4f_ in the [syllabus](https://dondi.lmu.build/fall2020/cmsi486/cmsi486-fall2020-syllabus.pdf). For this particular assignment, graded categories are as follows:

| Category | Points | Outcomes |
| -------- | -----: | -------- |
| _about.md_ provides all requested information | 20 points total | _1a_, _1b_/_1c_ or _1d_, _4c_ |
| • Dataset link | deduction only, if missed | |
| • Dataset content description | 5 points | |
| • Application description | 5 points | |
| • Database choice rationale | 5 points | |
| • Database choice assessment | 5 points | |
| _.gitignore_ correctly prevents accidental commits of dataset files | deduction only, if missed | _4a_ |
| Schema diagram is accurate, complete, and clear | 10 points | _1b_/_1c_ or _1d_, _4c_ |
| DDL, preprocessing, and loader code works as expected | 20 points | _3a_, _3b_, _4a_–_4d_|
| Indexing scheme is implemented and documented | 20 points | _2b_ |
| _setup.md_ is accurate, complete, and clear | 10 points | _1b_/_1c_ or _1d_, _3a_, _3b_ _4c_|
| DAL code meets specifications and works as expected | 60 points total | _3c_, _3d_, _4a_–_4d_|
| • Configuration code | deduction only, if regressed | | 
| • Two (2) featured query functions | 20 points | |
| • Full-cycle CRUD with transaction implementation | 25 points | |
| • Helper functions | 15 points | |
| Application proof-of-concept is functional and usable | 20 points | _3d_, _4a_–_4d_|
| Statement of work retrospective has the requested information | 10 points total | _4c_ |
| • _group-retrospective.md_ | 5 points | |
| • Individual email | 5 points | |
| Tutorial video has the requested content | 30 points | _2a_ |
| Hard-to-maintain or error-prone code | deduction only | _4b_ |
| Hard-to-read code | deduction only | _4c_ |
| Version control | deduction only | _4e_ |
| Punctuality | deduction only | _4f_ |
| **Total** | **200** |

Where applicable, we reinterpret outcomes _4b_ and _4c_ in this assignment to represent the clarity, polish, and effectiveness of how you document your dataset, database, and its features, whether in written descriptions, the database diagram, or the DAL code.

Note that inability to compile and run any code to begin with will negatively affect other criteria, because if we can’t run your code (or commands), we can’t evaluate related remaining items completely.
