// ==UserScript==
// @name			Kobo - Select all button
// @description		Add a button to select all rewards of the page
// @namespace		misc
// @version			1.0
// @author			QuidamAzerty
// @match			https://www.kobo.com/*/promotionalreward/*
// @grant			none
// ==/UserScript==

(function () {
	'use strict';

	const rewardClaimButton = document.getElementById('user-reward-claim-cta');
	if (!rewardClaimButton) {
		return;
	}

	const selectAllButton = document.createElement('button');
	rewardClaimButton.parentNode.insertBefore(selectAllButton, rewardClaimButton);

	selectAllButton.type = 'button';
	selectAllButton.classList = rewardClaimButton.classList;
	selectAllButton.style.marginBottom = '10px';
	selectAllButton.textContent = 'Select All';
	selectAllButton.addEventListener('click', () => {
		document.querySelectorAll('.reward-selector').forEach(checkbox => checkbox.click());
		document.getElementById('user-reward-claim-input').focus();
		return false;
	});

})();
