from websockets.sync.client import connect
from time import time

# Configuration
RUN_FOR = 20  # seconds
WS_URL = "" # The websocket endpoint to measure

start_time = time()
msg_count = 0

print("Counting message...")

with connect(WS_URL) as websocket:
    while True:
        message = websocket.recv()
        msg_count += 1
        if time() - start_time > 1.9 and time() - start_time <= 2:
            # Because the Websocket endpoint dumps the historical result
            # from all devices in the system, they do not represent the
            # real time computation of anomaly detection result from the
            # server. A simple workaround is to ignore the message received
            # within the first 2 seconds.
            print("Resetting message count to ignore existing readings")
            msg_count = 0
        if time() - start_time > RUN_FOR:
            break

print("Total count =", msg_count)
print("Average     =", msg_count / (RUN_FOR - 2), "msg/second")
