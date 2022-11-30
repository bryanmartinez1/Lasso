import React from 'react'
import '../styles/cart.css'
import Subtotal from '../components/subtotal'

export default function Cart() {
  return (
    <div className='cart'>
        <div className='cart_left'>
            <div>
                <h2 className='cart_title'>Your cart is empty.</h2>
                <p>You have no items in your shopping cart. Select one.</p>
            </div>
        </div>
        <div className='cart_right'>
            <Subtotal />
        </div>
        

    </div>
  )
}
