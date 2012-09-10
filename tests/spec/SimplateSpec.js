describe('Simplate', function() {
	beforeEach(function() {

	});

	it('basic template', function () {
		var template = '<h1>Hello World</h1>';
		var s = new Simplate(template).apply();
		expect(s).toBe(template);
	});

	it('with data - alternate syntax', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate(template).apply({name: 'Bob'});
		expect(s).toBe('<h1>Hello Bob</h1>');
	});

	it('multi-line, with function call', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate(['<h1>Hello {%= $.name %}</h1>', '<h2>How are you today {%= $.name.toUpperCase() %}</h2>']).apply({name: 'Bob'});
		expect(s).toBe('<h1>Hello Bob</h1><h2>How are you today BOB</h2>');
	});

	it('sub-template', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate(['<h1>Hello {%! $.format %}</h1>']).apply({name: 'Bob', format: new Simplate(['***{%= $.name %}***']) });
		expect(s).toBe('<h1>Hello ***Bob***</h1>');
	});

	it('sub-template explicit', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate(['<h1>Hello {%= $.format.apply({name: "Neo"}) %}</h1>']).apply({name: 'Bob', format: new Simplate(['***{%= $.name %}***']) });
		expect(s).toBe('<h1>Hello ***Neo***</h1>');
	});

	it('loop', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate(['{% for (var i = 0; i < $.names.length; i++) { %}', '<h1>Hello {%= $.names[i] %}</h1>', '{% } %}']).apply({names: ['Bob', 'Alice'] });
		expect(s).toBe('<h1>Hello Bob</h1><h1>Hello Alice</h1>');
	});

	it('encode output', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate('<h1>Hello {%: $.name %}</h1>').apply({name: 'Bob & Alice'});
		expect(s).toBe('<h1>Hello Bob &amp; Alice</h1>');
	});

	it('switch tags (local)', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate('<h1>Hello <%= $.name %></h1>', {tags: {begin: '<%', end: '%>'} } ).apply({name: 'Bob'});
		expect(s).toBe('<h1>Hello Bob</h1>');
	});

	it('conditional', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate('<h1>Hello {% if ($.name) { %}{%: $.name %}{% } else {%}{%: $.title %}{% } %}</h1>').apply({name: 'A Name', title: 'A Title'});
		expect(s).toBe('<h1>Hello A Name</h1>');
	});

	it('with container', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate('<h1>Hello {%: $.name %} at {%: $$.location %}</h1>').apply({name: 'Bob'}, {location: 'Home'});
		expect(s).toBe('<h1>Hello Bob at Home</h1>');
	});

	it('with container (this)', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = new Simplate('<h1>Hello {%: $.name %} at {%: this.location %}</h1>').apply({name: 'Bob'}, { location: 'Home'});
		expect(s).toBe('<h1>Hello Bob at Home</h1>');
	});

	it('make', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = Simplate.make('<h1>Hello {%: $.name %}</h1>')({name: 'Bob'});

		expect(s).toBe('<h1>Hello Bob</h1>');
	});

	it('No cache option', function () {
		var template = '<h1>Hello {%= $["name"] %}</h1>';
		var s = Simplate.make('<h1>Hello {%: $.name %}</h1>', {cacheMarkup: false })({name: 'Bob'});
		expect(s).toBe('<h1>Hello Bob</h1>');
	});
});