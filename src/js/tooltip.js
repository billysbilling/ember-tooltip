module.exports = function(container) {
    container.register('component:tooltip', require('./tooltip-component'));
    
    var instance = null;

    var getInstance = function() {
        if (!instance) {
            instance = container.lookup('component:tooltip');
        }
        return instance;
    };

    return {
        show: function(view, message, positionName) {
            getInstance().show(view, message, positionName);
        },
        scheduleShow: function(view, message, positionName) {
            getInstance().scheduleShow(view, message, positionName);
        },
        hide: function() {
            getInstance().hide();
        },
        scheduleHide: function() {
            getInstance().scheduleHide();
        }
    }
};

module.exports.Tooltipable = require('./tooltipable');