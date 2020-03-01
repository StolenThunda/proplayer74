
class ProPlayerFavoritesManager {
	constructor(parentDivID) {
		this.n_PackageID = 0;
		this.str_FavoritesListWrapperID = "#" + parentDivID;
		this.b_CommentsLoadedOnce = false;
		this.b_FilterComments = false;
		this.b_FavoritesLoadedOnce = false;
		this.b_Initialized = false;
		this.str_ReloadPath = gc_BranchPath + '/--ajax-load-favorites-list/';
		this.reset = function () {
			this.n_PackageID = 0;
			this.b_CommentsLoadedOnce = false;
			this.b_FilterComments = false;
			this.b_FavoritesLoadedOnce = false;
			this.b_Initialized = false;
			$(this.str_FavoritesListWrapperID).empty();
			$('#favListEmpty').text("Favorites have not been loaded.");
			$('#favListEmpty').toggle(true);
		};
		this.setNewPackageID = function (nPackageID) {
			this.reset();
			this.n_PackageID = nPackageID;
		};
		this.clearFavorites = function () {
			$(this.str_FavoritesListWrapperID).empty();
		};
		this.fullRefresh = function () {
			this.clearFavorites();
			thePlayer.spinner(this.str_FavoritesListWrapperID);
			this.reloadFavorites();
		};
		this.reloadFavorites = function () {
			//console.log('Reloading favorites, packageID: ' + this.n_PackageID);
			var reloadPath = this.str_ReloadPath;
			if (this.n_PackageID != '0') {
				reloadPath += this.n_PackageID;
			}
			$(this.str_FavoritesListWrapperID).load(reloadPath, function () {
				thePlayer.favoritesManager.finishedReloadingFavorites();
			});
		};
		this.finishedReloadingFavorites = function () {
			if ($(this.str_FavoritesListWrapperID).children().length == 0) {
				$('#favListEmpty').text("You have not saved any favorites.");
				$('#favListEmpty').toggle(true);
			}
			else {
				$('#favListEmpty').toggle(false);
				if (this.n_PackageID == '0') {
					$('#favthis-button').toggle(false);
				}
				else {
					$('#favthis-button').toggle(true);
					$('#favthis-button').load(gc_BranchPath + '/--ajax-load-favorite-this-button/' + thePlayer.favoritesManager.n_PackageID);
				}
			}
			this.b_FavoritesLoadedOnce = true;
		};
		this.removeFavoriteFromList = function (sender) {
			var formID = $(sender).closest('form.submitFavoriteForm');
			var courseID = $(formID).attr('data-id');
			var formData = $(formID).serialize();
			//this.clearFavorites();
			//thePlayer.spinner(this.str_FavoritesListWrapperID);
			var parentItem = $(sender).closest('li.sidebar-list-item');
			$(parentItem).toggleClass('deleting', true);
			$.ajax({
				type: 'POST',
				url: $(formID).attr('action'),
				data: formData,
				context: sender
			})
				.done(function (response) {
					var parentItem = $(this).closest('li.sidebar-list-item');
					var parentList = $(this).closest('ul.sidebar-list');
					if ($(parentList).children().length == 1) {
						//console.log("Empty accordion item found.");
						parentAccordion = $(this).closest('li.accordion-item');
						$(parentAccordion).fadeOut(400, function () {
							$(this).remove();
						});
					}
					else {
						$(parentItem).fadeOut(400, function () {
							$(this).remove();
						});
					}
					thePlayer.favoritesManager.finishedReloadingFavorites();
				});
		};
		this.addFavoriteToList = function (sender) {
			var formID = $(sender).closest('form.submitFavoriteForm');
			var courseID = $(formID).attr('data-id');
			var formData = $(formID).serialize();
			$(sender).toggle(false);
			this.clearFavorites();
			thePlayer.spinner(this.str_FavoritesListWrapperID);
			$.ajax({
				type: 'POST',
				url: $(formID).attr('action'),
				data: formData
			})
				.done(function (response) {
					thePlayer.favoritesManager.reloadFavorites();
				});
		};
	}
}
