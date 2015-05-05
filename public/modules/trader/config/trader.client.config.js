'use strict';

// Configuring the Articles module
angular.module(ApplicationConfiguration.modules.trader)
.run([
	ApplicationConfiguration.services.menu,
	function(MenuSrv) {
		// Set top bar menu items
		// function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position)
		MenuSrv.addMenuItem('topbar', 'Trader', 'trader', 'dropdown', undefined, false, ['ADMIN'], 0);
		// function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position)
		MenuSrv.addSubMenuItem('topbar', 'trader', 'New Trader', 'createTrader', undefined, false, undefined, 0);
		MenuSrv.addSubMenuItem('topbar', 'trader', 'List Trader', 'listTrader', undefined, false, undefined, 1);
	}
]);