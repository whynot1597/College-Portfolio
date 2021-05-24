import os

from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, Date, ForeignKey, Sequence, Index, delete, update, insert
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import select, func
from sqlalchemy.orm import sessionmaker, relationship

# db = create_engine(os.getenv('DB_URL'))
db = create_engine("postgres://localhost/bgg")
metadata = MetaData(db)
game_table = Table('game', metadata, autoload=True)
review_table = Table('review', metadata, autoload=True)

ORM_Base = declarative_base()

class Game(ORM_Base):
    __tablename__ = 'game'
    id = Column(Integer, Sequence('game_id_seq'), primary_key=True)
    name = Column(String, index=True)
    year = Column(Integer)
    rank = Column(Integer)
    average = Column(Float)
    bayes_average = Column(Float)
    users_rated = Column(Integer)
    url = Column(String)
    thumbnail = Column(String)


class Review(ORM_Base):
    __tablename__ = 'review'
    id = Column(Integer, Sequence('review_id_seq'), primary_key=True)
    game_id = Column(Integer, ForeignKey('game.id'))
    user_id = Column(String)
    rating = Column(Float)
    comment = Column(String)
    game = relationship('Game')

Session = sessionmaker(bind=db)
current_session = Session()

def get_number_of_ratings_per_game(game_id):
    """
    A function to get the total number of reviews for a given game id.

    Parameters
    -------------
    game_id : int
        user-inputted game_id that should correspond to a Game.id

    Return Value
    -------------
    list of results from database.
        if the game id does not exist the list length will be 0
        otherwise the first item in the list has the name property and a count property

    Example
    -------------
    select game.name, count(review.id) 
    from review 
    inner join game on review.game_id = game.id 
    where review.game_id = 30549 
    group by game.name;
    """

    query = current_session.query(Game.name, func.count(Review.id).label("count")).\
        join(Game).\
        filter(Review.game_id == game_id).\
        group_by(Game.name)
    return query.all()

def compare_reviews(game_id):
    """
    A function to get the comment for the lowest review of a game and the comment for the hightest review of the game.
    Makes sure the comment is not the empty string

    Parameters
    -------------
    game_id : int
        user-inputted game_id that should correspond to a Game.id

    Return Value
    -------------
    tuple of query results
        the first item is the result of the query for the highest review
        the second item is the result of the query for the lowest review

        if the game id exists, the queries will return 
            the name of the game
            the rating
            the user_id
            the comment
        otherwise the item in the tuple will be None

    Example
    -------------
    select game.name, review.rating. review.user_id, review.comment
    from review 
    inner join game on review.game_id = game.id 
    where review.game_id = 30549 and review.comment != ''
    group by game.name, review.user_id, review.comment, review.rating
    order by review.rating desc;
    select game.name, review.rating. review.user_id, review.comment
    from review 
    inner join game on review.game_id = game.id 
    where review.game_id = 30549 and review.comment != ''
    group by game.name, review.user_id, review.comment, review.rating
    order by review.rating asc limit 1;
    """

    query_high = current_session.query(Game.name, Review.rating, Review.user_id, Review.comment).\
        join(Game).filter(Review.game_id == game_id, Review.comment != "").\
        group_by(Game.name, Review.user_id, Review.comment, Review.rating).\
        order_by(Review.rating.desc())
    
    query_low = current_session.query(Game.name, Review.rating, Review.user_id, Review.comment).\
        join(Game).\
        filter(Review.game_id == game_id, Review.comment != "").\
        group_by(Game.name, Review.user_id, Review.comment, Review.rating).\
        order_by(Review.rating.asc())

    final_query = (query_high.first(), query_low.first())
    return final_query

def get_game_by_name(name):
    """
    A function to get id's of games that match a name

    Parameters
    -------------
    name : string
        user-inputted complete name of a game

    Return Value
    -------------
    list of tuples of results from database
        if there are no matches, the list will be empty
        otherwise the first element of the tuple is the name and the second element is the game id

    Example
    -------------
    select game.name, game.id from game where game.name like 'Pandemic';
    """

    query = current_session.query(Game.name, Game.id).\
        filter(Game.name.like(name))
    return query.all()

def get_game_by_id(game_id):
    """
    A function to get all the properties of a game given the id of the game

    Parameters
    -------------
    game_id : int
        user-inputted id that should correspond to a Game.id

    Return Value
    -------------
    resulting object with all the properties of the game
        if game id does not exist, the rsult is None

    Example
    -------------
    select * from game 
    where id=30549;
    """

    query = current_session.query(Game).\
        get(game_id)
    return query
    
def insert_game(name, year, rank, average, Bayes_Average, Users_Rated, url, thumbnail):
    """
    A function to insert a new game into the game table

    Parameters
    -------------
    name : string
        user-inputted name of the game
    year : int
        user-inputted year the game released
    rank : int
        user-inputted current rank of the game
    average : float
        user-inputted average rating of the game
    Bayes_Average : float
        user-inputted bayes average rating of the game
    Users_Rated : int
        user-inputted number of users who have reviewed the game
    url : string
        user-inputted link to game on board game geek site
    thumbnail : string
        user-inputted link to thumbnail of the game on board game geek

    Return Value
    -------------
    None

    Example
    -------------
    insert into game (name, year, rank, average, Bayes_Average, Users_Rated, url, thumbnail)
    values ('Test Game', 1901, 0, 0, 0, 0, 'fakeurl.com', 'thereisnone');
    """

    stmt = (
        insert(Game).
        values(name=name, year=year, rank=rank, average=average, bayes_average=Bayes_Average, users_rated = Users_Rated, url = url, thumbnail = thumbnail)
    )
    current_session.execute(stmt)
    current_session.commit()
    return

def combo_insert(name, year, rank, average, Bayes_Average, Users_Rated, url, thumbnail, user_id, rating, comment):
    """
    A function to insert a new game and a review for the game
        The execution of the insert game and insert review statements are wrapped in a try catch to create a transaction
        In the event of code failure, the program will rollback the transaction

    Parameters
    -------------
    name : string
        user-inputted name of the game
    year : int
        user-inputted year the game released
    rank : int
        user-inputted current rank of the game
    average : float
        user-inputted average rating of the game
    Bayes_Average : float
        user-inputted bayes average rating of the game
    Users_Rated : int
        user-inputted number of users who have reviewed the game
    url : string
        user-inputted link to game on board game geek site
    thumbnail : string
        user-inputted link to thumbnail of the game on board game geek
    user_id : string
        user-inputted id of the user who reviewed the game
    rating : float
        user-inputted rating of game by user
    comment : ctring
        user-inputted comment attached to the rating of the game

    Return Value
    -------------
    None

    Example
    -------------
    insert into game (name, year, rank, average, Bayes_Average, Users_Rated, url, thumbnail)
    values ('Test Game', 1901, 0, 0, 0, 0, 'fakeurl.com', 'thereisnone');
    select id from game where name like 'Test Game';
    insert into review (user_id, rating, comment )
    """

    try:
        stmt_game = (
            insert(Game).
            values(name=name, year=year, rank=rank, average=average, bayes_average=Bayes_Average, users_rated = Users_Rated, url = url, thumbnail = thumbnail).
            returning(Game.id)
        )

        game_id = current_session.execute(stmt_game).fetchone()[0]

        stmt_review = (
            insert(Review).
            values(user_id=user_id, rating=rating, comment=comment, game_id=game_id)
        )
        current_session.execute(stmt_review)

        current_session.commit()
    except:
        print("Transaction failed")
        current_session.rollback()
        raise
    finally:
        current_session.close()
    
def update_game_name(name, new_name):
    """
    A function update the name of a game

    Parameters
    -------------
    name : string
        user-inputted current name of the game
    new_name : string
        user-inputted name the user wants to change to


    Return Value
    -------------
    0 - name was updated
    1 - game with name does not exist

    Example
    -------------
    update game
    set name = 'New Name'
    where name like 'Test Game';
    """

    game = current_session.query(Game).filter_by(name=name).first()
    if game is not None:
        game.name = new_name
        current_session.commit()
        return 0
    return 1

def delete_game(game_id):
    """
    A function to delete a game given a game id

    Parameters
    -------------
    game_id : int
        user-inputted id of the game

    Return Value
    -------------
    0 - game was deleted
    1 - game with id does not exist

    Example
    -------------
    delete from game
    where id = 314042;
    """

    game = current_session.query(Game).filter_by(id=game_id).first()
    if game is not None:
        current_session.delete(game)
        current_session.commit()
        return 0
    return 1


