import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className='py-10'>
        <Image src={'/images/sizeChart.png'} width={500} height={500} alt='size chart' className=''></Image>
    </div>
  )
}
