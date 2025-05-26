// ==UserScript==
// @name			Archidekt Cockatrice deck export
// @description		Export a deck on Archidekt for Cockatrice
// @namespace		MTG
// @version			1.0
// @author			QuidamAzerty
// @match			https://archidekt.com/decks/*
// @icon			https://archidekt.com/favicon.ico
// @grant			none
// ==/UserScript==

class MtgCard {
	/**
	 * @param {string} name
	 * @param {string} category
	 * @param {number} quantity
	 */
	constructor(name, category, quantity) {
		this.name = name;
		this.category = category;
		this.quantity = quantity;
	}
}

// TODO ONLY WORK IF STACKS MODE

const MAYBEBOARD_NAME = 'Maybeboard';
const SIDEBOARD_NAME = 'Sideboard';

(function () {
	'use strict';

	// Add copy button
	const buttonContainer = document.querySelector('[class*="deckHeader_primaryActions"]');
	const buttonClass = buttonContainer.querySelector('button').className;

	const copyButton = document.createElement('button');
	buttonContainer.append(copyButton);
	copyButton.className = buttonClass;
	copyButton.innerHTML = `
		<i aria-hidden="true" class="download icon"></i>
		Export deck for Cockatrice
	`;
	copyButton.addEventListener('click', () => {
		// Retrieve cards
		/** @type {Object<string, Object<string, MtgCard>>} */
		const cardsByCategoryByName = {};
		document.querySelectorAll('[class*="basicCard_image"]').forEach(img => {
			const wrapper = img.closest('[class*="deckCardWrapper_container"]');
			// Tokens do not have wrappers
			if (wrapper) {
				const card = new MtgCard(
					img.title,
					wrapper.closest('[class*="stackWrapper_container"]').querySelector('[class*="stackHeader_container"] [class*="stackHeader_title"]').textContent,
					parseInt(wrapper.querySelector('[class*="cornerQuantity_cornerQuantity"]').textContent),
				);
				if (!cardsByCategoryByName[card.category]) {
					cardsByCategoryByName[card.category] = {};
				}
				cardsByCategoryByName[card.category][card.name] = card;
			}
		});

		// Retrieve deck data
		const descriptionParts = new Set();
		const descriptionContainer = document.querySelector('[class*="descriptionContainer_container"] .ql-editor');
		if (descriptionContainer) {
			descriptionContainer.querySelectorAll('*').forEach(element => {
				if (element.textContent) {
					descriptionParts.add(element.textContent);
				}
			});
		}

		const exportParts = [
			'// ' + document.querySelector('[class*="deckHeader_deckName"]').textContent,
			'',
		];
		descriptionParts.values().forEach(part => {
			exportParts.push(`// ${part}`);
		});

		// Maindeck
		exportParts.push('', '// Maindeck');
		Object.entries(cardsByCategoryByName).forEach(([category, cardsByName]) => {
			if (category === MAYBEBOARD_NAME || category === SIDEBOARD_NAME) {
				return;
			}
			exportParts.push(
				`// ${category}`,
				...Object.values(cardsByName).map(card => `${card.quantity} ${card.name}`),
			);
		});

		if (cardsByCategoryByName[SIDEBOARD_NAME]) {
			exportParts.push(
				'',
				`// ${SIDEBOARD_NAME}`,
				...Object.values(cardsByCategoryByName[SIDEBOARD_NAME]).map(card => `${card.quantity} ${card.name}`),
			);
		}

		// And copy !
		navigator.clipboard.writeText(exportParts.join('\n'));

		alert('Deck exported !');
	});

})();
