import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    encryptedBlob: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

const Vault = mongoose.models.Vault || mongoose.model("Vault", vaultSchema);
export default Vault