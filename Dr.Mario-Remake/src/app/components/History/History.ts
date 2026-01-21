(function (history: any) {
    let originalPushState = history.pushState;
    let originalReplaceState = history.replaceState;

    history.pushState = function (state: any) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
        }
        return originalPushState.apply(history, arguments);
    };

    history.replaceState = function (state: any) {
        if (typeof history.onreplacestate == "function") {
            history.onreplacestate({ state: state });
        }
        return originalReplaceState.apply(history, arguments);
    };
})(globalThis.history);

globalThis.onpopstate = function () {
    console.log('popstate fired');
}