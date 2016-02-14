'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Harvest Schema
 */
var HarvestSchema = new Schema({
	appVersion: {
			type: String,
			default: GLOBAL.version
	},
    garden: {
        type: Schema.ObjectId,
        ref: 'Garden',
        required: 'A reference to a garden is required to create a harvest'
    },
    planting: {
        type: Schema.ObjectId,
        ref: 'Planting',
        required: 'A reference to a planting is required to create a harvest'
    },
    quantity: {
        type: Number
    },
    unit: {
        enum: [ 'piece', 'g', 'kg']
    },
    issues: {
        type: [Schema.ObjectId], ref: 'Issue'
    },
    gotchas:{
        type: [Schema.ObjectId], ref: 'Gotcha'
    },
    date: {
        type: Date,
        required: 'No harvest date provided'
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Harvest', HarvestSchema);
