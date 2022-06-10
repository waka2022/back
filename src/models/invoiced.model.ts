/************/
//*! Importaciones
    //* |-> { Schema, model } - mongoose
    import { Schema, model } from 'mongoose'
/************/
//? Definicion del modelo de Facturacion
/************/
const invoicedSchema: Schema = new Schema({
    id_booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    totals: {
        type: {
            hours: Number,
            price: Number
        },
        required: true
    },
    parent: {
        type: Boolean,
        required: true,
        default: false
    }
})
/************/
// TODO -> Exportacion del schema de facturacion
export default model('Invoiced', invoicedSchema)