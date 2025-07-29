// import type { NextApiRequest, NextApiResponse } from 'next'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { serialize } from 'cookie'
// import { users } from '@/lib/data'

// const SECRET = process.env.JWT_SECRET || 'devsecret'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).end()

//   const { email, password } = req.body
//   const user = users.find(u => u.email === email)
//   if (!user) return res.status(401).json({ error: 'Invalid credentials' })

//   const valid = await bcrypt.compare(password, user.password)
//   if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

//   const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET, { expiresIn: '1d' })
//   const cookie = serialize('token', token, { httpOnly: true, secure: false, path: '/', maxAge: 86400 })
//   res.setHeader('Set-Cookie', cookie)
//   return res.status(200).json({ message: 'Logged in' })
// }