import React from "react";

import { WebView } from "react-native-webview";

const PrivacyPolicy = () => {
  return (
    <WebView
      originWhitelist={["*"]}
      containerStyle={{
        paddingHorizontal: 15,
        paddingTop: 70,
        paddingBottom: 30,
        backgroundColor: "#fff",
      }}
      textZoom={250}
      source={{
        html: `
      <div name="termly-embed"   data-id="4de9b8d7-4db9-4e9a-89c2-f7cdfbeaf2b9"></div>
      <script type="text/javascript">
      (function(d, s, id) {
        var js, tjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://app.termly.io/embed-policy.min.js";
        tjs.parentNode.insertBefore(js, tjs);
      }(document, 'script', 'termly-jssdk'));
      </script>
    `,
      }}
    />
  );
};

export default PrivacyPolicy;
