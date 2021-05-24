import sys
from board_game_dal import delete_game

if len(sys.argv) != 2:
    print('Usage: delete_game <game_id>')
    exit(1)

game_id = sys.argv[1]

try:
    result = delete_game(game_id)

    if result == 0:
      print(f'Deleted Game {game_id}')
    else:
      print(f'Sorry, something went wrong. Please ensure that “{game_id}” is a valid game id.')

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that “{game_id}” is a valid game name.')

