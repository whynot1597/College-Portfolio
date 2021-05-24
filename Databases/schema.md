| Game                    |
|-------------------------|
| **id** INT - Primary Key|
| **name** VARCHAR        |
| **year** INT            |
| **rank** INT            |
| **average** FLOAT       |
| **Bayes_Average** FLOAT |
| **Users_Rated** INT     |
| **url** VARCHAR         |
| **thumbnail** VARCHAR   |

| Review                  |
|-------------------------|
| **id** INT - Primary Key|
| **user_id** VARCHAR     |
| **rating** FLOAT        |
| **comment** VARCHAR     |
| **game_id** INT         |