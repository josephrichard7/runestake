'use strict';

// Configuring the Articles module
angular.module(ApplicationConfiguration.modules.bank)
.run([
	ApplicationConfiguration.services.menu,
	function(MenuSrv) {
		// Set top bar menu items
		// function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position)
		MenuSrv.addMenuItem('topbar', 'Bank', 'bank', 'dropdown', undefined, false, ['ADMIN'], 0);
		// function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position)
		MenuSrv.addSubMenuItem('topbar', 'bank', 'Edit Bank', 'editBank', undefined, false, ['ADMIN'], 0);
		MenuSrv.addSubMenuItem('topbar', 'bank', 'View Bank', 'viewBank', undefined, false, ['ADMIN'], 1);
		MenuSrv.addSubMenuItem('topbar', 'bank', 'Load Chips', 'loadChipsBank', undefined, false, ['ADMIN'], 2);
	}
]);