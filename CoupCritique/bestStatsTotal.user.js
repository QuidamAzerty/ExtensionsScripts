// ==UserScript==
// @name			Best stats total
// @description		Display BST
// @namespace		http://tampermonkey.net/
// @version			1.2
// @author			QuidamAzerty
// @match			https://coupcritique.fr/*
// @icon			https://coupcritique.fr/favicon.ico
// @grant			none
// ==/UserScript==

const MAX_BST = 780;

(function () {
	'use strict';

	const mainDiv = document.querySelector('main');

	new MutationObserver(displayBst).observe(mainDiv, {
		attributes: true,
		childList: true,
		characterData: true,
	});
	displayBst();
})();

function displayBst() {
	if (!window.location.href.includes('https://coupcritique.fr/entity/pokemons/')) {
		return;
	}
	const tableStats = document.querySelector('.table-stat');
	if (!tableStats) {
		return;
	}

	let bst = 0;
	Array.from(tableStats.querySelectorAll('td.text-right')).forEach(td => {
		bst += parseInt(td.textContent);
	});

	const bstTr = document.createElement('tr');
	tableStats.append(bstTr);
	bstTr.style.borderTop = '1px grey solid';

	let color = 'blue'; // max
	if (bst < 780 / 3) {
		color = 'red';
	} else if (bst < 780 * (2 / 3)) {
		color = 'orange';
	} else if (bst !== MAX_BST) {
		color = 'green';
	}

	bstTr.innerHTML = `
		<th class="text-right" title="Base Stat Total">BST</th>
		<td class="text-right">${bst}</td>
		<td>
			<div class="progress">
				<div 
						class="progress-bar ${color}" 
						role="progressbar" 
						style="width: ${bst * 100 / MAX_BST - 10}%" 
						aria-valuenow="${bst}" 
						aria-valuemin="0" 
						aria-valuemax="200"
				></div>
			</div>
		</td>
	`;
}
