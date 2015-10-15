window.zKeyboard = (function() {
    $self = {};
    $self.touchEvent = (function() {
        var eventTouchStartType,
            eventTouchLeaveType,
            eventTouchMoveType,
            eventTouchEnterType,
            eventTouchEndType;

        if (window.navigator.pointerEnabled) {
            eventTouchStartType = 'pointerdown';
            eventTouchLeaveType = 'pointerout';
            eventTouchMoveType = 'pointermove';
            eventTouchEnterType = 'pointerover';
            eventTouchEndType = 'pointerup';
        } else if (window.navigator.msPointerEnabled) {
            eventTouchStartType = 'MSPointerDown';
            eventTouchLeaveType = 'MSPointerOut';
            eventTouchMoveType = 'MSPointerMove';
            eventTouchEnterType = 'MSPointerOver';
            eventTouchEndType = 'MSPointerUp';
        } else if ('ontouchend' in window) {
            eventTouchStartType = 'touchstart';
            eventTouchLeaveType = 'touchleave ';
            eventTouchMoveType = 'touchmove';
            eventTouchEnterType = 'touchstart';
            eventTouchEndType = 'touchend touchcancel';
        } else {
            eventTouchStartType = 'mousedown';
            eventTouchLeaveType = 'mouseout';
            eventTouchMoveType = 'mousemove';
            eventTouchEnterType = 'mouseover';
            eventTouchEndType = 'mouseup';
        }

        return {
            start: eventTouchStartType,
            leave: eventTouchLeaveType,
            move: eventTouchMoveType,
            enter: eventTouchEnterType,
            end: eventTouchEndType
        };
    })();

    $self.defultConfig = {
        container: '.zkey-container',
        input: '.zkey-input',
        maxlength: 6,
        row: 4,
        col: 3,
        leftBottomText: '确定',
        rightBottomText: '退格',
        leftBottomCallback: null,
        rightBottomCallback: function() {
            var $input = $($self.defultConfig.input);
            $input.val((function() {
                var val = $input.val();
                val = val.substr(0, val.length - 1);
                return val;
            })());
        }
    };

    $self.init = function(config) {
        if ($($self.defultConfig.container).children().length > 0) {
            throw $self.defultConfig.container + 'is not empty!';
            return;
        }

        $.extend(true, $self.defultConfig, config);
        var $input = $($self.defultConfig.input);
        var $table = $('<table class="zkeys" cellspacing="0"></table>');
        for (var i = 0; i < $self.defultConfig.row; i++) {
            var $tr = $('<tr></tr>');
            for (var j = 1; j <= $self.defultConfig.col; j++) {
                var $td = $('<td class="zkey"></td>'),
                    val = i * 3 + j;
                if (val == 10) val = $self.defultConfig.leftBottomText;
                else if (val == 11) val = 0;
                else if (val == 12) val = $self.defultConfig.rightBottomText;
                $td.data('value', val).text(val);
                $tr.append($td);
            }
            $table.append($tr);
        }
        $($self.defultConfig.container).append($table);

        $($self.defultConfig.container).on($self.touchEvent.start, '.zkey', function() {
            $(this).addClass('active');
        }).on($self.touchEvent.end, '.zkey', function() {
            $(this).removeClass('active');
            if ($(this).data('value') == $self.defultConfig.leftBottomText) {
                // console.log('确定');
                $self.defultConfig.leftBottomCallback && $self.defultConfig.leftBottomCallback();
            } else if ($(this).data('value') == $self.defultConfig.rightBottomText) {
                // console.log('退格');
                $self.defultConfig.rightBottomCallback && $self.defultConfig.rightBottomCallback();
            } else {
                if ($input.val().length >= $self.defultConfig.maxlength) return;
                $input.val($input.val() + $(this).data('value'));
            }
        }).on($self.touchEvent.move, '.zkey', function(e) {
            e.preventDefault();
        });

        var styleStr = '.zkey-container{position:fixed;width:100%;bottom:0}.zkeys{-webkit-user-select:none;list-style:none;width:100%;border-right:1px solid #7f8c8d;border-bottom:1px solid #7f8c8d}.zkey{background-color:#ecf0f1;line-height:4rem;text-align:center;color:#34495e;width:33.33%;border-top:1px solid #7f8c8d;border-left:1px solid #7f8c8d}.zkey.active{background-color:#1abc9c}';
        var $style = $('<style></style>').text(styleStr);
        $('head').append($style);
    }

    return $self;
})();
