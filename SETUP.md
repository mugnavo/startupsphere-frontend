# Setup

## Prerequisites

1. Make sure you have [Node.js](https://nodejs.org/en/) **LTS** (at least v20) installed:
   - Use `node --version` from your terminal to check the version
2. Setup your VS Code with extensions - [Click here](https://gist.github.com/dotnize/47769c47114d7b7ba9a07df90cf416ca)
3. Install `pnpm` via corepack:
   ```sh
   corepack enable pnpm
   ```
4. Optional, but very convenient since the `pnpm` command is too long:

   Use the `pn` alias for pnpm: [pnpm.io/installation#adding-a-permanent-alias-in-powershell-windows](https://pnpm.io/installation#adding-a-permanent-alias-in-powershell-windows)
   [![image](https://github.com/dotnize/pinto/assets/48910077/0de0c417-9aaa-48f8-a768-35fcd968d7b4)](https://pnpm.io/installation#adding-a-permanent-alias-in-powershell-windows)

## Cloning & running the project

1. Clone this project:
   ```sh
   git clone git@github.com:dotnize/pinto.git
   ```
   or via HTTPS:
   ```sh
   git clone https://github.com/dotnize/pinto.git
   ```
2. Install dependencies:
   ```sh
   pn i
   ```
3. Create a `.env` file at the root directory of the project with the following variables:

   ```sh
   # https://account.mapbox.com/access-tokens
   NEXT_PUBLIC_MAPBOX_TOKEN=

   # MySQL connection details
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=startupsphere
   MYSQL_USER=root
   MYSQL_PASSWORD=
   ```

4. Run the project:
   ```sh
   pn dev
   ```
