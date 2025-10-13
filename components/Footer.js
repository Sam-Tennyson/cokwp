import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <>
      
<footer className="bg-gray-200 p-4 shadow flex items-center flex-col justify-between md:flex md:items-center md:justify-between md:p-6 md:flex-row dark:bg-gray-800 sm:flex sm:items-center sm:justify-between">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 &nbsp;
    <Link href={"/"} ><a className="hover:underline">COKWP</a></Link>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap flex-col sm:flex-row sm:px-10 items-center mt-3 sm:text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <Link href={"/privacy-and-policy"}>
          <a className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
        </Link>
      </li>
      <li>
        <Link href={"/disclaimer"}>
          <a className="mr-4 hover:underline md:mr-6">Disclaimer</a>
        </Link>
      </li>
      <li>
        <Link href={"/terms-and-conditions"}>
          <a className="mr-4 hover:underline md:mr-6">Terms & conditions</a>
        </Link>
      </li>
    </ul>
</footer>

    </>
  )
}

export default Footer