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
    id_vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    id_park: {
        type: Schema.Types.ObjectId,
        ref: 'Parkings'
    },
    date_booking: {
        type: {
            publish: { //? -_ Cuando lo solicita
                type: Date
            },
            booking: { //? -_ Cuando esta en la reserva
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
            },
            on_cancel: Boolean
        }
    },
    photo_news: {
        type: [String]
    },
    parnet: {
        type: {
            totals: Number,
            status_parnet: Boolean
        }
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Booking', bookingSchema)