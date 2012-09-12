Simplate
========
### A simple but powerful templating engine for javascript.


# Usages

basic

	var template = '<h1>Hello World</h1>';
	var results = new Simplate(template).apply();
	
value of results

	'<h1>Hello World</h1>'
	
***
	
basic with data

	var template = '<h1>Hello {%= $.name %}</h1>';
	var results = new Simplate(template).apply({name: 'Bob'});
	
value of results

	'<h1>Hello Bob</h1>'

***
	
basic with data - alternate syntax

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate(template).apply({name: 'Bob'});
	
value of results

	'<h1>Hello Bob</h1>'

***
	
multi-line, with function call

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate(['<h1>Hello {%= $.name %}</h1>', '<h2>How are you today {%= $.name.toUpperCase() %}</h2>']).apply({name: 'Bob'});
	
value of results

	'<h1>Hello Bob</h1><h2>How are you today BOB</h2>'

***
	
sub-template

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate(['<h1>Hello {%! $.format %}</h1>']).apply({name: 'Bob', format: new Simplate(['***{%= $.name %}***']) });
	
value of results

	'<h1>Hello ***Bob***</h1>'

***
	
sub-template explicit

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate(['<h1>Hello {%= $.format.apply({name: "Neo"}) %}</h1>']).apply({name: 'Bob', format: new Simplate(['***{%= $.name %}***']) });
	
value of results

	'<h1>Hello ***Neo***</h1>'

***
	
loop

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate(['{% for (var i = 0; i < $.names.length; i++) { %}', '<h1>Hello {%= $.names[i] %}</h1>', '{% } %}']).apply({names: ['Bob', 'Alice'] });
	
value of results

	'<h1>Hello Bob</h1><h1>Hello Alice</h1>'

***
	
encode output

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate('<h1>Hello {%: $.name %}</h1>').apply({name: 'Bob & Alice'});
	
value of results

	'<h1>Hello Bob &amp; Alice</h1>'

***
	
switch tags (local)

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate('<h1>Hello <%= $.name %></h1>', {tags: {begin: '<%', end: '%>'} } ).apply({name: 'Bob'});
	
value of results

	'<h1>Hello Bob</h1>'

***
	
conditional

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate('<h1>Hello {% if ($.name) { %}{%: $.name %}{% } else {%}{%: $.title %}{% } %}</h1>').apply({name: 'A Name', title: 'A Title'});
	
value of results

	'<h1>Hello A Name</h1>'

***
	
with container

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate('<h1>Hello {%: $.name %} at {%: $$.location %}</h1>').apply({name: 'Bob'}, {location: 'Home'});
	
value of results

	'<h1>Hello Bob at Home</h1>'

***
	
with container (this)

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = new Simplate('<h1>Hello {%: $.name %} at {%: this.location %}</h1>').apply({name: 'Bob'}, { location: 'Home'});
	
value of results

	'<h1>Hello Bob at Home</h1>'

***
	
make

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = Simplate.make('<h1>Hello {%: $.name %}</h1>')({name: 'Bob'});
	
value of results

	'<h1>Hello Bob</h1>'

***
	
No cache option

	var template = '<h1>Hello {%= $["name"] %}</h1>';
	var results = Simplate.make('<h1>Hello {%: $.name %}</h1>', {cacheMarkup: false })({name: 'Bob'});
	
value of results

	'<h1>Hello Bob</h1>'