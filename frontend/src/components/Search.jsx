import React from 'react'
import { HiOutlineSearch } from "react-icons/hi";
import { TypeAnimation } from 'react-type-animation';

const Search = () => {
  return (
    <div className="flex gap-2 w-[170px] border rounded-md p-1 lg:min-w-[420px] border-red-500">
      <button>
        <HiOutlineSearch />
      </button>
      <div className='w-full h-full flex items-center'>
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'Search "milk"',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'Search "bread"',
            1000,
            'Search "sugar"',
            1000,
            'Search "panner"',
            1000,
            'Search "chocolate"',
            1000,
            'Search "curd"',
            1000,
            'Search "rice"',
            1000,
            'Search "egg"',
            1000,
            'Search "chips"',
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: '1em', display: 'inline-block' }}
          repeat={Infinity}
        />
      </div>
    </div>


  )
}

export default Search
