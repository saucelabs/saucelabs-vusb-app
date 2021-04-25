# Virtual USB GUI
This project is an Open Source Virtual USB (vUSB) GUI for
[Sauce Labs vUSB](https://docs.saucelabs.com/mobile-apps/virtual-usb). It provides a simple GUI to start an Android or 
iOS vUSB session with only a few clicks.

![Server active](./docs/assets/server-active.png)

> vUSB  is a mobile app debugging tool that simulates connecting a Sauce Labs real device directly to your local machine
> with a USB cable. It integrates into your development environment as if the device is connected directly to your
> workstation, meaning you can use your choice of homegrown development and testing tools to debug.
> 
> vUSB will only work if you are having private devices in your Sauce Labs Real Device cloud. Please contact your
> Customer Success Manager if you have more questions about Sauce Labs private devices.

## Features
- Connect to an existing manual device session
- Start a **new** vUSB session through the UI
- Easily change vUSB server settings through the UI
- Automatically connect to ADB
- Save logs into files
- Use some most used buttons to control the device from the right menu
- and many more!

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
