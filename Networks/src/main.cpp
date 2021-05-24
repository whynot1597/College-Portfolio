/*********
  Jeremy Goldberg
  
  Base code: https://RandomNerdTutorials.com/esp8266-nodemcu-websocket-server-arduino/
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  Adapted to control a NeoPixel strip.
*********/

#include <Adafruit_NeoPixel.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include "LittleFS.h"

#define PIXELPIN 4
#define NUMPIXELS 300

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIXELPIN, NEO_GRB + NEO_KHZ800);

int PURPLE = strip.Color(255, 0, 255);
int DARK_BLUE = strip.Color(0, 0, 255);
int BLUE = strip.Color(0, 255, 255);
int BLACK = strip.Color(0, 0, 0);
int RED = strip.Color(255, 0, 0);
int YELLOW = strip.Color(255, 255, 0);
int GREEN = strip.Color(0, 255, 0);
int WHITE = strip.Color(255, 255, 255);
int WARM_WHITE = strip.Color(255, 147, 41);

int ALL_COLORS[8] = {PURPLE, DARK_BLUE, BLUE, BLACK, RED, YELLOW, GREEN, WHITE};

// Replace with your network credentials
const char *ssid = "your_network_id";
const char *password = "your_network_password";

bool ledState = 1;
String ledColor = "red";
const int ledPin = 16;

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void notifyClients()
{
  ws.textAll(ledColor);
  if (ledState)
  {
    ws.textAll("off");
  }
  else
  {
    ws.textAll("on");
  }
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT)
  {
    data[len] = 0;

    if (strcmp((char *)data, "purple") == 0)
    {
      ledColor = "purple";
      notifyClients();
    }
    else if (strcmp((char *)data, "dark_blue") == 0)
    {
      ledColor = "dark_blue";
      notifyClients();
    }
    else if (strcmp((char *)data, "blue") == 0)
    {
      ledColor = "blue";
      notifyClients();
    }
    else if (strcmp((char *)data, "red") == 0)
    {
      ledColor = "red";
      notifyClients();
    }
    else if (strcmp((char *)data, "yellow") == 0)
    {
      ledColor = "yellow";
      notifyClients();
    }
    else if (strcmp((char *)data, "green") == 0)
    {
      ledColor = "green";
      notifyClients();
    }
    else if (strcmp((char *)data, "white") == 0)
    {
      ledColor = "white";
      notifyClients();
    }
    else if (strcmp((char *)data, "power") == 0)
    {
      ledState = !ledState;
      notifyClients();
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
  switch (type)
  {
  case WS_EVT_CONNECT:
    Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
    if (ledState)
    {
      ws.text(client->id(), "on");
    }
    else
    {
      ws.text(client->id(), "off");
    }
    ws.text(client->id(), ledColor);
    break;
  case WS_EVT_DISCONNECT:
    Serial.printf("WebSocket client #%u disconnected\n", client->id());
    break;
  case WS_EVT_DATA:
    handleWebSocketMessage(arg, data, len);
    break;
  case WS_EVT_PONG:
  case WS_EVT_ERROR:
    break;
  }
}

void initWebSocket()
{
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

String processor(const String &var)
{
  return "Loading...";
}

void setup()
{
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  bool on = false;

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    if (on)
    {
      digitalWrite(ledPin, HIGH);
      on = false;
    }
    else
    {
      digitalWrite(ledPin, LOW);
      on = true;
    }
    Serial.println("Connecting to WiFi..");
  }
  digitalWrite(ledPin, LOW);

  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH)
    {
      type = "sketch";
    }
    else
    {
      type = "filesystem";
    }
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR)
    {
      Serial.println("Auth Failed");
    }
    else if (error == OTA_BEGIN_ERROR)
    {
      Serial.println("Begin Failed");
    }
    else if (error == OTA_CONNECT_ERROR)
    {
      Serial.println("Connect Failed");
    }
    else if (error == OTA_RECEIVE_ERROR)
    {
      Serial.println("Receive Failed");
    }
    else if (error == OTA_END_ERROR)
    {
      Serial.println("End Failed");
    }
  });
  ArduinoOTA.begin();

  Serial.print("Hosted on ");
  Serial.println(WiFi.localIP());

  if (!LittleFS.begin())
  {
    Serial.println("An Error has occurred while mounting LittleFS");
    return;
  }

  initWebSocket();

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(LittleFS, "/index.html", String(), false, processor);
  });

  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(LittleFS, "/style.css", "text/css");
  });

  server.begin();

  strip.begin();
  strip.setBrightness(25);
}

void loop()
{
  ws.cleanupClients();

  ArduinoOTA.handle();

  if (ledState)
  {
    strip.setBrightness(25);
  }
  else
  {
    strip.setBrightness(0);
  }

  if (ledColor == "purple")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, PURPLE);
    }
  }
  else if (ledColor == "dark_blue")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, DARK_BLUE);
    }
  }
  else if (ledColor == "blue")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, BLUE);
    }
  }
  else if (ledColor == "red")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, RED);
    }
  }
  else if (ledColor == "yellow")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, YELLOW);
    }
  }
  else if (ledColor == "green")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, GREEN);
    }
  }
  else if (ledColor == "white")
  {
    for (int i = 0; i < NUMPIXELS; i++)
    {
      strip.setPixelColor(i, WHITE);
    }
  }

  strip.show();

  delay(100);
}