// ==UserScript==
// @name			The Old School page loader
// @description		Display loader and lock ui on page change
// @namespace		TheOldSchool
// @version			1.0
// @author			QuidamAzerty
// @match			https://theoldschool.cc/torrents*
// @grant			none
// ==/UserScript==

(function () {
	'use strict';

	const style = document.createElement('style');
	style.textContent = `
		.tos-loader-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 999999;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: wait;
		}

		.tos-loader-spinner {
			border: 12px solid #f3f3f3;
			border-top: 12px solid #3498db;
			border-radius: 50%;
			width: 80px;
			height: 80px;
			animation: tos-spin 1.5s linear infinite;
		}

		@keyframes tos-spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
	`;
	document.head.appendChild(style);

	let overlay = null;

	function showLoader() {
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.className = 'tos-loader-overlay';
			const spinner = document.createElement('div');
			spinner.className = 'tos-loader-spinner';
			overlay.appendChild(spinner);
		}
		if (!document.body.contains(overlay)) {
			document.body.appendChild(overlay);
		}
	}

	function hideLoader() {
		if (overlay && overlay.parentNode) {
			overlay.parentNode.removeChild(overlay);
		}
	}

	document.addEventListener('click', (event) => {
		const paginationElement = event.target.closest('.pagination__link, [wire\\:click*="gotoPage"], [wire\\:click*="previousPage"], [wire\\:click*="nextPage"], .pagination a, .pagination button');
		if (paginationElement) {
			showLoader();
		}
	});

	function initLivewireHooks() {
		if (window.Livewire && window.Livewire.hook) {
			try {
				// Livewire v2
				window.Livewire.hook('message.processed', () => hideLoader());
				window.Livewire.hook('message.failed', () => hideLoader());
			} catch (e) {
				// ignore
			}
			try {
				// Livewire v3
				window.Livewire.hook('commit', ({ succeed, fail }) => {
					succeed(() => hideLoader());
					fail(() => hideLoader());
				});
			} catch (e) {
				// ignore
			}
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initLivewireHooks);
	} else {
		initLivewireHooks();
	}
	document.addEventListener('livewire:load', initLivewireHooks);
	document.addEventListener('livewire:navigated', hideLoader);
})();
