"use client";
import { decryptData, encryptData } from "@/utils/cryptodata";
import { useUser } from "@clerk/nextjs";
import { IconCopy, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { div } from "motion/react-client";
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";

interface VaultItem {
    id?: string;
    title?: string;
    username?: string;
    mypassword?: string;
    url?: string;
    notes?: string;
}

const Vaultpage = () => {
    const [form, setForm] = useState({ title: "", username: "", mypassword: "", url: "", notes: "" });
    const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
    const { user } = useUser();
    const [isHidden, setIsHidden] = useState(true)
    const [isHidden2, setIsHidden2] = useState(true)
    const [docId, setDocId] = useState("")
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all vault items (encrypted) and decrypt them
    async function fetchVaults() {
        const res = await fetch("/api/vault");
        const { items } = await res.json();

        const decrypted = [];
        for (const item of items) {
            try {
                const data = await decryptData(item.encryptedBlob);
                decrypted.push({ ...data, id: item._id });
            } catch {
                decrypted.push({ title: "Encrypted (locked)" });
            }
        }
        setVaultItems(decrypted);
    }

    useEffect(() => {
        fetchVaults();
    }, []);

    const handleUpdate = async () => {
        try {
            const encryptedBlob = encryptData(form);
            const res = await fetch("/api/vault", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id, blob: encryptedBlob, id: docId }),
            });

            if (res.status === 201) {
                toast.success("Vault updated successfully", { duration: 2000 });
                setForm({ title: "", username: "", mypassword: "", url: "", notes: "" });
            } else {
                toast.error("Vault update failed");
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setIsHidden(true);
            fetchVaults();
        }
    };
    const showDelete = (id: string) => {
        setIsHidden2(false);
        setDocId(id)
    }
    const handleDelete = async () => {
        try {
            const res = await fetch("/api/vault", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id, id: docId }),
            });
            if (res.status === 201) {
                toast.success("Vault deleted successfully", { duration: 2000 });
            } else {
                toast.error("Vault delete failed");
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setIsHidden2(true);
            fetchVaults();
        }
    };

    const handleEdit = (item : VaultItem) => {
        const { title, username, mypassword, url, notes } = item;
        setDocId(`${item.id}`)
        if (title !== undefined && username !== undefined && mypassword !== undefined && url !== undefined && notes !== undefined) {
        setForm({ title, username, mypassword, url, notes });
        setIsHidden(false);
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };
    const copyClearClipboard = (data: string) => {
        navigator.clipboard.writeText(data);
        toast.success("Copied to clipboard. After 20 seconds it will be cleared", { duration: 2000 });
        const button = document.createElement("button");
        button.addEventListener("click", () => {
            navigator.clipboard.writeText(" ");
        })
        setTimeout(() => {
            button.click();
        }, 20000);
        button.remove();
    };

    const filtered = searchQuery
        ? vaultItems.filter(item =>
            item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : vaultItems;
    return (
        <div className="flex justify-center min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            {!isHidden2 &&
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
                        <h2 className="text-xl text-black font-semibold mb-3">Are you sure?</h2>
                        <p className="text-gray-600 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete()}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setIsHidden2(true)}
                                className="border border-gray-300 hover:bg-gray-100 text-black px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
            {!isHidden &&
                <div className='fixed top-0 left-0 w-screen h-screen z-100 bg-black/50 backdrop-blur-md flex justify-center items-center'>
                    <form
                        onSubmit={(e) => { e.preventDefault(); }}
                        className='flex flex-col gap-5 bg-white/40 p-8 rounded-md relative sm:w-[60%] w-screen sm:h-[60%] text-black'>
                        <h2 className='text-2xl text-center'>Save your pass to vault</h2>
                        <IconX className='absolute top-2 right-2 cursor-pointer hover:invert' onClick={() => setIsHidden(true)} />
                        <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
                            <label htmlFor="title" className='cursor-pointer w-[20%]'>Title</label>
                            <input type="text" name="title" id="title" className='md:w-[80%] w-[60%] bg-white' value={form.title} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
                            <label htmlFor="username" className='cursor-pointer w-[20%]'>Username</label>
                            <input type="text" name="username" id="username" className='md:w-[80%] w-[60%] bg-white' value={form.username} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
                            <label htmlFor="mypassword" className='cursor-pointer w-[20%]'>Password</label>
                            <input type="password" name="mypassword" id="mypassword" className='md:w-[80%] w-[60%] bg-white' value={form.mypassword} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
                            <label htmlFor="url" className='cursor-pointer w-[20%] '>URL</label>
                            <input type="text" name="url" id="url" className='md:w-[80%] w-[60%] bg-white' value={form.url} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
                            <label htmlFor="notes" className='cursor-pointer w-[20%] '>Notes</label>
                            <input type="text" name="notes" id="notes" className='md:w-[80%] w-[60%] bg-white' value={form.notes} onChange={(e) => handleChange(e)} />
                        </div>
                        <button
                            onClick={handleUpdate}
                            type='submit'
                            className='cursor-pointer bg-[#282727] text-white rounded-md py-2 px-5 mx-auto w-fit'>
                            Save changes
                        </button>
                    </form>
                </div>
            }
            <div>
                <h2 className="font-semibold lg:text-4xl text-2xl mt-30 text-center">Hi, {user?.firstName || "User"}! Check out your Vault</h2>
                <div className="my-5">
                    <input
                        type="text"
                        placeholder="Filter by title..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 text-black rounded-lg mt-5 p-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="my-2 grid md:grid-cols-2 grid-cols-1 gap-2">
                    {filtered.map((v, i) => (
                        <div key={i} className="border p-6 rounded-md shadow">
                            <div className="flex gap-2 items-center justify-end">
                                <IconEdit className='hover:scale-110 cursor-pointer' onClick={() => handleEdit(v)} />
                                <IconTrash className='hover:scale-110 cursor-pointer' onClick={() => showDelete(`${v.id}`)} />
                            </div>
                            <div className="flex gap-2 mb-5 items-center justify-center">
                                <p className="mb-2 lg:text-3xl text-xl"><span className="font-semibold">Title: </span>{v.title}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <p className="mb-2 lg:text-2xl text-lg"><span className="font-semibold">Username: </span>{v.username}</p>
                                <IconCopy className='hover:scale-110 cursor-pointer' onClick={() => copyClearClipboard(`${v.username}`)} />
                            </div>
                            <div className="flex gap-2 items-center">
                                <p className="mb-2 lg:text-2xl text-lg"><span className="font-semibold">Password: </span>{v.mypassword}</p>
                                <IconCopy className='hover:scale-110 cursor-pointer' onClick={() => copyClearClipboard(`${v.mypassword}`)} />
                            </div>
                            <div className="flex gap-2 items-center">
                                <p className="mb-2 lg:text-2xl text-lg"><span className="font-semibold">URL: </span>{v.url}</p>
                                <IconCopy className='hover:scale-110 cursor-pointer' onClick={() => copyClearClipboard(`${v.url}`)} />
                            </div>
                            <div className="flex gap-2 items-center">
                                <p className="mb-2 lg:text-2xl text-lg"><span className="font-semibold">Notes: </span>{v.notes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Vaultpage