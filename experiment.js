Pins = new Mongo.Collection('pins');

Pins.deny({
    insert: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

Pins.allow({
    update: function (userId, doc, fieldNames, modifier) {
        return !_.difference(fieldNames, ['state']).length;
    }
});

if (Meteor.isClient) {

    Template.experiment1.onCreated(function () {
        this.subscribe('pins');
    });

    Template.experiment1.helpers({
        state: function () {
            var pin3 = Pins.findOne("3");
            if (!pin3) {
                return '?';
            } else {
                return pin3.state ? 'ON' : 'OFF';
            }
        }
    });

    Template.experiment1.events({
        'click button': function () {
            var state,
                pin3 = Pins.findOne("3");
            if (!pin3) {
                state = false;
            } else {
                state = pin3.state;
            }
            Pins.update({_id: "3"}, {$set: {state: !state}});
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (!Pins.findOne("3")) {
            Pins.insert({_id: "3", status: false});
        }
    });

    Meteor.publish('pins', function () {
        return Pins.find();
    });
}
