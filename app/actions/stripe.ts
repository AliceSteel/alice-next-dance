'use server'

import { headers } from 'next/headers'

import { stripe } from '../../lib/stripe'
import { BasketItem } from '@/types/basketItemTypes'

export async function fetchClientSecret(orderId: string, basketItems: BasketItem[]) {
  const origin = (await headers()).get('origin')

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({

    ui_mode: 'embedded_page',
    line_items: basketItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
            currency: 'dkk',
            unit_amount: Math.round(parseFloat(item.price.replace('DKK', '')) * 100),
            product_data: {
            name: item.name,
            },
        },
    })),
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      orderId,
    },
  })

  return session.client_secret as string
}