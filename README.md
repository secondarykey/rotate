# Rotate

"Rotate" is an application that captures and rotates the screen.

I made this because I found out that windows can't be rotated.

## Install

Please unzip the zip file on the release page.

## How to use

Launch "rotate.exe"

### Show Menu

Place the mouse cursor on the top of the screen to display the menu.

![Menu](/docs/images/menu.png)

### Select a screen

When you press the display selection button, a list of currently active screens will be displayed.

![Select](/docs/images/select.webp)

### Screen Display

Select a screen to display it.
The screens will be resized to the same size.

![Capture](/docs/images/capture.webp)

### Rotate

Use the rotate button to rotate the screen.
It can be adjusted to 90, 30, 10, or 5 degrees.
90 will always be 90, 180, 270, 360 degrees.

![Rotate](/docs/images/rotate.webp)

### Edit Mode(Green)

In edit mode, you can move and zoom the screen.

![Edit](/docs/images/edit.webp)

Change the window size and other settings to create the screen you want.

### Always top(Green)

I set it to always be displayed in the foreground.

![Top](/docs/images/top.webp)

## Development

- Go
- Wails(React)

Since Wails runs in the browser, it simply uses the MediaDeviceAPI for capture.

Currently it is only released for Windows, but I think it can be built for Mac and Linux, so if you write an issue they may be able to handle it.

