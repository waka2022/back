/*********/
//*! Importaciones
//* |-> { Schema, model } mongosee
import { Schema, model } from 'mongoose'
/*********/
//? -_ Schema Booking
/*********/
const bookingSchema: Schema = new Schema({
    id_user_res: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    id_park: {
        type: Schema.Types.ObjectId,
        ref: 'Parkings'
    },
    date_booking: {
        type: {
            publish: {
                type: Date
            },
            booking: {
                type: Date
            }
        }
    },
    status: {
        type: {
            on_route: Boolean,
            on_site: Boolean,
            on_park: {
                moment: Date,
                status: Boolean
            },
            end_park: {
                moment: Date,
                status: Boolean
            }
        }
    },
    parnet: {
        type: Boolean
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Booking', bookingSchema)