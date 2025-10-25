// ==UserScript==
// @name			Carsized - Extract dimensions
// @description		Add a button to extract dimensions
// @namespace		misc
// @version			1.0
// @author			QuidamAzerty
// @match			https://www.carsized.com/*
// @icon			https://www.carsized.com/images/favicon.ico
// @grant			none
// ==/UserScript==

const LABELS_TRANSLATIONS = {
	width: {
		fr: 'Largeur2',
		en: 'Width2',
	},
	widthWithMirrors: {
		fr: 'Largeur avec rétroviseurs',
		en: 'Width incl. mirrors',
	},
	height: {
		fr: 'Hauteur1',
		en: 'Height1',
	},
	length: {
		fr: 'Longueur',
		en: 'Length',
	},
	cars: {
		fr: 'voitures',
		en: 'cars',
	},
	compare: {
		fr: 'comparer',
		en: 'compare',
	}
};

(function () {
	'use strict';

	const snackbarStyle = document.createElement('style');
	snackbarStyle.textContent = `
		#snackbar {
			visibility: hidden;
			min-width: 250px;
			margin-left: -125px;
			background-color: #333;
			color: #fff;
			text-align: center;
			border-radius: 2px;
			padding: 16px;
			position: fixed;
			z-index: 1;
			left: 50%;
			bottom: 30px;
		}
		#snackbar.show {
			visibility: visible;
			animation: fadein 0.5s, fadeout 0.5s 2.5s;
		}
		@keyframes fadein {
			from {bottom: 0; opacity: 0;}
			to {bottom: 30px; opacity: 1;}
		}
		@keyframes fadeout {
			from {bottom: 30px; opacity: 1;}
			to {bottom: 0; opacity: 0;}
		}
	`;
	document.head.appendChild(snackbarStyle);

	const snackbar = document.createElement('div');
	snackbar.id = 'snackbar';
	document.body.appendChild(snackbar);

	const language = window.location.pathname.split('/')[1];
	if (!window.location.pathname.startsWith(`/${language}/${LABELS_TRANSLATIONS.cars[language]}/`)) {
		console.debug('Not on the cars page');
		return;
	}

	const isCompare = window.location.pathname.split('/')[3] === LABELS_TRANSLATIONS.compare[language];

	const extractDimensionsButton = document.createElement('button');
	extractDimensionsButton.innerHTML = 'Extract<br/>dimensions';
	extractDimensionsButton.addEventListener('click', function () {
		extractDimensions(language, 0);
	});

	const extractDimensionsButtonContainer = document.createElement('div');
	extractDimensionsButtonContainer.classList.add('contentmargin');
	extractDimensionsButtonContainer.style.marginTop = '10px'
	extractDimensionsButtonContainer.style.marginTop = '10px'
	extractDimensionsButtonContainer.style.display = 'flex';
	extractDimensionsButtonContainer.style.justifyContent = 'space-between';

	extractDimensionsButtonContainer.append(extractDimensionsButton);
	if (isCompare) {
		const extractDimensionsButton2 = document.createElement('button');
		extractDimensionsButton2.innerHTML = 'Extract<br/>dimensions';
		extractDimensionsButtonContainer.append(extractDimensionsButton2);
		extractDimensionsButton2.addEventListener('click', function () {
			extractDimensions(language, 2);
		});
	}

	const h2 = document.querySelector('h2');
	h2.parentElement.insertAdjacentElement('afterend', extractDimensionsButtonContainer);

})();

function showSnackbar(message) {
	const snackbar = document.getElementById('snackbar');
	snackbar.textContent = message;
	snackbar.className = 'show';
	setTimeout(() => snackbar.className = '', 3000);
}

function extractDimensions(language, indexTarget) {
	const dimensions = {};
	document.querySelectorAll('.contentmargin').forEach(contentMarginDiv => {
		const dMatrixTitleDivs = contentMarginDiv.querySelectorAll('.dmatrixtitle, .dmatrixtitlesup');
		if (!dMatrixTitleDivs || dMatrixTitleDivs.length === 0) {
			return;
		}
		const rowLabel = dMatrixTitleDivs[1].textContent;
		if (dMatrixTitleDivs.length !== 3) {
			return;
		}
		Object.entries(LABELS_TRANSLATIONS).forEach(([label, labelTranslations]) => {
			if (rowLabel === labelTranslations[language]) {
				const dimension = parseFloat(dMatrixTitleDivs[indexTarget].textContent.split(' ')[0]);
				dimensions[label] = isNaN(dimension) ? '?' : (dimension*10);
			}
		});
	});

	copyToClipboard(`${dimensions.length}\t${dimensions.width}\t${dimensions.widthWithMirrors}\t${dimensions.height}`);
}

function copyToClipboard(text) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).then(() => showSnackbar('Dimensions copied!'));
		return;
	}
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);
		ta.select();
		document.execCommand('copy');
		document.body.removeChild(ta);
		showSnackbar('Dimensions copied!');
	} catch (e) {
		console.error('Failed to copy:', e);
	}
}
