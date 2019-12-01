#include <Mouse.h>
const int trigpin= 8;
const int echopin= 7;
long duration;
int distance;
const int ledPin = 13;   //the number of the LED pin
const int ldrPin = A0;  //the number of the LDR pin

void setup()
{
  pinMode(trigpin,OUTPUT);
  pinMode(echopin,INPUT);
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);  //initialize the LED pin as an output
  pinMode(ldrPin, INPUT);   //initialize the LDR pin as an input
 
}
void loop()
{
  digitalWrite(trigpin,HIGH);
  delayMicroseconds(10);
  digitalWrite(trigpin,LOW);
  duration=pulseIn(echopin,HIGH);
  distance = duration*0.034/2;
  if(distance>40)
    distance = 40;
  Serial.print(distance - 3);
  Serial.print("-");

  int ldrStatus = analogRead(ldrPin);   //read the status of the LDR value
 
  //check if the LDR status is <= 300
  //if it is, the LED is HIGH
 
   if (ldrStatus <=1) {
 
    digitalWrite(ledPin, HIGH);               //turn LED on
    Serial.println(1);
    
   }
  else {
 
    digitalWrite(ledPin, LOW);          //turn LED off
    Serial.println(0);
  }
}
