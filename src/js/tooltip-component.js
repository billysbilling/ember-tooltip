var highestZIndex = require('highest-z-index');

module.exports = Em.Component.extend({
    template: require('../templates/tooltip'),
    
    classNameBindings: [':tooltip', 'positionClassName'],

    position: 'top',
    
    positions: {
        top: {
            my: 'center bottom',
            at: 'center top-6'
        },
        topLeft: {
            my: 'center bottom',
            at: 'left+10 top-6'
        },
        right: {
            my: 'left center',
            at: 'right+5 center'
        },
        bottom: {
            my: 'center top',
            at: 'center bottom+6'
        },
        left: {
            my: 'right center',
            at: 'left-5 center'
        }
    },
    
    positionClassName: function() {
        var pos = this.get('position').replace(/(Left|Right)$/, '');
        return 'tooltip-' + pos;
    }.property('position'),

    isVisible: false,
    
    delay: 200,

    _updateZIndex: function() {
        var highest = highestZIndex();
        this.$().css('z-index', highest + 1);
    }.on('didInsertElement'),
    
    messageEl: function() {
        return this.$('.message');
    }.property(),

    scheduleShow: function(view, message, position) {
        var self = this;
        clearTimeout(this.scheduleTimeout);
        if (this.get('isVisible')) {
            this.show(view, message, position);
        } else {
            this.scheduleTimeout = setTimeout(function() {
                Em.run(function() {
                    self.show(view, message, position);
                });
            }, this.get('delay'));
        }
    },
    
    scheduleHide: function() {
        var self = this;
        clearTimeout(this.scheduleTimeout);
        this.scheduleTimeout = setTimeout(function() {
            Em.run(function() {
                self.hide();
            });
        }, this.get('delay'));
    },
    
    show: function(view, message, positionName) {
        positionName = positionName || 'top';
        var self = this,
            position = this.get('positions')[positionName];
        this.set('position', positionName);
        position.of = view.$();
        if (this.get('state') !== 'inDOM') {
            this.appendTo(this.container.lookup('application:main').get('rootElement'));
            this.on('didInsertElement', function() {
                self.$().css('opacity', 0);
                self.show(view, message, positionName);
            });
            return;
        } else {
            this._updateZIndex();
        }
        this.set('isVisible', true);
        this.get('messageEl').html(message);
        var el = this.$();
        el.show();
        el.stop(true).animate({
            opacity: 1
        }, 200);
        el.position(position);
    },
    
    hide: function() {
        var self = this;
        clearTimeout(this.scheduleTimeout);
        if (this.get('state') !== 'inDOM') {
            return;
        }
        var el = this.$();
        el.stop(true).animate({
            opacity: 0
        }, 200, function() {
            el.hide();
            self.set('isVisible', false);
        });
    }
});