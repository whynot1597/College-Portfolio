import sys
from board_game_dal import insert_game

if len(sys.argv) != 9:
    print('Usage: Insert_game <game_name>')
    exit(1)

game_name = sys.argv[1]
game_year = sys.argv[2]
game_rank = sys.argv[3]
game_average = sys.argv[4]
game_bayes_average = sys.argv[5]
game_users_rated = sys.argv[6]
game_url = sys.argv[7]
game_thumbnail= sys.argv[8]

try:
    result = insert_game(str(game_name), int(game_year), int(game_rank), float(game_average), float(game_bayes_average), int(game_users_rated), str(game_url), str(game_thumbnail))
    print('Game has been inserted.')

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that arguments are correct.')
