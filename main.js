// use this file in builds if /base is to be its own layer
require([
	'base/core/dcl',
	'base/core/behavior',
	'base/core/Base',
	'base/core/dom',
	'base/core/EventTree',
	'base/core/has',
	'base/core/lang',
	'base/core/logger',
	'base/core/mouse',
	'base/core/observable',
	'base/core/on',
	'base/core/Promise',
	'base/core/registry',
	'base/core/Store',
	'base/core/Widget',
	'base/core/xhr',
	
	'base/core/parser/main',
	'base/core/parser/parser-attributes',
	'base/core/parser/parser-observable',
	'base/core/parser/parser-reference',
	
	'base/ui/common/Menu',
	'base/ui/form/AutoComplete',
	'base/ui/form/Button',
	'base/ui/form/DropDown',
	
	'base/ui/grid/List',
	'base/ui/grid/Grid',
	
	'base/ui/views/manager',
	'base/ui/views/View'
	
]);