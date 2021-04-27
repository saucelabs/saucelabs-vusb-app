# Contributing to Virtual USB GUI

**Thank you for your interest in the Sauce Labs Virtual USB GUI. Your contributions are highly welcome.**

There are multiple ways of getting involved:

- [Report a bug](#report-a-bug) 
- [Suggest a feature](#suggest-a-feature) 
- [Contribute code](#contribute-code) 

Below are a few guidelines we would like you to follow.
If you need help, please reach out to us by opening an issue.

## Report a bug 
Reporting bugs is one of the best ways to contribute. Before creating a bug report, please check that an 
[issue](https://github.com/wswebcreation/saucelabs-vusb-gui/issues) reporting the same problem does not already exist. If there is such an issue, you may add your
information as a comment.

To report a new bug you should open an issue that summarizes the bug and set the label to "bug".

If you want to provide a fix along with your bug report: That is great! In this case please send us a pull request as 
described in section [Contribute Code](#contribute-code).

## Suggest a feature
To request a new feature you should open an [issue](https://github.com/wswebcreation/saucelabs-vusb-gui/issues) and 
summarize the desired functionality and its use case. Set the issue label to "feature".  

## Contribute code
> **NOTE:** Make sure you have private devices assigned to your account.

If you want to fix a bug, then first check the list of open 
[issues](https://github.com/wswebcreation/saucelabs-vusb-gui/issues). Either assign an existing issue to yourself, or 
create a new one that you would like work on and discuss your ideas and use cases. 

It is always best to discuss your plans beforehand, to ensure that your contribution is in line with our goals.

- Regardless of the platform you are working on, you will need to have Node.js v14+ installed. You might want to use 
  [Node Version Manager](https://github.com/creationix/nvm) to be able to switch between the Node.js versions.
- Fork the repository on GitHub

> **NOTE:** You need to use yarn to be able to work on this project. Information no how to install yarn can be found
> [here](https://classic.yarnpkg.com/en/docs/install/#mac-stable).

- Create a topic branch from where you want to base your work. This is usually `main`.
- Install all dependencies by using `yarn install` from the root of the project.
- Start the development server by using the command `yarn dev`, this will open up the vUSB GUI and the Chrome DevTools
  window which you can use to debug your code.
- Open a new pull request, label it `work in progress` and outline what you will be contributing

> **NOTE**: We are currently working on adding Unit Tests to the code. Please add a logical unit test that would verify
> that the code is working.

- Make commits of logical units.
- Make sure you sign-off on your commits `git commit -s -m "adding X to change Y"` 
- Write good commit messages (see below).
- Push your changes to a topic branch in your fork of the repository.
- As you push your changes, update the pull request with new information and tasks as you complete them
- Project maintainers might comment on your work as you progress
- When you are done, remove the `work in progess` label and ping the maintainers for a review
- Your pull request must receive a :thumbsup: from two [maintainers](../MAINTAINERS)

Thanks for your contributions!

### Commit messages
Your commit messages ideally can answer two questions: what changed and why. The subject line should feature the 
“what” and the body of the commit should describe the “why”.  

When creating a pull request, its description should reference the corresponding issue id.

### Sign your work / Developer certificate of origin
All contributions (including pull requests) must agree to the Developer Certificate of Origin (DCO) version 1.1. This is 
exactly the same one created and used by the Linux kernel developers and posted on http://developercertificate.org/. 
This is a developer's certification that he or she has the right to submit the patch for inclusion into the project. Simply submitting a contribution implies this agreement, however, please include a "Signed-off-by" tag in every patch (this tag is a conventional way to confirm that you agree to the DCO) - you can automate this with a [Git hook](https://stackoverflow.com/questions/15015894/git-add-signed-off-by-line-using-format-signoff-not-working)

```
git commit -s -m "adding X to change Y"
```

## Create release
This GUI can be build for three platforms, we have Mac OSX, Linux and Windows. Use the following commands to create a 
release for one of them.

### Mac OSX
Run `yarn package`. This will create all needed files in the [release](../release/)-folder.

### Linux
Run `yarn package-linux`. This will create all needed files in the [release](../release/)-folder.

### Windows
Run `yarn package-win`. This will create all needed files in the [release](../release/)-folder.

### Upgrade the versions-file
When a new version has been released the [`versions.json`](../versions.json)-file needs to be updated so people older 
versions of the GUI can notify the users if there is a new update or if the GUI has been deprecated due to a breaking
change.

**Have fun, and happy hacking!**
