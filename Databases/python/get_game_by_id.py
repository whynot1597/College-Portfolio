import sys
from board_game_dal import get_game_by_id

if len(sys.argv) != 2:
    print('Usage: get_game_by_id <game_id>')
    exit(1)

game_id = sys.argv[1]

try:
    result = get_game_by_id(game_id)

    if result is None:
      print(f"The game id {game_id} does not exist in the database")
      exit(0)
    
    print("ID: ", result.id)
    print("Name: ", result.name)
    print("Rank: ", result.rank)

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that “{game_id}” is a valid game name.')
