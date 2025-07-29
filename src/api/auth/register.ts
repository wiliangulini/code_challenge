// import type { NextApiRequest, NextApiResponse } from 'next'
// import bcrypt from 'bcryptjs'
// import { users } from '@/lib/data'
// import { Role } from '@/types/role'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).end()

//   const { name, email, password, role } = req.body
//   if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })

//   const existingUser = users.find(user => user.email === email)
//   if (existingUser) return res.status(400).json({ error: 'User already exists' })

//   const hashedPassword = await bcrypt.hash(password, 10)
//   const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role: role || Role.OPERADOR }
//   users.push(newUser)

//   return res.status(201).json({ message: 'User created' })
// }