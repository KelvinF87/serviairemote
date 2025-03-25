import mongoose from "mongoose";
const { Schema } = mongoose;

const ModeloSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        modelId: {  // Agrega el campo modelId
            type: String,
            required: true,
            unique: true, // Asegura que el modelId sea único
        },
        description: { // Agrega una descripción opcional
            type: String,
            default: "",
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);
const Modelo = mongoose.model("Modelo", ModeloSchema);
export default Modelo;