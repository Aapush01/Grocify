import React from 'react'
import Logo from './Logo'
import Search from './Search'
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  return (
    <header className='h-20 flex justify-between items-center p-2 shadow-md sticky top-0'>
       {/* logo */}
       <div className=""> <Logo/> </div>
       {/* serch bar  */}
       <div > <Search/>
        </div>
       {/* login bar/logout bar */}
       <div className='text-2xl lg:text-3xl'><GiHamburgerMenu/></div>
    </header>
  )
}

export default Header
