import sys
from board_game_dal import get_number_of_ratings_per_game

if len(sys.argv) != 2:
    print('Usage: get_number_of_ratings_per_game <game_id>')
    exit(1)

game_id = sys.argv[1]

try:
    result = get_number_of_ratings_per_game(int(game_id))

    if len(result) == 0:
        print(f'The game {game_id} does not have any ratings in the database.')
        exit(0)

    print(f'The game {result[0].name} ({game_id}) got {result[0].count} reviews')

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that “{game_id}” is a valid game ID.')
