/*********/
//*! Importaciones
    //* |-> { Schema, model } - mongoose
    import { Schema, model } from 'mongoose'
/*********/
//? -_ Schema de ratings
/*********/
const ratingsSchema: Schema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    id_parking: {
        type: Schema.Types.ObjectId,
        ref: 'Parkings'
    },
    coment: {
        type: String
    },
    ranking: {
        type: Number
    }
})
/*********/
// TODO -> Exportacion del modelo
export default model('ratingsParking', ratingsSchema)