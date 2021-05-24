# myTeam.py-99751145225137
# ---------
# Licensing Information:  You are free to use or extend these projects for
# educational purposes provided that (1) you do not distribute or publish
# solutions, (2) you retain this notice, and (3) you provide clear
# attribution to UC Berkeley, including a link to http://ai.berkeley.edu.
#
# Attribution Information: The Pacman AI projects were developed at UC Berkeley.
# The core projects and autograders were primarily created by John DeNero
# (denero@cs.berkeley.edu) and Dan Klein (klein@cs.berkeley.edu).
# Student side autograding was added by Brad Miller, Nick Hay, and
# Pieter Abbeel (pabbeel@cs.berkeley.edu).


from captureAgents import CaptureAgent
import random
import time
import util
from game import Directions
import game
from util import nearestPoint
import json
import os.path
from os import path
import math

#################
# Team creation #
#################


def createTeam(firstIndex, secondIndex, isRed,
               first='DefensiveReflexAgent', second='OffensiveReflexAgent'):
    """
    This function should return a list of two agents that will form the
    team, initialized using firstIndex and secondIndex as their agent
    index numbers.  isRed is True if the red team is being created, and
    will be False if the blue team is being created.
    As a potentially helpful development aid, this function can take
    additional string-valued keyword arguments ("first" and "second" are
    such arguments in the case of this function), which will come from
    the --redOpts and --blueOpts command-line arguments to capture.py.
    For the nightly contest, however, your team will be created without
    any extra arguments, so you should make sure that the default
    behavior is what you want for the nightly contest.
    """
    return [eval(first)(firstIndex), eval(second)(secondIndex)]

##########
# Agents #
##########


class ReflexCaptureAgent(CaptureAgent):
    """
    A base class for reflex agents that chooses score-maximizing actions
    """

    def initializeWeights(self):
        self.weights = util.Counter()
        if (not path.exists("weights_jj.txt")):
            self.all_weights = util.Counter()
            self.all_weights['distanceToFood'] = 0
            self.all_weights['distanceToGhost'] = 0
            self.all_weights['willDie'] = 0
            self.all_weights['willEatPellet'] = 0
            self.all_weights['desireForHome'] = 0
            self.all_weights['invaderDistance'] = 0
            self.all_weights['willEatInvader'] = 0
            self.all_weights['distanceToFarFood'] = 0

            with open("weights_jj.txt", "w") as outfile:
                json.dump(self.all_weights, outfile)
        else:
            with open("weights_jj.txt") as json_file:
                self.all_weights = json.load(json_file)

    def registerInitialState(self, gameState):

        CaptureAgent.registerInitialState(self, gameState)

        self.TRAINING = False

        # UPDATE VALUES
        self.gamma = 1
        self.alpha = .01
        self.epsilon = .2 if self.TRAINING else 0

        self.prevAction = None

        self.start = gameState.getAgentPosition(self.index)

        self.initializeWeights()

        # max maze distance (home_base to enemy_home_base)
        opponents = self.getOpponents(gameState)
        self.maxDistance = self.getMazeDistance(
            self.start, gameState.getAgentPosition(opponents[0]))

    def update(self, gameState):
        prevState = self.getPreviousObservation()
        if (prevState is None):
            return
        currentState = self.getCurrentObservation()

        reward = self.getReward(prevState, currentState)

        actions = gameState.getLegalActions(self.index)

        values = [self.evaluate(currentState, action)
                  for action in actions]
        bestValue = max(values)

        difference = reward + self.gamma * bestValue - \
            self.evaluate(prevState, self.prevAction)

        prevFeatures = self.getFeatures(prevState, self.prevAction)

        with open("weights_jj.txt") as json_file:
            self.all_weights = json.load(json_file)

        for feature in prevFeatures.items():
            value = self.weights[feature[0]] + \
                self.alpha * difference * feature[1]
            self.weights[feature[0]] = value
            self.all_weights[feature[0]] = value

        if self.TRAINING:
            with open("weights_jj.txt", "w") as json_file:
                json.dump(self.all_weights, json_file)

    def chooseAction(self, gameState):
        """
        Picks among the actions with the highest Q(s,a).
        """
        self.update(gameState)

        actions = gameState.getLegalActions(self.index)

        chance = random.uniform(0, 1)
        if chance <= self.epsilon:
            choice = random.choice(actions)
            self.prevAction = choice
            return choice
        else:

            # You can profile your evaluation time by uncommenting these lines
            # start = time.time()
            values = [self.evaluate(gameState, a) for a in actions]
            # print('eval time for agent %d: %.4f' % (self.index, time.time() - start))

            maxValue = max(values)
            bestActions = [a for a, v in zip(actions, values) if v == maxValue]

            self.prevAction = random.choice(bestActions)
            return self.prevAction

    def getSuccessor(self, gameState, action):
        """
        Finds the next successor which is a grid position (location tuple).
        """
        successor = gameState.generateSuccessor(self.index, action)
        pos = successor.getAgentState(self.index).getPosition()
        if pos != nearestPoint(pos):
            return successor.generateSuccessor(self.index, action)
        else:
            return successor

    def evaluate(self, gameState, action):
        """
        Computes a linear combination of features and feature weights
        """
        features = self.getFeatures(gameState, action)
        weights = self.getWeights(gameState, action)
        return features * weights

    def getWeights(self, gameState, action):
        """
        Normally, weights do not depend on the gamestate.  They can be either
        a counter or a dictionary.
        """
        return self.weights


class OffensiveReflexAgent(ReflexCaptureAgent):
    """
    A reflex agent that seeks food. This is an agent
    we give you to get an idea of what an offensive agent might look like,
    but it is by no means the best or only way to build an offensive agent.
    """
    # distance to home AKA state is not pacman
    # eating SUPER pellet

    def registerInitialState(self, gameState):
        super().registerInitialState(gameState)
        self.holdingPellets = 0
        self.storedPellets = 0

    def initializeWeights(self):
        super().initializeWeights()
        self.weights = util.Counter()
        self.weights['willEatPellet'] = self.all_weights['willEatPellet']
        self.weights['distanceToFood'] = self.all_weights['distanceToFood']
        self.weights['willDie'] = self.all_weights['willDie']
        self.weights['distanceToGhost'] = self.all_weights['distanceToGhost']
        self.weights['desireForHome'] = self.all_weights['desireForHome']

    def update(self, gameState):
        super().update(gameState)
        prevState = self.getPreviousObservation()
        if (prevState is None):
            return
        if len(self.getFood(gameState).asList()) < len(self.getFood(prevState).asList()):
            self.holdingPellets = self.holdingPellets + 1

        if (prevState.getAgentState(self.index).isPacman and not gameState.getAgentState(self.index).isPacman):
            holdingPellets = self.holdingPellets
            self.holdingPellets = 0
            if (self.getMazeDistance(gameState.getAgentPosition(self.index), prevState.getAgentPosition(self.index)) == 1):
                self.storedPellets = self.storedPellets + holdingPellets

    def getReward(self, prevState, currentState):
        if (prevState == None):
            return 0

        reward = 0

        # LOCAL VARIABLES
        current_enemies = [currentState.getAgentState(i)
                           for i in self.getOpponents(currentState)]
        current_ghosts = [a for a in current_enemies if not a.isPacman and a.getPosition()
                          != None]
        prev_enemies = [prevState.getAgentState(i)
                        for i in self.getOpponents(prevState)]
        prev_ghosts = [a for a in prev_enemies if not a.isPacman and a.getPosition()
                       != None]

        foodListPrev = self.getFood(prevState).asList()
        myPosPrev = prevState.getAgentPosition(self.index)
        minDistancePrev = min([self.getMazeDistance(myPosPrev, food)
                               for food in foodListPrev])

        foodListCurr = self.getFood(currentState).asList()
        myPosCurr = currentState.getAgentPosition(self.index)
        minDistanceCurrent = min([self.getMazeDistance(myPosCurr, food)
                                  for food in foodListCurr])

        # DYING
        if (myPosPrev != self.start and myPosCurr == self.start and len(prev_ghosts) > 0):
            if (len(foodListPrev) < len(foodListCurr)):
                reward = reward + .5
            reward = reward - .5

        # ATE PELLET
        if (len(foodListPrev) > len(foodListCurr)):
            reward = reward + .08

        # MOVE CLOSER TO PELLET
        if minDistancePrev >= minDistanceCurrent:
            reward = reward + .02
        # Punish for not moving closer if we are not holding pellets
        elif self.holdingPellets == 0:
            reward = reward - .02

        if len(prev_ghosts) > 0 and len(current_ghosts) > 0:
            dists = [self.getMazeDistance(
                myPosCurr, a.getPosition()) for a in current_ghosts]

            minGhostDistanceCurrent = min(dists)

            dists = [self.getMazeDistance(
                myPosPrev, a.getPosition()) for a in prev_ghosts]

            minGhostDistancePrev = min(dists)

            # Punish for being within 1 of ghost
            if minGhostDistanceCurrent == 1:
                reward = reward - .05

            # Punish for moving closer to ghost
            if minGhostDistancePrev > minGhostDistanceCurrent:
                reward = reward - .05

            # Punish for being in sight of a ghost
            if minGhostDistanceCurrent <= 5:
                reward = reward - .02

        # MOVING CLOSER TO HOME AND HOLDING PELLETS
        if (self.holdingPellets > 0 and self.getMazeDistance(self.start, myPosCurr) < self.getMazeDistance(self.start, myPosPrev)):
            reward = reward + .02

        # DEPOSITING PELLETS
        if (prevState.getAgentState(self.index).isPacman and not currentState.getAgentState(self.index).isPacman and self.getMazeDistance(myPosCurr, myPosPrev) == 1):
            reward = reward + .05

        return reward

    def getFeatures(self, gameState, action):

        features = util.Counter()
        successor = self.getSuccessor(gameState, action)
        foodList = self.getFood(successor).asList()

        if len(foodList) > 0:
            myPos = successor.getAgentState(self.index).getPosition()
            minDistance = min([self.getMazeDistance(myPos, food)
                               for food in foodList])
            foodListCurrent = self.getFood(gameState).asList()

            if len(foodListCurrent) > len(foodList):
                minDistance = 0
                features['willEatPellet'] = 1

            if(gameState.getAgentPosition(self.index) != self.start and myPos == self.start and gameState.getAgentState(self.index).isPacman):
                features['willDie'] = 1

           # Computes distance to invaders we can see
            enemies = [successor.getAgentState(i)
                       for i in self.getOpponents(successor)]
            ghosts = [a for a in enemies if not a.isPacman and a.getPosition()
                      != None]
            if len(ghosts) > 0:
                dists = [self.getMazeDistance(
                    myPos, a.getPosition()) for a in ghosts]
                features['distanceToGhost'] = (self.maxDistance -
                                               min(dists)) / self.maxDistance
            else:
                features['distanceToFood'] = (
                    self.maxDistance - minDistance) / self.maxDistance if len(foodListCurrent) > 2 else 0

            features['desireForHome'] = self.holdingPellets * \
                ((self.maxDistance - self.getMazeDistance(myPos,
                                                          self.start)) / self.maxDistance)

        return features

    def getWeights(self, gameState, action):
        return self.weights


class DefensiveReflexAgent(ReflexCaptureAgent):
    """
    A reflex agent that keeps its side Pacman-free. Again,
    this is to give you an idea of what a defensive agent
    could be like.  It is not the best or only way to make
    such an agent.
    """

    def registerInitialState(self, gameState):
        super().registerInitialState(gameState)
        foodList = self.getFoodYouAreDefending(gameState).asList()
        farthestDistance = 0
        for food in foodList:
            dist = self.getMazeDistance(
                gameState.getAgentState(self.index).getPosition(), food)
            if dist > farthestDistance:
                farthestDistance = dist
                self.farthestPellet = food

    def initializeWeights(self):
        super().initializeWeights()
        self.weights = util.Counter()
        self.weights['invaderDistance'] = self.all_weights['invaderDistance']
        self.weights['distanceToFarFood'] = self.all_weights['distanceToFarFood']
        self.weights['willEatInvader'] = self.all_weights['willEatInvader']

    def update(self, gameState):
        super().update(gameState)
        currentPos = gameState.getAgentPosition(self.index)
        if (currentPos == self.farthestPellet):
            foodList = self.getFoodYouAreDefending(gameState).asList()
            farthestDistance = 0
            for food in foodList:
                if self.getMazeDistance(currentPos, food) > farthestDistance:
                    farthestDistance = self.getMazeDistance(currentPos, food)
                    self.farthestPellet = food

    def getReward(self, prevState, currentState):
        if prevState is None:
            return 0

        reward = 0

        # LOCAL VARIABLES
        currentPos = currentState.getAgentState(self.index).getPosition()
        prevPos = prevState.getAgentState(self.index).getPosition()
        current_enemies = [currentState.getAgentState(i)
                           for i in self.getOpponents(currentState)]
        current_invaders = [a for a in current_enemies if a.isPacman and a.getPosition()
                            != None]
        prev_enemies = [prevState.getAgentState(i)
                        for i in self.getOpponents(prevState)]
        prev_invaders = [a for a in prev_enemies if a.isPacman and a.getPosition()
                         != None]
        minDistanceInvadersPrev = min([self.getMazeDistance(
            prevPos, a.getPosition()) for a in prev_invaders]) if len(prev_invaders) != 0 else float('inf')
        minDistanceInvadersCurrent = min([self.getMazeDistance(
            currentPos, a.getPosition()) for a in current_invaders]) if len(current_invaders) != 0 else float('inf')

        # ATE AN INVADER
        if ((len(prev_invaders) > len(current_invaders)) and minDistanceInvadersPrev == 1):
            reward = reward + .8

        if len(current_invaders) > 0 and len(prev_invaders) > 0:
            # MOVING CLOSER TO INVADER
            if (minDistanceInvadersPrev >= minDistanceInvadersCurrent and minDistanceInvadersPrev != 1):
                reward = reward + .2
        else:
            # MOVING CLOSER TO A FAR PELLET
            if self.getMazeDistance(currentPos, self.farthestPellet) <= self.getMazeDistance(prevPos, self.farthestPellet):
                reward = reward + .010

        return reward

    def getFeatures(self, gameState, action):
        features = util.Counter()
        successor = self.getSuccessor(gameState, action)

        myState = successor.getAgentState(self.index)
        myPos = myState.getPosition()

        enemies_succ = [successor.getAgentState(i)
                        for i in self.getOpponents(successor)]
        invader_succ = [a for a in enemies_succ if a.isPacman and a.getPosition()
                        != None]

        enemies_curr = [gameState.getAgentState(i)
                        for i in self.getOpponents(successor)]
        invader_curr = [a for a in enemies_curr if a.isPacman and a.getPosition()
                        != None]

        features['distanceToFarFood'] = (self.maxDistance - self.getMazeDistance(
            myPos, self.farthestPellet)) / self.maxDistance if len(invader_curr) == 0 else 0

        dists = [self.getMazeDistance(
            gameState.getAgentPosition(self.index), a.getPosition()) for a in invader_curr]

        if len(invader_curr) > 0:
            if (len(invader_succ) == 0):
                minDist = 0
                features['willEatInvader'] = 1
            else:
                dists = [self.getMazeDistance(
                    myPos, a.getPosition()) for a in invader_succ]
                minDist = min(dists)
            features['invaderDistance'] = (
                self.maxDistance - minDist) / self.maxDistance

        return features

    def getWeights(self, gameState, action):
        return self.weights
