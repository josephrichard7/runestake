'use strict';

// Configuring the Articles module
angular.module(ApplicationConfiguration.modules.transaction)
.run([
	ApplicationConfiguration.services.menu,
	function(MenuSrv) {
		// Set top bar menu items
		// function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position)
		MenuSrv.addMenuItem('topbar', 'Transactions', 'transaction', 'dropdown', undefined, false, ['ADMIN'], 0);
		// function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position)
		MenuSrv.addSubMenuItem('topbar', 'transaction', 'List Transactions', 'listTransaction', undefined, false, undefined, 0);
	}
]);