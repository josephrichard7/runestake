'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain).run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Trader', 'trader', 'dropdown', '/trader(/create)?', false, ['ADMIN']);
		// Menus.addSubMenuItem('topbar', 'trader', 'List Trader', 'traders');
		// Menus.addSubMenuItem('topbar', 'trader', 'New Trader', 'trader/create');
	}
]);