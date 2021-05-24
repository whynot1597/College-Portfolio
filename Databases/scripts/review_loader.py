import csv
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

"""
This program generates direct SQL statements from the source Netflix Prize files in order
to populate a relational database with those files’ data.

By taking the approach of emitting SQL statements directly, we bypass the need to import
some kind of database library for the loading process, instead passing the statements
directly into a database command line utility such as `psql`.
"""

# For simplicity, we assume that the program runs where the files are located.

REVIEW_SOURCE = '../data/bgg-15m-reviews.csv'

with open(REVIEW_SOURCE, 'r+', encoding='UTF-8') as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        user = row[1]
        rating = 'null' if row[2] == 'NULL' else float(row[2])
        comment = 'null' if row[3] == 'NULL' else row[3]
        game_id = 'null' if row[4] == 'NULL' else int(row[4])

        # Watch out---comments might have apostrophes!
        comment = comment.replace("'", "''")
        print(f'INSERT INTO review(user_id, rating, comment, game_id) VALUES(\'{user}\', {rating}, \'{comment}\', {game_id});')
