import controlP5.*;
import oscP5.*;
import netP5.*;
import ddf.minim.analysis.*;
import ddf.minim.*;


OPC opc;
OscP5 oscP5;
ControlP5 cp5;
Minim       minim;
AudioInput  accessMic;
FFT         fft;


float qheight;
float qwidth;
float particleSpeed;
int particleInterval = 1000;
int particleNext = 0;
float particleWidth = 10;
boolean positionBar = false;

ArrayList<Particle> particles = new ArrayList<Particle>();
PhoneSlot[] slots = new PhoneSlot[18];

float fadeSpeed = 1;
float leftFade = 0;
float rightFade = PI;
float spinnerSpeed = 1.0;
float spinnerPos = 0;
float spinnerWidth = 20;
float vocalGlow = 0;

color[] particleColors = new color[6];


float blackout = 0;
//String currentUsersHomeDir = System.getProperty("user.home");
String propertiesFile = "leds.properties"; //currentUsersHomeDir+"/Desktop/leds.properties";


// -------------------------------
void setup()
{
  registerPre(this);
  frameRate(60);
  size(1200, 300);
  opc = new OPC(this, "127.0.0.1", 7890);
  oscP5 = new OscP5(this, 3334);
  cp5 = new ControlP5(this);


  minim = new Minim(this);
  accessMic = minim.getLineIn();

  qheight = height / 4.0;
  qwidth = width / 4.0;

  particleColors[0] = color(255, 0, 0);
  particleColors[1] = color(250, 100, 100);
  particleColors[2] = color(255, 255, 255);
  particleColors[3] = color(200, 225, 240);
  particleColors[4] = color(130, 200, 224);
  particleColors[5] = color(0, 255, 180);

  color greenish = color(10, 255, 10);
  color white = color(255, 255, 255);
  color red = color(250, 50, 50);

  slots[0] = new PhoneSlot(0.195, greenish);
  slots[1] = new PhoneSlot(0.172, greenish);
  slots[2] = new PhoneSlot(0.144, greenish);
  slots[3] = new PhoneSlot(0.122, greenish);
  slots[4] = new PhoneSlot(0.097, greenish);
  slots[5] = new PhoneSlot(0.216, greenish);
  slots[6] = new PhoneSlot(0.280, white);
  slots[7] = new PhoneSlot(0.314, white);
  slots[8] = new PhoneSlot(0.337, white);
  slots[9] = new PhoneSlot(0.363, white);
  slots[10] = new PhoneSlot(0.385, white);
  slots[11] = new PhoneSlot(0.399, white);
  slots[12] = new PhoneSlot(0.599, red);
  slots[13] = new PhoneSlot(0.623, red);
  slots[14] = new PhoneSlot(0.647, red);
  slots[15] = new PhoneSlot(0.672, red);

  slots[16] = new PhoneSlot(0.695, red);
  slots[17] = new PhoneSlot(0.72, red);



  cp5.addSlider("particleSpeed")
    .setSize(100, 20)
      .setPosition(20, 10)
        .setRange(0.5, 10)
          ;
  cp5.addSlider("particleInterval")
    .setSize(100, 20)
      .setPosition(20, 40)
        .setRange(200, 2000)
          ;
  cp5.addSlider("particleWidth")
    .setSize(100, 20)
      .setPosition(20, 70)
        .setRange(10, 100)
          ;
  cp5.addToggle("positionBar")
    .setSize(60, 20)
      .setPosition(20, 100)
        .setValue(true)
          .setMode(ControlP5.SWITCH)
            ;
  cp5.addSlider("fadeSpeed")
    .setSize(100, 20)
      .setPosition(20, 140)
        .setRange(0.5, 5)
          ;
  cp5.addSlider("spinnerSpeed")
    .setSize(100, 20)
      .setPosition(20, 170)
        .setRange(10, 2000)
          ;

  cp5.addSlider("spinnerWidth")
    .setSize(100, 20)
      .setPosition(20, 200)
        .setRange(10, 100)
          ;


  cp5.addSlider("blackout")
    .setSize(100, 20)
      .setPosition(20, 230)
        .setRange(0, 255)
          ;

  cp5.loadProperties(propertiesFile);

  // https://github.com/scanlime/fadecandy/blob/master/doc/processing_opc_client.md
  opc.ledStrip(0, 240, qwidth, qheight, width / 450, 0, false); //RIGHT TOP
  opc.ledStrip(251, 320, qwidth, qheight*2, width / 540, 0, false); // RIGHT BOTTOM 1
  opc.ledStrip(576, 320, qwidth, qheight*3, width / 540, 0, false); // RIGHT BOTTOM 2

  opc.ledStrip(1024, 240, qwidth*3, qheight, width / 450, 0, true);  // LEFT TOP
  opc.ledStrip(1280, 360, qwidth*3, qheight*2, width / 540, 0, true); // LEFT BOTTOM 1
  opc.ledStrip(1600, 360, qwidth*3, qheight*3, width / 540, 0, true); // LEFT BOTTOM 2
}





// -------------------------------
/* incoming osc message are forwarded to the oscEvent method. */
void oscEvent(OscMessage theOscMessage) {
  String addr = theOscMessage.addrPattern();
  String data = theOscMessage.get(0).toString();
  JSONObject json = JSONObject.parse(data);
  //println(addr);
  //println(data);


  if (addr.equals("/bass_multislider_1")) {
    slots[0].blink();
  } else if (addr.equals("/bass_keyboard_1")) {
    slots[1].on = json.getInt("on")>1;
  } else if (addr.equals("/bass_keyboard_2")) {
    slots[2].on = json.getInt("on")>1;
  } else if (addr.equals("/bass_keyboard_3")) {
    slots[3].on = json.getInt("on")>1;
  } else if (addr.equals("/bass_keyboard_4")) {
    slots[4].on = json.getInt("on")>1;
  } else if (addr.equals("/bass_keyboard_5")) {
    slots[5].on = json.getInt("on")>1;
  } else if (addr.equals("/bass_tilt_1")) {
    slots[6].blink();
  } else if (addr.equals("/keys_range_1")) {
    slots[7].blink();
  } else if (addr.equals("/keys_multislider_1")) {
    slots[8].blink();
  } else if (addr.equals("/keys_keyboard_2")) {
    slots[9].on = json.getInt("on")>1;
  } else if (addr.equals("/keys_keyboard_3")) {
    slots[10].on = json.getInt("on")>1;
  } else if (addr.equals("/keys_button_1")) {
    slots[11].on = json.getInt("press")>1;
  } else if (addr.equals("/keys_tilt_1")) {
    slots[12].blink();
  } else if (addr.equals("/drums_toggle_0")) {
    slots[12].on = json.getInt("value")==1;
  } else if (addr.equals("/drums_keyboard_1")) {
    slots[13].on = json.getInt("on")>0;
  } else if (addr.equals("/drums_keyboard_2")) {
    slots[14].on= json.getInt("on")>0;
  } else if (addr.equals("/drums_keyboard_3")) {
    slots[15].on= json.getInt("on")>0;
  } else if (addr.equals("/drums_keyboard_4")) {
    slots[16].on = json.getInt("on")>0;
  } else if (addr.equals("/drums_tilt_1")) {
    slots[17].blink();
  }

  /* get and print the address pattern and the typetag of the received OscMessage */
  //println("### received an osc message with addrpattern "+theOscMessage.addrPattern()+" and typetag "+theOscMessage.typetag());
  //theOscMessage.print();
}

// -------------------------------
int lastFrame = millis();
void pre() {
  int now = millis();
  int deltaTime = now - lastFrame;
  lastFrame = now;

  float vocals = accessMic.left.level() + accessMic.right.level();


  if (keyPressed && key=='v') {
    vocalGlow += 50;
  } else {
    vocalGlow = vocals * 2000;
  }

  float elapsed = (deltaTime / 1000.0);
  leftFade += fadeSpeed * elapsed;
  rightFade += fadeSpeed * elapsed;
  spinnerPos += spinnerSpeed * elapsed;
  if (spinnerPos > width) {
    spinnerPos = 0;
  }


  if (now > particleNext) {
    particles.add( new Particle() );
    particleNext = now + particleInterval;
  }

  for (int i = 0; i < particles.size (); i++) {
    particles.get(i).update(deltaTime);
  }
  for (int i=0; i<slots.length; i++) {
    slots[i].update(deltaTime);
  }
}

// -------------------------------
void draw()
{
  background(0);
  noStroke();


  // FADES
  rectMode(CORNER);
  float left = map(cos(leftFade), -1, 1, 0, 50);
  fill(left);
  rect(0, 50, width/2, 40);

  float right = map(cos(rightFade), -1, 1, 0, 50);
  fill(right);
  rect(width/2, 50, width/2, 40);


  // SPINNER
  float t = millis() / 2000.0;
  float r = map(noise(t, 0.25), 0.0, 1.0, 150.0, 255.0);
  float g = map(noise(t, 0.75), 0.0, 1.0, 0.0, 100.0);
  float b = map(noise(t, 1.0), 0.0, 1.0, 0.0, 100.0);
  fill(r, g, b);
  rectMode(CENTER);
  rect(spinnerPos, qheight, spinnerWidth, 20);

  for (int i=0; i<slots.length; i++) {
    slots[i].draw();
  }

  for (int i = 0; i < particles.size (); i++) {
    particles.get(i).draw();
  }


  if (vocalGlow > 0) {
    fill(10, 200, 50, vocalGlow);
    rect(.875*width, qheight, 200, 20);
  }


  //  rectMode(CORNER);
  //  fill(0, 0, 0, blackout);
  //  rect(0, 0, width, height);



  if (positionBar) {

    fill(255, 100, 100);
    rect(mouseX, height/2, 22, height);
    fill(255);
    textSize(12);
    float x = mouseX/(float)width;
    text(x, mouseX, 20);
  }
}


// -------------------------------
void keyPressed() {
  if (key=='g') {
    if (cp5.isVisible()) cp5.hide();
    else cp5.show();
  }
  if (key=='s') {
    cp5.saveProperties(propertiesFile);
  }
  if (key=='1') {
    slots[0].blink();
  }
  if (key=='2') {
    slots[1].on = true;
  }
  if (key=='r') {
    println("reset");
    for (int i=0; i<slots.length; i++) {
      slots[i].on = false;
    }
  }
}

// -------------------------------
void keyReleased() {
  if (key=='2') {
    slots[1].on = false;
  }
}

