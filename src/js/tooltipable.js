module.exports = Ember.Mixin.create({
    tooltipElement: function() {
        return this.$();
    }.property(),

    registerTooltip: function() {
        var self = this,
            tooltip = this.container.lookup('util:tooltip');
        this.get('tooltipElement')
            .mouseenter(function() {
                if (self.get('tip')) {
                    tooltip.scheduleShow(self, self.get('tip'), self.get('tipPosition'));
                }
            })
            .mouseleave(function() {
                tooltip.scheduleHide();
            })
            .click(function(){
                tooltip.hide();
            });
    }.on('didInsertElement')
});