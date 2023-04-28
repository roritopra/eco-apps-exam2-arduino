const int POTEN_PIN = A1;
const int PHOTO_PIN = A3;

const int btn_A_PIN = 2;
const int btn_B_PIN = 3;

int btn_A_value = 0;
int btn_B_value = 0;

int previous_btn_A_value = 0;
int previous_btn_B_value = 0;

int myLEDs[2] = {5, 6};

int actuatorValue = 0;
int previousValue = 0;

void setup() {
  pinMode(POTEN_PIN, INPUT);
  pinMode(PHOTO_PIN, INPUT);
  pinMode(btn_A_PIN, INPUT);
  pinMode(btn_B_PIN, INPUT);
  
  for (int i = 0; i < sizeof(myLEDs)/sizeof(myLEDs[0]); i++) {
    pinMode(myLEDs[i], OUTPUT);
  }
  Serial.begin(9600); 
}

void loop() {
  // lee el valor del potenciómetro y el estado de los botones
  actuatorValue = analogRead(POTEN_PIN);
  btn_A_value = digitalRead(btn_A_PIN);
  btn_B_value = digitalRead(btn_B_PIN);
  
  // envía los datos por el puerto serie
  sendingData();
  
  // espera un tiempo antes de volver a leer los datos
  delay(100);
}

/*___________________________________________
Envía los datos por el puerto serie
_____________________________________________ */ 

void sendingData() {
  if (previousValue != actuatorValue || previous_btn_A_value != btn_A_value || previous_btn_B_value != btn_B_value) {
    sendSerialMessage(actuatorValue, btn_A_value, btn_B_value);
    previousValue = actuatorValue;
    previous_btn_A_value = btn_A_value;
    previous_btn_B_value = btn_B_value;
  }
}

/*___________________________________________
Envía el mensaje por el puerto serie
_____________________________________________ */ 

void sendSerialMessage(int POTEN_PIN, int btn_A_value, int btn_B_value) {
  Serial.print(btn_A_value);
  Serial.print(' ');
  Serial.print(btn_B_value);
  Serial.print(' ');
  Serial.print(POTEN_PIN);
  Serial.print(' ');
  Serial.println();
}

/*___________________________________________
Recibe los mensajes enviados por el Game
S es para scoring: Si marcas un punto, ambas luces deben encender y apagar
L es para perder: Si pierdes, ambas luces deben encender
_____________________________________________ */ 

void receivingData() {
  char inByte = Serial.read();

  switch(inByte){
    case 'S':
      // Enciende y apaga las luces 5 y 6
      digitalWrite(myLEDs[0], HIGH);
      digitalWrite(myLEDs[1], HIGH);
      delay(1000);
      digitalWrite(myLEDs[0], LOW);
      digitalWrite(myLEDs[1], LOW);
      break;
    case 'L':
      // Enciende las luces 5 y 6
      digitalWrite(myLEDs[0], HIGH);
      digitalWrite(myLEDs[1], HIGH);
      break;
  }
  Serial.flush();
}

