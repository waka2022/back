/*********/
//*! Importaciones
    //* |-> { Schema, model } mongoose
    import { Schema, model } from 'mongoose'
/*********/
//? -_ Schema Vehiculo
/*********/
const vehicleSchema: Schema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    type_vehi: {
        type: {
            global: Number, //? -> { 0: moto, 1: carro, 2: bicicleta }
            mark: String,
            model: Number,
            placa: String,
            color: String
        },
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    photo: {
        type: [String]
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Vehicle', vehicleSchema)