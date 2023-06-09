# Windowed ChatGPT with auto focus

Windowed ChatGPT is an app that enhances the ChatGPT experience by wrapping it in a tab-able window. In addition to the
base functionality of ChatGPT, this app adds several enhancements detailed below including, full width code blocks, various shortcuts within the app to increase efficiency and a
global shortcut for quick access. The app also has auto-focus functionality on the prompt textbox to make input easier
and allow for better compatibility with Alfred workflows.

![image](https://user-images.githubusercontent.com/64414639/236674514-94d87c55-9a16-4556-b6b1-cb29528bb020.png)

# Installation

Download one of the following packages depending on your device and follow the steps below:

* [Windowed-ChatGPT.0.0.2.arm64.dmg](https://github.com/thomasyao15/windowed-chatgpt/releases/download/v0.0.2/ChatGPT.dmg) -
  for Apple Silicon Macs
* [Windowed-ChatGPT.0.0.1.x64.dmg](https://github.com/thomasyao15/windowed-chatgpt/releases/download/v0.0.1/Windowed-ChatGPT.0.0.1.x64.dmg) -
  for Intel-based Macs (not updated with wide screen mode or toggle sidebar)

**IMPORTANT:** the .dmg files have not been code signed, so please follow these steps to install the app:

1. Open the .dmg file and drag the app into the Applications folder
2. Try to open the application
3. When the 'broken file' prompt pops up, click **cancel**
4. Enter this command in terminal: `xattr -d com.apple.quarantine /Applications/ChatGPT.app`
5. Open the application

If it opens successfully, MacOS will trust the app from now on.

# Shortcuts

Supported shortcuts out of the box (use CMD for MacOS):

* CMD/CTRL + shift + g: show/hide all GPT windows
* CMD/CTRL + f: toggle full/wide chat mode to maximise the width of code blocks and messages
    * ![image](https://github.com/thomasyao15/windowed-chatgpt/assets/64414639/90445236-f0c2-4d04-836f-1949442b7764)
* CMD/CTRL + b: toggle side bar in mobile and desktop view
* CMD/CTRL + i: trigger focus on the input textbox
* CMD/CTRL + t: open a new GPT tab
* CMD/CTRL + w: close the current tab
* CMD/CTRL + n: open a new GPT window
* CMD/CTRL + ]: switch to the next tab
* CMD/CTRL + [: switch to the previous tab
* CMD/CTRL + r: reload the current tab

You can customise shortcuts specifically for this application using tools like [BetterTouchTool](https://folivora.ai/).

### Alfred shortcuts (installation instructions below)

* CMD + Opt + CTRL + a: **a**sk GPT anything about anything currently selected in MacOS
* CMD + Opt + CTRL + i: tell GPT to directly modify selected code and return it in a code block
    * ![image](https://github.com/thomasyao15/windowed-chatgpt/assets/64414639/3be76ae5-1464-4dc1-9477-ec18c3753d34)
* CMD + Opt + CTRL + c: trigger quick **c**hat to ask GPT anything from anywhere in the OS
* CMD + Opt + x: tell GPT to explain everything you need to know about the current selection in MacOS
* CMD + Opt + CTRL + x: tell GPT to explain everything you need to know about entered text
* CMD + Opt + A: append any MacOS text selection to the currently opened Obsidian file

# Alfred and Obsidian Integrations

![image](https://github.com/thomasyao15/windowed-chatgpt/assets/64414639/ed69cc96-a9a3-4160-9d95-96da15aaf8f2)


I wrote this app specifically to support some Alfred workflows I had in mind. Try them out here (keep in mind you need
the Alfred Powerpack):

* [Windowed-GPT.v0.0.2.alfredworkflow](https://github.com/thomasyao15/windowed-chatgpt/releases/download/v0.0.2/Windowed-GPT-0.0.2.alfredworkflow) -
  simply open the file and install on Alfred

In order for the Obsidian workflow to work, you need to manually install the Obsidian plugin here

* https://github.com/thomasyao15/obsidian-gpt-helper

### What does the workflow currently do?

- Use the keyword `ask` followed by a general ChatGPT prompt to automatically launch the ChatGPT app and submit the
  prompt
    - ![image](https://user-images.githubusercontent.com/64414639/236802293-c634ed5d-e4c9-4a2f-b8db-249e15007849.png)
- Use the keyword `tma` (teach me anything) followed by any content you want ChatGPT to comprehensively explain
    - This adds extra instructions in front of the content (auto prompt-engineering)
    - ![image](https://user-images.githubusercontent.com/64414639/236802563-6878b413-3cf9-46f6-983a-5859e5604504.png)
- Use the hotkey CMD + Option + X to launch tma on any highlighted text on MacOS
    - Super useful if you want to quickly learn deeply about any content you're reading, you can keep chaining `tma`
      prompts from within the Windowed ChatGPT app
- Use the hotkey CMD + Option + A to append any highlighted text in MacOS to the currently opened obsidian file (you
  must have the plugin mentioned above installed on Obsidian)
    - ![image](https://user-images.githubusercontent.com/64414639/236803081-b71d1e6a-f238-4b4c-89fa-f08dfc55b992.png)
    - This is useful if you learn anything new from `tma` or any other sources and want to quickly save the information
      to your Obsidian notes

Feel free to create your own triggers, add as many extra prompts to fit your needs, this app's prompt-auto-focus makes
it easy to input any custom prompts from workflows.

# Contributing

* When you are ready to package your changes, make sure the body of the initUpdater function in update-electron-app (
  node_modules) is commented out as it causes a code signing error when it tries to update on launch
* Run `npm run package-with-icon` to package the app with the icon
* Run `npm run make-dmg` to create the .dmg file

---

This app was inspired by the work of @vincelwt's chatgpt-mac, which formed the foundation of this app. All credit and
copyrights go to OpenAI and @vincelwt.
