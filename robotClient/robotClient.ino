
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

// iphone ip 172.20.10.2
// Wifi_home ip 192.168.0.104
// jCoders ROOM4 ip 192.168.174.100

const char* ssid = "Wifi_home";
const char* password = "domi1211";

String ipAddress = "192.168.0.104";
int port = 8080;

bool isSocketConnected = false;
double heartBeatTimeRef = 0;

String textReceived = "";
int upToHere = 0;

enum allModes{drive, scan, turnLeft, turnRight, stop};
allModes currentMode = stop;

#define backPowerPin 16     // D0
#define forPowerPin   5     // D1
#define pwmPowerPin   4     // D2
#define leftDirPin    0     // D3
#define rightDirPin   2     // D4

#define motorPinA 14        // D5
#define motorPinB 13        // D7
#define motorPinC 12        // D6
#define motorPinD 15        // D8

#define encoderA 3          // D9
#define encoderB 1          // D10

#define sensorPin A0

/* the proper pinmap def 
    #define D0 16 
    #define D1 5 
    #define D2 4 
    #define D3 0 
    #define D4 2 
    #define D5 14 
    #define D6 12 
    #define D7 13 
    #define D8 15 
    #define D9 3 
    #define D10 1   
*/

int dir = 0;      //  1 per djathtas -1 per majtas 0 per drejt
int prevDir = 0;
int power = 0;    //  1 per forward -1 per backward 0 per asnjeren
int prevPower = 0;
int pwmPower = 0; // 0 per pa fuqi, 1023 per fuqi te plote
int prevPwmPower = 0;


//Graphs
int graphStepForward[4] = {1,2,3,0};
int graphStepBackward[4] = {3,0,1,2};

int prevEncoderState;
int encoderState;
bool eAstate;

int graphState[2][2] = {{2,1},
			                  {3,0}};

int graphStep[4][4] = {{ 0, 1, 0,-1},
                       {-1, 0, 1, 0},
			                 { 0,-1, 0, 1},
			                 { 1, 0,-1, 0}};

//stepper motor vars
int currentStep = 0;
int graphStepToPin[4] = {14,13,12,15};
double timeRef;
int startStepDelay = 16;
int stepDelay = 16;
int finalStepDelay = 2;
int acceleration = 1; 
int accelSteps = 0;
double absoluteStepCounter = 0;
bool scanningRight = true;
double stepsToRun = 0;
double localStepCounter = 0;
double stepsOver2 = 0;

void setup()
{
    WiFiMulti.addAP(ssid, password);

    //WiFi.disconnect();
    while(WiFiMulti.run() != WL_CONNECTED)
    {
        delay(100);
    }

    pinMode(rightDirPin, OUTPUT);
    pinMode(leftDirPin, OUTPUT);
    pinMode(forPowerPin, OUTPUT);
    pinMode(backPowerPin, OUTPUT);
    analogWrite(pwmPowerPin, 0);

    pinMode(motorPinA, OUTPUT);
    pinMode(motorPinB, OUTPUT);
    pinMode(motorPinC, OUTPUT);
    pinMode(motorPinD, OUTPUT);

    pinMode(sensorPin, INPUT);
    pinMode(encoderA, INPUT);
    pinMode(encoderB, INPUT);

    webSocket.beginSocketIO(ipAddress, port);
    webSocket.onEvent(webSocketEvent);

    digitalWrite(motorPinA, HIGH);
    digitalWrite(motorPinB, LOW);
    digitalWrite(motorPinC, LOW);
    digitalWrite(motorPinD, LOW);

    eAstate = digitalRead(encoderA);
    encoderState = graphState[digitalRead(encoderA)][digitalRead(encoderB)];
    prevEncoderState = encoderState;

    timeRef = millis();
    webSocket.sendTXT("2");
}

void loop()
{
    webSocket.loop();

    if(millis() > heartBeatTimeRef) 
    {// Send message to keep socket opened
        heartBeatTimeRef = millis() + 10000;
        webSocket.sendTXT("2");
    }

    /*
        if(isSocketConnected)
        {
            if(mCounter < 3)
            {
                // example socket.io message with type "messageType" and JSON payload
                //webSocket.sendTXT("42[\"messageType\",{\"greeting\":\"hello\"}]");
                if(millis() > timeRef)
                {
                    timeRef = millis() + 2000;
                    mCounter++;
                    webSocket.sendTXT("42[\"bot\",{\"move\":[0,0]}]");
                }
            }
            //webSocket.sendTXT("2");
        }
    */
    scan180();
    turnRightJog();
    turnLeftJog();
    readEncoder();
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length)
{
    switch(type)
    {
        case WStype_DISCONNECTED:
        {
            isSocketConnected = false;
            break;
        }
        case WStype_CONNECTED:
        {
            isSocketConnected = true;
			      // send message to server when Connected
            // socket.io upgrade confirmation message (required)
		      	webSocket.sendTXT("5");
            break;
        }
        case WStype_TEXT:
        {
			      // send message to server
			      // webSocket.sendTXT("message here");
            textReceived = (char*) payload;
            Serial.println(textReceived);
            parseMessage(textReceived);
            textReceived = "";
            break;
        }
        case WStype_BIN:
        {
            // send data to server
            // webSocket.sendBIN(payload, length);
            break;
        }
    }
}

void parseMessage(String text)
{
    
    if(  text.indexOf("stop()") >= 0  )
    {
        if(currentMode != stop) {
            stopCar();
            currentMode = stop;
        }
    }
    else if(  text.indexOf("drive(") >= 0  )
    {   // String format received
        //   drive(dir,power,pwmPower)
        text = text.substring(text.indexOf("(") + 1,text.indexOf(")"));
        upToHere = text.indexOf(",");
        dir = text.substring(0,upToHere).toInt();
        
        text = text.substring(upToHere + 1,text.length());
        upToHere = text.indexOf(",");
        power = text.substring(0,upToHere).toInt();
        pwmPower = text.substring(upToHere + 1,text.length()).toInt();
        
        driveCar();
        currentMode = drive;
    }
    else if (  textReceived.indexOf("turnRight()") >= 0  )
    {
        if(currentMode != stop)
        {
            stopCar();
            currentMode = stop;
        }
        currentMode = turnRight;
        stepDelay = startStepDelay;
    }
    else if (  textReceived.indexOf("turnLeft()") >= 0  )
    {
        if(currentMode != stop)
        {
            stopCar();
            currentMode = stop;
        }
        currentMode = turnLeft;
        stepDelay = startStepDelay;
    }
    else if (  textReceived.indexOf("scan()") >= 0  )
    {
        stepsToRun = 1025;
        localStepCounter = 0;
        stepsOver2 = 512;
        accelSteps = (startStepDelay - finalStepDelay) / acceleration;
        if(currentMode != stop)
        {
            stopCar();
            currentMode = stop;
        }
        currentMode = scan;
    }
}

void driveCar()
{
    //direction motor
    if(prevDir != dir)
    {
        if(dir == 1)
        {
            digitalWrite(leftDirPin, LOW);
            digitalWrite(rightDirPin, HIGH);
        }
        else if(dir == -1)
        {
            digitalWrite(rightDirPin, LOW);
            digitalWrite(leftDirPin, HIGH);
        }
        else 
        {
            digitalWrite(rightDirPin, LOW);
            digitalWrite(leftDirPin, LOW);
        }
        prevDir = dir;
    }

    //power motor
    if(prevPower != power)
    {
        if(power == 1)
        {
            digitalWrite(backPowerPin, LOW);
            digitalWrite(forPowerPin, HIGH);
        }
        else if(power == -1)
        {
            digitalWrite(forPowerPin, LOW);
            digitalWrite(backPowerPin, HIGH);
        }
        else 
        {
            digitalWrite(forPowerPin, LOW);
            digitalWrite(backPowerPin, LOW);
        }
        prevPower = power;
    }

    if(prevPwmPower != pwmPower)
    {
        if(pwmPower >= 0 && pwmPower <= 1023) {
            analogWrite(pwmPowerPin, pwmPower);
        }
        prevPwmPower = pwmPower;
    }
}

void stopCar() 
{
    digitalWrite(rightDirPin, LOW);
    digitalWrite(leftDirPin, LOW);
    digitalWrite(forPowerPin, LOW);
    digitalWrite(backPowerPin, LOW);
    digitalWrite(pwmPowerPin, LOW);
    dir = 0;
    power = 0;
    pwmPower = 0;
    prevDir = 0;
    prevPower = 0;
    prevPwmPower = 0;
}

void scan180(){
  if(currentMode == scan){
    
    if(millis() > timeRef + stepDelay){
      
      if(scanningRight){
        
        digitalWrite(graphStepToPin[currentStep],LOW);
        currentStep = graphStepForward[currentStep];
        digitalWrite(graphStepToPin[currentStep],HIGH);
        
        localStepCounter++;
        absoluteStepCounter++;
        timeRef = millis();
        
        if (localStepCounter < stepsOver2){
          if(stepDelay > finalStepDelay){
            stepDelay -= acceleration;
          }
        }
        else{
          if(localStepCounter >= (stepsToRun - accelSteps)){
            stepDelay += acceleration;
            if(localStepCounter >= stepsToRun){
              scanningRight = false;
              localStepCounter = 0;
              currentMode = stop;
            }
          }
        }
         
        //Measuring Distance
        String newMessage = "42[\"botPt\",{\"points\":[";
        
        int currentVal = 0;
        int prevVal = 0;
        int prevVal2 = 0;
        int average = 0;
        byte mms = 3;
        byte mmCounter = 0;
        
        while(true)
        {
            prevVal2 = prevVal;
            prevVal = currentVal;
            currentVal = analogRead(sensorPin);
            
            if(currentVal == prevVal)
            {
              if(prevVal == prevVal2)
              {
                average+=currentVal;
                mmCounter++;
                if(mmCounter>=mms)
                {
                  average = average/3;
                  webSocket.sendTXT(newMessage + String(-localStepCounter) + "," + String(average) + "]}]");
                  break;
                }
              }
            }
        }

      }else{
          
        digitalWrite(graphStepToPin[currentStep],LOW);
        currentStep = graphStepBackward[currentStep];
        digitalWrite(graphStepToPin[currentStep],HIGH);
        
        localStepCounter++;
        absoluteStepCounter++;
        
        timeRef = millis();
        
        if (localStepCounter < stepsOver2){
          if(stepDelay > finalStepDelay){
            stepDelay -= acceleration;
          }
        }
        else{
          if(localStepCounter >= (stepsToRun - accelSteps)){
            stepDelay += acceleration;
            if(localStepCounter >= stepsToRun){
              scanningRight = true;
              localStepCounter = 0;
              currentMode = stop;
            }
          }
        }
        
        //Measuring Distance and emmitting socket message
        //{points:[localStepCounter,currentVal]}
        String newMessage = "42[\"botPt\",{\"points\":[";
        
        int currentVal = 0;
        int prevVal = 0;
        int prevVal2 = 0;
        int average = 0;
        byte mms = 3;
        byte mmCounter = 0;
        
        while(true)
        {
            prevVal2 = prevVal;
            prevVal = currentVal;
            currentVal = analogRead(sensorPin);
            
            if(currentVal == prevVal)
            {
              if(prevVal == prevVal2)
              {
                average+=currentVal;
                mmCounter++;
                if(mmCounter>=mms)
                {
                  average = average/3;
                  webSocket.sendTXT(newMessage + String(-localStepCounter) + "," + String(average) + "]}]");
                  break;
                }
              }
            }
        }
      }
      
    }
    
  }
}

/*
void scan180(){
    if(currentMode == scan)
    {
        String newMessage = "42[\"botPt\",{\"points\":[0,";

        int currentVal = 0;
        int prevVal = 0;
        int prevVal2 = 0;

        while(true)
        {
        prevVal2 = prevVal;
        prevVal = currentVal;
        currentVal = analogRead(sensorPin);

            if(currentVal == prevVal)
            {
              if(prevVal == prevVal2)
              {
                webSocket.sendTXT(newMessage + String(currentVal) + "]}]");
                currentMode = stop;
                break;
              }
            }
        }
    }
}
*/

void turnRightJog(){
  if(currentMode == turnRight){

    if(millis() > timeRef){

      digitalWrite(graphStepToPin[currentStep],LOW);
      currentStep = graphStepForward[currentStep];
      digitalWrite(graphStepToPin[currentStep],HIGH);
      
      absoluteStepCounter++;

      timeRef = millis() + stepDelay;
      if(stepDelay > finalStepDelay){stepDelay-=acceleration;}
    }

  }
}

void turnLeftJog(){
  if(currentMode == turnLeft){

    if(millis() > timeRef){

      digitalWrite(graphStepToPin[currentStep],LOW);
      currentStep = graphStepBackward[currentStep];
      digitalWrite(graphStepToPin[currentStep],HIGH);

      absoluteStepCounter--;

      timeRef = millis() + stepDelay;
      if (stepDelay > finalStepDelay){stepDelay-=acceleration;}
    }

  }
}

void readEncoder()
{
    encoderState = graphState[digitalRead(encoderA)][digitalRead(encoderB)];
    if(encoderState!=prevEncoderState)
    {
      bool newEAState = digitalRead(encoderA);
      if(newEAState != eAstate)
      {
        String newMessage = "42[\"botMove\",{\"move\":[";
        webSocket.sendTXT(newMessage + String(dir) + "," + graphStep[prevEncoderState][encoderState] + "]}]");
        eAstate = newEAState;
      }
      prevEncoderState = encoderState;      
    }
}
