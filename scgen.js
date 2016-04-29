var centerX = 525;
var centerY = 550;
var seatScale = 1;
var customScale = 1;
var maxRows = 8;
var generateCode = false;
var showStands;
var rows;
var stands;
var chairs;
var standCoordinates;
var straightRows = 0;

$(document).ready(function() {
	"use strict";
	setLetterCheckbox();
	$('input').change(drawChart);
	$('#code').unbind('change');
	$('#loadlink').click(function() {
		$('#loadlink').addClass('hidden');
		$('#loadcontainer').removeClass('hidden');
	});
	$('#load').click(decode);
	$('#loadcode').keypress(function(e) {
		if(e.which === 13) {
			decode();
		}
	});
	$('#reset').click(reset);
	$('#guide_canvas').click(clickChart);
	$('#chknumbers').change(function() {
		setRestartCheckbox();
		drawChart();
	});
	$('#chkrestart').change(function() {
		setLetterCheckbox();
		drawChart();
	});
	$('#btnscaledown').click(function() {
		setCustomScale(-0.1);
		drawChart();
	});
	$('#btnscaleup').click(function() {
		setCustomScale(0.1);
		drawChart();
	});
	$('#btnstraightdown').click(function() {
		setStraight(-1);
		drawChart();
	});
	$('#btnstraightup').click(function() {
		setStraight(1);
		drawChart();
	});
	$('#chkstands').change(checkStands);
	$('#code').click(function () {
		$(this).select();
	});
	$('#help').click(closeHelp);
	$('#helpcontents').click(function(e) { e.stopPropagation(); });
	reset();
	checkStands();
	drawChart();
});

function drawChart() {
	"use strict";
	var n = '';
	var a = '';
	var t = 0;

	$("canvas").clearCanvas();
	var showNumbers = document.getElementById("chknumbers").checked;
	var restartNumbering = document.getElementById("chkrestart").checked;
	var letterRows = document.getElementById("chkletters").checked;
	if(showNumbers) {
		n = 1;
	}
	readInputs();
	seatScale = Math.min(1, 7 / rows.length) * customScale;
	var step = 300 / (rows.length - 1);
	var row_length = 0;
	for(var row in rows) {
		if(restartNumbering) {
			n = 1;
		}
		if(letterRows) {
			a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(row);
		}
		var r = 350;
		if(rows.length > 1) {
			r = 185 + step * row;
		}
		if(row < rows.length - straightRows) {
			$('canvas').drawArc({
				radius: r,
				strokeStyle: '#000',
				x: centerX,
				y: centerY
			});
			var arc_length = Math.PI - 0.3 - (1 - r / 550);
			var angle_step = arc_length / (rows[row] - 1);
			for(var i = 0; i < rows[row]; i++) {
				if(rows[row] > 1) {
					t = -1 * (-1 * arc_length / 2 + angle_step * i);
				}
				// Hide the arc under disabled chairs
				if(!chairs[row][i].enabled) {
					$('canvas').drawArc({
						radius: r,
						strokeStyle: '#fff',
						strokeWidth: 5,
						x: centerX, y: centerY,
						// Start/end are in degrees by default.  To use radians, 'inDegrees' must be set to 'false'
						inDegrees: false,
						start: i === 0 ? Math.PI : ((t + angle_step * 0.55) * -1), // First chair, blank out entire arc to the left
						end: i === rows[row] - 1 ? Math.PI : ((t - angle_step * 0.55) * -1)  // Last chair, blank out entire arc to the right
					});
				}
				drawChair(r, t, n, a, chairs[row][i]);
				if(showStands) {
					drawStand(Math.max(r - step * 0.5, r - 35 * customScale), t, stands[row][i*2]);
					if(i !== rows[row] - 1) {
						drawStand(Math.max(r - step * 0.5, r - 35 * customScale), t - angle_step / 2, stands[row][i*2+1]);
					}
				}
				if(showNumbers && chairs[row][i].enabled) {
					n++;
				}
			}
		} else {
			var y = centerY - r;
			if(!row_length) {
				if(rows.length > straightRows) {
					row_length = r * 1.8;
				}
				else {
					row_length = 1000;
				}
			}
			$('canvas').drawLine({ x1: centerX - row_length/2, y1: y, x2: centerX + row_length/2, y2: y, strokeStyle: '#000' });
			var x_step = (row_length - 100) / (rows[row] - 1);
			for(var j = 0; j < rows[row]; j++) {
				var x = centerX;
				if(rows[row] > 1) {
					x = x_step * j + centerX - row_length/2 + 50;
				}
				// Hide the line under disabled chairs
				if(!chairs[row][j].enabled) {
					$('canvas').drawLine({
						x1: j === 0 ? 0 : (x - x_step * 0.55), // First chair, blank out entire line to the left
						y1: y,
						x2: j === rows[row] - 1 ? centerX * 2 : (x + x_step * 0.55), // Last chair, blank out entire line to the right
						y2: y,
						strokeStyle: '#fff',
						strokeWidth: 5
					});
				}
				drawChairXY(x, y, 0, n, a, chairs[row][j]);
				if(showStands) {
					drawStandXY(x, Math.min(y + step * 0.5, y + 35 * customScale), stands[row][j*2]);
					if(j !== rows[row] - 1) {
						drawStandXY(x + x_step * 0.5, Math.min(y + step * 0.5, y + 35 * customScale), stands[row][j*2+1]);
					}
				}
				if(showNumbers && chairs[row][j].enabled) {
					n++;
				}
			}
		}
	}
	if(showStands) {
		$('canvas').drawText({
			x: 66, y: 8,
			text: ' = music stand',
			fillStyle: '#000',
			strokeStyle: '#000',
			strokeWidth: 0.1,
			fontSize: 14,
			fontFamily: 'Verdana, sans-serif',
			fontStyle: 'normal'
		});
		$('canvas').drawLine({ x1: 2, y1: 2, x2: 12, y2: 12, strokeStyle: '#000' });
		$('canvas').drawLine({ x1: 2, y1: 12, x2: 12, y2: 2, strokeStyle: '#000' });
	}
	$('.title').html($('#title').val());
	if(generateCode) {
		document.getElementById("code").value = encode();
	}
}

function drawChair(r, t, n, a, chair) {
	"use strict";
	var x = centerX - Math.sin(t) * r;
	var y = centerY - Math.cos(t) * r;
	drawChairXY(x, y, t, n, a, chair);
}

function drawChairXY(x, y, t, n, a, chair) {
	"use strict";
	chair.x = x;
	chair.y = y;
	var fontSize = Math.round((a ? 14 : 16) * seatScale);
	// The black borders don't work in old Firefoxen.
	// So fake it by drawing two rectangles
	if(chair.enabled) {
		$('canvas').drawRect({
			fillStyle: '#000',
			strokeStyle: '#000',
			strokeWidth: 0.5,
			x: x, y: y,
			width: 40 * seatScale, height: 40 * seatScale,
			cornerRadius: 2,
			rotate: -1 * t,
			inDegrees: false
		});
		$('canvas').drawRect({
			fillStyle: '#fff',
			strokeStyle: '#fff',
			strokeWidth: 0.5,
			x: x, y: y,
			width: 40 * seatScale - 4, height: 40 * seatScale - 4,
			cornerRadius: 2,
			rotate: -1 * t,
			inDegrees: false
		});
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#000',
			strokeWidth: 0.2,
			x: x, y: y,
			text: a + n,
			fontSize: fontSize,
			fontFamily: 'Verdana, sans-serif',
			fontStyle: 'normal'
		});
	} else {
		$('#guide_canvas').drawRect({
			fillStyle: '#CCC',
			strokeStyle: '#CCC',
			strokeWidth: 1,
			x: x, y: y,
			width: 40 * seatScale, height: 40 * seatScale,
			cornerRadius: 2,
			rotate: -1 * t,
			inDegrees: false
		});
		$('#guide_canvas').drawRect({
			fillStyle: '#fff',
			strokeStyle: '#fff',
			strokeWidth: 1,
			x: x, y: y,
			width: 40 * seatScale - 4, height: 40 * seatScale - 4,
			cornerRadius: 2,
			rotate: -1 * t,
			inDegrees: false
		});
	}
	//console.log(x + ' ' + y + ' ' + t);
}

function drawStand(r, t, stand) {
	"use strict";
	var x = centerX - Math.sin(t) * r;
	var y = centerY - Math.cos(t) * r;
	drawStandXY(x, y, stand);
}

function drawStandXY(x, y, stand) {
	"use strict";
	stand.x = x;
	stand.y = y;
	// Again with the borders
	$('#guide_canvas').drawRect({
		fillStyle: '#999',
		strokeStyle: '#999',
		x: x, y: y,
		width: 7, height: 7
	});
	$('#guide_canvas').drawRect({
		fillStyle: '#fff',
		strokeStyle: '#fff',
		x: x, y: y,
		width: 6, height: 6
	});
	if(stand.enabled) {
		$('canvas').each(function() {
			$(this).drawLine({
				x1: x-5, y1: y-5,
				x2: x+5, y2: y+5,
				strokeStyle: '#000'
			});
			$(this).drawLine({
				x1: x-5, y1: y+5,
				x2: x+5, y2: y-5,
				strokeStyle: '#000'
			});
		});
	}
}

function clickChart(e) {
	"use strict";
	var canvas = $('#guide_canvas');
	var scale = 1050 / canvas.width();
	var x = (e.pageX - canvas.offset().left) * scale;
	var y = (e.pageY - canvas.offset().top) * scale;
	for(var row in rows) {
		for(var c in chairs[row]) {
			var chair = chairs[row][c];
			if(chair.x > x - 18 && chair.x < x + 18 && chair.y > y - 18 && chair.y < y + 18 ) {
				chair.enabled = !chair.enabled;
				drawChart();
				break;
			}
		}
		if(!showStands) {
			continue;
		}
		for(var s in stands[row]) {
			var stand = stands[row][s];
			if(stand.x > x - 9 && stand.x < x + 9 && stand.y > y - 9 && stand.y < y + 9 ) {
				stand.enabled = !stand.enabled;
				drawChart();
				break;
			}
		}
	}
}

function readInputs() {
	"use strict";
	rows = [];
	var j = 0;
	for(var i = maxRows - 1; i >= 0; i--) {
		var val = parseInt($('#row' + (i+1)).val());
		if(rows.length === 0 && !val) {
			continue;
		}
		if(!val) {
			val = 0;
		}
		rows.push(val);
		if(!chairs[i] || chairs[i].length !== val) {
			chairs[i] = [];
			for(j = 0; j < val; j ++) {
				chairs[i][j] = { enabled: true, x: 0, y: 0 };
			}
		}
		if(!stands[i] || stands[i].length !== val * 2 - 1) {
			stands[i] = [];
			for(j = 0; j < val * 2 - 1; j += 2) {
				stands[i][j] = { enabled: true, x: 0, y: 0 };
				if(j !== val * 2 - 2) {
					stands[i][j+1] = { enabled: false, x: 0, y: 0 };
				}
			}
		}
	}
	rows.reverse();
	showStands = document.getElementById("chkstands").checked;
	setStraight(0); // Re-run "max straight rows" logic in case rows were removed
}

function addRow() {
	"use strict";
	maxRows++;
	$('#rows').append("<p>Row " + maxRows + ": <input id='row" + maxRows + "' size='2' maxlength='2'></input></p>");
	$('#row' + maxRows).change(drawChart);
}

function reset() {
	"use strict";
	$('input:text').not('#loadcode').val('');
	$('input:checkbox').removeAttr('checked');
	document.getElementById("chknumbers").checked = true;
	checkStands();
	chairs = [];
	stands = [];
	standCoordinates = [];
	rows = [];
	customScale = 1;
	straightRows = 0;
	$('#scale').html('100');
	$('#straight').html('0');
	drawChart();
}

function setRestartCheckbox() {
	"use strict";
	if(document.getElementById("chknumbers").checked) {
		$('#lblrestart').removeClass('disabled');
		$('#chkrestart').removeAttr('disabled');
	} else {
		$('#lblrestart').addClass('disabled');
		$('#chkrestart').attr('disabled', 'disabled').removeAttr('checked');
	}
	setLetterCheckbox();
}

function setLetterCheckbox() {
	"use strict";
	if(document.getElementById("chkrestart").checked) {
		$('#lblletters').removeClass('disabled');
		$('#chkletters').removeAttr('disabled');
	} else {
		$('#lblletters').addClass('disabled');
		$('#chkletters').attr('disabled', 'disabled').removeAttr('checked');
	}
}

function checkStands() {
	"use strict";
	if(document.getElementById("chkstands").checked) {
		showStands = true;
		$('#helpstands').show();
	} else {
		showStands = false;
		$('#helpstands').hide();
	}
	drawChart();
}

function setCustomScale(n) {
	"use strict";
	customScale = Math.min(2, Math.max(0.5, (customScale + n).toFixed(1)));
	$('#scale').html(Math.round(customScale * 100));
}

function setStraight(n) {
	"use strict";
	straightRows = Math.min(rows.length, Math.max(0, straightRows + n));
	$('#straight').html(straightRows);
}

function save() {
	"use strict";
	generateCode = true;
	drawChart();
	$('#helpsave').show();
}

function encode() {
	"use strict";
	var code = '';
	if(!document.getElementById("chknumbers").checked) {
		code += 'H';
	}
	if (document.getElementById("chkrestart").checked) {
		code = 'N';
		if (document.getElementById("chkletters").checked) {
			code += 'L';
		}
	}

	if(customScale !== 1.0) {
		code += 'P' + Math.round(customScale * 100);
	}

	code += 'R';
	var i = 0;
	var n = 0;
	for(var row in rows) {
		var val = rows[row].toString(10);
		if(val.length === 1) {
			val = '0' + val;
		}
		code += val;
	}
	if(showStands) {
		code += 'S';
		for(var row in rows) {
			for(var s in stands[row]) {
				if(stands[row][s].enabled) {
					var mask = 1 << i;
					n |= mask;
				}
				i++;
				if(i === 31) {
					code += (n.toString(36) + '.');
					i = n = 0;
				}
			}
		}
		code += (n.toString(36) + '.');
		code = code.slice(0, -1);
	}
	var rowSentinal = false;
	for(var row in rows) {
		for(var c in chairs[row]) {
			if(!chairs[row][c].enabled) {
				var rowval = row.toString(10);
				if(rowval.length === 1) {
					rowval = '0' + rowval;
				}
				var chairval = c.toString(10);
				if(chairval.length === 1) {
					chairval = '0' + chairval;
				}
				if(!rowSentinal) {
					rowSentinal = true;
					code += ',H';
				}
				code += rowval + chairval;
			}
		}
	}
	if(straightRows > 0) {
		code += ',T' + straightRows;
	}

	// Chart Title
	if (document.getElementById("title").value.length > 0) {
		code += '\"' + document.getElementById("title").value + '\"';
	}

	return code;
}

function decode() {
	"use strict";
	reset();
	var code = $('#loadcode').val();
	var matches;
	var i = 0;
	var val;
	var row;

	// Simple checkboxes
	matches = code.match(/^([^R]*)/);
	if(matches !== null && matches.length > 1) {
		if(matches[1].indexOf('H') > -1) {
			document.getElementById("chknumbers").checked = false;
		}
		if(matches[1].indexOf('N') > -1) {
			document.getElementById("chkrestart").checked = true;
			setLetterCheckbox();
			if(matches[1].indexOf('L') > -1) {
				document.getElementById("chkletters").checked = true;
			}
		}
	}

	// Seat scale
	matches = code.match(/P(\d+)/);
	if(matches !== null && matches.length > 1) {
		customScale = +((parseInt(matches[1], 10) / 100).toFixed(1));
		$('#scale').html(Math.round(customScale * 100));
	}

	// Rows
	matches = code.match(/R([\d\.]*)/);
	if(matches !== null && matches.length > 1) {
		var loadRows = [];
		for(i = 0; i < matches[1].length; i+= 2) {
			if(i / 2 > 7) {
				addRow();
			}
			val = matches[1].substring(i, i+2);
			//console.log(val);
			loadRows.push(parseInt(val, 10));
			$('#row' + (i/2+1)).val(val);
		}
	}

	// Stands
	matches = code.match(/S([^,]*)/);
	if(matches !== null && matches.length > 1) {
		var standParts = matches[1].split('.');
		i = 0;
		var standPart = 0;
		var n = parseInt(standParts[0], 36);
		stands = [];
		for(row in loadRows) {
			stands[row] = [];
			val = loadRows[row];
			for(var j = 0; j < val * 2 - 1; j++) {
				var mask = 1 << i;
				stands[row][j] = { enabled: (n & mask) != 0, x: 0, y: 0 };
				i++;
				if(i === 31) {
					i = 0;
					standPart++;
					n = parseInt(standParts[standPart], 36);
				}
			}
		}
		document.getElementById("chkstands").checked = true;
		checkStands();
	}

	// Hidden chairs
	matches = code.match(/,H([^,]*)/);
	if(matches !== null && matches.length > 1) {
		var hidden = matches[1];
		for(i = 0; i < hidden.length; i += 4) {
			row   = parseInt(hidden.substring(i  , i+2), 10);
			var chair = parseInt(hidden.substring(i+2, i+4), 10);
			chairs[row][chair].enabled = false;
		}
	}

	// Straight rows
	matches = code.match(/,T([^,]*)/);
	if(matches !== null && matches.length > 1) {
		straightRows = parseInt(matches[1], 10);
	}

	// Title
	matches = code.match(/[^\"]+\"(.*)\"/);
	if (matches !== null && matches.length > 1) {
		document.getElementById("title").value = matches[1];
	}

	drawChart();
}

function showHelp(highlight) {
	"use strict";
	$('#help').show();
	if(highlight) {
		$('#' + highlight).css('background-color', 'yellow');
	}
}

function closeHelp() {
	"use strict";
	$('#help').hide();
	$('#helpstyle *').css('background-color', '');
}