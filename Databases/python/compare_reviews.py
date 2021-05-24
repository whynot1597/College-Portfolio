import sys
from board_game_dal import compare_reviews

if len(sys.argv) != 2:
    print('Usage: compare_reviews <game_id>')
    exit(1)

game_id = sys.argv[1]

try:
    result = compare_reviews(game_id)
        
    if result[0] is None or result[1] is None:
      print(f"The game id {gameid} does not exist in the database")
      exit(0)

    high = result[0]
    low = result[1]

    print(f"""
    The game {high[0]} received a rating of {high[1]} by {high[2]} with the comment: {high[3]}
    The game {low[0]} received a rating of {low[1]} by {low[2]} with the comment: {low[3]}
    """)

except ValueError:
    print(f'Sorry, something went wrong. Please ensure that “{game_id}” is a valid game id.')