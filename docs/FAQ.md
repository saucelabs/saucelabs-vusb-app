# FAQ

## Table of contents
- [I'm not seeing any devices in the device catalog](#im-not-seeing-any-devices-in-the-device-catalog)
- [Why can't I see iOS devices, even though I have private iOS devices assigned to my account](#why-cant-i-see-ios-devices-even-though-i-have-private-ios-devices-assigned-to-my-account)
- [I'm getting al kinds of errors in my home screen telling me that `JAVA_HOME`, `ANDROID_HOME` and or `ADB` are not working](#im-getting-al-kinds-of-errors-in-my-home-screen-telling-me-that-java_home-android_home-and-or-adb-are-not-working)
- [Cannot open Sauce vUSB app on Big Sur](#cannot-open-sauce-vusb-app-on-big-sur)
- [Cannot open Sauce vUSB app because it's "malicious software"](#cannot-open-sauce-vusb-app-because-its-malicious-software)
- [XCODE/Safari doesn't recognise my just connected iOS device over vUSB](#xcodesafari-doesnt-recognise-my-just-connected-ios-device-over-vusb)

### I'm not seeing any devices in the device catalog
Please make sure you have private devices assigned to your account. If you still can't see them file an issue
[here](https://github.com/wswebcreation/saucelabs-vusb-gui/issues).

### Why can't I see iOS devices, even though I have private iOS devices assigned to my account
Virtual USB for iOS is in beta. You need to have two things to make this work:

- be at least on version [`0.4.0`](https://github.com/wswebcreation/saucelabs-vusb-gui/releases/tag/0.4.0), go to
  **Settings** > **Server settings** > **SERVER VERSION** and select `Version 2.0-SNASHOT-5 !!iOS BETA!!`
- use a Mac, because vUSB relies on XCODE which will not work on Windows.

If that doesn't work I would advice you to contact your Sauce Labs Customer Success Manager.

### I'm getting al kinds of errors in my home screen telling me that `JAVA_HOME`, `ANDROID_HOME` and or `ADB` are not working
Make sure you have set up your environment for using Android on your local machine. Use Google as your biggest friend.

### Cannot open Sauce vUSB app on Big Sur
You may see a failure opening Sauce vUSB on Big Sur. This can be fixed by:

- opening a terminal
- run the following command:

      xattr -rd com.apple.quarantine /Applications/SauceVusbClient.app 

Once done, this should let you open the Sauce vUSB GUI without any further issues.

### Cannot open Sauce vUSB app because it's "malicious software"
When trying to open the application, you might get an error from Mac saying that you can't open this software because it's
downloaded from an external source and could be malicious software.

You can fix this by going to `System Preferences > Security & Privacy` and click on `Open Anyway`, see below

![Open Anyway](assets/mac-blocked.png)

### XCODE/Safari doesn't recognise my just connected iOS device over vUSB
You'll need to exit Xcode/Safari before connecting to an iOS Virtual USB session (or relaunch it after connecting).
Otherwise, the device won't show up.
