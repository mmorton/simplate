/*!
 * simplate-js v1.1
 * Copyright 2010, Michael Morton
 *
 * MIT Licensed - See LICENSE.txt
 */
(function(window, undefined) {
    var trimRE = /^\s+|\s+$/g,
        testRE = /(,)/,
        escQuoteRE = /'/g,
        escNewLineRE = /\n/g,
        entAmpRE = /&/g,
        entLtRE = /</g,
        entGtRE = />/g,
        entQuotRE = /"/g,
        cache = {},
        cacheRE = {},
        useCompatibleParser = ('is,ie'.split(testRE).length != 3),
        options = {
            cacheMarkup: true,
            tags: {
                begin: "{%",
                end: "%}"
            },
            allowWith: false
        };

    var mix = function(left, middle, right) {
        if (right) for (var rightProp in right) left[rightProp] = right[rightProp];
        if (middle) for (var middleProp in middle) left[middleProp] = middle[middleProp];
        return left;
    };

    var encode = function(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(entAmpRE, '&amp;')
            .replace(entLtRE, '&lt;')
            .replace(entGtRE, '&gt;')
            .replace(entQuotRE, '&quot;');
    };

    var escape = function(val) {
        return val
            .replace(escQuoteRE, '\\\'')
            .replace(escNewLineRE, '\\n');
    };

    var trim = function(val) {
        return val.replace(trimRE, '');
    };
        
    var parse = function(markup, o) {

        var tagBegin = o.tags.begin,
            tagEnd = o.tags.end,
            fragments = [],
            at = 0;

        if (!useCompatibleParser)
        {
            var key = tagBegin + tagEnd,
                regex = cacheRE[key] || (cacheRE[key] = new RegExp(tagBegin + '(.*?)' + tagEnd));
            
            fragments = markup.split(regex);
            return fragments;
        }

        var nextBegin = 0,
            nextEnd = 0,
            markers = [];

        while ((nextBegin = markup.indexOf(tagBegin, nextEnd)) != -1 &&
               (nextEnd = markup.indexOf(tagEnd, nextBegin)) != -1)
        {
            markers[markers.length] = nextBegin;
            markers[markers.length] = nextEnd;
        }

        for (var i = 0; i < markers.length; i++)
        {
            fragments[fragments.length] = markup.substr(at, markers[i] - at);
            at = markers[i] + ((i % 2) ? tagEnd.length : tagBegin.length);
        }

        fragments.push(markup.substr(at));

        return fragments;
    };

    var make = function(markup, o) {
        var mixedOptions, fragments, i, x, control, source, fn;

        mixedOptions = mix({}, o, options);

        if (markup.join) {
            markup = markup.join('');
        }

        if (mixedOptions.cacheMarkup && cache[markup]) {
            return cache[markup];
        }

        fragments = parse(markup, mixedOptions);

        /* code fragments */
        for (i = 1; i < fragments.length; i += 2)
        {
            if (fragments[i].length > 0)
            {
                control = fragments[i].charAt(0);
                source = fragments[i].substr(1);

                switch (control)
                {
                    case '=':
                        fragments[i] = '__results.push(' + source + ');';
                        break;
                    case ':':
                        fragments[i] = '__results.push(__simplate.encode(' + source + '));';
                        break;
                    case '!':
                        fragments[i] = '__results.push(' + trim(source) + '.apply(__data, __container));';
                        break;
                    default:
                        break;
                }
            }
        }

        for (x = 0; x < fragments.length; x += 2) {
            fragments[x] = '__results.push(\'' + escape(fragments[x]) + '\');';
        }

        fragments.unshift(
            'var __results = [], $ = __data, $$ = __container, __simplate = Simplate;',
            mixedOptions.allowWith ? 'with ($ || {}) {' : ''
        );

        fragments.push(
            mixedOptions.allowWith ? '}': '',
            'return __results.join(\'\');'
        );

        try
        {
            fn = new Function('__data, __container', fragments.join(''));
        }
        catch (e)
        {
            fn = function(values) { return e.message; };
        }

        if (mixedOptions.cacheMarkup) {
            cache[markup] = fn;
            return cache[markup];
        } else {
            return fn;
        }
    };

    var Simplate = function(markup, o) {
        this.fn = make(markup, o);
    };

    mix(Simplate, {
        options: options,
        encode: encode,
        make: make
    });

    mix(Simplate.prototype, {
        apply: function(data, container) {
            return this.fn.call(container || this, data, container || data);
        }
    });

    window.Simplate = Simplate;
})(window);