import math

def transposeArr(array):
    arrLen = len(array)
    newArr = []
    for i in array:
        newArr.append([])
    for i in array:
        for index, j in enumerate(i):
            newArr[index].append(j)
    return newArr
class TicTacToe:
    def __init__(self):
        self.board = [[0, 0, 0],
                     [0, 0, 0],
                     [0, 0, 0]]
    def reset(self):
        self.board = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]]
    def moveCross(self, place):
        if (place > 8 or place < 0):
            return False
        row = place % 3
        column = math.floor(place / 3)
        if (self.board[column][row] == 0):
            self.board[column][row] = 1
            return True
        return False
    def moveKnot(self, place):
        if (place > 8 or place < 0):
            return False
        row = place % 3
        column = math.floor(place / 3)
        if self.board[column][row] == 0:
            self.board[column][row] = 2
            return True
        return False
    def rowIsWinning(self, arr, item):
        for i in arr:
            if i != item:
                return False
        return True
    def getDiags(self, arr):
        diags = []
        temp = []
        for i in range(len(arr)):
            temp.append(arr[i][i])
        diags.append(temp)
        temp = []
        for i in range(len(arr)-1, -1, -1):
            temp.append(arr[len(arr)-1-i][i])
        diags.append(temp)
        return diags


    def checkWin(self):
        #Check win for knots up and down
        rot = transposeArr(self.board)
        diags = self.getDiags(self.board)
        for r in self.board:
            if self.rowIsWinning(r, 2):
                return 2
        for r in rot:
            if self.rowIsWinning(r, 2):
                return 2
        for r in diags:
            if self.rowIsWinning(r, 2):
                return 2
        #Check win for cross up and down
        for r in self.board:
            if self.rowIsWinning(r, 1):
                return 1
        for r in rot:
            if self.rowIsWinning(r, 1):
                return 1
        for r in diags:
            if self.rowIsWinning(r, 1):
                return 1

        flat = [item for sublist in self.board for item in sublist]
        for i in flat:
            if i == 0:
                return -1
        return 0

    def getState(self, turn):
        state = [item for sublist in self.board for item in sublist]
        if turn == 1:
            for i in range(len(state)):
                if state[i] == 2:
                    state[i] = 1
                elif state[i] == 1:
                    state[i] = 2
        return state

    def printRow(self, x):
        print(" "+str(self.board[x][0]) + "|" + str(self.board[x][1]) + "|" + str(self.board[x][2]))
    def printBoard(self):
        self.printRow(0)
        print("-------")
        self.printRow(1)
        print("-------")
        self.printRow(2)
        print("\n\n\n")

import numpy as np
import gym
from gym import spaces


class TicTacToeEnv(gym.Env):

    reward_range = (-np.inf, np.inf)
    observation_space = spaces.MultiDiscrete([2 for _ in range(0, 9 * 3)])
    action_space = spaces.Discrete(9)

    """
    Board looks like:
    [0, 1, 2,
     3, 4, 5,
     6, 7, 8]
    """
    winning_streaks = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    def __init__(self, summary: dict = None):
        super().__init__()
        if summary is None:
            summary = {
                "total games": 0,
                "ties": 0,
                "illegal moves": 0,
                "player 0 wins": 0,
                "player 1 wins": 0,
            }
        self.summary = summary
        self.board = np.zeros(9, dtype="int")

    def seed(self, seed=None):
        pass

    def _one_hot_board(self):
        if self.current_player == 0:
            return self.board.tolist()
        if self.current_player == 1:
            # permute for symmetry
            b = self.board.tolist()
            for i in range(len(b)):
                if b[i] == 1:
                    b[i] = 2
                elif b[i] == 2:
                    b[i] = 1
            return b

    def reset(self):
        self.current_player = 0
        self.board = np.zeros(9, dtype="int")
        return self._one_hot_board()

    def step(self, actions):
        exp = {"state": "in progress"}

        # get the current player's action
        action = actions

        reward = 0.01
        done = False
        # illegal move
        if self.board[action] != 0:
            reward = -3  # illegal moves are really bad
            exp = {"state": "done", "reason": "Illegal move"}
            done = True
            self.summary["total games"] += 1
            self.summary["illegal moves"] += 1
            return self._one_hot_board(), reward, done, exp

        self.board[action] = self.current_player + 1

        # check if the other player can win on the nextG turn:
        for streak in self.winning_streaks:
            if ((self.board[streak] == 2 - self.current_player).sum() >= 2) and (
                self.board[streak] == 0
            ).any():
                reward = -2
                exp = {
                    "state": "in progress",
                    "reason": "Player {} can lose on the nextG turn".format(
                        self.current_player
                    ),
                }

        # check if we won
        for streak in self.winning_streaks:
            if (self.board[streak] == self.current_player + 1).all():
                reward = 1  # player wins!
                exp = {
                    "state": "in progress",
                    "reason": "Player {} has won".format(self.current_player),
                }
                self.summary["total games"] += 1
                self.summary["player {} wins".format(self.current_player)] += 1
                done = True
        # check if we tied, which ends the game
        if (self.board != 0).all():
            reward = 1
            exp = {
                "state": "in progress",
                "reason": "Player {} has tied".format(self.current_player),
            }
            done = True
            self.summary["total games"] += 1
            self.summary["ties"] += 1

        # move to the nextG player
        self.current_player = 1 - self.current_player

        return self._one_hot_board(), reward, done, exp

    def render(self, mode: str = "human"):
        print("{}|{}|{}\n-----\n{}|{}|{}\n-----\n{}|{}|{}".format(*self.board.tolist()))