# Frustration Dashboard

This is the Frustration Dashboard (as a part of monorepository Frustration), a web application built with Next.js to help you manage front app and vizualize sources of income.

## Features

- Track monthly revenues and campaigns in progress
- Extract list of subscribers and donators
- List and update manually videos to be displayed on the site's homepage

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, pnpm or yarn

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/frustration-dashboard.git
  ```
2. Navigate to the project directory:
  ```bash
  cd frustration-dashboard
  ```
3. Install dependencies:
  ```bash
  pnpm install
  ```

### Running the Development Server

Start the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

## Jobs

There are currently two jobs running each morning :

- Update transactions | Retrieve the last transactions made on Stripe or HelloAsso and upadte the registered ones within the past month.
- Update videos | Refresh information about videos that must be displayed on the homepage if the preview image or metadata has changed.

You can find more details about how these jobs are configured in `vercel.json`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [frustrationmagazine@gmail.com](mailto:frustrationmagazine@gmail.com).
