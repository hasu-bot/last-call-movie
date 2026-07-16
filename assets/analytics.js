// GA4 計測ID: Google Analytics でプロパティ発行後、下記を書き換える
window.GA_MEASUREMENT_ID = "G-L47MTFS257";

(function () {
  var id = window.GA_MEASUREMENT_ID;
  if (!id || id === "G-XXXXXXXXXX") return; // プレースホルダーのままなら発火しない

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id);
})();
