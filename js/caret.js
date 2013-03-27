/* http://plusblog.jp/4654/ */

(function($) {
    var caretPos = function(pos) {
        var item = this.get(0);
        if (pos == null) {
            return get(item);
        } else {
            set(item, pos);
            return this;
        }
    };

    var get = function(item) {
        var CaretPos = 0;
        if (item.selectionStart || item.selectionStart == "0") { // Firefox, Chrome
            start = item.selectionStart;
        } else if (document.selection) { // IE
             start = getSelectionCount(item)[0];
        }
        
        if (isNaN (start)){
            return;
        }
        
        return item.value.getLinefromCount( start );
    };
    var set = function(item, pos) {
        if (item.setSelectionRange) {  // Firefox, Chrome
            item.setSelectionRange(pos, pos);
            
            var lineNum = item.value.getLinefromCount( pos );
            var lineHeight = item.style.lineHeight.slice(0,-2);
            item.scrollTop = (lineNum-1) * parseInt(lineHeight);
            item.focus();
        } else if (item.createTextRange) { // IE
            var range = item.createTextRange();
            range.collapse(true);
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select();
        }
    };
    
    $.fn.extend({caretPos: caretPos});
})(jQuery);

function getSelectionCount(textarea) {
    var selectionRange = textarea.document.selection.createRange();

    if (selectionRange == null || selectionRange.parentElement() !== textarea) {
        return [ NaN, NaN ];
    }

    var value = arguments[1] || textarea.value;
    var valueCount = value.length;
    var range = textarea.createTextRange();
    range.moveToBookmark(selectionRange.getBookmark());

    var endBoundary = textarea.createTextRange();
    endBoundary.collapse(false);

    // endBoundary << range
    if (range.compareEndPoints('StartToEnd', endBoundary) >= 0) {
        return [ valueCount, valueCount ];
    }

    var normalizedValue = arguments[2] || value.replace(/rn|r/g, 'n');
    var start = -(range.moveStart('character', -valueCount));
    start += normalizedValue.slice(0, start).split('n').length - 1;

    // range << endBoundary << range
    if (range.compareEndPoints('EndToEnd', endBoundary) >= 0) {
        return [ start, valueCount ];
    }

    // range << endBoundary
    var end = -(range.moveEnd('character', -valueCount));
    end += normalizedValue.slice(0, end).split('n').length - 1;
    return [ start, end ];
}