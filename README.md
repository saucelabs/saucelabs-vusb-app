# Virtual USB GUI
This project is an Open Source Virtual USB (vUSB) GUI for
[Sauce Labs vUSB](https://docs.saucelabs.com/mobile-apps/virtual-usb). It provides a simple GUI to start an Android or 
iOS vUSB session with only a few clicks.

[![License](https://img.shields.io/github/license/saucelabs/saucelabs-vusb-app.svg?color=success&style=flat-square&label=License)](https://github.com/saucelabs/saucelabs-vusb-appl/blob/main/LICENSE)

![VUSB example](./docs/assets/vusb.gif)

> vUSB  is a mobile app debugging tool that simulates connecting a Sauce Labs real device directly to your local machine
> with a USB cable. It integrates into your development environment as if the device is connected directly to your
> workstation, meaning you can use your choice of homegrown development and testing tools to debug.
> 
> vUSB will only work if you are having private devices in your Sauce Labs Real Device cloud. Please contact your
> Customer Success Manager if you have more questions about Sauce Labs private devices.

## Features
- :octocat: **Open Source**. So if you have any recommendations, want to see new features or want to help fix a bug,
  then please feel free to do so. Check our [contributing](./docs/CONTRIBUTING.md)-docs on how to start.
- :link: **Connect to an existing manual device session**, see 
  [here](./docs/SCREENS.md#connected-device-from-an-already-opened-device-session). This will allow you to easily take
  over the device under test, push your app to it and interact with it like you would normally do during a live manual
  session.
- :iphone: **Start a NEW vUSB session through the UI**, see 
  [here](./docs/SCREENS.md#connected-device-from-a-clean-session). With this option you can start interacting with the
  device without even to have a Sauce Labs browser window open, just do everything from this app.
- :gear: **Easily change vUSB server settings through the UI**, see [here](./docs/SCREENS.md#settings). This will
  prevent remembering all options that you need to type in the command line, the vUSB GUI will store and re-use them 
  each time you use the app.
- :computer: **Automatically connect to ADB, see [here](./docs/SCREENS.md#automatically-connect-adb).** No need to open
  extra terminals, by default it will automatically connect to ADB for you.
- :inbox_tray: **Save logs into files, see [here](./docs/SCREENS.md#write-logs-to-file).** Logs for and the server and
  each device can be saved to a file for you for easy debugging.
- :radio_button: **Use some most used buttons to control the device from the right menu.** When a fresh session through
  this vUSB GUI is started you now also have the option to use the Home (Android/iOS), Rotate (Android/iOS), 
  Menu (Android) and Back (Android) buttons through the UI.
- :bulb: and many more!

## Prerequisites
### Android
To be able to work with vUSB for Android you need to have the following on your local machine:

- JAVA added to your path.
- The latest version of ADB installed on your machine.
- The latest version of Android Studio installed on your local machine (optional).

Android can run on Linux, Windows and OSX. There is an installable of the vUSB GUI for each platform.

### iOS
To be able to work with iOS you need to have a **Mac** and **XCODE** installed.

## Installing
Download the latest version of the client from [here](https://github.com/saucelabs/saucelabs-vusb-app/releases).
If you face challenges during the installation then please check the [FAQ](./docs/FAQ.md).

## How to use
Please check the docs [here](./docs/HOW_TO_USE.md). More information about the screens can be found [here](./docs/SCREENS.md).

## FAQ
Please check the FAQ [here](./docs/FAQ.md)

## Contributing
Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our process for submitting pull requests to us, and 
please ensure you follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/saucelabs/_projectname_/tags). 

## Built With
- [Electron](http://electron.atom.io/)
- [React](https://facebook.github.io/react/)
- [Redux](https://github.com/reactjs/redux)
- [React Router](https://github.com/reactjs/react-router)
- [Webpack](http://webpack.github.io/docs/)
- [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- And love 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
- This project is based on 
[Electron React Boilerplate version `0.18.0`](https://github.com/electron-react-boilerplate/electron-react-boilerplate/)
![Electron React Boilerplate](./docs/assets/erb-banner.png "Electron React Boilerplate version `0.18.0`")
- This vUSB GUI was originally created by [wswebcreation](https://github.com/wswebcreation).
