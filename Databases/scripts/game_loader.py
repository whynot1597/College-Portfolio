import csv
import re
import sys

sys.stdout.reconfigure(encoding='iso-8859-1')

"""
This program generates direct SQL statements from the source Netflix Prize files in order
to populate a relational database with those files’ data.

By taking the approach of emitting SQL statements directly, we bypass the need to import
some kind of database library for the loading process, instead passing the statements
directly into a database command line utility such as `psql`.
"""


GAMES_SOURCE = '../data/2020-08-19.csv'
with open(GAMES_SOURCE, 'r+', encoding="iso-8859-1") as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        id = int(row[1])
        name = 'null' if row[2] == 'NULL' else row[2]
        year = 'null' if row[3] == 'NULL' else int(row[3])
        rank = 'null' if row[4] == 'NULL' else int(row[4])
        average = 'null' if row[5] == 'NULL' else float(row[5])
        bayes = 'null' if row[6] == 'NULL' else float(row[6])
        users_rated = 'null' if row[7] == 'NULL' else int(row[7])
        url = 'null' if row[8] == 'NULL' else row[8]
        thumbnail = 'null' if row[9] == 'NULL' else row[9]

        # Watch out---titles might have apostrophes!
        name = name.replace("'", "''")
        print(f'INSERT INTO game VALUES({id}, \'{name}\', {year}, {rank}, {average}, {bayes}, {users_rated}, \'{url}\', \'{thumbnail}\');')

print('SELECT setval(\'game_id_seq\', (SELECT MAX(id) from game));')
