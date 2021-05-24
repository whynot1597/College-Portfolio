

## group_2

##### https://github.com/lmu-cmsi486-fall2020/full-db-sdk-group_2

| Category | Feedback | Points |
| --- | --- | ---: |
| _about.md_ | | |
| • Dataset link | Dataset link is provided in _about.md_ |  |
| • Dataset description | Dataset is described sufficiently | 5/5 |
| • Application description | Application is described sufficiently | 5/5 |
| • Choice rationale | Database choice rationale effectively communicates reason for choosing a relational database model—note though that the _schema.sql_ link is incorrect | 5/5 |
| • Choice assessment | Database choice assessment is expressed clearly—no wrong or right answer here of course, because it’s all about your view of the decision after the fact | 5/5 |
| _.gitignore_ | _.gitignore_ contains appropriate ignores |  |
| Schema | Schema diagram effectively communicates the intended design of the database, with proper notation of primary and referring keys<br><br>Schema SQL appears to follow the design and executes without errors | 10/10 |
| Preprocessing/loader | Loader appears to run without issues | 20/20 |
| Indexing | Indexing scheme is sufficiently implemented and documented with both timing and explanation data<br><br>Quite a nice speedup! #worthit | 20/20 |
| _setup.md_ | _setup.md_ is accurate, complete, and clear; all instructions and results went exactly as documented | 10/10 |
| DAL module | | |
| • Configuration/setup | Configuration code uses library correctly but comments out the environment variable in exchange for a hardcoded database URL—no bueno (–5)<br><br>(it’s an easy fix but why do it in the first place?—and if for some reason it was unavoidable [though I can’t imagine how, if you know how to set environment values—even in VS Code liveshare]—the hardcode should have been _strictly temporary_ and restored before the final commit) | -5 |
| • Featured queries | Featured queries successfully perform their intended queries<br><br>• `compare_reviews` can do with a minor optimization: only the first row of each query is needed, so setting `limit(1)` for each will help. One of the copy-pasteable queries has `LIMIT 1` but not the other<br><br>Both functions include the requested documentation (there is a typo in the `compare_reviews` copy-pasteable query but we’ll let that one go) | 20/20 |
| • CRUD + transaction | CRUD functions generally appear to work as expected and include the requested documentation, with some caveats:<br><br>• Insert and update should be generally symmetric; it isn’t the case here. You can specify all fields when adding but can only change the author afterward via `update_game_name` (at least the name reflects the limitation, conveying intentionality…would have been more of an issue if this were just `update_game`)<br><br>• Update and delete do a “preflight” query to see if a matching game exists—I get what you’re trying to do here but the `RETURNING` clause (not seen in class but available on the web and in PostgreSQL documentation: https://www.postgresql.org/docs/current/sql-update.html, https://www.postgresql.org/docs/current/sql-delete.html)<br><br>• Independent of that, update, as implemented, can be unpredictable when updating a game whose name isn’t unique in the database. Which game will get updated? Hard to know for sure—this one comes across as a genuine bug (–1)<br><br>In the transaction department, `combo_insert` successfully implements a transaction for a DAL operation that needs it | 24/25 |
| • Helpers | Helper functions generally appear to work as expected and include the requested documentation | 15/15 |
| PoC | • _get_number_of_ratings_per_game.py_ checks the argument count, provides help when needed, and displays readable results. It displays an appropriate message when there are no results or when the game ID is invaild<br><br>• _get_game_by_id.py_ checks the argument count, provides help when needed, and displays readable results. It displays an appropriate message when there are no results, but throws a scary stack trace when the game ID is invalid (–1)<br><br>• _get_game_by_name.py_ checks the argument count, provides help when needed, and displays readable results. It displays an appropriate message when there are no results<br><br>• _compare_reviews.py_ checks the argument count, provides help when needed, and displays readable results. However, it throws a scary stack trace when there are no results or when the game ID is invalid (–1)<br><br>• _insert_game.py_ checks the argument count but provides incomplete help (–1). It displays readable results. It displays an appropriate message when something goes wrong<br><br>• _update_game.py_ checks the argument count, provides help when needed, and displays readable results. It displays an appropriate message when there is no matching game name<br><br>• _delete_game.py_ checks the argument count, provides help when needed, and displays readable results. It displays an appropriate message when there is no matching game ID, but throws a scary stack trace when the game ID is invalid (–1)<br><br>• _combo_insert.py_ checks the argument count, provides help when needed, and displays readable results. It displays an appropriate message when something goes wrong | 16/20 |
| Retrospective | | |
| • _group-retrospective.md_ | _group-retrospective.md_ describes the overall interaction vibe | 5/5 |
| • Individual email | Credit applied to those who sent an email | |
| Tutorial video | Relational theory concepts sufficiently touched on—“deer in headlights” averted 😁<br><br>Useful tie-ins to the your database (for most of your segments)<br><br>Good job with (mostly) leading the set-like operations with the condition that the schemas of the involved relations are compatible. The notion of having compatible schemas should be front and center to begin with, because that’s really what makes the relational versions distinct from the generalized set versions | 30/30 |
| Code maintainability | No major code maintainability issues were found |  |
| Code readability | No major code readability issues were found |  |
| Version control | Looks like you had a marathon session on the 15th…virtually a one-day turnaround 😅 Yep the end of the semester will do that to you… |  |
| Punctuality | First commit on 12/11 5:12pm; last commit on 12/16 8:04pm |  |
| | **Total** | **185/195** |
