// ==UserScript==
// @name			FFLogs & XIVAnalysis links
// @description		Add on mentioned websites links to others
// @namespace		FFXIV
// @version			1.0
// @author			QuidamAzerty
// @match			https://*.fflogs.com/reports/*
// @grant			none
// @icon			https://assets.rpglogs.com/img/ff/favicon.png
// ==/UserScript==

const FFLOGS_XIV_ANALYSIS_LINK_ID = 'xivAnalysisLink';

const FFLOGS_URL_REPORT_REGEX = /^https:\/\/.*\.fflogs\.com\/reports\/([^#/]+)(.*fight=([^&]+))?.*$/gm;
const FFLOGS_ONMOUSEDOWN_FUNCTION_REGEX = /^changeFightByIDAndIndex\((\d+).*\)$/gm;

let fflogsLastFightIndex = null;

(function () {
	'use strict';

	(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

	function check(changes, observer) {
		if(document.getElementsByClassName('last-pull-label').length > 0) {
			observer.disconnect();
			fflogsInit();
		}
	}
})();

function fflogsInit() {
	const url = window.location.href;
	const matches = FFLOGS_URL_REPORT_REGEX.exec(url);
	const reportId = matches[1];
	let fightIndex = matches[3] ? parseInt(matches[3]) : null;

	if (fightIndex !== null && !Number.isInteger(fightIndex)) {
		Array.from(document.getElementsByClassName('last-pull-label')).some(lastPullLabel => {
			if (lastPullLabel.parentElement.hasAttribute('onmousedown')) {
				const onMouseDownAsString = lastPullLabel.parentElement.getAttribute('onmousedown');
				const onMouseDownMatches = FFLOGS_ONMOUSEDOWN_FUNCTION_REGEX.exec(onMouseDownAsString);
				fightIndex = parseInt(onMouseDownMatches[1]);
				return true;
			}
		});
	}

	fflogsLastFightIndex = fightIndex;

	const xivAnalysisLink = document.createElement('a');
	xivAnalysisLink.id = FFLOGS_XIV_ANALYSIS_LINK_ID;
	xivAnalysisLink.classList.add('report-settings-btn');
	xivAnalysisLink.target = '_blank';
	xivAnalysisLink.rel = 'noopener';
	xivAnalysisLink.style.color = 'white';
	xivAnalysisLink.innerHTML = '<img src="https://xivanalysis.com/logo.png" width="14" alt="logo">To xivanalysis';
	xivAnalysisLink.setAttribute('data-base-href', 'https://xivanalysis.com/find');

	ffLogsUpdateLinks([xivAnalysisLink], reportId, fightIndex);

	const reportSettingsBox = document.getElementById('report-settings-box');
	const reportInfoMenu = document.getElementById('report-info-menu');
	const otherBox = document.getElementsByClassName('report-bar-top-left-section')[0];

	const elementToAppendLink = reportSettingsBox
		? reportSettingsBox
		: (reportInfoMenu ? reportInfoMenu : otherBox);
	elementToAppendLink.after(xivAnalysisLink);

	const classesToAdd = ['wipes-entry', 'all-fights-entry'];
	const elementsToListen = [];
	classesToAdd.forEach(clazz => {
		elementsToListen.push(...Array.from(document.getElementsByClassName(clazz)));
	});

	elementsToListen.forEach(allFightEntry => {
		allFightEntry.addEventListener('click', () => {
			const onMouseDownAsString = allFightEntry.getAttribute('onmousedown');
			const onMouseDownMatches = FFLOGS_ONMOUSEDOWN_FUNCTION_REGEX.exec(onMouseDownAsString);
			const selectedFightIndex = onMouseDownMatches ? parseInt(onMouseDownMatches[1]) : null;

			ffLogsUpdateLinks([xivAnalysisLink, fightTimeLineLink], reportId, selectedFightIndex);
		});
	});

	const fightBossWrapper = document.getElementById('filter-fight-boss-wrapper');
	if (fightBossWrapper) {
		fightBossWrapper.addEventListener('click', () => {
			switch (document.getElementById('report-view-contents').style.visibility) {
				case 'visible':
					if (fflogsLastFightIndex !== null) {
						ffLogsUpdateLinks([xivAnalysisLink, fightTimeLineLink], reportId, fflogsLastFightIndex);
					}
					break;
				case 'hidden':
					ffLogsUpdateLinks([xivAnalysisLink, fightTimeLineLink], reportId);
					break;
			}
		});
	}
}

/**
 * @param {HTMLAnchorElement[]} links
 * @param {string} reportId
 * @param {int|null} fightIndex
 */
function ffLogsUpdateLinks(links, reportId, fightIndex = null) {
	const endOfLink = `${reportId}${fightIndex !== null ? `/${fightIndex}` : ''}`;
	links.forEach(link => {
		link.href = `${link.getAttribute('data-base-href')}/${endOfLink}`;
	});
	if (fightIndex !== null) {
		fflogsLastFightIndex = fightIndex;
	}
}
