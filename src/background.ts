chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dist/home.html') });
});

//One of the more important things in the manifest file is the distinction between 
// browser action and page action. Typically, when creating an extension you 
// will want to use Browser action as I have in the third hash. The only 
// reason that I am using browser action is in order to make my icon (york.png) 
// clickable at all times. This will allow your extension to function on every page. 
// However, there are some times you may want to use page action. When using page action,
//  your extension icon will be grayed out if it is unavailable. For example, 
//  I use an extension called YouTube Playback Speed Control that allows me to
//   speed up YouTube videos. Since it is only applicable when I am on YouTube, 
//   it is grayed out when I am surfing the web otherwise.