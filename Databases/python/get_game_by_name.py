import sys
from board_game_dal import get_game_by_name

if len(sys.argv) != 2:
    print('Usage: get_game_by_name <game_name>')
    exit(1)

game_name = sys.argv[1]

try:
    result = get_game_by_name(game_name)

    if len(result) == 0:
        print(f'There are no games with the name {game_name} in the database')
        exit(0)

    for game in result:
        print(f'The game {game.name} has an id of {game.id}')

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that “{game_name}” is a valid game name.')
