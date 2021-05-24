import sys
from board_game_dal import combo_insert
if len(sys.argv) != 12:
    print('Usage: combo_insert <game_name> <game_year> <game_rank> <game_average> <game_bayes_average> <game_users_rated> <game_url> <game_thumbnail> <user_id> <user_rating> <user_comment>')
    exit(1)

game_name = sys.argv[1]
game_year = sys.argv[2]
game_rank = sys.argv[3]
game_average = sys.argv[4]
game_bayes_average = sys.argv[5]
game_users_rated = sys.argv[6]
game_url = sys.argv[7]
game_thumbnail= sys.argv[8]
user_id = sys.argv[9]
rating = sys.argv[10]
comment = sys.argv[11]

try:
    result = combo_insert(str(game_name), int(game_year), int(game_rank), float(game_average), float(game_bayes_average), int(game_users_rated), str(game_url), str(game_thumbnail), 
             str(user_id), float(rating), str(comment))
    print('Review and game have been inserted.')

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that arguments are correct.')
