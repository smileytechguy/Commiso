<?php
header("Content-Type: application/javascript; charset=UTF-8", true);

define("ROOTDIR", "../../../");
define("REAL_ROOTDIR", "../../../");

define("NO_SESSION", true);

require_once REAL_ROOTDIR."src/php/initializer.php";
use \Catalyst\API\ErrorCodes;

$errors = ErrorCodes::getAssoc();

// the following series of whitespace is dedicated to SINNERSCOUT for being cool and a patron and stuff:
/*
U+0020	SPACE						foo bar,	size: depends on font, typically 1/4 em, often adjusted
U+00A0	NO-BREAK SPACE				foo bar,	size: as a space, but often not adjusted
U+1680	OGHAM SPACE MARK			foo bar,		size: unspecified; usually not really a space but a dash
U+180E	MONGOLIAN VOWEL SEPARATOR	foo᠎bar,		size: no width
U+2000	EN QUAD						foo bar,	size: 1 en (= 1/2 em)
U+2001	EM QUAD						foo bar,	size: 1 em (nominally, the height of the font)
U+2002	EN SPACE					foo bar,	size: 1 en (= 1/2 em)
U+2003	EM SPACE					foo bar,	size: 1 em
U+2004	THREE-PER-EM SPACE			foo bar,	size: 1/3 em
U+2005	FOUR-PER-EM SPACE			foo bar,	size: 1/4 em
U+2006	SIX-PER-EM SPACE			foo bar,	size: 1/6 em
U+2007	FIGURE SPACE				foo bar,	size: “tabular width”, the width of digits
U+2008	PUNCTUATION SPACE			foo bar,	size: the width of a period “.”
U+2009	THIN SPACE					foo bar,	size: 1/5 em (or sometimes 1/6 em)
U+200A	HAIR SPACE					foo bar,	size: narrower than thin space
U+200B	ZERO WIDTH SPACE			foo​bar,		size: nominally no width, but may expand
U+202F	NARROW NO-BREAK SPACE		foo bar,	size: narrower than no-break space (or space)
U+205F	MEDIUM MATHEMATICAL SPACE	foo bar,	size: 4/18 em
U+3000	IDEOGRAPHIC SPACE			foo　bar,	size: the width of ideographic (cjk) characters.
U+FEFF	ZERO WIDTH NO-BREAK SPACE	foo﻿bar,		size: no width (the character is invisible)
*/

?>
window.markInputInvalid = function(e, a) {
	if ($(e).length == 0) {
		window.log(<?= json_encode(basename(__FILE__)) ?>, "markInputInvalid - called but no elements were given!", true);
		return;
	}
	window.log(<?= json_encode(basename(__FILE__)) ?>, "markInputInvalid - invalid element ("+$(e).attr("id")+") treated as a generic form element");

	$(e).addClass("invalid").addClass("marked-invalid").focus();
	$("label[for="+$(e).attr("id")+"]").addClass("active");
	// add helper text if it doesn't exist, BC
	if ($("span.helper-text[for="+$(e).attr("id")+"]").length == 0) {
		$(e).parent().append($("<span></span>").addClass("helper-text").attr("for", $(e).attr("id")));
	}
	$("span.helper-text[for="+$(e).attr("id")+"]").attr("data-error", a);
};

window.showErrorMessageForCode = function(c) {
	window.log(<?= json_encode(basename(__FILE__)) ?>, "showErrorMessageForCode - called for error code "+c);

	switch (c) {
<?php foreach ($errors as $code => $message): ?>
		case <?= $code ?>:
			M.escapeToast(<?= json_encode($message) ?>, 4000);
			break;
<?php endforeach; ?>
		default:
			M.escapeToast("An unknown error occured", 4000);
	}
};
window.updateUploadIndicator = function(f, e) {
	window.log(<?= json_encode(basename(__FILE__)) ?>, "updateUploadIndicator - an upload (f="+f+") on this page has reached "+((e.loaded*100)/e.total)+"% completion");

	$(f+" .indeterminate").removeClass("indeterminate").addClass("determinate");
	$(f+" .determinate").css("width", ((e.loaded*100)/e.total)+"%");
	if (e.loaded == e.total) {
		window.log(<?= json_encode(basename(__FILE__)) ?>, "updateUploadIndicator - an upload (f="+f+") has completed.  Removing determinate progress.");
		$(f+" .determinate").addClass("indeterminate").removeClass("determinate").attr("style", "");
	}
};
