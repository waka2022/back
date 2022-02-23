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
            global: String,
            mark: String,
            model: String,
            placa: String,
            color: String
        },
        required: true
    },
    photo: {
        type: [String]
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Vehicle', vehicleSchema)