import Vault from "@/models/vaultModel";
import { connectDB } from "@/utils/connectDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function POST(request: NextRequest) {
    try {
        const { userId, blob } = await request.json();
        const newVault = await Vault.create({ userId, encryptedBlob: blob });

        if (newVault) {
            return NextResponse.json({ message: "Vault created successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Vault creation failed" }, { status: 501 });
        }
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
    
}
export async function PATCH(request: NextRequest) {
    try {
        const { userId, blob, id } = await request.json();
        const updatedVault = await Vault.findByIdAndUpdate({ _id: id }, { userId, encryptedBlob: blob, updatedAt: Date.now() });

        if (updatedVault) {
            return NextResponse.json({ message: "Vault updated successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Vault update failed" }, { status: 501 });
        }
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
    
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const deletedVault = await Vault.findByIdAndDelete({ _id: id });
        if (deletedVault) {
            return NextResponse.json({ message: "Vault deleted successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Vault delete failed" }, { status: 501 });
        }
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
    
}

export async function GET() {
    try {
        const {userId} = await auth();
        const vaults = await Vault.find({userId}).populate("userId");
        return NextResponse.json({ items: vaults }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}