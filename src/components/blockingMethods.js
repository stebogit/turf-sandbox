// https://github.com/jsbin/jsbin/wiki/Best-practices-for-building-your-own-live-paste-bin

// https://github.com/jsbin/jsbin/blob/94875bf6ef2244e021c17594a2ade302bef9a5c2/public/js/runner/processor.js#L10

const BlockingMethods = {
    kill: function () {
        window.__blocked = {
            methods: ['open', 'print', 'alert', 'prompt', 'confirm'],
            old: {},
        };
        for (let m of window.__blocked.methods) {
            try {
                window.__blocked.old[m] = window[m];
                window[m] = function () {/* noop */};
            } catch (e) {}
        }
    },
    restore: function () {
        for (let m of window.__blocked.methods) {
            try {
                window[m] = window.__blocked.old[m];
            } catch (e) {}
        }
        delete window.__blocked;
    },
};

export default BlockingMethods;
