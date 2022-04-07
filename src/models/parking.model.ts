/********/
//*! Importaciones
    //* |-> { Schema, model } mongoose
    import { Schema, model } from 'mongoose'
/*********/
//? -_ Schema de parking
/*********/
const parkingSchema: Schema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type_parks: {
        type: {
            _0: Boolean, //? -> Moto
            _1: Boolean, //? -> Carro
            _2: Boolean //? -> Bici
        },
        required: true
    },
    type_security: {
        type: {
            cams: {
                type: Boolean,
                required: true,
                default: false
            },
            vigilant: {
                type: Boolean,
                required: true,
                default: false
            },
            add: {
                type: [
                    {
                        type: String,
                        have: String
                    }
                ]
            }
        }
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    descript: {
        type: String,
        required: true
    },
    ubi: {
        type: {
            lon: Number,
            lat: Number
        }
    },
    price: {
        type: Number,
        required: true,
        default: 500
    },
    quotas: {
        type: {
            totals: {
                type: Number,
                required: true
            },
            not_available: {
                type: Number,
                required: true,
                default: 0
            }
        }
    },
    space: {
        type: String,
        required: true
    },
    photo: {
        type: [String],
        //required: true
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Parkings', parkingSchema)