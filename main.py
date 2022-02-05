from TicTacToe import TicTacToeEnv
from TicTacToe import transposeArr
from DQN import *


env = TicTacToeEnv()

agent = AgentDQN(lr=0.001, epsilon=1, batch_size=64, n_actions=9, input_dims=[9], gamma=0.99, epsilon_dec=1e-5)

best = -10
totalSteps = 1

for i in range(100000):
    done = False
    state = env.reset()
    accum = 0
    finalBoard = []
    m = 0
    reson = None
    while not done:
        action = agent.choose_action(np.array(state))
        state_, reward, done, reson = env.step(action)
        agent.store_transition(state, action, reward, state_, done)
        accum += reward
        state = state_
        agent.learn()
        m+=1
    agent.update_targets()
    env.render()
    print(f"Episode: {i}, Total reward:{accum}, total moves:{m}, epsilon:{agent.epsilon}")
    print(f"Reason of end{reson}")
    if accum > best or i % 100 == 0:
        if agent.save_model() != False:
            best = accum
            print(f"New Best!")
