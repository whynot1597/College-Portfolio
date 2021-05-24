# How to Load and Setup Data

1. Start the database server
2. Navigate to the `scripts` folder.
3. Copy and paste the contents of `schema.sql` into your database console to add the schema and create the indexes.
4. Run the command `python .\game_loader.py | psql <server_address>` to populate the game table.
5. Run the command `python .\review_loader | psql <server_address>` to populate the review table.

   **NOTE:** This can take a significant amount of time.
6. Run the command `python .\index_loader | psql <server_address>` to create the game.name and review.game_id indices.
7. Set your environment variable `DB_URL` to the servar address.
8. Navigate to the python folder and create a new virtual environment with `python3 -m venv /path/to/new/virtual/environment`
9. Activate the environment (command varies based on operating system)
10. Install SQLAlchemy using `pip install sqlalchemy`.
11. You should now be able to run all the programs in the `python` folder.


## Evidence of Index Improvement

We added indices on `game.name` and `review.game_id` as those are the entities we iterate through with a search the most often.

We used the program compare_reviews to test our indices. This program loops through the game_id in the review table testing against the one the user submitted. For this test we will use the following SQL query, which can be considered equivalent to the one that SQLAlchemy would generate. In that program, there are actually 2 queries but they are almost essentially the same except for the `order by` clause, so for the purposes of this demo we will only use the first one. The game we will be searching for is "Pandemic" with an id of 30549.
```
select game.name, review.rating, review.user_id, review.comment from game inner join review on game.id=review.game_id where review.game_id=30549 and review.comment != '' group by game.name, review.user_id, review.comment, review.rating order by review.rating asc limit 1;
```

### `EXPLAIN` the query without indices
```
explain select game.name, review.rating, review.user_id, review.comment from game inner join review on game.id=review.game_id where review.game_id=30549 and review.comment != '' group by game.name, review.user_id, review.comment, review.rating order by review.rating asc limit 1;
                                              QUERY PLAN
------------------------------------------------------------------------------------------------------
 Limit  (cost=297118.64..297118.66 rows=1 width=75)
   ->  Group  (cost=297118.64..297338.23 rows=17479 width=75)
         Group Key: review.rating, game.name, review.user_id, review.comment
         ->  Sort  (cost=297118.64..297162.56 rows=17567 width=75)
               Sort Key: review.rating, game.name, review.user_id, review.comment
               ->  Nested Loop  (cost=1000.29..295880.12 rows=17567 width=75)
                     ->  Index Scan using game_pkey on game  (cost=0.29..8.30 rows=1 width=23)
                           Index Cond: (id = 30549)
                     ->  Gather  (cost=1000.00..295696.14 rows=17567 width=60)
                           Workers Planned: 2
                           ->  Parallel Seq Scan on review  (cost=0.00..292939.44 rows=7320 width=60)
                                 Filter: (((comment)::text <> ''::text) AND (game_id = 30549))
(12 rows)
```
### `Measure-Command` the query without the indices
```
(env) Measure-Command{"select game.name, review.rating, review.user_id, review.comment from game inner join review on game.id=review.game_id where review.game_id=30549 and review.comment != '' group by game.name, review.user_id, review.comment, review.rating order by review.rating asc limit 1;" | psql postgres://localhost/bgg}


Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 1
Milliseconds      : 36
Ticks             : 10363479
TotalDays         : 1.19947673611111E-05
TotalHours        : 0.000287874416666667
TotalMinutes      : 0.017272465
TotalSeconds      : 1.0363479
TotalMilliseconds : 1036.3479
```

### `EXPLAIN` the command with the indices
```
explain select game.name, review.rating, review.user_id, review.comment from game inner join review on game.id=review.game_id where review.game_id=30549 and review.comment != '' group by game.name, review.user_id, review.comment, review.rating order by review.rating asc limit 1;
                                                      QUERY PLAN
----------------------------------------------------------------------------------------------------------------------
 Limit  (cost=223646.45..223646.46 rows=1 width=75)
   ->  Group  (cost=223646.45..223866.04 rows=17479 width=75)
         Group Key: review.rating, game.name, review.user_id, review.comment
         ->  Sort  (cost=223646.45..223690.37 rows=17567 width=75)
               Sort Key: review.rating, game.name, review.user_id, review.comment
               ->  Nested Loop  (cost=2753.33..222407.92 rows=17567 width=75)
                     ->  Index Scan using game_pkey on game  (cost=0.29..8.30 rows=1 width=23)
                           Index Cond: (id = 30549)
                     ->  Gather  (cost=2753.04..222223.95 rows=17567 width=60)
                           Workers Planned: 2
                           ->  Parallel Bitmap Heap Scan on review  (cost=1753.04..219467.25 rows=7320 width=60)
                                 Recheck Cond: (game_id = 30549)
                                 Filter: ((comment)::text <> ''::text)
                                 ->  Bitmap Index Scan on review_game_id_idx  (cost=0.00..1748.65 rows=94412 width=0)
                                       Index Cond: (game_id = 30549)
(15 rows)

```

### `Measure-Command` with the indices
```
(env) Measure-Command{"select game.name, review.rating, review.user_id, review.comment from game inner join review on game.id=review.game_id where review.game_id=30549 and review.comment != '' group by game.name, review.user_id, review.comment, review.rating order by review.rating asc limit 1;" | psql postgres://localhost/bgg}


Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 0
Milliseconds      : 134
Ticks             : 1340412
TotalDays         : 1.55140277777778E-06
TotalHours        : 3.72336666666667E-05
TotalMinutes      : 0.00223402
TotalSeconds      : 0.1340412
TotalMilliseconds : 134.0412
```

## Relational Theories Video
You can find the link [here](https://www.youtube.com/watch?v=3EM6e4al8YQ&ab_channel=whynot1597).