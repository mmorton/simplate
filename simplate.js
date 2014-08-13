/*!
 * simplate v2.0
 * Copyright 2013, Michael Morton
 *
 * MIT Licensed - See LICENSE.txt
 */

//noinspection ThisExpressionReferencesGlobalObjectJS,JSCheckFunctionSignatures
(function(scope, empty) {
    var testRE = /(,)/,
        fragmentQuoteRE = /'/g,
        fragmentLineRE = /\n/g,
        cache = {},
        cacheRE = {},
        useCompatibleParser = ('is,ie'.split(testRE).length != 3),
        globalOptions = {
            cacheMarkup: true,
            tags: {
                begin: "{%",
                end: "%}"
            }
        };

    function mixin(into, a, b) {
        var prop;

        if (a) for (prop in a) into[prop] = a[prop];
        if (b) for (prop in b) into[prop] = b[prop];

        return into;
    }

    function merge(optionsA, optionsB) {
        var options;

        options = mixin({}, optionsA, optionsB);
        options.tags = mixin({}, optionsA && optionsA.tags, optionsB && optionsB.tags);
        options.imports = mixin({}, optionsA && optionsA.imports, optionsB && optionsB.imports);

        return options;
    }

    function quoteStaticFragment(fragment) {
        return "'" + fragment.replace(fragmentQuoteRE, "\\'").replace(fragmentLineRE, "\\n") + "'";
    }

    function parse(markup, options) {

        var tagBegin = options.tags.begin,
            tagEnd = options.tags.end,
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
    }

    var make = function(markup, options) {
        if (typeof markup === 'object' && markup.length === empty) return (globalOptions = merge(globalOptions, markup));

        var fragments, i, x, control, source, fn;

        options = merge(globalOptions, options);

        if (markup.join) markup = markup.join('');

        if (options.cacheMarkup && cache[markup]) return cache[markup];

        fragments = parse(markup, options);

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
                        fragments[i] = '__expression = (' + source + '); (__expression !== null && typeof __expression !== "undefined") && __results.push(__expression.toString());';
                        break;
                    case ':':
                        fragments[i] = '__expression = (' + source + '); (__expression !== null && typeof __expression !== "undefined") && __results.push(__encode(__expression));';
                        break;
                    case '!':
                        fragments[i] = '__expression = (' + source + '); (__expression !== null && typeof __expression !== "undefined")  && __results.push(__expression($, $$));';
                        break;
                    default:
                        break;
                }
            }
        }

        /* static fragments */
        for (x = 0; x < fragments.length; x += 2) {
            fragments[x] = '__results.push(' + quoteStaticFragment(fragments[x]) + ');';
        }

        fragments.unshift(
            'var __encodeAmpRE = /&/g, __encodeLtRE = /</g, __encodeGtRE = />/g, __encodeQuotRE = /"/g;',
            'var __encode = function(value) { return (value !== null && typeof value !== "undefined") ? value.toString().replace(__encodeAmpRE, "&amp;").replace(__encodeLtRE, "&lt;").replace(__encodeGtRE, "&gt;").replace(__encodeQuotRE, "&quot;") : ""; };',
            'var __expression, __results = [], $ = arguments[0], $$ = arguments[1] || arguments[0];'
        );

        fragments.push(
            'return __results.join("");'
        );

        var imports = options.imports,
            importParams = [],
            importValues = [];

        if (imports) for (var name in imports) importParams.push(name), importValues.push(imports[name]);

        if (importParams.length > 0)
        {
            fragments.unshift(
                'return function() {'
            );

            fragments.push(
                '};'
            );

            fn = (Function.apply(null, importParams.concat(fragments.join('')))).apply(null, importValues);
        }
        else
        {
            fn = new Function(fragments.join(''));
        }

        return options.cacheMarkup ? (cache[markup] = fn) : fn;
    };

    make.options = globalOptions;

    //noinspection JSUnresolvedVariable
    if (typeof module != 'undefined' && module.exports)
    {
        //noinspection JSUnresolvedVariable
        module.exports = make;
    }
    else if (typeof define == 'function' && typeof define.amd == 'object')
    {
        //noinspection JSValidateTypes
        define(function() { return make; });
    }
    else
    {
        scope.simplate = make;
    }

})(this);