"use client"

import { encryptData } from '@/utils/cryptodata'
import { useUser } from '@clerk/nextjs'
import PasswordGenerator from '@smakss/password-generator'
import { IconCopy, IconReload, IconX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
const PasswordGen = () => {
  const [form, setForm] = useState({ title: "", username: "", mypassword: "", url: "", notes: "" });
  const [passwordLength, setPasswordLength] = useState(8)
  const [password, setPassword] = useState("")
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [isHidden, setIsHidden] = useState(true)
  const {user, isSignedIn} = useUser()

  const generatePassword = () => {
    const generatedPassword = PasswordGenerator({
      length: passwordLength,
      includeCaps: uppercase,
      includeLower: lowercase,
      includeNums: numbers,
      includeSpecs: symbols,
    })
    setPassword(String(generatedPassword))
  }

  useEffect(() => {
    generatePassword()
  }, [passwordLength, uppercase, lowercase, numbers, symbols])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value, mypassword: password });
  };

     const handleAdd = async () => {
          try {
            setIsHidden(true)
            if (!isSignedIn) {
              return toast.error("You must be signed in to create a vault", { duration: 2000 });
            }
            const encryptedBlob = encryptData(form);
            const res = await fetch("/api/vault", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id, blob: encryptedBlob }),
            });

            if (res.status === 201) {
                toast.success("Vault created successfully", { duration: 2000 });
                setForm({ title: "", username: "", mypassword: "", url: "", notes: "" });
                window.location.replace("/vault");
            } else {
                toast.error("Vault creation failed");
            }
          } catch (error) {
            toast.error(`${error}`);
          }
      };

      const copyClearClipboard = () => {
        navigator.clipboard.writeText(password);
        toast.success("Copied to clipboard. After 20 seconds it will be cleared", { duration: 2000 });
        setTimeout(() => {
          navigator.clipboard.writeText(" ");
        }, 20000);
      };

  return (
    <div className='flex flex-col gap-4 w-full'>
    <Toaster position="top-center" reverseOrder={false} />
    { !isHidden &&
      <div className='fixed top-0 left-0 w-screen h-screen z-100 bg-black/50 backdrop-blur-md flex justify-center items-center'>
        <form className='flex flex-col gap-5 bg-white/40 p-8 rounded-md relative sm:w-[60%] w-screen sm:h-[60%] text-black'>
        <h2 className='text-2xl text-center'>Save your pass to vault</h2>
        <IconX className='absolute top-2 right-2 cursor-pointer hover:invert'  onClick={() => setIsHidden(true)}/>
          <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
            <label htmlFor="title" className='cursor-pointer w-[20%]'>Title</label>
            <input type="text" name="title" id="title"  className='md:w-[80%] w-[60%] bg-white' value={form.title} onChange={(e) => handleChange(e)}/>
          </div>
          <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
            <label htmlFor="username" className='cursor-pointer w-[20%]'>Username</label>
            <input type="text" name="username" id="username"  className='md:w-[80%] w-[60%] bg-white' value={form.username} onChange={(e) => handleChange(e)}/>
          </div>
          <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
            <label htmlFor="password" className='cursor-pointer w-[20%]'>Password</label>
            <input type="password" name="password" id="password"  className='md:w-[80%] w-[60%] bg-white' value={password} readOnly />
          </div>
          <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
            <label htmlFor="url" className='cursor-pointer w-[20%] '>URL</label>
            <input type="text" name="url" id="url" className='md:w-[80%] w-[60%] bg-white' value={form.url} onChange={(e) => handleChange(e)}/>
          </div>
          <div className='flex sm:gap-2 gap-5 w-full lg:text-2xl'>
            <label htmlFor="notes" className='cursor-pointer w-[20%] '>Notes</label>
            <input type="text" name="notes" id="notes"  className='md:w-[80%] w-[60%] bg-white' value={form.notes} onChange={(e) => handleChange(e)}/>
          </div>
          <button 
          onClick={handleAdd}
          type='submit' 
          className='cursor-pointer bg-[#282727] text-white rounded-md py-2 px-5 mx-auto w-fit'>
            Submit
          </button>
        </form>
      </div>
}
      <div className='dark:bg-[#282727] shadow bg-white sm:p-8 p-3 rounded-md sm:text-4xl sm:gap-0 gap-2 text-xl flex items-center sm:justify-between justify-center w-full'>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className='w-[80%] p-2 rounded-md focus:outline-none' />
        <div className='flex gap-2 w-[20%]'>
          <IconCopy className='hover:scale-110 cursor-pointer' onClick={() => copyClearClipboard()}/>
          <IconReload className='hover:scale-110 cursor-pointer' onClick={() => generatePassword()}/>
        </div>
      </div>
      <div className='flex flex-col gap-2 dark:bg-[#282727] shadow bg-white sm:p-8 p-3 rounded-md'>
        <div className='flex flex-col gap-2'>
          <h2 className='sm:text-4xl text-2xl'>Customize your password</h2>
          <hr />
        </div>
        <div className='flex flex-col gap-2'>
          <h3>Password Length</h3>
          <div className='flex justify-between sm:px-10'>
            <div className='flex gap-4 items-center'>
              <input type='number' className='w-15 dark:bg-white ring dark:text-black h-fit p-2 rounded-md' max={50} min={1} value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value))} />
              <input type="range" className='sm:w-[20vw] cursor-pointer' max={50} min={1} value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value))} />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-2'>
                <input type="checkbox" name="Uppercase" id="Uppercase" className='w-10 cursor-pointer' checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
                <label htmlFor="Uppercase" className='cursor-pointer'>Uppercase</label>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" name="lowercase" id="lowercase" className='w-10 cursor-pointer' checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
                <label htmlFor="lowercase" className='cursor-pointer'>Lowercase</label>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" name="numbers" id="numbers" className='w-10 cursor-pointer' checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
                <label htmlFor="numbers" className='cursor-pointer'>Numbers</label>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" name="symbols" id="symbols" className='w-10 cursor-pointer' checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
                <label htmlFor="symbols" className='cursor-pointer'>Symbols</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => setIsHidden(!isHidden)} className='dark:bg-[#282727] cursor-pointer dark:hover:bg-[#393939] hover:bg-gray-300 hover:ring w-fit shadow bg-white sm:p-4 p-2 mx-auto rounded-md'>Save Password</button>
    </div>
  )
}

export default PasswordGen
