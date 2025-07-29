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