├── node_modules/
├── src/
│   ├── constants/
│   │   ├── auth.constant.js
│   │   ├── env.constant.js
│   │   ├── resume.constant.js
│   │   └── user.constant.js
│   ├── middlewares/
│   │   ├── error-handler.middleware.js
│   │   ├── require-access-token.middleware.js
│   │   ├── require-refresh-token.middleware.js
│   │   └── require-roles.middleware.js
│   ├── routers/
│   │   ├── auth.router.js
│   │   ├── index.js
│   │   ├── resumes.router.js
│   │   └── users.router.js
│   ├── utils/
│   │   └── prisma.util.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── package.json
├── README.md
└── yarn.lock