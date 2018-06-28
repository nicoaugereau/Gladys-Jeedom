# Gladys Jeedom

Gladys hooks to provide control on your devices through Jeedom.
Gladys communicate with Jeedom through telnet so it can control any devices configured onto Jeedom.

Usefull for controlling either Z-wave, EnOcean, RFx or any protocol supported by Jeedom. 

/!\ Development and testing in progress.
Based on Gladys-FHEM. https://github.com/Jean-PhilippeD/gladys-fhem

## Documentation

### Jeedom side

In order Gladys detect your devices, you have to delcare your devices with specific keyword in the name:
- for Temperature sensor: **temperature**
- for Motion sensor: **motion**
- for Humidity sensor: **humidity**
- for Brightness sensor: **brightness**
- for Switchs 4 buttons: **switchs**
- for Binary (on-off state button): **actuator**
- for Door contact sensor: **contact**

If your device does multiple sensor, just add each sensor type in your name.

__For example__, a device which does both brightness and motion sensor you need to name it as:
- **yourDeviceId_brightness_motion**

Be sure to get unique naming of course.

### Gladys side

To install this module : 

- Install the module in Gladys.
- Change the default Jeedom parameters (JEEDOM_PORT, JEEDOM_HOST, JEEDOM_TOKEN).
- Reboot Gladys.
- Then, launch Configuration on Jeedom Module, your devices should have been automaticaly detected. 

Once installed, you can run exec command or build launcher based on received values.
Value are mapped from Jeedom to Gladys like this:
- on = 1
- off = 0
- closed = 0
- open = 1
- A0 = 1
- AI = 2
- B0 = 3
- BI = 4

