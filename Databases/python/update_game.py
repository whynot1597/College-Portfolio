import sys
from board_game_dal import update_game_name

if len(sys.argv) != 3:
    print('Usage: update_game <game_name> <new_name>')
    exit(1)

name = sys.argv[1]
new_name = sys.argv[2]

try:
    result = update_game_name(name, new_name)

    if result == 0:
      print(f'Updated Game {name} to {new_name}')
    else:
      print(f'Sorry, something went wrong. Please ensure that “{name}” is a valid game name.')

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that “{name}” is a valid game name.')