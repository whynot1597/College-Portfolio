import sys

sys.stdout.reconfigure(encoding='iso-8859-1')

# Program to generate sql statements to load the indices

print("create index game_name_idx on game(name);")
print("create index rating_game_id_idx on review(game_id);")