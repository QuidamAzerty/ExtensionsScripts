// ==UserScript==
// @name			Kobo - Select all button
// @description		Add a button to select all rewards of the page
// @namespace		misc
// @version			1.1
// @author			QuidamAzerty
// @match			https://www.kobo.com/*/promotionalreward/*
// @icon			https://static.kobo.com/1.0.0.0/Images/favicon/favicon.ico
// @grant			none
// ==/UserScript==

(function () {
	'use strict';

	const rewardClaimButton = document.getElementById('user-reward-claim-cta');
	const rewardClaimInput = document.getElementById('user-reward-claim-input');
	if (!rewardClaimButton || !rewardClaimInput) {
		return;
	}

	const selectAllButton = document.createElement('button');
	rewardClaimInput.parentNode.insertBefore(selectAllButton, rewardClaimInput);

	selectAllButton.type = 'button';
	selectAllButton.classList = rewardClaimButton.classList;
	selectAllButton.style.marginBottom = '10px';
	selectAllButton.textContent = 'Select All';
	selectAllButton.addEventListener('click', () => {
		document.querySelectorAll('.reward-selector').forEach(checkbox => checkbox.click());
		rewardClaimInput.focus();
		return false;
	});

})();
