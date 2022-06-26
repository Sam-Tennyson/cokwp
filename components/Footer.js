import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <>
      
<footer className="bg-gray-200  p-4  bottom-0 inset-x-0 shadow flex items-center flex-col justify-between md:flex md:items-center md:justify-between md:p-6 md:flex-row dark:bg-gray-800 sm:flex sm:item-center sm:justify-between">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 &nbsp;
    <Link href={"/"} ><a className="hover:underline">COKWP</a></Link>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap flex-col sm:flex-row sm:px-10 items-center mt-3 text-0.5sm sm:text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
      <Link href={"/privacy-and-policy"}>
        <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">Privacy Policy</a>
        </li>
      </Link>
        
      <Link href={"/disclaimer"}>
        <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">Disclaimer</a>
        </li>
      </Link>
        
      <Link href={"/terms-and-conditions"}>
        <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">Terms & conditions</a>
        </li>
      </Link>
        
    </ul>
</footer>

    </>
  )
}

export default Footer