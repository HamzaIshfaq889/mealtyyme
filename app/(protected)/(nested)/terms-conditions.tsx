import React from "react";

import { WebView } from "react-native-webview";

const TermConditions = () => {
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
   <div name="termly-embed" data-id="39d2952d-eb8f-4d0e-8d58-aeae493e18ae"></div>
<script type="text/javascript">(function(d, s, id) {
  var js, tjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://app.termly.io/embed-policy.min.js";
  tjs.parentNode.insertBefore(js, tjs);
}(document, 'script', 'termly-jssdk'));</script>
    `,
      }}
    />
  );
};

export default TermConditions;
