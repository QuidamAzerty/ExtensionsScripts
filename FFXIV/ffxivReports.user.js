// ==UserScript==
// @name			FFLogs to XIVAnalysis link
// @description		Add on mentioned websites links to others
// @namespace		FFXIV
// @version			2.0
// @author			QuidamAzerty
// @match			https://*.fflogs.com/reports/*
// @grant			none
// @icon			https://assets.rpglogs.com/img/ff/favicon.png
// ==/UserScript==

(function () {
	'use strict';

	fflogsInit();
})();

function fflogsInit() {
	const xivAnalysisLink = document.createElement('a');
	xivAnalysisLink.id = 'xivAnalysisLink';
	xivAnalysisLink.classList.add('report-settings-btn');
	xivAnalysisLink.target = '_blank';
	xivAnalysisLink.rel = 'noopener';
	xivAnalysisLink.style.color = 'white';
	xivAnalysisLink.innerHTML = '<img src="https://xivanalysis.com/logo.png" width="14" alt="logo">To xivanalysis';
	xivAnalysisLink.setAttribute('data-base-href', 'https://xivanalysis.com/fflogs');

	listenToUrlChange(xivAnalysisLink);

	const reportSettingsBox = document.getElementById('report-settings-box');
	const reportInfoMenu = document.getElementById('report-info-menu');
	const otherBox = document.getElementsByClassName('report-bar-top-left-section')[0];

	const elementToAppendLink = reportSettingsBox
			? reportSettingsBox
			: (reportInfoMenu ? reportInfoMenu : otherBox);
	elementToAppendLink.after(xivAnalysisLink);
}

function listenToUrlChange(xivAnalysisLink) {
	const url = window.location.href;
	const fflogsUrlRegex = /^https:\/\/.*\.fflogs\.com\/reports\/(?<reportId>[^#/?]+)(.*fight=(?<fightIndex>\d+|last))?.*$/gm;
	const matches = fflogsUrlRegex.exec(url);

	const reportId = matches.groups.reportId;
	let fightIndex = matches.groups.fightIndex ?? null;
	if (fightIndex === 'last') {
		fightIndex = document.getElementsByClassName('fight-grid-cell-container').length;
	}

	ffLogsUpdateLinks(xivAnalysisLink, reportId, fightIndex);
	setTimeout(() => {listenToUrlChange(xivAnalysisLink)}, 500);
}

/**
 * @param {HTMLAnchorElement} link
 * @param {string} reportId
 * @param {int|null} fightIndex
 */
function ffLogsUpdateLinks(link, reportId, fightIndex = null) {
	const endOfLink = `${reportId}${fightIndex !== null ? `/${fightIndex}` : ''}`;
	link.href = `${link.getAttribute('data-base-href')}/${endOfLink}`;
}
