# Beverage Voucher - Algorand-based Drink Ordering System

Beverage Voucher is a web application that allows users to purchase drink vouchers using Algorand cryptocurrency. This project demonstrates the integration of blockchain technology with a simple e-commerce platform.

## Features

- Browse a selection of drink vouchers
- Add vouchers to cart
- Connect Pera Wallet for Algorand transactions
- Make payments using Algorand (ALGO)
- Responsive design for various screen sizes

## Technologies Used

- Next.js
- React
- TypeScript
- Algorand SDK
- Pera Wallet Connect
- TxnLab use-wallet-react
- Tailwind CSS
- React Icons

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Connect your Pera Wallet
2. Browse the available drink vouchers
3. Add desired vouchers to your cart
4. Review your cart and total amount
5. Click "Place Order" to complete the transaction

## Project Structure

- `app/page.tsx`: Main component with product listing and cart functionality
- `app/providers.tsx`: Sets up the wallet provider for the application
- `app/components/CartSummary.tsx`: Displays the cart summary and total

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
