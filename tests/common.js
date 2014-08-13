(function() {
    QUnit.test('basic template', function(assert) {
        var template = 'Hello World';
        var s = simplate(template)();
        assert.equal(s, template);
    });

    QUnit.test('with data (dotted style)', function(assert) {
        var s = simplate('Hello {%= $.name %}')({name: 'Bob'});
        assert.equal(s, 'Hello Bob');
    });

    QUnit.test('with data (dictionary style)', function(assert) {
        var s = simplate('Hello {%= $["name"] %}')({name: 'Bob'});
        assert.equal(s, 'Hello Bob');
    });

    QUnit.test('multi-line, with function call', function(assert) {
        var s = simplate(['Hello {%= $.name %}', '\n', 'How are you today {%= $.name.toUpperCase() %}'])({name: 'Bob'});
        assert.equal(s, 'Hello Bob\nHow are you today BOB');
    });

    QUnit.test('sub-template', function(assert) {
        var s = simplate(['Hello {%! $.sub %}'])({name: 'Bob', sub: simplate(['***{%= $.name %}***']) });
        assert.equal(s, 'Hello ***Bob***');
    });

    QUnit.test('sub-template explicit', function(assert) {
        var s = simplate(['Hello {%= $.sub({name: "Neo"}) %}'])({name: 'Bob', sub: simplate(['***{%= $.name %}***']) });
        assert.equal(s, 'Hello ***Neo***');
    });

    QUnit.test('loop', function(assert) {
        var s = simplate(['{% for (var i = 0; i < $.names.length; i++) { %}', 'Hello {%= $.names[i] %}\n', '{% } %}'])({names: ['Bob', 'Alice'] });
        assert.equal(s, 'Hello Bob\nHello Alice\n');
    });

    QUnit.test('encode output', function(assert) {
        var s = simplate('Hello {%: $.name %}')({name: 'Bob & Alice'});
        assert.equal(s, 'Hello Bob &amp; Alice');
    });

    QUnit.test('different tags', function(assert) {
        var s = simplate('Hello <%= $.name %>', {tags: {begin: '<%', end: '%>'} } )({name: 'Bob'});
        assert.equal(s, 'Hello Bob');
    });

    QUnit.test('conditional', function(assert) {
        var s = simplate('Hello {% if ($.name) { %}{%: $.name %}{% } else {%}{%: $.title %}{% } %}')({name: 'A Name', title: 'A Title'});
        assert.equal(s, 'Hello A Name');
    });

    QUnit.test('with container', function(assert) {
        var s = simplate('Hello {%: $.name %} at {%: $$.location %}')({name: 'Bob'}, {location: 'Home'});
        assert.equal(s, 'Hello Bob at Home');
    });

    QUnit.test('no cache option', function(assert) {
        var s = simplate('Hello {%: $.name %}', {cacheMarkup: false })({name: 'Bob'});
        assert.equal(s, 'Hello Bob');
    });
    
    QUnit.test('named import', function(assert) {
        var i = {'$format':{'upper': function(v) { return v.toUpperCase(); }}},
            s = simplate('Hello {%: $format.upper($.name) %}', {imports: i})({name: 'Bob'});
        assert.equal(s, 'Hello BOB');
    });
})();
