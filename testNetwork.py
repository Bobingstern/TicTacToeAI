from DQN import *
from TicTacToe import TicTacToeEnv
agent = AgentDQN(lr=0.001, epsilon=0, batch_size=64, n_actions=9, input_dims=[9], gamma=0.99, epsilon_dec=1e-4)
agent.load_model()
env = TicTacToeEnv()
env.reset()
done = False
while not done:
    env.render()
    player = int(input("Enter your move 0-8\n>>>"))
    state, reward, done, exp = env.step(player)
    ac = agent.choose_action(state)
    state, reward, done, exp = env.step(ac)
    print(str(exp)+"\n\n\n")