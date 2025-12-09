function sendMessage(message) {
  const iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe) return;
  iframe.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
}

window.addEventListener("theme-change", (e) => {
  const darkStyle = window.giscusCssDark;
  const lightStyle = window.giscusCssLight;
  console.log(darkStyle);
  

  const giscus = document.getElementById("giscus");
  if (giscus) {
    giscus.dataset.theme = e.detail.theme === "dark" ? darkStyle : lightStyle;
  }
  sendMessage({
    setConfig: {
      theme: e.detail.theme === "dark" ? darkStyle : lightStyle,
    },
  });
});
