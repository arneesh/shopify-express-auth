export default function redirectionScript({origin, redirectTo, apiKey}) {
    return `
    <script src="https://unpkg.com/@shopify/app-bridge@2"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        if (window.top === window.self) {
          window.location.href = "${redirectTo}";
        } else {
          var AppBridge = window["app-bridge"];
          var createApp = AppBridge.default;
          var Redirect = AppBridge.actions.Redirect;

          const app = createApp({
            apiKey: "${apiKey}",
            shopOrigin: "${encodeURI(origin)}",
          });

          const redirect = Redirect.create(app);

          redirect.dispatch(
            Redirect.Action.REMOTE,
            "${redirectTo}"
          );
        }
      });
    </script>
    `;
  }