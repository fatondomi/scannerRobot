# scannerRobot
This is the complete code for a robot that maps the enviorment.
It comprises of a server written in "Node.js", and a client side written in C for ESP8266 microcontroller.

During the hole time the client will be listening to commands from a websocket that enables the communcation with the server.
When the command arrives the microcontroller will shortly execute it, driving the dc motors or taking an input from a sensor, and then return the sensor output or an affirmation of the executed command to the server.

The heavy lifting of deciding where the robot should go next and storing the map constructed by the scanned points will be done on the server side. The server will offer other clients to have access to a webpage that graphs the map in real time showing also the movments that the robot is making.
