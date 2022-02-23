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
        type: [String],
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
    photo: {
        type: [String],
        required: true
    },
    ratings: {
        type: [
            {
                id_user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users'
                },
                coment: {
                    type: String
                },
                ranking: {
                    type: Number
                }
            }
        ]
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Parkings', parkingSchema)