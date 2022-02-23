/*********/
//*! Importaciones
    //* |-> { Schema, model } mongoose
    import { Schema, model } from 'mongoose'
/*********/
//? -_ Schema users
const UserSchema: Schema = new Schema({
    names: {
        type: {
            name: String,
            last_name: String
        },
        required: true
    },
    email_t: {
        type: {
            email: {
                type: String,
                unique: true
            },
            verify_at: {
                type: Date
            }
        },
        required: true
    },
    document: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    google: {
        type: Boolean,
        required: true,
        default: false
    },
    parking: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_BP' //* |-> { USER_BP, USER_PP }
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    img: {
        type: String
    }
})
/*********/
// TODO -> Exportacion del schema
export default model('Users', UserSchema)