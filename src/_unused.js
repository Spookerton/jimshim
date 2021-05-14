
Object.defineProperties(globalThis, { //Shorthand DefineProperty/ies
	$def: { value: (object, key, value) => Object.defineProperty(object, key, { value: value }) },
	$$def: { value: (object, map) => Object.keys(map).forEach(key => $def(object, key, map[key])) },
})

$$def(globalThis, { //The above, but the values can be modified
	$var: { value: (object, key, value) => Object.defineProperty(object, key, { value: value, writable: true }) },
	$$var: { value: (object, map) => Object.keys(map).forEach(key => $var(object, key, map[key])) },
})

$$def(globalThis, { //Happy Tests

})

$$def(globalThis, { //Global Misc
	$o: (map) => Object.assign(Object.create(null), map),
	attempt: (handler, ...args) => { try { return handler(...args) } catch (error) { return error } },
	toJson: (object) => attempt(JSON.stringify, object),
	fromJson: (json) => attempt(JSON.parse, json),
})

$$def(Object.prototype, {
	$def: function(key, value) { $def(this, key, value); return this },
	$$def: function(map) { $$def(this, map); return this },
	asThis: function(handler, ...args) { handler.call(this, ...args); return this },
	entries: function() { return Object.entries(this) },
	mapEntries: function(handler) { return this.entries().map(handler) },
	forEntries: function(handler) { this.entries().forEach(handler); return this },
	keys: function() { return Object.keys(this) },
	mapKeys: function(handler) { return this.keys().map(handler) },
	forKeys: function(handler) { this.keys().forEach(handler); return this },
	values: function() { return Object.values(this) },
	mapValues: function(handler) { return this.values().map(handler) },
	forValues: function(handler) { this.values().forEach(handler); return this },
	assign: function(map) { return Object.assign(this, map) },
})

if (globalThis.EventTarget) $$def(EventTarget.prototype, {
	emit: function(event, data) { this.dispatchEvent(new Event(event).assign({ data: data })); return this },
	off: function(event, handler, options = {}) { this.removeEventListener(event, handler, options); return this },
	on: function(event, handler, options = {}) { this.addEventListener(event, handler, { passive: true, ...options }); return this },
	once: function(event, handler, options = {}) { return this.on(event, handler, { ...options, once: true }) },
})

if (globalThis.document) $$def(globalThis, {
	Ready: () => new Promise((resolve) => globalThis.once('DOMContentLoaded', resolve)),
	$: (query, parent = document) => isFunction(query) ? globalThis.once('DOMContentLoaded', query) : parent.querySelector(query),
	$$: (query, parent = document) => [...parent.querySelectorAll(query)],
	$html: (text) => {
		let virt = document.createElement('div')
		virt.innerHTML = text
		return [...virt.children]
	},
	$el: (descriptor, ...contents) => {
		let state = 0, tag = '', id = '', className = '', attributes = [], index
		for (let character in descriptor) {
			if (character === '#' && state < 1) state = 1
			else if (character === '.' && state < 2) state = 2
			else if (character === '&') (attributes[index = attributes.length] = ['', '']), (state = 3)
			else if (character === '=' && state === 3) state = 4
			else if (state === 0) tag += character
			else if (state === 1) id += character
			else if (state === 2) className += character
			else if (state === 3) attributes[index][0] += character
			else if (state === 4) attributes[index][1] += character
		}
		let element = document.createElement(tag).setId(id).setClass(className).setContents(...contents)
		for (let [key, value] of attributes)
			if (!key) continue
			else if (key === 'style')
				if (value) element.setStyle(value)
				else continue
			else if (key.startsWith('data-')) element.setData(key.slice(5), value || 'true')
			else element.setAttribute(key, value || 'true')
		return element
	},
})

if (globalThis.Element) $$def(Element.prototype, {
	$: function(query, handler) { return handler ? (handler.call(this, $(query, this)), this) : $(query, this) },
	$$: function(query, handler) { return handler ? (handler.call(this, $$(query, this)), this) : $$(query, this) },
	setAttr: function(key, value) { if (!value) this.removeAttribute(key); else this.setAttribute(key, value); return this },
	setId: function(id) { return !id ? this.removeAttribute('id') : ((this.id = id), this) },
	getId: function() { return this.id ?? '' },
	setClass: function(className) { return !className ? this.removeAttribute('class') : ((this.className = className), this) },
	getClass: function() { return this.className ?? '' },
	setStyle: function(css, value) { return !css ? this.removeAttribute('style') : value ? (this.style[css] = value) : ((this.style.cssText = css), this) },
	getStyle: function(name) { return !name ? this.style.cssText : this.style[name] },
	setData: function(key, value) { !value ? this.removeAttribute(`data-${key}`) : this.dataset[key] = value; return this },
	getData: function(key) { return !key ? this.dataset : this.dataset[key] ?? '' },
	setContents: function(...contents) { this.replaceChildren(...contents); return this },
	getContents: function() { return [...this.children] },
	mapContents: function(handler) { return this.getContents().map(handler) },
	forContents: function(handler) { this.getContents().forEach(handler); return this },
})

if (globalThis.fetch) $$def(globalThis, {
	fetchBlob: (...fetchArgs) => fetch(...fetchArgs).then(response => response.blob()).catch(error => error),
	fetchBuffer: (...fetchArgs) => fetch(...fetchArgs).then(response => response.arrayBuffer()).catch(error => error),
	fetchForm: (...fetchArgs) => fetch(...fetchArgs).then(response => response.formData()).catch(error => error),
	fetchJson: (...fetchArgs) => fetch(...fetchArgs).then(response => response.json()).catch(error => error),
	fetchText: (...fetchArgs) => fetch(...fetchArgs).then(response => response.text()).catch(error => error),
})

if (globalThis.WebSocket) $$def(WebSocket.prototype, {
	json: function(object) { this.send(toJson(object)); return this },
})
