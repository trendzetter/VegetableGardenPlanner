'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Garden Schema
 */
var GardenSchema = new Schema({
	appVersion: {
			type: String,
			default: GLOBAL.version
	},
    bk: {
        type: Schema.ObjectId,
        required: 'BK is missing'
    },
	name: {
		type: String,
		default: '',
		required: 'Please fill Garden name',
		trim: true
	},
    elemwidth: {
        type: Number,
        default: '500'
    },
    elemheight: {
        type: Number,
        default: '300'
    },
    elemtop: {
        type: Number,
        default: '0'
    },
    elemleft: {
        type: Number,
        default: '0'
    },
	created: {
		type: Date,
		default: Date.now
	},
    validFrom: {
        type: Date
    },
    validTo: {
        type: Date
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	keepers: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Garden', GardenSchema);
