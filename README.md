# divvy - receipt splitting app

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev
```

## Todo

- [x] Upload members to supabase table
- [ ] Update settings page
- [ ] Currency conversion based on manual / current exchange rate and extracted currency from receipt
- [ ] Take a picture of the receipt through the app
- [ ] Loading states and error handling across the app
- [ ] Filter / sort receipts by date, amount, locale, etc.
- [ ] Allow users to edit the title, vendor, and amount of a receipt
- [ ] Allow manual creation of a new receipt (maybe change the upload to create?)
