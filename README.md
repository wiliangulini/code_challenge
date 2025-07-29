This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


dependencias pra se instalar em caso de nao serem instaladas com npm install:

npm install react-hook-form @hookform/resolvers zod
npm install -D vitest-mock-extended
npm install uuid
npm install tailwindcss postcss autoprefixer bcryptjs jsonwebtoken js-cookie
npm install @prisma/client
npm install prisma --save-dev
npm install lucide-react


backend :
  npm init -y
  npm install json-server express jsonwebtoken (npm install json-server@0.17.3 usar essa versao do json-server pra rodar o backend sem erros, se necessario instalar express e jsonwebtoken separados)
  rodar o arquivo server.js com node server.js (node versao 18.20.4)